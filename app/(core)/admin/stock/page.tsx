import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";
import { Button } from "@/core/components/ui/button";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { formatCurrency } from "@/core/lib/utils/format";
import { listStockItems } from "@/core/lib/stock/actions";

export const metadata = { title: "Stock" };

export default async function StockPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (!["ca", "dg", "coord"].includes(dbUser.role)) {
    redirect("/admin/dashboard");
  }

  const items = await listStockItems();

  const totalItems = items.length;
  const lowStock = items.filter(
    (item) =>
      item.activo &&
      Number(item.quantidadeAtual) <= Number(item.quantidadeMinima)
  ).length;

  const stockValue = items.reduce(
    (sum, item) => sum + Number(item.quantidadeAtual) * Number(item.custoUnitario ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Controlo de Stock" />

      <main className="space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Consumíveis e materiais</h2>
            <p className="text-sm text-gray-500">
              Monitorização de níveis mínimos, movimentos e valor aproximado de stock
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/stock/new" className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo item
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard label="Itens" value={String(totalItems)} />
          <KpiCard label="Abaixo do mínimo" value={String(lowStock)} tone={lowStock > 0 ? "warn" : "ok"} />
          <KpiCard label="Valor de stock" value={formatCurrency(stockValue)} />
        </div>

        <section className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="w-full min-w-[880px] text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Item</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Categoria</th>
                <th className="px-4 py-2 text-right font-medium text-gray-600">Actual</th>
                <th className="px-4 py-2 text-right font-medium text-gray-600">Mínimo</th>
                <th className="px-4 py-2 text-right font-medium text-gray-600">Movimentos</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Estado</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600 w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-gray-400">
                    Ainda sem itens de stock.
                  </td>
                </tr>
              )}
              {items.map((item) => {
                const actual = Number(item.quantidadeAtual);
                const minimo = Number(item.quantidadeMinima);
                const isLow = item.activo && actual <= minimo;

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{item.nome}</p>
                      <p className="text-xs text-gray-500">{item.sku ?? "Sem SKU"}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{item.categoria ?? "-"}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-gray-900">
                      {actual.toLocaleString("pt-PT", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 3,
                      })} {item.unidade}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">
                      {minimo.toLocaleString("pt-PT", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 3,
                      })}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">
                      {item.movements.length}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          !item.activo
                            ? "bg-gray-200 text-gray-700"
                            : isLow
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {!item.activo ? "Inactivo" : isLow ? "Repor" : "OK"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/stock/${item.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        Abrir
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

function KpiCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warn" | "ok";
}) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p
        className={`mt-2 text-xl font-semibold tabular-nums ${
          tone === "warn" ? "text-red-600" : tone === "ok" ? "text-green-700" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
