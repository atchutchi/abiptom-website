"use server";

import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { dbAdmin, withAuthenticatedDb } from "@/core/lib/db";
import {
  clients,
  dividendLines,
  dividendPeriods,
  expenses,
  invoicePayments,
  invoices,
  projects,
  salaryLines,
  salaryPeriods,
} from "@/core/lib/db/schema";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { buildReportNarrative, type ReportNarrative } from "@/core/lib/reports/insights";
import { getMonthRange } from "@/core/lib/utils/date-range";
import { toXofInteger } from "@/core/lib/utils/money";

interface MonthRange {
  start: string;
  end: string;
}

export interface ReportBreakdownItem {
  id: string;
  nome: string;
  valor: number;
  count: number;
}

export interface ProfitLossReport {
  ano: number;
  mes: number;
  periodoTipo?: "mensal" | "trimestral";
  trimestre?: number;
  periodoLabel?: string;
  monthlyBreakdown?: ProfitLossMonthSummary[];
  narrativa: ReportNarrative;
  indicadores: {
    taxaCobranca: number;
    margemLiquidaPercentagem: number;
    despesaSobreFacturado: number;
  };
  receitas: {
    facturado: number;
    recebido: number;
    emAberto: number;
    vencido: number;
    facturasCount: number;
    pagamentosCount: number;
    porEstado: Record<string, number>;
    topClientes: ReportBreakdownItem[];
    topProjectos: ReportBreakdownItem[];
  };
  despesas: {
    total: number;
    porCategoria: Record<string, number>;
    count: number;
  };
  salarios: {
    totalFolha: number;
    totalLiquido: number;
    totalBruto: number;
    estado: string | null;
  };
  dividendos: {
    totalDistribuido: number;
    pagoNoMes: number;
  };
  resultado: {
    margemBruta: number;
    margemLiquida: number;
    cashflow: number;
    saldoGlobal: number;
  };
}

export interface ProfitLossMonthSummary {
  ano: number;
  mes: number;
  label: string;
  facturado: number;
  recebido: number;
  despesas: number;
  folha: number;
  folhaLiquida: number;
  dividendosPagos: number;
  cashflow: number;
  saldoGlobal: number;
  saldoAcumulado: number;
}

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

async function assertReportsAccess() {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!["ca", "dg"].includes(dbUser.role)) throw new Error("Sem permissão");
  return { user, dbUser };
}

function addBreakdown(
  map: Map<string, ReportBreakdownItem>,
  id: string | null,
  nome: string | null,
  valor: number,
) {
  const key = id ?? "sem-associacao";
  const current = map.get(key) ?? {
    id: key,
    nome: nome ?? "Sem associação",
    valor: 0,
    count: 0,
  };

  current.valor += valor;
  current.count += 1;
  map.set(key, current);
}

function topItems(map: Map<string, ReportBreakdownItem>) {
  return Array.from(map.values())
    .sort((left, right) => right.valor - left.valor)
    .slice(0, 5);
}

function buildIndicators(
  facturado: number,
  recebido: number,
  totalDespesas: number,
  margemLiquida: number,
) {
  return {
    taxaCobranca: facturado > 0 ? (recebido / facturado) * 100 : 0,
    margemLiquidaPercentagem: facturado > 0 ? (margemLiquida / facturado) * 100 : 0,
    despesaSobreFacturado: facturado > 0 ? (totalDespesas / facturado) * 100 : 0,
  };
}

async function getInvoiceOutstandingById(
  db: typeof dbAdmin,
  invoiceRows: Array<{
    id: string;
    total: string;
    taxaCambio: string | null;
  }>,
) {
  const invoiceIds = invoiceRows.map((invoice) => invoice.id);
  if (invoiceIds.length === 0) return new Map<string, number>();

  const paymentRows = await db
    .select({
      invoiceId: invoicePayments.invoiceId,
      valor: invoicePayments.valor,
      taxaCambio: invoicePayments.taxaCambio,
    })
    .from(invoicePayments)
    .where(inArray(invoicePayments.invoiceId, invoiceIds));

  const paidByInvoice = new Map<string, number>();
  for (const payment of paymentRows) {
    paidByInvoice.set(
      payment.invoiceId,
      (paidByInvoice.get(payment.invoiceId) ?? 0) +
        toXofInteger(Number(payment.valor) * Number(payment.taxaCambio ?? "1")),
    );
  }

  const outstandingByInvoice = new Map<string, number>();
  for (const invoice of invoiceRows) {
    const total = toXofInteger(Number(invoice.total) * Number(invoice.taxaCambio ?? "1"));
    outstandingByInvoice.set(
      invoice.id,
      Math.max(0, total - (paidByInvoice.get(invoice.id) ?? 0)),
    );
  }

  return outstandingByInvoice;
}

