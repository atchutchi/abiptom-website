export type ReportNarrativeInput = {
  periodoLabel: string;
  receitas: {
    facturado: number;
    recebido: number;
    emAberto: number;
    vencido: number;
    facturasCount: number;
    pagamentosCount: number;
  };
  despesas: {
    total: number;
    count: number;
  };
  salarios: {
    totalFolha: number;
    totalLiquido: number;
  };
  resultado: {
    margemLiquida: number;
    cashflow: number;
  };
  indicadores: {
    taxaCobranca: number;
    margemLiquidaPercentagem: number;
    despesaSobreFacturado: number;
  };
};

export type ReportNarrative = {
  resumo: string[];
  recomendacoes: string[];
};

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function buildReportNarrative(input: ReportNarrativeInput): ReportNarrative {
  const resumo = [
    `${input.periodoLabel}: foram facturados ${input.receitas.facturasCount} documento(s) e recebidos ${input.receitas.pagamentosCount} pagamento(s), com taxa de cobranca de ${formatPercent(input.indicadores.taxaCobranca)}.`,
    `A margem liquida ficou em ${formatPercent(input.indicadores.margemLiquidaPercentagem)} do facturado depois de despesas e folha bruta.`,
    `O saldo de caixa do periodo ficou ${input.resultado.cashflow >= 0 ? "positivo" : "negativo"}, considerando recebimentos, despesas, folha liquida e dividendos pagos.`,
  ];

  const recomendacoes: string[] = [];

  if (input.receitas.vencido > 0) {
    recomendacoes.push(
      "Priorizar cobranca das facturas vencidas antes de assumir novas despesas.",
    );
  }

  if (input.indicadores.despesaSobreFacturado > 40) {
    recomendacoes.push(
      "Rever categorias de despesa com maior peso, porque ultrapassam 40% do valor facturado.",
    );
  }

  if (input.indicadores.taxaCobranca < 60) {
    recomendacoes.push(
      "Acompanhar clientes com valores em aberto para melhorar a entrada de caixa.",
    );
  }

  if (input.resultado.cashflow < 0) {
    recomendacoes.push(
      "Evitar compromissos de caixa nao essenciais ate o saldo operacional voltar a positivo.",
    );
  }

  if (recomendacoes.length === 0) {
    recomendacoes.push(
      "Manter o controlo de cobranca e acompanhar despesas recorrentes para preservar a margem.",
    );
  }

  return { resumo, recomendacoes };
}
