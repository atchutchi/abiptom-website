import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { dbAdmin } from "@/core/lib/db";
import { reports } from "@/core/lib/db/schema";
import { isAuthorizedCronRequest } from "@/core/lib/cron/auth";
import { getMonthlyProfitLossSystem } from "@/core/lib/reports/actions";

export const runtime = "nodejs";

function getMonthBounds(ano: number, mes: number) {
  const start = `${ano}-${String(mes).padStart(2, "0")}-01`;
  const endDate = new Date(ano, mes, 0);
  const end = `${ano}-${String(mes).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
  return { start, end };
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));

  const ano = target.getUTCFullYear();
  const mes = target.getUTCMonth() + 1;

  const period = getMonthBounds(ano, mes);
  const reportData = await getMonthlyProfitLossSystem(ano, mes);

  const pdfUrl = `/api/reports/pl?periodo=mensal&ano=${ano}&mes=${mes}`;

  const existing = await dbAdmin.query.reports.findFirst({
    where: and(
      eq(reports.tipo, "mensal"),
      eq(reports.periodoInicio, period.start),
      eq(reports.periodoFim, period.end)
    ),
  });

  if (existing) {
    await dbAdmin
      .update(reports)
      .set({
        dadosJson: reportData,
        pdfUrl,
        geradoEm: new Date(),
      })
      .where(eq(reports.id, existing.id));
  } else {
    await dbAdmin.insert(reports).values({
      tipo: "mensal",
      periodoInicio: period.start,
      periodoFim: period.end,
      dadosJson: reportData,
      pdfUrl,
    });
  }

  return NextResponse.json({
    ok: true,
    tipo: "mensal",
    periodo: `${String(mes).padStart(2, "0")}/${ano}`,
    totals: {
      facturado: reportData.receitas.facturado,
      despesas: reportData.despesas.total,
      margemLiquida: reportData.resultado.margemLiquida,
    },
  });
}