async function computeMonthlyProfitLoss(
  db: typeof dbAdmin,
  ano: number,
  mes: number,
): Promise<ProfitLossReport> {
  const { start, end }: MonthRange = getMonthRange(ano, mes);

  const facturasDoMes = await db
    .select({
      id: invoices.id,
      total: invoices.total,
      taxaCambio: invoices.taxaCambio,
      estado: invoices.estado,
      dataVencimento: invoices.dataVencimento,
      clientId: invoices.clientId,
      clientName: clients.nome,
      projectId: invoices.projectId,
      projectTitle: projects.titulo,
    })
    .from(invoices)
    .leftJoin(clients, eq(invoices.clientId, clients.id))
    .leftJoin(projects, eq(invoices.projectId, projects.id))
    .where(
      and(
        gte(invoices.dataEmissao, start),
        lte(invoices.dataEmissao, end),
        inArray(invoices.estado, ["definitiva", "paga_parcial", "paga"]),
      ),
    );

  const facturado = facturasDoMes.reduce(
    (sum, invoice) =>
      sum + toXofInteger(Number(invoice.total) * Number(invoice.taxaCambio ?? "1")),
    0,
  );

  const pagamentosDoMes = await db
    .select({
      valor: invoicePayments.valor,
      taxaCambio: invoicePayments.taxaCambio,
    })
    .from(invoicePayments)
    .where(and(gte(invoicePayments.data, start), lte(invoicePayments.data, end)));

  const recebido = pagamentosDoMes.reduce(
    (sum, payment) =>
      sum + toXofInteger(Number(payment.valor) * Number(payment.taxaCambio ?? "1")),
    0,
  );

  const outstandingByInvoice = await getInvoiceOutstandingById(db, facturasDoMes);
  const hoje = new Date().toISOString().split("T")[0];
  let emAberto = 0;
  let vencido = 0;
  const porEstado: Record<string, number> = {};
  const clientesMap = new Map<string, ReportBreakdownItem>();
  const projectosMap = new Map<string, ReportBreakdownItem>();

  for (const invoice of facturasDoMes) {
    const total = toXofInteger(Number(invoice.total) * Number(invoice.taxaCambio ?? "1"));
    const aberto = outstandingByInvoice.get(invoice.id) ?? 0;
    emAberto += aberto;
    porEstado[invoice.estado] = (porEstado[invoice.estado] ?? 0) + total;
    addBreakdown(clientesMap, invoice.clientId, invoice.clientName, total);
    addBreakdown(projectosMap, invoice.projectId, invoice.projectTitle, total);

    if (
      aberto > 0 &&
      invoice.dataVencimento &&
      invoice.dataVencimento <= hoje &&
      ["definitiva", "paga_parcial"].includes(invoice.estado)
    ) {
      vencido += aberto;
    }
  }

  const despesasDoMes = await db
    .select({
      categoria: expenses.categoria,
      valorXof: expenses.valorXof,
      estado: expenses.estado,
    })
    .from(expenses)
    .where(and(gte(expenses.data, start), lte(expenses.data, end)));

  const despesasValidas = despesasDoMes.filter((expense) => expense.estado !== "anulada");
  const totalDespesas = despesasValidas.reduce(
    (sum, expense) => sum + toXofInteger(expense.valorXof),
    0,
  );
  const porCategoria: Record<string, number> = {};
  for (const expense of despesasValidas) {
    porCategoria[expense.categoria] =
      (porCategoria[expense.categoria] ?? 0) + toXofInteger(expense.valorXof);
  }

  const periodo = await db.query.salaryPeriods.findFirst({
    where: and(eq(salaryPeriods.ano, ano), eq(salaryPeriods.mes, mes)),
  });

  let totalFolha = 0;
  let totalLiquido = 0;
  let totalBruto = 0;
  let estadoSalario: string | null = null;

  if (periodo) {
    totalFolha = toXofInteger(periodo.totalFolha ?? 0);
    totalLiquido = toXofInteger(periodo.totalLiquido ?? 0);
    totalBruto = toXofInteger(periodo.totalBruto ?? 0);
    estadoSalario = periodo.estado;

    if (totalFolha === 0) {
      const linhas = await db
        .select({
          totalBruto: salaryLines.totalBrutoFinal,
          totalLiquido: salaryLines.totalLiquidoFinal,
        })
        .from(salaryLines)
        .where(eq(salaryLines.periodId, periodo.id));
      totalBruto = linhas.reduce((sum, line) => sum + toXofInteger(line.totalBruto), 0);
      totalLiquido = linhas.reduce(
        (sum, line) => sum + toXofInteger(line.totalLiquido),
        0,
      );
      totalFolha = totalBruto;
    }
  }

  const linhasDivPagas = await db
    .select({
      valorBruto: dividendLines.valorBruto,
    })
    .from(dividendLines)
    .innerJoin(dividendPeriods, eq(dividendLines.periodId, dividendPeriods.id))
    .where(
      and(
        eq(dividendLines.pago, true),
        gte(dividendLines.dataPagamento, start),
        lte(dividendLines.dataPagamento, end),
      ),
    );

  const pagoNoMes = linhasDivPagas.reduce(
    (sum, line) => sum + toXofInteger(line.valorBruto),
    0,
  );

  const periodosAno = await db
    .select({
      totalDistribuido: dividendPeriods.totalDistribuido,
      trimestre: dividendPeriods.trimestre,
    })
    .from(dividendPeriods)
    .where(eq(dividendPeriods.ano, ano));

  const totalDistribuido = periodosAno
    .filter((period) => {
      if (!period.trimestre) return false;
      const trimestreMes = [0, 3, 6, 9, 12];
      return (
        period.trimestre >= 1 &&
        period.trimestre <= 4 &&
        trimestreMes[period.trimestre] === mes
      );
    })
    .reduce((sum, period) => sum + toXofInteger(period.totalDistribuido), 0);

  const margemBruta = facturado - totalDespesas;
  const margemLiquida = margemBruta - totalFolha;
  const cashflow = recebido - totalDespesas - totalLiquido - pagoNoMes;
  const saldoGlobal = cashflow;
  const indicadores = buildIndicators(facturado, recebido, totalDespesas, margemLiquida);
  const periodoLabel = `${String(mes).padStart(2, "0")}/${ano}`;

  return {
    ano,
    mes,
    periodoTipo: "mensal",
    periodoLabel,
    narrativa: buildReportNarrative({
      periodoLabel,
      receitas: {
        facturado,
        recebido,
        emAberto,
        vencido,
        facturasCount: facturasDoMes.length,
        pagamentosCount: pagamentosDoMes.length,
      },
      despesas: { total: totalDespesas, count: despesasValidas.length },
      salarios: { totalFolha, totalLiquido },
      resultado: { margemLiquida, cashflow },
      indicadores,
    }),
    indicadores,
    receitas: {
      facturado,
      recebido,
      emAberto,
      vencido,
      facturasCount: facturasDoMes.length,
      pagamentosCount: pagamentosDoMes.length,
      porEstado,
      topClientes: topItems(clientesMap),
      topProjectos: topItems(projectosMap),
    },
    despesas: {
      total: totalDespesas,
      porCategoria,
      count: despesasValidas.length,
    },
    salarios: {
      totalFolha,
      totalLiquido,
      totalBruto,
      estado: estadoSalario,
    },
    dividendos: {
      totalDistribuido,
      pagoNoMes,
    },
    resultado: {
      margemBruta,
      margemLiquida,
      cashflow,
      saldoGlobal,
    },
  };
}

