import { describe, expect, it } from "vitest";
import { buildReportNarrative } from "@/core/lib/reports/insights";

describe("buildReportNarrative", () => {
  it("gera resumo e recomendacoes operacionais a partir dos indicadores", () => {
    const narrative = buildReportNarrative({
      periodoLabel: "Julho 2026",
      receitas: {
        facturado: 1000000,
        recebido: 400000,
        emAberto: 600000,
        vencido: 250000,
        facturasCount: 5,
        pagamentosCount: 2,
      },
      despesas: { total: 450000, count: 4 },
      salarios: { totalFolha: 200000, totalLiquido: 180000 },
      resultado: { margemLiquida: 350000, cashflow: -230000 },
      indicadores: {
        taxaCobranca: 40,
        margemLiquidaPercentagem: 35,
        despesaSobreFacturado: 45,
      },
    });

    expect(narrative.resumo[0]).toContain("Julho 2026");
    expect(narrative.recomendacoes).toContain(
      "Priorizar cobranca das facturas vencidas antes de assumir novas despesas.",
    );
    expect(narrative.recomendacoes).toContain(
      "Rever categorias de despesa com maior peso, porque ultrapassam 40% do valor facturado.",
    );
  });
});
