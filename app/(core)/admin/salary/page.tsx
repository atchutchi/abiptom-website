import Link from "next/link";
import { listSalaryPeriods } from "@/core/lib/salary/actions";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { formatCurrency } from "@/core/lib/utils/format";
import { Plus } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";
import { RecalculateHistoricalPeriodsButton } from "@/core/components/forms/RecalculateHistoricalPeriodsButton";

const PERIOD_STATE_LABELS: Record<string, string> = {
  aberto: "Aberto",
  calculado: "Calculado",
  confirmado: "Confirmado",
  pago: "Pago",
};

const PERIOD_STATE_COLORS: Record<string, string> = {
  aberto: "bg-gray-100 text-gray-700",
  calculado: "bg-blue-100 text-blue-700",
  confirmado: "bg-orange-100 text-orange-700",
  pago: "bg-green-100 text-green-700",
};

const MES_LABELS = [
  "", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default async function SalaryPage() {
  const periods = await listSalaryPeriods();

  return (
    <>
      <Header title="Folha Salarial" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-gray-500">
              Processamento de salários por período
            </p>
            <div className="flex items-start gap-2">
              <RecalculateHistoricalPeriodsButton />
              <Button asChild>
                <Link href="/admin/salary/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo período
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Período
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Política
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Estado
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Total Líquido
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Total Folha
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {periods.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center text-gray-400 py-10 text-sm"
                    >
                      Nenhum período processado ainda.
                    </td>
                  </tr>
                )}
                {periods.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {MES_LABELS[p.mes]} {p.ano}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.policy.nome}{" "}
                      <span className="text-gray-400">v{p.policy.versao}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          PERIOD_STATE_COLORS[p.estado] ??
                          "bg-gray-100 text-gray-700"
                        }
                      >
                        {PERIOD_STATE_LABELS[p.estado] ?? p.estado}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrency(p.totalLiquido)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrency(p.totalFolha)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/salary/${p.id}`}
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
