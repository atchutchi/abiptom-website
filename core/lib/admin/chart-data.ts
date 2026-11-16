export interface FinancialDatum { label: string; value: number }

interface DashboardTotals {
  facturadoMes: number; recebidoMes: number; despesasMes: number;
  dividendosPagosMes: number; folhaMes: { totalLiquido: number }; saldoGlobalMes: number;
}

export function dashboardChartData(stats: DashboardTotals): FinancialDatum[] {
  return [
    { label: 'Facturado', value: stats.facturadoMes },
    { label: 'Recebido', value: stats.recebidoMes },
    { label: 'Despesas', value: stats.despesasMes },
    { label: 'Folha líquida', value: stats.folhaMes.totalLiquido },
    { label: 'Dividendos pagos', value: stats.dividendosPagosMes },
    { label: 'Saldo global', value: stats.saldoGlobalMes },
  ];
}

export function expenseChartData(categories: Record<string, number>, labels: Record<string, string>): FinancialDatum[] {
  return Object.entries(categories).sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({ label: labels[key] ?? key, value }));
}

interface ReportTotals {
  receitas: { facturado: number; recebido: number }; despesas: { total: number };
  salarios: { totalLiquido: number }; dividendos: { pagoNoMes: number }; resultado: { saldoGlobal: number };
}

export function reportChartData(report: ReportTotals): FinancialDatum[] {
  return dashboardChartData({ facturadoMes: report.receitas.facturado, recebidoMes: report.receitas.recebido,
    despesasMes: report.despesas.total, folhaMes: { totalLiquido: report.salarios.totalLiquido },
    dividendosPagosMes: report.dividendos.pagoNoMes, saldoGlobalMes: report.resultado.saldoGlobal });
}

export function monthlyChartData(months?: readonly { label: string; recebido: number; despesas: number; saldoGlobal: number }[]) {
  return (months ?? []).map(month => ({ label: month.label, recebido: month.recebido, despesas: month.despesas, saldo: month.saldoGlobal }));
}
