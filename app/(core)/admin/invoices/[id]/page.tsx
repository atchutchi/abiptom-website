import { getInvoice } from "@/core/lib/invoices/actions";
import { dbAdmin } from "@/core/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react-core";
import {
  formatDate,
  formatCurrency,
  invoiceNumber,
  INVOICE_STATE_LABELS,
  INVOICE_STATE_COLORS,
} from "@/core/lib/utils/format";
import InvoiceActions from "@/core/components/forms/InvoiceActions";
import PaymentForm from "@/core/components/forms/PaymentForm";
import { InvoicePaymentDateEditor } from "@/core/components/forms/InvoicePaymentDateEditor";
import { InvoiceProjectLinkForm } from "@/core/components/forms/InvoiceProjectLinkForm";
import { Header } from "@/core/components/layout/Header";

export const metadata = { title: "Factura - ABIPTOM Core" };

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  if (!invoice) notFound();
  const formatInvoiceAmount = (value: string | number) =>
    Number(value).toLocaleString("pt-PT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: invoice.moeda === "XOF" ? 0 : 2,
    });
  const projectRows = await dbAdmin.query.projects.findMany({
    where: (table, { and, eq, inArray }) =>
      and(
        eq(table.clientId, invoice.clientId),
        inArray(table.estado, ["proposta", "activo", "pausado", "concluido"]),
      ),
    with: {
      client: { columns: { id: true, nome: true } },
    },
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });

  const canProforma =
    invoice.estado === "rascunho";
  const canDefinitiva =
    invoice.estado === "rascunho" || invoice.estado === "proforma";
  const canPagar =
    invoice.estado === "definitiva" || invoice.estado === "paga_parcial";
  const canAnular = !["paga", "anulada"].includes(invoice.estado);

  return (
    <>
      <Header title="Facturas" />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <Link
              href="/admin/invoices"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> Facturas
            </Link>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="text-2xl font-semibold">
                {invoice.numero
                  ? `Factura ${invoiceNumber(invoice.numero)}`
                  : "Rascunho"}
              </h1>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${INVOICE_STATE_COLORS[invoice.estado]}`}
              >
                {INVOICE_STATE_LABELS[invoice.estado]}
              </span>
            </div>
          </div>

          {/* Actions bar */}
          <InvoiceActions
            invoiceId={id}
            estado={invoice.estado}
            canProforma={canProforma}
            canDefinitiva={canDefinitiva}
            canAnular={canAnular}
            pdfUrl={`/api/invoices/pdf/${id}`}
            clientEmail={invoice.client?.email ?? undefined}
          />

          {/* Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Cliente</p>
              <p className="font-medium">{invoice.client?.nome}</p>
              {invoice.client?.nif && (
                <p className="text-sm text-muted-foreground">NIF: {invoice.client.nif}</p>
              )}
              {invoice.client?.endereco && (
                <p className="text-sm text-muted-foreground">{invoice.client.endereco}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Datas</p>
              <p className="text-sm">
                <span className="text-muted-foreground">Emissão:</span>{" "}
                {formatDate(invoice.dataEmissao)}
              </p>
              {invoice.dataVencimento && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Vencimento:</span>{" "}
                  {formatDate(invoice.dataVencimento)}
                </p>
              )}
              <p className="text-sm">
                <span className="text-muted-foreground">Moeda:</span>{" "}
                {invoice.moeda}
                {invoice.moeda !== "XOF" && ` (câmbio: ${invoice.taxaCambio})`}
              </p>
            </div>
          </div>

          <InvoiceProjectLinkForm
            invoiceId={id}
            initialProjectId={invoice.projectId}
            disabled={invoice.estado === "anulada"}
            projects={projectRows.map((project) => ({
              id: project.id,
              titulo: project.titulo,
              clienteNome: project.client.nome,
            }))}
          />

          {/* Items table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium w-8">Nº</th>
                  <th className="px-4 py-2 text-left font-medium">Descrição</th>
                  <th className="px-4 py-2 text-left font-medium w-24">Unidade</th>
                  <th className="px-4 py-2 text-right font-medium w-16">Qtd.</th>
                  <th className="px-4 py-2 text-right font-medium w-32">P. Unit.</th>
                  <th className="px-4 py-2 text-right font-medium w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 text-muted-foreground">{item.ordem}</td>
                    <td className="px-4 py-2">{item.descricao}</td>
                    <td className="px-4 py-2 text-muted-foreground">{item.unidade}</td>
                    <td className="px-4 py-2 text-right font-mono">{Number(item.quantidade).toLocaleString("pt-PT")}</td>
                    <td className="px-4 py-2 text-right font-mono">
                      {formatInvoiceAmount(item.precoUnitario)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-medium">
                      {formatInvoiceAmount(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30">
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-right text-muted-foreground">Subtotal</td>
                  <td className="px-4 py-2 text-right font-mono">
                    {formatCurrency(invoice.subtotal, invoice.moeda)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-right text-muted-foreground">
                    IGV {Number(invoice.igvPercentagem)}%
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    {formatCurrency(invoice.igvValor, invoice.moeda)}
                  </td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={5} className="px-4 py-2 text-right">TOTAL</td>
                  <td className="px-4 py-2 text-right font-mono">
                    {formatCurrency(invoice.total, invoice.moeda)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payments */}
          {canPagar && (
            <div className="space-y-4">
              <h2 className="font-medium">Registar pagamento</h2>
              <PaymentForm invoiceId={id} moeda={invoice.moeda} />
            </div>
          )}

          {invoice.payments.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-medium">Pagamentos recebidos</h2>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Data</th>
                      <th className="px-4 py-2 text-left font-medium">Método</th>
                      <th className="px-4 py-2 text-left font-medium">Referência</th>
                      <th className="px-4 py-2 text-right font-medium">Valor</th>
                      <th className="px-4 py-2 text-right font-medium w-24">Recibo</th>
                      <th className="px-4 py-2 text-right font-medium w-40">Acções</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {invoice.payments.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-2">{formatDate(p.data)}</td>
                        <td className="px-4 py-2 text-muted-foreground">{p.metodo ?? "-"}</td>
                        <td className="px-4 py-2 text-muted-foreground">{p.referencia ?? "-"}</td>
                        <td className="px-4 py-2 text-right font-mono font-medium">
                          {formatCurrency(p.valor, p.moeda)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <a
                            href={`/api/invoices/payments/${p.id}/receipt`}
                            className="text-primary hover:underline text-xs"
                          >
                            PDF
                          </a>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <InvoicePaymentDateEditor
                            paymentId={p.id}
                            initialDate={p.data}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Info row */}
          <p className="text-xs text-muted-foreground">
            Criada por {invoice.createdBy?.nomeCurto ?? "-"} em {formatDate(invoice.createdAt.toISOString().slice(0, 10))}
          </p>
        </div>
      </main>
    </>
  );
}
