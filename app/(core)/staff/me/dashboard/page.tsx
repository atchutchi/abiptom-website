import { redirect } from "next/navigation";
import { dbAdmin } from "@/core/lib/db";
import {
  salaryLines,
  projectPayments,
  dividendLines,
} from "@/core/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { Header } from "@/core/components/layout/Header";
import { Badge } from "@/core/components/ui/badge";
import { formatCurrency, formatDate } from "@/core/lib/utils/format";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  FileDown,
  TrendingUp,
  Wallet,
} from "lucide-react-core";
import { getCurrentUser } from "@/core/lib/auth/actions";

const ROLE_LABELS: Record<string, string> = {
  ca: "Conselho de Administração",
  dg: "Director Geral",
  coord: "Coordenação",
  staff: "Colaborador",
};

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

const PROJECT_ROLE_LABELS: Record<string, string> = {
  pf: "Ponto focal",
  aux: "Auxiliar",
  dg: "Director Geral",
  coord: "Coordenação",
};

const PERIOD_STATE_LABELS: Record<string, string> = {
  aberto: "Em aberto",
  calculado: "Calculado",
  confirmado: "Confirmado",
  pago: "Pago",
};

export const metadata = { title: "O meu painel - ABIPTOM Core" };

export default async function StaffDashboardPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user) redirect("/login");
  if (!dbUser) redirect("/login");

  const [myLines, myDividends] = await Promise.all([
    dbAdmin.query.salaryLines.findMany({
      where: eq(salaryLines.userId, dbUser.id),
      with: {
        period: {
          columns: { ano: true, mes: true, estado: true },
        },
      },
    }),
    dbAdmin.query.dividendLines.findMany({
      where: eq(dividendLines.userId, dbUser.id),
      with: {
        period: {
          columns: { ano: true, trimestre: true, estado: true },
        },
      },
    }),
  ]);

  const visibleLines = myLines
    .flatMap((line) => {
      const { period } = line;
      if (!period || period.estado === "aberto") return [];
      return [{ ...line, period }];
    })
    .sort((a, b) => {
      if (a.period.ano !== b.period.ano) return b.period.ano - a.period.ano;
      return b.period.mes - a.period.mes;
    });

  const now = new Date();
  const anoActual = now.getFullYear();

  const linhasAnoActual = visibleLines.filter(
    (l) => l.period.ano === anoActual
  );
  const totalBrutoAno = linhasAnoActual.reduce(
    (s, l) => s + Number(l.totalBrutoFinal),
    0
  );
  const totalLiquidoAno = linhasAnoActual.reduce(
    (s, l) => s + Number(l.totalLiquidoFinal),
    0
  );
  const totalPagoAno = linhasAnoActual
    .filter((l) => l.pago)
    .reduce((s, l) => s + Number(l.totalLiquidoFinal), 0);

  const pendentePagar = linhasAnoActual
    .filter((l) => !l.pago)
    .reduce((s, l) => s + Number(l.totalLiquidoFinal), 0);

  const latestLine = visibleLines[0];

  let latestProjectPayments: Array<{
    id: string;
    projectTitulo: string;
    papel: string;
    percentagemAplicada: number;
    valorRecebido: number;
  }> = [];

  if (latestLine) {
    const pp = await dbAdmin.query.projectPayments.findMany({
      where: and(
        eq(projectPayments.periodId, latestLine.periodId),
        eq(projectPayments.userId, dbUser.id)
      ),
      with: {
        project: { columns: { titulo: true } },
      },
    });
    latestProjectPayments = pp.map((p) => ({
      id: p.id,
      projectTitulo: p.project?.titulo ?? "Projecto removido",
      papel: p.papel,
      percentagemAplicada: Number(p.percentagemAplicada),
      valorRecebido: Number(p.valorRecebido),
    }));
  }

  const visibleDividends = myDividends
    .flatMap((dividend) => {
      const { period } = dividend;
      if (!period || !["aprovado", "pago"].includes(period.estado)) return [];
      return [{ ...dividend, period }];
    })
    .sort((a, b) => {
      if (a.period.ano !== b.period.ano) return b.period.ano - a.period.ano;
      return (b.period.trimestre ?? 0) - (a.period.trimestre ?? 0);
    });

  const totalDividendosAno = visibleDividends
    .filter((d) => d.period.ano === anoActual)
    .reduce((s, d) => s + Number(d.valorBruto), 0);

  return (
    <>
      <Header title="O meu painel" />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Olá, {dbUser.nomeCurto}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {dbUser.cargo ?? ROLE_LABELS[dbUser.role] ?? dbUser.role}
              </p>
            </div>
            <Badge variant="secondary">
              {ROLE_LABELS[dbUser.role] ?? dbUser.role}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              icon={TrendingUp}
              label={`Bruto ${anoActual}`}
              value={totalBrutoAno}
              sub={`${linhasAnoActual.length} mês/meses`}
              tone="blue"
            />
            <KpiCard
              icon={Wallet}
              label={`Líquido ${anoActual}`}
              value={totalLiquidoAno}
              sub={`Recebido: ${formatCurrency(totalPagoAno)}`}
              tone="emerald"
            />
            <KpiCard
              icon={Clock}
              label="A receber"
              value={pendentePagar}
              sub={pendentePagar > 0 ? "Em processamento" : "Nenhum pendente"}
              tone={pendentePagar > 0 ? "orange" : "gray"}
            />
            <KpiCard
              icon={Briefcase}
              label={`Dividendos ${anoActual}`}
              value={totalDividendosAno}
              sub={
                totalDividendosAno > 0
                  ? `${visibleDividends.filter((d) => d.period.ano === anoActual).length} período(s)`
                  : "Sem dividendos"
              }
              tone={totalDividendosAno > 0 ? "purple" : "gray"}
            />
          </div>

          {latestLine && (
            <section className="rounded-lg border bg-white overflow-hidden">
              <div className="px-5 py-3 border-b bg-gray-50">
                <h2 className="font-semibold text-gray-800">
                  Último período ({MES_LABELS[latestLine.period.mes]}{" "}
                  {latestLine.period.ano})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Salário base
                  </p>
                  <p className="text-lg font-semibold tabular-nums mt-1">
                    {formatCurrency(Number(latestLine.salarioBase))}
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Total líquido
                  </p>
                  <p className="text-2xl font-bold tabular-nums mt-1 text-emerald-700">
                    {formatCurrency(Number(latestLine.totalLiquidoFinal))}
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Estado
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {latestLine.pago ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">
                          Pago
                          {latestLine.dataPagamento &&
                            ` em ${formatDate(latestLine.dataPagamento)}`}
                        </span>
                      </>
                    ) : (
                      <Badge variant="secondary">
                        {PERIOD_STATE_LABELS[latestLine.period.estado] ??
                          latestLine.period.estado}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 border-t bg-gray-50 text-right">
                <a
                  href={`/api/salary/receipt/${latestLine.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                >
                  <FileDown className="h-4 w-4" />
                  Descarregar recibo (PDF)
                </a>
              </div>
            </section>
          )}

          {latestProjectPayments.length > 0 && latestLine && (
            <section className="rounded-lg border bg-white overflow-hidden">
              <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">
                  Alocações em projectos ({MES_LABELS[latestLine.period.mes]})
                </h2>
                <span className="text-xs text-gray-500">
                  {latestProjectPayments.length} projecto(s)
                </span>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">
                      Projecto
                    </th>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">
                      Papel
                    </th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">
                      %
                    </th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">
                      Valor recebido
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {latestProjectPayments.map((pp) => (
                    <tr key={pp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{pp.projectTitulo}</td>
                      <td className="px-4 py-2 text-gray-600">
                        {PROJECT_ROLE_LABELS[pp.papel] ?? pp.papel}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {pp.percentagemAplicada}%
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums font-medium">
                        {formatCurrency(pp.valorRecebido)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          <section className="rounded-lg border bg-white overflow-hidden">
            <div className="px-5 py-3 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-800">
                Os meus recibos salariais
              </h2>
            </div>
            {visibleLines.length === 0 ? (
              <p className="p-8 text-center text-sm text-gray-400">
                Ainda não tem recibos disponíveis.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">
                      Período
                    </th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">
                      Bruto
                    </th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">
                      Líquido
                    </th>
                    <th className="text-center px-4 py-2 font-medium text-gray-600">
                      Pago
                    </th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600 w-24">
                      Recibo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visibleLines.map((line) => (
                    <tr key={line.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5">
                        {MES_LABELS[line.period.mes]} {line.period.ano}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-600">
                        {formatCurrency(Number(line.totalBrutoFinal))}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                        {formatCurrency(Number(line.totalLiquidoFinal))}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {line.pago ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            {line.dataPagamento && (
                              <span className="text-xs text-gray-400">
                                {formatDate(line.dataPagamento)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <a
                          href={`/api/salary/receipt/${line.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {visibleDividends.length > 0 && (
            <section className="rounded-lg border bg-white overflow-hidden">
              <div className="px-5 py-3 border-b bg-gray-50">
                <h2 className="font-semibold text-gray-800">
                  Os meus dividendos
                </h2>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">
                      Período
                    </th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">
                      Quota
                    </th>
                    <th className="text-right px-4 py-2 font-medium text-gray-600">
                      Valor bruto
                    </th>
                    <th className="text-center px-4 py-2 font-medium text-gray-600">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visibleDividends.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5">
                        {d.period.trimestre
                          ? `T${d.period.trimestre} ${d.period.ano}`
                          : `${d.period.ano}`}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {Number(d.percentagemQuota)}%
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                        {formatCurrency(Number(d.valorBruto))}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {d.pago ? (
                          <Badge className="bg-green-100 text-green-800">
                            Pago
                            {d.dataPagamento && ` ${formatDate(d.dataPagamento)}`}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Aprovado</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

const TONE_CLASSES: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  orange: "bg-orange-50 text-orange-700 border-orange-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
  gray: "bg-gray-50 text-gray-600 border-gray-100",
};

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  sub: string;
  tone: "blue" | "emerald" | "orange" | "purple" | "gray";
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
      <p className="text-xl font-bold tabular-nums mt-2 text-gray-900">
        {formatCurrency(value)}
      </p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  );
}
