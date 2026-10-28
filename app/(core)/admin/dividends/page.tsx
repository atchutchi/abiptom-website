import Link from "next/link";
import { listDividendPeriods } from "@/core/lib/dividends/actions";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { formatCurrency } from "@/core/lib/utils/format";
import { Plus } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";

const STATE_LABELS: Record<string, string> = {
  proposto: "Proposto",
  aprovado: "Aprovado",
  pago: "Pago",
  anulado: "Anulado",
};

const STATE_COLORS: Record<string, string> = {
  proposto: "bg-gray-100 text-gray-700",
  aprovado: "bg-orange-100 text-orange-700",
  pago: "bg-green-100 text-green-700",
  anulado: "bg-red-100 text-red-700",
};

export const metadata = { title: "Dividendos - ABIPTOM Core" };

export default async function DividendsPage() {
  const periods = await listDividendPeriods();

  return (
    <>
      <Header title="Dividendos" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Distribuição de lucros aos sócios por período
            </p>
            <Button asChild>
              <Link href="/admin/dividends/new">
                <Plus className="h-4 w-4 mr-2" />
                Novo período
              </Link>
            </Button>
          </div>

          <div className="rounded-lg border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Período
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Estado
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Base Calculada
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Total Distribuído
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {periods.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-400 py-10 text-sm"
                    >
                      Nenhum período de dividendos registado.
                    </td>
                  </tr>
                )}
                {periods.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {p.ano}
                      {p.trimestre ? ` · T${p.trimestre}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          STATE_COLORS[p.estado] ?? "bg-gray-100 text-gray-700"
                        }
                      >
                        {STATE_LABELS[p.estado] ?? p.estado}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrency(p.baseCalculada)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      {formatCurrency(p.totalDistribuido)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/dividends/${p.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
