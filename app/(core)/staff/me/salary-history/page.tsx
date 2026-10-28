import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Header } from "@/core/components/layout/Header";
import { dbAdmin } from "@/core/lib/db";
import {
  projectPayments,
  salaryLines,
} from "@/core/lib/db/schema";
import { formatCurrency, formatDate } from "@/core/lib/utils/format";
import { getCurrentUser } from "@/core/lib/auth/actions";

export const metadata = { title: "Histórico salarial - ABIPTOM Core" };

const PERIOD_STATE_LABELS: Record<string, string> = {
  aberto: "Em aberto",
  calculado: "Calculado",
  confirmado: "Confirmado",
  pago: "Pago",
};

const MONTH_LABELS = [
  "",
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default async function SalaryHistoryPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user) redirect("/login");
  if (!dbUser) redirect("/login");

  const lines = await dbAdmin.query.salaryLines.findMany({
    where: eq(salaryLines.userId, dbUser.id),
    with: {
      period: {
        columns: {
          id: true,
          ano: true,
          mes: true,
          estado: true,
        },
      },
    },
  });

  const visibleLines = lines
    .flatMap((line) => {
      const { period } = line;
      if (!period || period.estado === "aberto") return [];
      return [{ ...line, period }];
    })
    .sort((a, b) => {
      if (a.period.ano !== b.period.ano) return b.period.ano - a.period.ano;
      return b.period.mes - a.period.mes;
    });

  const bonuses = await dbAdmin.query.projectPayments.findMany({
    where: eq(projectPayments.userId, dbUser.id),
    with: {
      project: {
        columns: {
          titulo: true,
        },
      },
      period: {
        columns: {
          id: true,
          ano: true,
          mes: true,
        },
      },
    },
  });

  const projectBonuses = bonuses
    .flatMap((payment) => {
      const { period } = payment;
      if (!period) return [];
      return [{ ...payment, period }];
    })
    .sort((a, b) => {
      if (a.period.ano !== b.period.ano) return b.period.ano - a.period.ano;
      return b.period.mes - a.period.mes;
    });

  if (dbUser.role !== "staff" && dbUser.role !== "coord") {
    redirect("/staff/me/dashboard");
  }

  const totalLiquido = visibleLines.reduce((sum, line) => sum + Number(line.totalLiquidoFinal), 0);
  const totalPago = visibleLines
    .filter((line) => line.pago)
    .reduce((sum, line) => sum + Number(line.totalLiquidoFinal), 0);
  const totalBonus = projectBonuses.reduce(
    (sum, payment) => sum + Number(payment.valorRecebido),
    0
  );
  const chartData = visibleLines
    .slice()
    .sort((a, b) => {
      if (a.period.ano !== b.period.ano) return a.period.ano - b.period.ano;
      return a.period.mes - b.period.mes;
    })
    .map((line) => ({
      id: `${line.period.ano}-${line.period.mes}`,
      label: `${MONTH_LABELS[line.period.mes].slice(0, 3)} ${String(line.period.ano).slice(-2)}`,
      totalLiquido: Number(line.totalLiquidoFinal),
      totalBruto: Number(line.totalBrutoFinal),
    }));
  const maxChartValue = Math.max(
    ...chartData.map((item) => item.totalLiquido),
    1
  );

  return (
    <>
      <Header title="Histórico salarial" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <KpiCard label="Total líquido acumulado" value={formatCurrency(totalLiquido)} />
            <KpiCard label="Total pago" value={formatCurrency(totalPago)} />
            <KpiCard label="Bónus de projectos" value={formatCurrency(totalBonus)} />
          </div>

          <section className="rounded-lg border bg-white shadow-sm">
            <div className="border-b bg-gray-50 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-900">Evolução mensal</h2>
            </div>
            {chartData.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-gray-400">
                Ainda sem histórico suficiente para mostrar evolução.
              </p>
            ) : (
              <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
                {chartData.map((item) => (
                  <article key={item.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          {item.label}
                        </p>
                        <p className="mt-2 text-lg font-semibold tabular-nums text-gray-900">
                          {formatCurrency(item.totalLiquido)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Bruto: {formatCurrency(item.totalBruto)}
                        </p>
                      </div>
                      <div className="flex h-24 items-end">
                        <div className="flex h-full w-7 items-end rounded-full bg-gray-200 p-1">
                          <div
                            className="w-full rounded-full bg-gray-900"
                            style={{
                              height: `${Math.max(
                                12,
                                (item.totalLiquido / maxChartValue) * 100
                              )}%`,
                            }}
                            aria-label={`${item.label}: ${formatCurrency(item.totalLiquido)}`}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="overflow-x-auto rounded-lg border bg-white shadow-sm">
            <div className="border-b bg-gray-50 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-900">Recibos e períodos</h2>
            </div>
            <table className="w-full min-w-[940px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Período</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Base</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Bruto</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Líquido</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Estado</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Pagamento</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Recibo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visibleLines.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-gray-400">
                      Ainda sem períodos salariais fechados.
                    </td>
                  </tr>
                )}
                {visibleLines.map((line) => (
                  <tr key={line.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {MONTH_LABELS[line.period.mes]} {line.period.ano}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">
                      {formatCurrency(line.salarioBase)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">
                      {formatCurrency(line.totalBrutoFinal)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-gray-900">
                      {formatCurrency(line.totalLiquidoFinal)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {line.pago ? "Pago" : PERIOD_STATE_LABELS[line.period.estado] ?? line.period.estado}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {line.dataPagamento ? formatDate(line.dataPagamento) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/api/salary/receipt/${line.id}`}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="overflow-x-auto rounded-lg border bg-white shadow-sm">
            <div className="border-b bg-gray-50 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-900">Alocações por projecto</h2>
            </div>
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Período</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Projecto</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Papel</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">%</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {projectBonuses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-gray-400">
                      Sem componentes dinâmicas registadas.
                    </td>
                  </tr>
                )}
                {projectBonuses.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">
                      {MONTH_LABELS[payment.period.mes]} {payment.period.ano}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {payment.project?.titulo ?? "Projecto removido"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{payment.papel}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">
                      {(Number(payment.percentagemAplicada) * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-gray-900">
                      {formatCurrency(payment.valorRecebido)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-gray-900 tabular-nums">{value}</p>
    </div>
  );
}
