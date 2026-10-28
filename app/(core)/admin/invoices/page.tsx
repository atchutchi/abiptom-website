import Link from "next/link";
import { FileText, Plus } from "lucide-react-core";
import { Button } from "@/core/components/ui/button";
import InvoiceExportButton from "@/core/components/forms/InvoiceExportButton";
import { Header } from "@/core/components/layout/Header";
import { listClients } from "@/core/lib/clients/actions";
import { listInvoices } from "@/core/lib/invoices/actions";
import {
  invoiceFiltersToSearchParams,
  normalizeInvoiceFilters,
  type RawInvoiceFilters,
} from "@/core/lib/invoices/filters";
import { listProjects } from "@/core/lib/projects/actions";
import {
  formatCurrency,
  formatDate,
  INVOICE_STATE_COLORS,
  INVOICE_STATE_LABELS,
  invoiceNumber,
} from "@/core/lib/utils/format";
import type { InvoiceState } from "@/core/lib/db/schema";

export const metadata = { title: "Facturas - ABIPTOM Core" };

const STATES: InvoiceState[] = [
  "rascunho",
  "proforma",
  "definitiva",
  "paga_parcial",
  "paga",
  "anulada",
];

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<RawInvoiceFilters>;
}) {
  const rawFilters = await searchParams;
  const normalizedFilters = normalizeInvoiceFilters(rawFilters);
  const isVencidas = normalizedFilters.vencidas === true;
  const estadoFilter = isVencidas
    ? undefined
    : normalizedFilters.estado
      ? normalizedFilters.estado
      : (["proforma", "definitiva", "paga_parcial", "paga"] as InvoiceState[]);

  const [facturas, clientes, projectos] = await Promise.all([
    listInvoices({ ...normalizedFilters, estado: estadoFilter }),
    listClients(),
    listProjects({ scope: "todos" }),
  ]);

  const mesAtual = new Date().toISOString().slice(0, 7);
  const exportQuery = invoiceFiltersToSearchParams({
    ...rawFilters,
    mes: rawFilters.mes ?? mesAtual,
  }).toString();

  return (
    <>
      <Header title={isVencidas ? "Facturas vencidas" : "Facturas"} />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {facturas.length} resultado(s)
            </p>
            <div className="flex gap-2">
              <InvoiceExportButton query={exportQuery} />
              <Button asChild>
                <Link href="/admin/invoices/new">
                  <Plus className="size-4" />
                  Nova Factura
                </Link>
              </Button>
            </div>
          </div>

          <form className="grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterField label="Estado">
              <select
                name="estado"
                defaultValue={rawFilters.estado ?? ""}
                disabled={isVencidas}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none disabled:opacity-50"
              >
                <option value="">Todos activos</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {INVOICE_STATE_LABELS[state]}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField label="Mês de emissão">
              <input
                name="mes"
                type="month"
                defaultValue={rawFilters.mes ?? ""}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              />
            </FilterField>

            <FilterField label="Cliente">
              <select
                name="clientId"
                defaultValue={rawFilters.clientId ?? ""}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                <option value="">Todos os clientes</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField label="Projecto">
              <select
                name="projectId"
                defaultValue={rawFilters.projectId ?? ""}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                <option value="">Todos os projectos</option>
                {projectos.map((projecto) => (
                  <option key={projecto.id} value={projecto.id}>
                    {projecto.titulo}
                  </option>
                ))}
              </select>
            </FilterField>

            <FilterField label="Nº da factura">
              <input
                name="numero"
                type="number"
                min="1"
                defaultValue={rawFilters.numero ?? ""}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              />
            </FilterField>

            <FilterField label="Tipo">
              <select
                name="tipo"
                defaultValue={rawFilters.tipo ?? ""}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                <option value="">Todos</option>
                <option value="proforma">Proforma</option>
                <option value="definitiva">Definitiva</option>
              </select>
            </FilterField>

            <FilterField label="Moeda">
              <select
                name="moeda"
                defaultValue={rawFilters.moeda ?? ""}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                <option value="">Todas</option>
                <option value="XOF">XOF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </FilterField>

            <FilterField label="Pago no mês">
              <input
                name="pagoNoMes"
                type="month"
                defaultValue={rawFilters.pagoNoMes ?? ""}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              />
            </FilterField>

            <FilterField label="Data inicial">
              <input
                name="dataInicio"
                type="date"
                defaultValue={rawFilters.dataInicio ?? ""}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              />
            </FilterField>

            <FilterField label="Data final">
              <input
                name="dataFim"
                type="date"
                defaultValue={rawFilters.dataFim ?? ""}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              />
            </FilterField>

            <label className="flex items-center gap-2 pb-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="vencidas"
                value="1"
                defaultChecked={isVencidas}
                className="rounded border-border"
              />
              Só vencidas
            </label>

            <div className="flex items-center gap-3">
              <Button type="submit" variant="secondary">
                Filtrar
              </Button>
              {normalizedFilters.hasActiveFilters && (
                <Link
                  href="/admin/invoices"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Limpar
                </Link>
              )}
            </div>
          </form>

          {facturas.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-12 text-center">
              <FileText className="size-10 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhuma factura encontrada.</p>
              <Button asChild variant="secondary">
                <Link href="/admin/invoices/new">Criar factura</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Nº</th>
                    <th className="px-4 py-3 text-left font-medium">Cliente</th>
                    <th className="px-4 py-3 text-left font-medium">Projecto</th>
                    <th className="px-4 py-3 text-left font-medium">Data</th>
                    <th className="px-4 py-3 text-left font-medium">Estado</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {facturas.map((factura) => (
                    <tr
                      key={factura.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-mono font-medium">
                        {invoiceNumber(factura.numero)}
                      </td>
                      <td className="px-4 py-3">
                        {factura.client?.nome ?? "Sem cliente"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {factura.project?.titulo ?? "Sem projecto"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(factura.dataEmissao)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${INVOICE_STATE_COLORS[factura.estado]}`}
                        >
                          {INVOICE_STATE_LABELS[factura.estado]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {formatCurrency(factura.total, factura.moeda)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/invoices/${factura.id}`}
                          className="text-xs text-primary hover:underline"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
