export interface ExpenseFilters {
  mes?: string;
  categoria?: string;
  estado?: string;
}

export const EXPENSE_CATEGORY_LABEL: Record<string, string> = {
  aluguer: "Aluguer",
  servicos_publicos: "Serviços (Água/Luz/Internet)",
  material_escritorio: "Material de escritório",
  deslocacoes: "Deslocações",
  marketing: "Marketing",
  formacao: "Formação",
  software_licencas: "Software / Licenças",
  manutencao: "Manutenção",
  impostos_taxas: "Impostos / Taxas",
  impressao: "Impressão",
  fundo_maneio: "Fundo de maneio",
  comunicacao: "Comunicação",
  outros: "Outros",
};

export const EXPENSE_STATE_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  aprovada: "Aprovada",
  paga: "Paga",
  anulada: "Anulada",
};

export const EXPENSE_STATE_COLOR: Record<string, string> = {
  rascunho: "bg-muted text-muted-foreground",
  aprovada: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paga: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  anulada: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};
