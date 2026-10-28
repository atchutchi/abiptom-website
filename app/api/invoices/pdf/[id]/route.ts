import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { withAuthenticatedDb } from "@/core/lib/db";
import { invoices } from "@/core/lib/db/schema";
import { eq } from "drizzle-orm";
import { InvoicePDF } from "@/core/lib/pdf/invoice";
import { authorizeOperation } from "@/core/lib/auth/authorization";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authorization = await authorizeOperation("invoicesRead");
  if (!authorization.success) {
    const status = authorization.error === "Não autenticado" ? 401 : 403;
    return new NextResponse(authorization.error, { status });
  }
  const { user, dbUser } = authorization;

  const { id } = await params;

  const invoice = await withAuthenticatedDb(user, async (db) =>
    db.query.invoices.findFirst({
      where: eq(invoices.id, id),
      with: {
        client: true,
        items: { orderBy: (i, { asc }) => [asc(i.ordem)] },
      },
    })
  );

  if (!invoice) return new NextResponse("Não encontrado", { status: 404 });
  if (dbUser.role === "coord" && invoice.estado === "rascunho") {
    return new NextResponse("Sem permissão", { status: 403 });
  }

  const data = {
    numero: invoice.numero,
    tipo: (invoice.tipo ?? "definitiva") as "proforma" | "definitiva",
    dataEmissao: invoice.dataEmissao,
    dataVencimento: invoice.dataVencimento,
    moeda: invoice.moeda,
    subtotal: Number(invoice.subtotal),
    igvPercentagem: Number(invoice.igvPercentagem),
    igvValor: Number(invoice.igvValor),
    total: Number(invoice.total),
    formaPagamento: invoice.formaPagamento,
    contaBancaria: invoice.contaBancaria,
    observacoes: invoice.observacoes,
    client: {
      nome: invoice.client?.nome ?? "",
      nif: invoice.client?.nif,
      endereco: invoice.client?.endereco,
      contacto: invoice.client?.contacto,
      email: invoice.client?.email,
    },
    items: invoice.items.map((i) => ({
      ordem: i.ordem,
      descricao: i.descricao,
      unidade: i.unidade ?? "serviço",
      quantidade: Number(i.quantidade),
      precoUnitario: Number(i.precoUnitario),
      total: Number(i.total),
    })),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(InvoicePDF({ data }) as any);

  const filename = invoice.numero
    ? `factura-${String(invoice.numero).padStart(5, "0")}.pdf`
    : `rascunho-${id.slice(0, 8)}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
