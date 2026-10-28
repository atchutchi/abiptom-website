import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Download,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react-core";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { getMonthlyProfitLoss, getQuarterlyProfitLoss } from "@/core/lib/reports/actions";
import { Header } from "@/core/components/layout/Header";
import { formatCurrency } from "@/core/lib/utils/format";
import { EXPENSE_CATEGORY_LABEL } from "@/core/lib/expenses/labels";
import { APP_NAME, APP_SLOGAN } from "@/core/lib/brand";

export const metadata = { title: "Relatórios" };

const MES_LABELS = [
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

const SALARY_STATE_LABELS: Record<string, string> = {
  aberto: "Aberto",
  calculado: "Calculado",
  confirmado: "Confirmado",
  pago: "Pago",
  "Consolidado trimestral": "Consolidado trimestral",
};

interface PageProps {
  searchParams: Promise<{
    ano?: string;
    mes?: string;
    periodo?: string;
    trimestre?: string;
  }>;
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (!["ca", "dg"].includes(dbUser.role)) redirect("/admin/dashboard");

  const sp = await searchParams;
  const now = new Date();
  const periodo = sp.periodo === "trimestral" ? "trimestral" : "mensal";
  const ano = Number(sp.ano) || now.getFullYear();
  const mes = Number(sp.mes) || now.getMonth() + 1;
  const trimestre = Number(sp.trimestre) || Math.ceil((now.getMonth() + 1) / 3);

  const report =
    periodo === "trimestral"
      ? await getQuarterlyProfitLoss(ano, trimestre)
      : await getMonthlyProfitLoss(ano, mes);

  const anos = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);
  const meses = Array.from({ length: 12 }, (_, i) => i + 1);
  const trimestres = [1, 2, 3, 4];

  const categoriasOrdenadas = Object.entries(report.despesas.porCategoria).sort(
    (a, b) => b[1] - a[1]
  );
  const totalDespesasCat = categoriasOrdenadas.reduce(
    (s, [, v]) => s + v,
    0
  );
  const periodoLabel =
    periodo === "trimestral"
      ? `T${trimestre} ${ano}`
      : `${MES_LABELS[mes]} ${ano}`;

  return (
    <>
      <Header title="Relatórios" />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7300]">
                {APP_NAME}
              </p>
              <h1 className="mt-1 text-2xl font-bold text-gray-950">
                {periodo === "trimestral"
                  ? "Relatório trimestral (P&L)"
                  : "Relatório mensal (P&L)"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {periodoLabel} · receitas, despesas, salários, dividendos e saldo global. {APP_SLOGAN}
              </p>
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <form method="get" className="flex flex-wrap items-end gap-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Período
                  </label>
                  <select
                    name="periodo"
                    defaultValue={periodo}
                    className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
                  >
                    <option value="mensal">Mensal</option>
                    <option value="trimestral">Trimestral</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Mês
                  </label>
                  <select
                    name="mes"
                    defaultValue={mes}
                    className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
                  >
                    {meses.map((m) => (
                      <option key={m} value={m}>
                        {MES_LABELS[m]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Trimestre
                  </label>
                  <select
                    name="trimestre"
                    defaultValue={trimestre}
                    className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
                  >
                    {trimestres.map((t) => (
                      <option key={t} value={t}>
                        T{t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Ano
                  </label>
                  <select
                    name="ano"
                    defaultValue={ano}
                    className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
                  >
                    {anos.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="h-9 rounded-md bg-[#F5B800] px-4 text-sm font-semibold text-gray-950 hover:bg-[#dca600]"
                >
                  Filtrar
                </button>
              </form>
              <a
                href={`/api/reports/pl?periodo=${periodo}&ano=${ano}&mes=${mes}&trimestre=${trimestre}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#F5B800] bg-white px-3 text-sm font-semibold text-gray-900 hover:bg-[#fff8df]"
              >
                <Download className="h-4 w-4" />
                Exportar PDF
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              icon={ArrowUpRight}
              label="Facturado"
              value={report.receitas.facturado}
              sub={`${report.receitas.facturasCount} factura(s)`}
              tone="gold"
            />
            <KpiCard
              icon={Wallet}
              label="Recebido"
              value={report.receitas.recebido}
              sub={`${report.receitas.pagamentosCount} pagamento(s)`}
              tone="gold"
            />
            <KpiCard
              icon={ArrowDownRight}
              label="Despesas"
              value={report.despesas.total}
              sub={`${report.despesas.count} movimento(s)`}
              tone="red"
            />
            <KpiCard
              icon={Receipt}
              label="Folha salarial"
              value={report.salarios.totalFolha}
              sub={
                report.salarios.estado
                  ? SALARY_STATE_LABELS[report.salarios.estado] ??
                    report.salarios.estado
                  : "Sem período"
              }
              tone="gold"
            />
          </div>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-lg border bg-white p-5 lg:col-span-2">
              <h2 className="font-semibold text-gray-900">Resumo executivo</h2>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                {report.narrativa.resumo.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="rounded-lg border bg-white p-5">
              <h2 className="font-semibold text-gray-900">Recomendações</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                {report.narrativa.recomendacoes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Em aberto"
              value={report.receitas.emAberto}
              hint="Facturas emitidas no período ainda não totalmente pagas"
            />
            <MetricCard
              label="Vencido"
              value={report.receitas.vencido}
              hint="Valor em aberto com vencimento ultrapassado"
              danger={report.receitas.vencido > 0}
            />
            <PercentCard
              label="Taxa de cobrança"
              value={report.indicadores.taxaCobranca}
              hint="Recebido / facturado"
            />
            <PercentCard
              label="Despesas / facturado"
              value={report.indicadores.despesaSobreFacturado}
              hint="Peso das despesas no período"
              danger={report.indicadores.despesaSobreFacturado > 40}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ResultCard
              icon={TrendingUp}
              label="Margem bruta"
              value={report.resultado.margemBruta}
              hint="Facturado - Despesas"
            />
            <ResultCard
              icon={TrendingUp}
              label="Margem líquida"
              value={report.resultado.margemLiquida}
              hint="Margem bruta - Folha bruta"
            />
            <ResultCard
              icon={Banknote}
              label={
                periodo === "trimestral"
                  ? "Saldo acumulado trimestral"
                  : "Saldo global do mês"
              }
              value={report.resultado.saldoGlobal}
              hint={`Recebido - Despesas - Folha líquida - Divid. ${periodo === "trimestral" ? "pagos no período" : "pagos"}`}
            />
          </div>

          {periodo === "trimestral" && report.monthlyBreakdown?.length ? (
            <section className="overflow-hidden rounded-lg border bg-white">
              <div className="flex items-center justify-between border-b bg-[#fff8df] px-5 py-3">
                <h2 className="font-semibold text-gray-900">Resumo por mês</h2>
                <span className="text-xs text-gray-600">
                  Consolidação de {report.monthlyBreakdown.length} meses
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[980px] w-full text-sm">
                  <thead className="bg-gray-950 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Mês</th>
                      <th className="px-4 py-2 text-right font-medium">Facturado</th>
                      <th className="px-4 py-2 text-right font-medium">Recebido</th>
                      <th className="px-4 py-2 text-right font-medium">Despesas</th>
                      <th className="px-4 py-2 text-right font-medium">Folha bruta</th>
                      <th className="px-4 py-2 text-right font-medium">Folha líquida</th>
                      <th className="px-4 py-2 text-right font-medium">Dividendos pagos</th>
                      <th className="px-4 py-2 text-right font-medium">Saldo do mês</th>
                      <th className="px-4 py-2 text-right font-medium">Saldo acumulado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {report.monthlyBreakdown.map((month) => (
                      <tr key={`${month.ano}-${month.mes}`} className="hover:bg-[#fffdf4]">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {month.label}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatCurrency(month.facturado)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatCurrency(month.recebido)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatCurrency(month.despesas)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatCurrency(month.folha)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatCurrency(month.folhaLiquida)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatCurrency(month.dividendosPagos)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-semibold tabular-nums ${
                            month.saldoGlobal >= 0 ? "text-gray-950" : "text-red-700"
                          }`}
                        >
                          {formatCurrency(month.saldoGlobal)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-semibold tabular-nums ${
                            month.saldoAcumulado >= 0 ? "text-gray-950" : "text-red-700"
                          }`}
                        >
                          {formatCurrency(month.saldoAcumulado)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BreakdownTable
          title="Top clientes"
          rows={report.receitas.topClientes}
          emptyLabel="Sem facturação por cliente neste período."
        />

        <BreakdownTable
          title="Top projectos"
          rows={report.receitas.topProjectos}
          emptyLabel="Sem facturação por projecto neste período."
        />

        <section className="rounded-lg border bg-white overflow-hidden">
          <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Despesas por categoria</h2>
            <span className="text-xs text-gray-500 tabular-nums">
              {formatCurrency(totalDespesasCat)}
            </span>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {categoriasOrdenadas.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400 py-8">
                    Sem despesas no {periodo === "trimestral" ? "trimestre" : "mês"}.
                  </td>
                </tr>
              )}
              {categoriasOrdenadas.map(([cat, valor]) => {
                const pct =
                  totalDespesasCat > 0 ? (valor / totalDespesasCat) * 100 : 0;
                return (
                  <tr key={cat} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {EXPENSE_CATEGORY_LABEL[cat] ?? cat}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      {formatCurrency(valor)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-xs text-gray-500 w-16">
                      {pct.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="rounded-lg border bg-white overflow-hidden">
          <div className="px-5 py-3 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-800">Detalhe</h2>
          </div>
          <dl className="divide-y divide-gray-100 text-sm">
            <Row label="Total bruto da folha" value={report.salarios.totalBruto} />
            <Row
              label="Total líquido pago a colaboradores"
              value={report.salarios.totalLiquido}
            />
            <Row
              label="Dividendos distribuídos"
              value={report.dividendos.totalDistribuido}
            />
            <Row
              label={`Dividendos pagos ${periodo === "trimestral" ? "no período" : "no mês"}`}
              value={report.dividendos.pagoNoMes}
            />
            <Row
              label={
                periodo === "trimestral"
                  ? "Saldo acumulado trimestral"
                  : "Saldo global do mês"
              }
              value={report.resultado.saldoGlobal}
              strong
            />
          </dl>
          <div className="px-4 py-3 text-xs text-gray-500 border-t bg-gray-50">
            {periodo === "trimestral"
              ? "O saldo acumulado soma os saldos globais dos três meses do trimestre."
              : "Saldo global = recebido - despesas - folha líquida - dividendos pagos. Dividendos distribuídos correspondem ao trimestre do mês seleccionado (T1=Mar, T2=Jun, T3=Set, T4=Dez)."}
          </div>
        </section>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-gray-50 px-4 py-3 text-xs text-gray-600">
            <span>Ver também:</span>
            <Link href="/admin/invoices" className="text-blue-600 hover:underline">
              Facturas
            </Link>
            <Link href="/admin/expenses" className="text-blue-600 hover:underline">
              Despesas
            </Link>
            <Link href="/admin/salary" className="text-blue-600 hover:underline">
              Folha salarial
            </Link>
            <Link href="/admin/dividends" className="text-blue-600 hover:underline">
              Dividendos
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

const TONE_CLASSES: Record<string, string> = {
  gold: "bg-[#fff8df] text-gray-950 border-[#F5B800]",
  red: "bg-red-50 text-red-700 border-red-100",
};

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  sub: string;
  tone: "gold" | "red";
}

function KpiCard({ icon: Icon, label, value, sub, tone }: KpiCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <div
          className={`h-7 w-7 rounded-md border flex items-center justify-center ${TONE_CLASSES[tone]}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className="text-xl font-bold tabular-nums mt-2">
        {formatCurrency(value)}
      </p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  );
}

interface ResultCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  hint: string;
}

function ResultCard({ icon: Icon, label, value, hint }: ResultCardProps) {
  const positive = value >= 0;
  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="flex items-center gap-2 text-gray-600">
        <Icon className="h-4 w-4" />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p
        className={`text-2xl font-bold tabular-nums mt-2 ${
          positive ? "text-gray-900" : "text-red-600"
        }`}
      >
        {formatCurrency(value)}
      </p>
      <p className="text-xs text-gray-400 mt-1">{hint}</p>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
  hint: string;
  danger?: boolean;
}

function MetricCard({ label, value, hint, danger = false }: MetricCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p
        className={`mt-2 text-xl font-bold tabular-nums ${
          danger ? "text-red-700" : "text-gray-950"
        }`}
      >
        {formatCurrency(value)}
      </p>
      <p className="mt-1 text-xs text-gray-500">{hint}</p>
    </div>
  );
}

interface PercentCardProps {
  label: string;
  value: number;
  hint: string;
  danger?: boolean;
}

function PercentCard({ label, value, hint, danger = false }: PercentCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p
        className={`mt-2 text-xl font-bold tabular-nums ${
          danger ? "text-red-700" : "text-gray-950"
        }`}
      >
        {value.toFixed(1)}%
      </p>
      <p className="mt-1 text-xs text-gray-500">{hint}</p>
    </div>
  );
}

interface BreakdownTableProps {
  title: string;
  rows: Array<{ id: string; nome: string; valor: number; count: number }>;
  emptyLabel: string;
}

function BreakdownTable({ title, rows, emptyLabel }: BreakdownTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border bg-white">
      <div className="border-b bg-gray-50 px-5 py-3">
        <h2 className="font-semibold text-gray-800">{title}</h2>
      </div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-100">
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="py-8 text-center text-gray-400">
                {emptyLabel}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{row.nome}</p>
                <p className="text-xs text-gray-500">{row.count} factura(s)</p>
              </td>
              <td className="px-4 py-3 text-right font-medium tabular-nums">
                {formatCurrency(row.valor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

interface RowProps {
  label: string;
  value: number;
  strong?: boolean;
}

function Row({ label, value, strong = false }: RowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <dt className="text-gray-600">{label}</dt>
      <dd
        className={`tabular-nums ${
          strong ? "font-semibold text-gray-950" : "font-medium"
        }`}
      >
        {formatCurrency(value)}
      </dd>
    </div>
  );
}