export async function getMonthlyProfitLoss(
  ano: number,
  mes: number,
): Promise<ProfitLossReport> {
  const { user } = await assertReportsAccess();
  return withAuthenticatedDb(user, async (db) => computeMonthlyProfitLoss(db, ano, mes));
}

export async function getQuarterlyProfitLoss(
  ano: number,
  trimestre: number,
): Promise<ProfitLossReport> {
  const { user } = await assertReportsAccess();
  return withAuthenticatedDb(user, async (db) =>
    getQuarterlyProfitLossForDb(db, ano, trimestre),
  );
}

export async function getMonthlyProfitLossSystem(
  ano: number,
  mes: number,
): Promise<ProfitLossReport> {
  return computeMonthlyProfitLoss(dbAdmin, ano, mes);
}

function mergeBreakdown(
  reports: ProfitLossReport[],
  key: "topClientes" | "topProjectos",
) {
  const map = new Map<string, ReportBreakdownItem>();
  for (const report of reports) {
    for (const item of report.receitas[key]) {
      const current = map.get(item.id) ?? { ...item, valor: 0, count: 0 };
      current.valor += item.valor;
      current.count += item.count;
      map.set(item.id, current);
    }
  }

  return topItems(map);
}

async function getQuarterlyProfitLossForDb(
  db: typeof dbAdmin,
  ano: number,
  trimestre: number,
): Promise<ProfitLossReport> {
  if (trimestre < 1 || trimestre > 4) {
    throw new Error("Trimestre inválido");
  }

  const mesInicial = (trimestre - 1) * 3 + 1;
  const meses = [mesInicial, mesInicial + 1, mesInicial + 2];
  const monthlyReports = await Promise.all(
    meses.map((month) => computeMonthlyProfitLoss(db, ano, month)),
  );

  const porCategoria: Record<string, number> = {};
  const porEstado: Record<string, number> = {};
  for (const report of monthlyReports) {
    for (const [category, value] of Object.entries(report.despesas.porCategoria)) {
      porCategoria[category] = (porCategoria[category] ?? 0) + value;
    }
    for (const [state, value] of Object.entries(report.receitas.porEstado)) {
      porEstado[state] = (porEstado[state] ?? 0) + value;
    }
  }

  const facturado = monthlyReports.reduce((sum, report) => sum + report.receitas.facturado, 0);
  const recebido = monthlyReports.reduce((sum, report) => sum + report.receitas.recebido, 0);
  const emAberto = monthlyReports.reduce((sum, report) => sum + report.receitas.emAberto, 0);
  const vencido = monthlyReports.reduce((sum, report) => sum + report.receitas.vencido, 0);
  const totalDespesas = monthlyReports.reduce((sum, report) => sum + report.despesas.total, 0);
  const totalFolha = monthlyReports.reduce((sum, report) => sum + report.salarios.totalFolha, 0);
  const totalLiquido = monthlyReports.reduce((sum, report) => sum + report.salarios.totalLiquido, 0);
  const totalBruto = monthlyReports.reduce((sum, report) => sum + report.salarios.totalBruto, 0);
  const totalDistribuido = monthlyReports.reduce(
    (sum, report) => sum + report.dividendos.totalDistribuido,
    0,
  );
  const pagoNoMes = monthlyReports.reduce((sum, report) => sum + report.dividendos.pagoNoMes, 0);

  let saldoAcumulado = 0;
  const monthlyBreakdown: ProfitLossMonthSummary[] = monthlyReports.map((report) => {
    saldoAcumulado += report.resultado.saldoGlobal;

    return {
      ano: report.ano,
      mes: report.mes,
      label: MES_LABELS[report.mes],
      facturado: report.receitas.facturado,
      recebido: report.receitas.recebido,
      despesas: report.despesas.total,
      folha: report.salarios.totalFolha,
      folhaLiquida: report.salarios.totalLiquido,
      dividendosPagos: report.dividendos.pagoNoMes,
      cashflow: report.resultado.cashflow,
      saldoGlobal: report.resultado.saldoGlobal,
      saldoAcumulado,
    };
  });

  const margemBruta = facturado - totalDespesas;
  const margemLiquida = margemBruta - totalFolha;
  const cashflow = recebido - totalDespesas - totalLiquido - pagoNoMes;
  const saldoGlobal = cashflow;
  const indicadores = buildIndicators(facturado, recebido, totalDespesas, margemLiquida);
  const periodoLabel = `T${trimestre} ${ano}`;

  return {
    ano,
    mes: meses[2],
    trimestre,
    periodoTipo: "trimestral",
    periodoLabel,
    monthlyBreakdown,
    narrativa: buildReportNarrative({
      periodoLabel,
      receitas: {
        facturado,
        recebido,
        emAberto,
        vencido,
        facturasCount: monthlyReports.reduce(
          (sum, report) => sum + report.receitas.facturasCount,
          0,
        ),
        pagamentosCount: monthlyReports.reduce(
          (sum, report) => sum + report.receitas.pagamentosCount,
          0,
        ),
      },
      despesas: {
        total: totalDespesas,
        count: monthlyReports.reduce((sum, report) => sum + report.despesas.count, 0),
      },
      salarios: { totalFolha, totalLiquido },
      resultado: { margemLiquida, cashflow },
      indicadores,
    }),
    indicadores,
    receitas: {
      facturado,
      recebido,
      emAberto,
      vencido,
      facturasCount: monthlyReports.reduce(
        (sum, report) => sum + report.receitas.facturasCount,
        0,
      ),
      pagamentosCount: monthlyReports.reduce(
        (sum, report) => sum + report.receitas.pagamentosCount,
        0,
      ),
      porEstado,
      topClientes: mergeBreakdown(monthlyReports, "topClientes"),
      topProjectos: mergeBreakdown(monthlyReports, "topProjectos"),
    },
    despesas: {
      total: totalDespesas,
      porCategoria,
      count: monthlyReports.reduce((sum, report) => sum + report.despesas.count, 0),
    },
    salarios: {
      totalFolha,
      totalLiquido,
      totalBruto,
      estado: "Consolidado trimestral",
    },
    dividendos: {
      totalDistribuido,
      pagoNoMes,
    },
    resultado: {
      margemBruta,
      margemLiquida,
      cashflow,
      saldoGlobal,
    },
  };
}

export async function getQuarterlyProfitLossSystem(
  ano: number,
  trimestre: number,
): Promise<ProfitLossReport> {
  return getQuarterlyProfitLossForDb(dbAdmin, ano, trimestre);
}
