import { listExpenses } from "@/core/lib/expenses/actions";
import {
  EXPENSE_CATEGORY_LABEL,
  EXPENSE_STATE_LABEL,
  EXPENSE_STATE_COLOR,
} from "@/core/lib/expenses/labels";
import Link from "next/link";
import { Button } from "@/core/components/ui/button";
import { Plus, Receipt } from "lucide-react-core";
import { formatCurrency, formatDate } from "@/core/lib/utils/format";
import { cn } from "@/core/lib/utils";
import { Header } from "@/core/components/layout/Header";

export const metadata = { title: "Despesas - ABIPTOM Core" };

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; categoria?: string; estado?: string }>;
}) {
  const filters = await searchParams;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const mes = filters.mes ?? currentMonth;

  const despesas = await listExpenses({
    mes,
    categoria: filters.categoria,
    estado: filters.estado,
  });

  const totalXof = despesas.reduce((sum, e) => sum + Number(e.valorXof), 0);
  const totalPagas = despesas
    .filter((e) => e.estado === "paga")
    .reduce((sum, e) => sum + Number(e.valorXof), 0);
  const totalPendentes = despesas
    .filter((e) => e.estado === "rascunho" || e.estado === "aprovada")
    .reduce((sum, e) => sum + Number(e.valorXof), 0);

  return (
    <>
      <Header title="Despesas" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {despesas.length} despesa(s) em {mes}
            </p>
            <Button asChild>
              <Link href="/admin/expenses/new">
                <Plus className="size-4" />
                Nova Despesa
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs uppercase text-muted-foreground">Total do mês</p>
              <p className="text-2xl font-semibold font-mono mt-1">
                {formatCurrency(totalXof)}
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs uppercase text-muted-foreground">Pagas</p>
              <p className="text-2xl font-semibold font-mono mt-1 text-green-600 dark:text-green-400">
                {formatCurrency(totalPagas)}
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs uppercase text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-semibold font-mono mt-1 text-orange-600 dark:text-orange-400">
                {formatCurrency(totalPendentes)}
              </p>
            </div>
          </div>

          <form className="flex flex-wrap gap-2">
            <input
              name="mes"
              type="month"
              defaultValue={mes}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            />
            <select
              name="categoria"
              defaultValue={filters.categoria ?? "todas"}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="todas">Todas categorias</option>
              {Object.entries(EXPENSE_CATEGORY_LABEL).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <select
              name="estado"
              defaultValue={filters.estado ?? "todos"}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="todos">Todos estados</option>
              {Object.entries(EXPENSE_STATE_LABEL).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <Button type="submit" variant="secondary">Filtrar</Button>
          </form>

          {despesas.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-12 text-center">
              <Receipt className="size-10 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhuma despesa neste período.</p>
              <Button asChild variant="secondary">
                <Link href="/admin/expenses/new">Registar primeira despesa</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Data</th>
                    <th className="px-4 py-3 text-left font-medium">Categoria</th>
                    <th className="px-4 py-3 text-left font-medium">Descrição</th>
                    <th className="px-4 py-3 text-left font-medium">Fornecedor</th>
                    <th className="px-4 py-3 text-left font-medium">Projecto</th>
                    <th className="px-4 py-3 text-left font-medium">Beneficiário</th>
                    <th className="px-4 py-3 text-right font-medium">Valor (XOF)</th>
                    <th className="px-4 py-3 text-left font-medium">Estado</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {despesas.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{formatDate(e.data)}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {EXPENSE_CATEGORY_LABEL[e.categoria]}
                      </td>
                      <td className="px-4 py-3 font-medium">{e.descricao}</td>
                      <td className="px-4 py-3 text-muted-foreground">{e.fornecedor ?? "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {e.project?.titulo ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {e.beneficiario ? e.beneficiario.nomeCurto : "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {formatCurrency(e.valorXof)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            EXPENSE_STATE_COLOR[e.estado]
                          )}
                        >
                          {EXPENSE_STATE_LABEL[e.estado]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/expenses/${e.id}`}
                          className="text-primary hover:underline text-xs"
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
