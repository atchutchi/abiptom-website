import { describe, expect, it } from 'vitest';
import { demoStats, demoReport, demoMonthlyReport } from '@/core/components/review/admin-fixtures';

describe('coerência financeira das amostras fictícias', () => {
  for (const [label, report] of [['mensal', demoMonthlyReport], ['trimestral', demoReport]] as const) {
    it(`concilia os indicadores com os totais no exemplo ${label}`, () => {
      expect(report.indicadores.taxaCobranca).toBeCloseTo(report.receitas.recebido / report.receitas.facturado * 100, 1);
      expect(report.indicadores.margemLiquidaPercentagem).toBeCloseTo(report.resultado.margemLiquida / report.receitas.facturado * 100, 1);
      expect(report.indicadores.despesaSobreFacturado).toBeCloseTo(report.despesas.total / report.receitas.facturado * 100, 1);
      expect(Object.values(report.despesas.porCategoria).reduce((sum, amount) => sum + amount, 0)).toBe(report.despesas.total);
      expect(report.receitas.recebido - report.despesas.total - report.salarios.totalLiquido - report.dividendos.pagoNoMes).toBe(report.resultado.saldoGlobal);
    });
  }
  it('concilia o painel, o mês e a soma dos meses do trimestre', () => {
    expect(demoStats.saldoGlobalMes).toBe(demoMonthlyReport.resultado.saldoGlobal);
    expect(demoReport.monthlyBreakdown?.reduce((sum, month) => sum + month.saldoGlobal, 0)).toBe(demoReport.resultado.saldoGlobal);
  });
});
