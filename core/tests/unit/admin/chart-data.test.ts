import { describe, expect, it } from 'vitest';
import { dashboardChartData, expenseChartData, reportChartData, monthlyChartData } from '@/core/lib/admin/chart-data';

describe('dados apresentados nos gráficos financeiros', () => {
  it('mantém facturado e recebido separados e conserva zero e saldo negativo', () => {
    const result = dashboardChartData({ facturadoMes: 120, recebidoMes: 80, despesasMes: 90, dividendosPagosMes: 0, folhaMes: { totalLiquido: 20 }, saldoGlobalMes: -30 });
    expect(result.map(row => row.value)).toEqual([120, 80, 90, 20, 0, -30]);
    expect(result.map(row => row.label)).toEqual(['Facturado', 'Recebido', 'Despesas', 'Folha líquida', 'Dividendos pagos', 'Saldo global']);
  });
  it('ordena categorias sem modificar a origem nem perder montantes negativos', () => {
    const categories = { a: 30, b: 50, c: -10 };
    expect(expenseChartData(categories, { a: 'Categoria A' }).map(row => [row.label, row.value])).toEqual([['b', 50], ['Categoria A', 30], ['c', -10]]);
    expect(categories).toEqual({ a: 30, b: 50, c: -10 });
  });
  it('usa os totais do relatório sem recalcular as regras de caixa', () => {
    expect(reportChartData({ receitas: { facturado: 100, recebido: 80 }, despesas: { total: 20 }, salarios: { totalLiquido: 30 }, dividendos: { pagoNoMes: 10 }, resultado: { saldoGlobal: 20 } }).map(row => row.value)).toEqual([100, 80, 20, 30, 10, 20]);
  });
  it('não inventa uma série mensal quando esta não está disponível', () => {
    expect(monthlyChartData(undefined)).toEqual([]);
    expect(monthlyChartData([])).toEqual([]);
  });
  it('conserva os meses e os saldos recebidos, sem acumular novamente', () => {
    expect(monthlyChartData([{ label: 'Outubro', recebido: 100, despesas: 120, saldoGlobal: -40 }])).toEqual([{ label: 'Outubro', recebido: 100, despesas: 120, saldo: -40 }]);
  });
});
