export type PolicyType = "actual_2024" | "guia_2026";

// Policy configs persisted in salary_policies.configuracao_json.

export interface Actual2024PolicyConfig {
  tipo: "actual_2024";
  percentagens: {
    pf_0aux: number;
    pf_1aux: number;
    pf_2aux: number;
    aux_1aux: number;
    aux_2aux: number;
    dg: number;
    resto: number;
  };
  subsidio: {
    percentagem: number;
    numPessoas: number;
  };
}

export interface Guia2026PolicyConfig {
  tipo: "guia_2026";
  percentagens: {
    reserva: number;
    fundo: number;
    pf_1aux: number;
    pf_2aux: number;
    aux_1aux: number;
    aux_2aux: number;
    coord: number;
    custos: number;
    margem: number;
  };
}

export type PolicyConfig = Actual2024PolicyConfig | Guia2026PolicyConfig;

// Legacy input/output types kept for guia_2026 and for transitional callers.

export interface StaffInput {
  id: string;
  nomeCurto: string;
  role: "ca" | "dg" | "coord" | "staff";
  salarioBase: number;
}

export interface AssistantInput {
  userId: string;
  percentagemOverride?: number | null;
}

export interface ProjectInput {
  id: string;
  titulo: string;
  valorLiquido: number;
  pontoFocalId: string | null;
  pfPercentagemOverride?: number | null;
  coordId?: string | null;
  assistants: AssistantInput[];
}

export interface SalaryOverride {
  userId: string;
  outrosBeneficios?: number;
  descontos?: number;
  overrideMotivo?: string;
}

export interface ProjectPaymentRecord {
  projectId: string;
  userId: string;
  papel: "pf" | "aux" | "dg" | "coord";
  percentagemAplicada: number;
  valorLiquidoProjecto: number;
  valorRecebido: number;
}

export interface SalaryLineResult {
  userId: string;
  salarioBase: number;
  componenteDinamica: ProjectPaymentRecord[];
  subsidios: Record<string, number>;
  outrosBeneficios: number;
  descontos: number;
  totalBruto: number;
  totalLiquido: number;
}

export interface SalaryCalculationSummary {
  totalBruto: number;
  totalLiquido: number;
  totalFolha: number;
  entradas_brutas_abiptom?: number;
  saldo?: number;
  subsidioTotal?: number;
  subsidioPerPerson?: number;
  reservaEstrategica?: number;
  fundoInvestimento?: number;
  custos?: number;
  margemEmpresa?: number;
}

export interface SalaryCalculationResult {
  lines: SalaryLineResult[];
  projectPayments: ProjectPaymentRecord[];
  summary: SalaryCalculationSummary;
}

// actual_2024 v2 contract.

export interface Actual2024PolicyDefaults {
  percentagem_pf: number;
  percentagem_aux_total: number;
  percentagem_rubrica_gestao: number;
  percentagem_subsidio: number;
  percentagem_pf_0aux?: number;
  percentagem_pf_1aux?: number;
  percentagem_pf_2aux?: number;
  percentagem_aux_1aux?: number;
  percentagem_aux_2aux?: number;
}

export interface ProjectWithAssignmentsInput {
  id: string;
  titulo: string;
  valorLiquido: number;
  pontoFocalId: string | null;
  assistants: AssistantInput[];
  percentagemPf: number | null;
  percentagemAuxTotal: number | null;
  percentagemRubricaGestao: number | null;
}

export interface SalaryPeriodParticipantInput {
  userId: string;
  isElegivelSubsidio: boolean;
  recebeRubricaGestao: boolean;
  salarioBaseOverride: number | null;
}

export interface UserForSalary {
  id: string;
  nomeCurto: string;
  salarioBaseMensal: number;
  percentagemDescontoFolha: number;
  role: "ca" | "dg" | "coord" | "staff";
}

export interface ExpenseForSalary {
  id: string;
  valorXof: number;
  moeda: "XOF" | "EUR" | "USD";
  projectId: string | null;
  beneficiarioUserId: string | null;
}

export interface CalculateActual2024Input {
  period: { year: number; month: number };
  projects: ProjectWithAssignmentsInput[];
  participants: SalaryPeriodParticipantInput[];
  expenses: ExpenseForSalary[];
  users: UserForSalary[];
  policyDefaults: Actual2024PolicyDefaults;
}

export interface Actual2024ProjectBreakdown {
  projectId: string;
  titulo: string;
  valorBaseSnapshot: number;
  despesasProjecto: number;
  valorLiquido: number;
  pagamentoPf: number;
  pagamentoAuxTotal: number;
  pagamentoGestao: number;
  restoAbiptom: number;
  percentagemPfAplicada: number;
  percentagemAuxTotalAplicada: number;
  percentagemRubricaGestaoAplicada: number;
}

export interface SalaryLineCalculated {
  userId: string;
  salarioBase: number;
  componenteDinamica: ProjectPaymentRecord[];
  subsidios: {
    dinamico: number;
    rubrica_gestao: number;
  };
  outrosBeneficios: number;
  pagamentosProjectos: number;
  pagamentoGestaoPessoa: number;
  subsidioDinamico: number;
  descontoPercentagem: number;
  descontoValor: number;
  totalBrutoCalculado: number;
  totalLiquidoCalculado: number;
}

export interface Actual2024Aggregates {
  totalRestoAbiptom: number;
  totalPagamentoGestao: number;
  totalDespesasOperacionais: number;
  saldoBaseSubsidios: number;
  boloSubsidios: number;
  subsidioPorPessoa: number;
  numeroElegiveis: number;
  totalFolhaBruto: number;
  totalFolhaLiquido: number;
}

export interface CalculateActual2024Output {
  projectBreakdowns: Actual2024ProjectBreakdown[];
  projectPayments: ProjectPaymentRecord[];
  salaryLines: SalaryLineCalculated[];
  aggregates: Actual2024Aggregates;
  warnings: string[];
}

export class CalculationIntegrityError extends Error {
  public readonly details: {
    expected: number;
    actual: number;
    diff: number;
    tolerance: number;
  };

  constructor(details: {
    expected: number;
    actual: number;
    diff: number;
    tolerance: number;
  }) {
    super(
      `Integridade do calculo: esperado ${details.expected}, obtido ${details.actual}, diferenca ${details.diff} (tolerancia ${details.tolerance})`
    );
    this.name = "CalculationIntegrityError";
    this.details = details;
  }
}

export class AssistantSplitError extends Error {
  constructor(projectId: string, actualSum: number) {
    super(
      `Projecto ${projectId}: soma das percentagens dos auxiliares e ${actualSum}, deve ser 1.0`
    );
    this.name = "AssistantSplitError";
  }
}

export class MultipleRubricaGestaoBeneficiariosError extends Error {
  constructor(count: number) {
    super(
      `Periodo tem ${count} beneficiarios marcados para a rubrica de gestao; apenas e permitido zero ou um`
    );
    this.name = "MultipleRubricaGestaoBeneficiariosError";
  }
}
