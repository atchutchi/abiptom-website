import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { dbAdmin } from "@/core/lib/db";
import { salaryLines } from "@/core/lib/db/schema";
import { eq } from "drizzle-orm";
import { authorizeRoles } from "@/core/lib/auth/authorization";
import {
  SalaryReceiptPDF,
  type SalaryReceiptPDFData,
  type SalaryReceiptProjectPayment,
} from "@/core/lib/pdf/salary-receipt";
import type { ProjectPaymentRecord } from "@/core/lib/salary/types";

const MES_LABELS = [
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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lineId: string }> }
) {
  const authorization = await authorizeRoles(["ca", "dg", "coord", "staff"]);
  if (!authorization.success) {
    const status = authorization.error === "Não autenticado" ? 401 : 403;
    return new NextResponse(authorization.error, { status });
  }
  const { dbUser } = authorization;

  const { lineId } = await params;

  const line = await dbAdmin.query.salaryLines.findFirst({
    where: eq(salaryLines.id, lineId),
    with: {
      user: {
        columns: {
          id: true,
          nomeCompleto: true,
          nomeCurto: true,
          cargo: true,
          role: true,
          email: true,
        },
      },
      period: {
        with: {
          policy: { columns: { nome: true, versao: true } },
          projectPayments: {
            with: {
              project: { columns: { titulo: true } },
            },
          },
        },
      },
    },
  });

  if (!line) {
    return new NextResponse("Recibo não encontrado", { status: 404 });
  }

  const isAdmin = ["ca", "dg"].includes(dbUser.role);
  const isOwner = line.userId === dbUser.id;
  if (!isAdmin && !isOwner) {
    return new NextResponse("Sem permissão", { status: 403 });
  }

  if (line.period.estado === "aberto") {
    return new NextResponse(
      "Período ainda não calculado",
      { status: 400 }
    );
  }

  const projectPayments: SalaryReceiptProjectPayment[] =
    line.period.projectPayments
      .filter((pp) => pp.userId === line.userId)
      .map((pp) => ({
        projectTitulo: pp.project.titulo,
        papel: pp.papel,
        percentagemAplicada: Number(pp.percentagemAplicada),
        valorRecebido: Number(pp.valorRecebido),
      }));

  // Fallback: componenteDinamica may hold data before project_payments table rows exist
  const componenteFallback =
    projectPayments.length === 0
      ? (line.componenteDinamica as ProjectPaymentRecord[] | null) ?? []
      : [];

  const allPayments: SalaryReceiptProjectPayment[] =
    projectPayments.length > 0
      ? projectPayments
      : componenteFallback.map((c) => ({
          projectTitulo: c.projectId,
          papel: c.papel,
          percentagemAplicada: c.percentagemAplicada,
          valorRecebido: c.valorRecebido,
        }));

  const generatedAt = new Date().toISOString().split("T")[0];

  const data: SalaryReceiptPDFData = {
    periodo: {
      ano: line.period.ano,
      mes: line.period.mes,
      policyNome: line.period.policy.nome,
      policyVersao: line.period.policy.versao,
    },
    staff: {
      nomeCompleto: line.user.nomeCompleto,
      nomeCurto: line.user.nomeCurto,
      cargo: line.user.cargo,
      role: line.user.role,
      email: line.user.email,
    },
    line: {
      salarioBase: Number(line.salarioBase),
      outrosBeneficios: Number(line.outrosBeneficios),
      descontos: Number(line.descontos),
      totalBruto: Number(line.totalBrutoFinal),
      totalLiquido: Number(line.totalLiquidoFinal),
      pago: line.pago,
      dataPagamento: line.dataPagamento,
      referenciaPagamento: line.referenciaPagamento,
      overrideMotivo: line.overrideMotivo,
    },
    projectPayments: allPayments,
    subsidios: (line.subsidios as Record<string, number>) ?? {},
    generatedAt,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(SalaryReceiptPDF({ data }) as any);

  const nomeSlug = line.user.nomeCurto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const mesSlug = MES_LABELS[line.period.mes];
  const filename = `recibo-${nomeSlug}-${mesSlug}-${line.period.ano}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
