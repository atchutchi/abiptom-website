// Synthetic examples only. This module never imports a database or an action at runtime.
import type { DashboardStats } from '@/core/lib/dashboard/actions';
import type { ProfitLossReport } from '@/core/lib/reports/actions';

export const demoStats: DashboardStats = {
  facturasAbertas: { count: 8, totalXof: 1250000 }, facturasVencidas: { count: 2, totalXof: 320000 },
  projectosActivos: 12, clientesActivos: 9, folhaMes: { ano: 2026, mes: 11, totalLiquido: 950000, estado: 'calculado' },
  recebidoMes: 3400000, despesasMes: 680000, facturadoMes: 4250000, dividendosPagosMes: 120000,
  saldoGlobalMes: 1650000, saldoAcumuladoTrimestre: 3100000, trimestreActual: 4,
  ultimasFacturas: [
    { id: 'demo-a', numero: 124, clientNome: 'Cliente de demonstração A', total: '450000', estado: 'paga', dataEmissao: '2026-11-12' },
    { id: 'demo-b', numero: 123, clientNome: 'Cliente de demonstração B', total: '280000', estado: 'definitiva', dataEmissao: '2026-11-10' },
    { id: 'demo-c', numero: 122, clientNome: 'Cliente de demonstração C', total: '650000', estado: 'paga_parcial', dataEmissao: '2026-11-08' },
  ],
};

export const demoReport: ProfitLossReport = {
  ano: 2026, mes: 11, periodoTipo: 'trimestral', trimestre: 4, periodoLabel: 'T4 2026',
  monthlyBreakdown: [
    { ano: 2026, mes: 10, label: 'Outubro', facturado: 3000000, recebido: 2400000, despesas: 500000, folha: 960000, folhaLiquida: 900000, dividendosPagos: 100000, cashflow: 1900000, saldoGlobal: 900000, saldoAcumulado: 900000 },
    { ano: 2026, mes: 11, label: 'Novembro', facturado: 4250000, recebido: 3400000, despesas: 680000, folha: 1010000, folhaLiquida: 950000, dividendosPagos: 120000, cashflow: 2720000, saldoGlobal: 1650000, saldoAcumulado: 2550000 },
    { ano: 2026, mes: 12, label: 'Dezembro', facturado: 2100000, recebido: 1700000, despesas: 350000, folha: 850000, folhaLiquida: 800000, dividendosPagos: 0, cashflow: 1350000, saldoGlobal: 550000, saldoAcumulado: 3100000 },
  ],
  narrativa: { resumo: ['Exemplo de consolidação trimestral com dados inteiramente fictícios.', 'O saldo global inclui receitas recebidas, despesas, folha líquida e dividendos pagos.'], recomendacoes: ['Acompanhar os recebimentos pendentes e as despesas do período.'] },
  indicadores: { taxaCobranca: 80.21, margemLiquidaPercentagem: 53.48, despesaSobreFacturado: 16.36 },
  receitas: { facturado: 9350000, recebido: 7500000, emAberto: 1850000, vencido: 320000, facturasCount: 24, pagamentosCount: 18, porEstado: { paga: 15, definitiva: 7, paga_parcial: 2 },
    topClientes: [{ id: 'demo-a', nome: 'Cliente de demonstração A', valor: 3000000, count: 8 }, { id: 'demo-b', nome: 'Cliente de demonstração B', valor: 2100000, count: 6 }],
    topProjectos: [{ id: 'demo-p', nome: 'Projecto de demonstração', valor: 1800000, count: 5 }] },
  despesas: { total: 1530000, count: 32, porCategoria: { operacional: 710000, transporte: 420000, outros: 400000 } },
  salarios: { totalFolha: 2820000, totalLiquido: 2650000, totalBruto: 2820000, estado: 'Consolidado trimestral' },
  dividendos: { totalDistribuido: 220000, pagoNoMes: 220000 },
  resultado: { margemBruta: 7820000, margemLiquida: 5000000, cashflow: 5970000, saldoGlobal: 3100000 },
};

export const demoMonthlyReport: ProfitLossReport = {
  ...demoReport, periodoTipo: 'mensal', monthlyBreakdown: undefined, periodoLabel: 'Novembro 2026',
  receitas: { ...demoReport.receitas, facturado: 4250000, recebido: 3400000, emAberto: 850000, facturasCount: 10, pagamentosCount: 8,
    topClientes: [{ id: 'demo-a', nome: 'Cliente de demonstração A', valor: 1800000, count: 4 }], topProjectos: [] },
  despesas: { total: 680000, count: 12, porCategoria: { operacional: 360000, transporte: 220000, outros: 100000 } },
  salarios: { totalFolha: 1010000, totalLiquido: 950000, totalBruto: 1010000, estado: 'calculado' },
  dividendos: { totalDistribuido: 120000, pagoNoMes: 120000 },
  resultado: { margemBruta: 3570000, margemLiquida: 2560000, cashflow: 2720000, saldoGlobal: 1650000 },
  narrativa: { resumo: ['Exemplo mensal com dados inteiramente fictícios.'], recomendacoes: ['Acompanhar os recebimentos pendentes.'] },
  indicadores: { taxaCobranca: 80, margemLiquidaPercentagem: 60.24, despesaSobreFacturado: 16 },
};
