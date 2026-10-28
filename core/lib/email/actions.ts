"use server";

import { resend, FROM_EMAIL } from "./resend";
import { dbAdmin } from "@/core/lib/db";
import { invoices } from "@/core/lib/db/schema";
import { eq } from "drizzle-orm";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/core/lib/pdf/invoice";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { insertAuditLog } from "@/core/lib/db/audit";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { formatCurrency } from "@/core/lib/utils/format";

export async function sendInvoiceEmail(invoiceId: string) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) return { error: "Não autenticado" };
  if (!["ca", "dg"].includes(dbUser.role)) return { error: "Sem permissão" };

  const invoice = await dbAdmin.query.invoices.findFirst({
    where: eq(invoices.id, invoiceId),
    with: {
      client: true,
      items: { orderBy: (i, { asc }) => [asc(i.ordem)] },
    },
  });

  if (!invoice) return { error: "Factura não encontrada" };
  if (!invoice.client?.email) return { error: "Cliente sem email registado" };
  if (!["proforma", "definitiva"].includes(invoice.estado))
    return { error: "Só é possível enviar facturas proforma ou definitivas" };

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
      nome: invoice.client.nome,
      nif: invoice.client.nif,
      endereco: invoice.client.endereco,
      contacto: invoice.client.contacto,
      email: invoice.client.email,
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
  const pdfBuffer = await renderToBuffer(InvoicePDF({ data }) as any);

  const tipoLabel =
    invoice.tipo === "proforma" ? "Factura Proforma" : "Factura";
  const numLabel = invoice.numero
    ? `Nº ${String(invoice.numero).padStart(5, "0")}`
    : "";
  const subject = `ABIPTOM - ${tipoLabel} ${numLabel}`.trim();
  const filename = invoice.numero
    ? `factura-${String(invoice.numero).padStart(5, "0")}.pdf`
    : `factura-rascunho.pdf`;

  const totalFormatted = formatCurrency(invoice.total, invoice.moeda);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: invoice.client.email,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#2D6A4F">ABIPTOM SARL</h2>
        <p>Exmo(a). Senhor(a),</p>
        <p>
          Enviamos em anexo a <strong>${tipoLabel.toLowerCase()} ${numLabel}</strong>
          no valor de <strong>${totalFormatted}</strong>.
        </p>
        <p>
          Qualquer questão, contacte-nos através do email
          <a href="mailto:info@abiptom.gw">info@abiptom.gw</a>
          ou pelo telefone 955 573 423.
        </p>
        <p>Com os melhores cumprimentos,<br/>ABIPTOM SARL</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="font-size:11px;color:#999">
          Bairro de Ajuda 2ª Fase, Bissau, Guiné-Bissau<br/>
          NIF: 510148077
        </p>
      </div>
    `,
    attachments: [
      {
        filename,
        content: Buffer.from(pdfBuffer).toString("base64"),
        contentType: "application/pdf",
      },
    ],
  });

  if (error) return { error: `Erro ao enviar email: ${error.message}` };

  await dbAdmin
    .update(invoices)
    .set({ enviadaEm: new Date() })
    .where(eq(invoices.id, invoiceId));

  const hdrs = await headers();
  await insertAuditLog({
    userId: dbUser.id,
    acao: "send_email",
    entidade: "invoices",
    entidadeId: invoiceId,
    dadosDepois: { to: invoice.client.email },
    ip: hdrs.get("x-forwarded-for") ?? undefined,
    userAgent: hdrs.get("user-agent") ?? undefined,
  });

  revalidatePath(`/admin/invoices/${invoiceId}`);
  return { success: true };
}
