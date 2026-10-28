import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";
import StockMovementForm from "@/core/components/forms/StockMovementForm";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { getStockItem, registerStockMovement } from "@/core/lib/stock/actions";
import { formatCurrency } from "@/core/lib/utils/format";

export const metadata = { title: "Item de stock" };

const MOVEMENT_LABELS = {
  entrada: "Entrada",
  saida: "Saída",
  ajuste: "Ajuste",
} as const;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StockItemPage({ params }: PageProps) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (!["ca", "dg", "coord"].includes(dbUser.role)) {
    redirect("/admin/dashboard");
  }

  const { id } = await params;
  const item = await getStockItem(id);
  if (!item) notFound();

  const movementAction = registerStockMovement.bind(null, id);
  const actual = Number(item.quantidadeAtual);
  const minimo = Number(item.quantidadeMinima);
  const isLow = item.activo && actual <= minimo;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={item.nome} />

      <main className="space-y-6 p-6">
        <Link
          href="/admin/stock"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar ao stock
        </Link>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">Quantidade actual</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900 tabular-nums">
              {actual.toLocaleString("pt-PT", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 3,
              })} {item.unidade}
            </p>
            <p className="mt-2 text-xs text-gray-500">Mínimo: {minimo.toLocaleString("pt-PT")}</p>
            <span
              className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                !item.activo
                  ? "bg-gray-200 text-gray-700"
                  : isLow
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {!item.activo ? "Inactivo" : isLow ? "Repor" : "OK"}
            </span>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm lg:col-span-2">
            <p className="text-xs uppercase tracking-wide text-gray-500">Detalhes</p>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
              <Meta label="SKU" value={item.sku ?? "-"} />
              <Meta label="Categoria" value={item.categoria ?? "-"} />
              <Meta label="Localização" value={item.localizacao ?? "-"} />
              <Meta label="Custo unitário" value={formatCurrency(item.custoUnitario)} />
              <Meta
                label="Criado por"
                value={item.createdBy?.nomeCurto ?? "-"}
              />
              <Meta
                label="Actualizado"
                value={new Date(item.updatedAt).toLocaleDateString("pt-PT")}
              />
            </dl>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <StockMovementForm action={movementAction} />

          <section className="overflow-x-auto rounded-lg border bg-white shadow-sm lg:col-span-2">
            <div className="border-b px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-900">Histórico de movimentos</h2>
            </div>
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Data</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Tipo</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Quantidade</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Referência</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Utilizador</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {item.movements.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-gray-400">
                      Sem movimentos.
                    </td>
                  </tr>
                )}
                {item.movements.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(m.createdAt).toLocaleString("pt-PT")}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {MOVEMENT_LABELS[m.tipo]}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-gray-900">
                      {Number(m.quantidade).toLocaleString("pt-PT", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 3,
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{m.referencia ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {m.criadoPor?.nomeCurto ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 font-medium text-gray-900">{value}</dd>
    </div>
  );
}
