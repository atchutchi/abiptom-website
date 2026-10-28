import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { authorizeRoles } from "@/core/lib/auth/authorization";
import { getRequestIp } from "@/core/lib/auth/request-security";
import { getMonthlyProfitLoss, getQuarterlyProfitLoss } from "@/core/lib/reports/actions";
import { ProfitLossPDF } from "@/core/lib/pdf/profit-loss";
import { consumeRateLimit } from "@/core/lib/security/rate-limit-db";
import { recordSecurityEvent } from "@/core/lib/security/events";

const MES_SLUG = [
  "",
  "janeiro",
  "fevereiro",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export async function GET(req: NextRequest) {
  const authorization = await authorizeRoles(["ca", "dg"]);
  if (!authorization.success) {
    const status = authorization.error === "Não autenticado" ? 401 : 403;
    return new NextResponse(authorization.error, { status });
  }

  const rateLimit = await consumeRateLimit({
    action: "profit-loss-export",
    subject: `${authorization.dbUser.id}:${getRequestIp(req.headers)}`,
    limit: 20,
    windowMs: 5 * 60_000,
    blockMs: 10 * 60_000,
  });

  if (!rateLimit.allowed) {
    await recordSecurityEvent({
      actorId: authorization.dbUser.id,
      action: "report.profit_loss.export",
      entity: "report",
      result: "blocked",
      severity: "warning",
      requestHeaders: req.headers,
    });
    return NextResponse.json(
      { error: "Demasiados pedidos. Tenta novamente mais tarde." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const { searchParams } = new URL(req.url);
  const now = new Date();
  const periodo = searchParams.get("periodo") === "trimestral" ? "trimestral" : "mensal";
  const ano = Number(searchParams.get("ano")) || now.getFullYear();
  const mes = Number(searchParams.get("mes")) || now.getMonth() + 1;
  const trimestre = Number(searchParams.get("trimestre")) || Math.ceil((now.getMonth() + 1) / 3);

  if (mes < 1 || mes > 12) {
    return new NextResponse("Mês inválido", { status: 400 });
  }
  if (trimestre < 1 || trimestre > 4) {
    return new NextResponse("Trimestre inválido", { status: 400 });
  }
  if (ano < 2000 || ano > 2100) {
    return new NextResponse("Ano inválido", { status: 400 });
  }

  const report =
    periodo === "trimestral"
      ? await getQuarterlyProfitLoss(ano, trimestre)
      : await getMonthlyProfitLoss(ano, mes);
  const generatedAt = new Date().toISOString().split("T")[0];

  const buffer = await renderToBuffer(
    ProfitLossPDF({
      report,
      generatedAt,
      title:
        periodo === "trimestral"
          ? "Relatório Trimestral (P&L)"
          : "Relatório Mensal (P&L)",
      periodLabelOverride:
        periodo === "trimestral" ? `T${trimestre} ${ano}` : undefined,
    })
  );

  const filename =
    periodo === "trimestral"
      ? `pl-t${trimestre}-${ano}.pdf`
      : `pl-${MES_SLUG[mes]}-${ano}.pdf`;

  await recordSecurityEvent({
    actorId: authorization.dbUser.id,
    action: "report.profit_loss.export",
    entity: "report",
    result: "success",
    requestHeaders: req.headers,
    after: { periodo, ano, mes, trimestre },
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
