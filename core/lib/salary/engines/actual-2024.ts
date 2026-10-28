import type {
  Actual2024Aggregates,
  Actual2024PolicyConfig,
  AssistantInput,
  CalculateActual2024Input,
  CalculateActual2024Output,
  ProjectInput,
  ProjectPaymentRecord,
  SalaryCalculationResult,
  SalaryLineCalculated,
  SalaryLineResult,
  SalaryOverride,
  SalaryPeriodParticipantInput,
  StaffInput,
  UserForSalary,
} from "../types";
import {
  AssistantSplitError,
  CalculationIntegrityError,
  MultipleRubricaGestaoBeneficiariosError,
} from "../types";

const INTEGRITY_TOLERANCE_XOF = 1;

type LegacyActual2024Arguments = [
  policy: Actual2024PolicyConfig,
  projects: ProjectInput[],
  staff: StaffInput[],
  operationalExpenses: number,
  overrides?: SalaryOverride[],
];

export function calculateActual2024(
  input: CalculateActual2024Input,
): CalculateActual2024Output;
export function calculateActual2024(
  policy: Actual2024PolicyConfig,
  projects: ProjectInput[],
  staff: StaffInput[],
  operationalExpenses: number,
  overrides?: SalaryOverride[],
): SalaryCalculationResult;
export function calculateActual2024(
  first: CalculateActual2024Input | Actual2024PolicyConfig,
  ...rest: unknown[]
): CalculateActual2024Output | SalaryCalculationResult {
  if (isCalculateActual2024Input(first)) {
    return calculateActual2024V2(first);
  }

  return calculateActual2024Legacy(
    first,
    ...(rest as LegacyActual2024Arguments extends [unknown, ...infer T]
      ? T
      : never),
  );
}

function isCalculateActual2024Input(
  value: CalculateActual2024Input | Actual2024PolicyConfig,
): value is CalculateActual2024Input {
  return (
    typeof value === "object" &&
    value !== null &&
    "policyDefaults" in value &&
    "participants" in value &&
    Array.isArray(value.projects)
  );
}

function calculateActual2024V2(
  input: CalculateActual2024Input,
): CalculateActual2024Output {
  const { projects, participants, expenses, users, policyDefaults } = input;
  const warnings: string[] = [];

  const beneficiariosGestao = participants.filter(
    (participant) => participant.recebeRubricaGestao,
  );
  if (beneficiariosGestao.length > 1) {
    throw new MultipleRubricaGestaoBeneficiariosError(
      beneficiariosGestao.length,
    );
  }

  const beneficiarioGestaoUserId = beneficiariosGestao[0]?.userId ?? null;
  const usersById = new Map(users.map((user) => [user.id, user]));
  const directProjectExpenses = new Map<string, number>();
  const operationalExpenses: typeof expenses = [];

  for (const expense of expenses) {
    if (expense.moeda !== "XOF") {
      warnings.push(
        `Despesa ${expense.id} em moeda ${expense.moeda} foi ignorada no calculo do saldo.`,
      );
      continue;
    }

    if (expense.projectId) {
      directProjectExpenses.set(
        expense.projectId,
        (directProjectExpenses.get(expense.projectId) ?? 0) + expense.valorXof,
      );
      continue;
    }

    operationalExpenses.push(expense);
  }

  const projectBreakdowns = [];
  const projectPayments: ProjectPaymentRecord[] = [];
  const pagamentosProjectosPorUser = new Map<string, number>();

  for (const project of projects) {
    const numAux = project.assistants.length;
    const percentagemPf =
      project.percentagemPf ?? resolvePolicyPfPercent(policyDefaults, numAux);
    const percentagemAuxTotal =
      project.percentagemAuxTotal ??
      resolvePolicyAuxTotalPercent(policyDefaults, numAux);
    const percentagemRubricaGestao =
      project.percentagemRubricaGestao ??
      policyDefaults.percentagem_rubrica_gestao;
    const despesasProjecto = directProjectExpenses.get(project.id) ?? 0;
    const valorBaseSnapshot = project.valorLiquido;
    const valorLiquido = Math.max(valorBaseSnapshot - despesasProjecto, 0);

    if (despesasProjecto > valorBaseSnapshot) {
      warnings.push(
        `Projecto ${project.titulo}: despesas ligadas ao projecto excedem a base do período e o cálculo foi truncado a zero.`,
      );
    }

    const pagamentoPf = project.pontoFocalId
      ? Math.round(valorLiquido * percentagemPf)
      : 0;
    const pagamentoAuxTotal = project.assistants.length > 0
      ? Math.round(valorLiquido * percentagemAuxTotal)
      : 0;
    const pagamentoGestao = Math.round(
      valorLiquido * percentagemRubricaGestao,
    );
    const restoAbiptom =
      valorLiquido - pagamentoPf - pagamentoAuxTotal - pagamentoGestao;

    if (project.pontoFocalId && pagamentoPf > 0) {
      const pfRecord: ProjectPaymentRecord = {
        projectId: project.id,
        userId: project.pontoFocalId,
        papel: "pf",
        percentagemAplicada: percentagemPf,
        valorLiquidoProjecto: valorLiquido,
        valorRecebido: pagamentoPf,
      };
      projectPayments.push(pfRecord);
      pagamentosProjectosPorUser.set(
        project.pontoFocalId,
        (pagamentosProjectosPorUser.get(project.pontoFocalId) ?? 0) +
          pagamentoPf,
      );
    }

    if (project.assistants.length > 0 && pagamentoAuxTotal > 0) {
      const auxShares = resolveAssistantShares(project.id, project.assistants);
      let distribuido = 0;

      project.assistants.forEach((assistant, index) => {
        const isLast = index === project.assistants.length - 1;
        const valorRecebido = isLast
          ? pagamentoAuxTotal - distribuido
          : Math.round(pagamentoAuxTotal * auxShares[index]);

        distribuido += valorRecebido;

        const auxRecord: ProjectPaymentRecord = {
          projectId: project.id,
          userId: assistant.userId,
          papel: "aux",
          percentagemAplicada: percentagemAuxTotal * auxShares[index],
          valorLiquidoProjecto: valorLiquido,
          valorRecebido,
        };
        projectPayments.push(auxRecord);
        pagamentosProjectosPorUser.set(
          assistant.userId,
          (pagamentosProjectosPorUser.get(assistant.userId) ?? 0) +
            valorRecebido,
        );
      });
    }

    if (beneficiarioGestaoUserId && pagamentoGestao > 0) {
      projectPayments.push({
        projectId: project.id,
        userId: beneficiarioGestaoUserId,
        papel: "dg",
        percentagemAplicada: percentagemRubricaGestao,
        valorLiquidoProjecto: valorLiquido,
        valorRecebido: pagamentoGestao,
      });
    }

    projectBreakdowns.push({
      projectId: project.id,
      titulo: project.titulo,
      valorBaseSnapshot,
      despesasProjecto,
      valorLiquido,
      pagamentoPf,
      pagamentoAuxTotal,
      pagamentoGestao,
      restoAbiptom,
      percentagemPfAplicada: percentagemPf,
      percentagemAuxTotalAplicada: percentagemAuxTotal,
      percentagemRubricaGestaoAplicada: percentagemRubricaGestao,
    });
  }

  let totalDespesasOperacionais = 0;
  const expensesXof = operationalExpenses;

  for (const expense of expensesXof) {
    totalDespesasOperacionais += expense.valorXof;
  }

  const totalRestoAbiptom = projectBreakdowns.reduce(
    (sum, breakdown) => sum + breakdown.restoAbiptom,
    0,
  );
  const totalPagamentoGestao = projectBreakdowns.reduce(
    (sum, breakdown) => sum + breakdown.pagamentoGestao,
    0,
  );
  const saldoBaseSubsidios =
    totalRestoAbiptom - totalDespesasOperacionais;
  const boloSubsidios = Math.round(
    saldoBaseSubsidios * policyDefaults.percentagem_subsidio,
  );

  const elegiveis = participants.filter(
    (participant) => participant.isElegivelSubsidio,
  );
  const numeroElegiveis = elegiveis.length;
  const subsidioPorPessoa = numeroElegiveis > 0
    ? Math.round(boloSubsidios / numeroElegiveis)
    : 0;

  const outrosBeneficiosPorUser = new Map<string, number>();
  for (const expense of expensesXof) {
    if (!expense.beneficiarioUserId) {
      continue;
    }

    outrosBeneficiosPorUser.set(
      expense.beneficiarioUserId,
      (outrosBeneficiosPorUser.get(expense.beneficiarioUserId) ?? 0) +
        expense.valorXof,
    );
  }

  const salaryLines: SalaryLineCalculated[] = participants.map((participant) => {
    const user = usersById.get(participant.userId);
    if (!user) {
      throw new Error(
        `Utilizador ${participant.userId} em participants nao foi encontrado em users`,
      );
    }

    return buildSalaryLine({
      participant,
      user,
      projectPayments,
      pagamentosProjectosPorUser,
      totalPagamentoGestao,
      subsidioPorPessoa,
      outrosBeneficios: outrosBeneficiosPorUser.get(participant.userId) ?? 0,
    });
  });

  const totalFolhaBruto = salaryLines.reduce(
    (sum, line) => sum + line.totalBrutoCalculado,
    0,
  );
  const totalFolhaLiquido = salaryLines.reduce(
    (sum, line) => sum + line.totalLiquidoCalculado,
    0,
  );

  const aggregates: Actual2024Aggregates = {
    totalRestoAbiptom,
    totalPagamentoGestao,
    totalDespesasOperacionais,
    saldoBaseSubsidios,
    boloSubsidios,
    subsidioPorPessoa,
    numeroElegiveis,
    totalFolhaBruto,
    totalFolhaLiquido,
  };

  validateActual2024Integrity({
    salaryLines,
    totalFolhaBruto,
    totalPagamentoGestao,
    subsidioPorPessoa,
    numeroElegiveis,
    pagamentosProjectosPorUser,
    beneficiarioGestaoUserId,
  });

  return {
    projectBreakdowns,
    projectPayments,
    salaryLines,
    aggregates,
    warnings,
  };
}

function resolveAssistantShares(
  projectId: string,
  assistants: AssistantInput[],
): number[] {
  const hasAnyOverride = assistants.some(
    (assistant) =>
      assistant.percentagemOverride !== null &&
      assistant.percentagemOverride !== undefined,
  );

  if (!hasAnyOverride) {
    return assistants.map(() => 1 / assistants.length);
  }

  const shares = assistants.map(
    (assistant) => assistant.percentagemOverride ?? 0,
  );
  const sum = shares.reduce((total, share) => total + share, 0);

  if (Math.abs(sum - 1) > 0.0001) {
    throw new AssistantSplitError(projectId, sum);
  }

  return shares;
}

function resolvePolicyPfPercent(
  policyDefaults: CalculateActual2024Input["policyDefaults"],
  numAux: number,
) {
  if (numAux >= 2) {
    return policyDefaults.percentagem_pf_2aux ?? policyDefaults.percentagem_pf;
  }
  if (numAux === 1) {
    return policyDefaults.percentagem_pf_1aux ?? policyDefaults.percentagem_pf;
  }
  return policyDefaults.percentagem_pf_0aux ?? policyDefaults.percentagem_pf;
}

function resolvePolicyAuxTotalPercent(
  policyDefaults: CalculateActual2024Input["policyDefaults"],
  numAux: number,
) {
  if (numAux >= 2 && policyDefaults.percentagem_aux_2aux !== undefined) {
    return policyDefaults.percentagem_aux_2aux * numAux;
  }
  if (numAux === 1) {
    return (
      policyDefaults.percentagem_aux_1aux ??
      policyDefaults.percentagem_aux_total
    );
  }
  return policyDefaults.percentagem_aux_total;
}

type BuildSalaryLineArgs = {
  participant: SalaryPeriodParticipantInput;
  user: UserForSalary;
  projectPayments: ProjectPaymentRecord[];
  pagamentosProjectosPorUser: Map<string, number>;
  totalPagamentoGestao: number;
  subsidioPorPessoa: number;
  outrosBeneficios: number;
};

function buildSalaryLine({
  participant,
  user,
  projectPayments,
  pagamentosProjectosPorUser,
  totalPagamentoGestao,
  subsidioPorPessoa,
  outrosBeneficios,
}: BuildSalaryLineArgs): SalaryLineCalculated {
  const pagamentosProjectos =
    pagamentosProjectosPorUser.get(participant.userId) ?? 0;
  const pagamentoGestaoPessoa = participant.recebeRubricaGestao
    ? totalPagamentoGestao
    : 0;
  const subsidioDinamico = participant.isElegivelSubsidio
    ? subsidioPorPessoa
    : 0;
  const salarioBase =
    participant.salarioBaseOverride !== null &&
    participant.salarioBaseOverride !== undefined
      ? participant.salarioBaseOverride
      : user.salarioBaseMensal;
  const descontoPercentagem = user.percentagemDescontoFolha;
  const descontoValor = Math.round(
    (pagamentosProjectos +
      pagamentoGestaoPessoa +
      subsidioDinamico +
      salarioBase +
      outrosBeneficios) * descontoPercentagem,
  );
  const totalBrutoCalculado =
    pagamentosProjectos +
    pagamentoGestaoPessoa +
    subsidioDinamico +
    salarioBase +
    outrosBeneficios;
  const totalLiquidoCalculado = totalBrutoCalculado - descontoValor;

  return {
    userId: participant.userId,
    salarioBase,
    componenteDinamica: projectPayments.filter(
      (record) => record.userId === participant.userId,
    ),
    subsidios: {
      dinamico: subsidioDinamico,
      rubrica_gestao: pagamentoGestaoPessoa,
    },
    outrosBeneficios,
    pagamentosProjectos,
    pagamentoGestaoPessoa,
    subsidioDinamico,
    descontoPercentagem,
    descontoValor,
    totalBrutoCalculado,
    totalLiquidoCalculado,
  };
}

type IntegrityArgs = {
  salaryLines: SalaryLineCalculated[];
  totalFolhaBruto: number;
  totalPagamentoGestao: number;
  subsidioPorPessoa: number;
  numeroElegiveis: number;
  pagamentosProjectosPorUser: Map<string, number>;
  beneficiarioGestaoUserId: string | null;
};

function validateActual2024Integrity({
  salaryLines,
  totalFolhaBruto,
  totalPagamentoGestao,
  subsidioPorPessoa,
  numeroElegiveis,
  pagamentosProjectosPorUser,
  beneficiarioGestaoUserId,
}: IntegrityArgs) {
  const somaPagamentosProjectos = Array.from(
    pagamentosProjectosPorUser.values(),
  ).reduce((sum, value) => sum + value, 0);
  const somaSalariosBase = salaryLines.reduce(
    (sum, line) => sum + line.salarioBase,
    0,
  );
  const somaOutrosBeneficios = salaryLines.reduce(
    (sum, line) => sum + line.outrosBeneficios,
    0,
  );
  const gestaoAtribuida = beneficiarioGestaoUserId ? totalPagamentoGestao : 0;
  const subsidiosAtribuidos = subsidioPorPessoa * numeroElegiveis;
  const somaBrutaEsperada =
    somaPagamentosProjectos +
    gestaoAtribuida +
    subsidiosAtribuidos +
    somaSalariosBase +
    somaOutrosBeneficios;
  const diff = Math.abs(somaBrutaEsperada - totalFolhaBruto);

  if (diff > INTEGRITY_TOLERANCE_XOF) {
    throw new CalculationIntegrityError({
      expected: somaBrutaEsperada,
      actual: totalFolhaBruto,
      diff,
      tolerance: INTEGRITY_TOLERANCE_XOF,
    });
  }
}

function calculateActual2024Legacy(
  policy: Actual2024PolicyConfig,
  projects: ProjectInput[],
  staff: StaffInput[],
  operationalExpenses: number,
  overrides: SalaryOverride[] = [],
): SalaryCalculationResult {
  const cfg = policy.percentagens;

  const projectPayments: ProjectPaymentRecord[] = [];
  const userComponents = new Map<string, ProjectPaymentRecord[]>(
    staff.map((member) => [member.id, []]),
  );

  let entradasBrutas = 0;
  const dgUser = staff.find((member) => member.role === "dg");

  for (const project of projects) {
    const numAux = project.assistants.length;
    const percentagemPf =
      project.pfPercentagemOverride ??
      (numAux >= 2 ? cfg.pf_2aux : numAux === 1 ? cfg.pf_1aux : cfg.pf_0aux);
    const percentagemAuxEach = numAux >= 2 ? cfg.aux_2aux : cfg.aux_1aux;

    if (project.pontoFocalId) {
      const pfRecord: ProjectPaymentRecord = {
        projectId: project.id,
        userId: project.pontoFocalId,
        papel: "pf",
        percentagemAplicada: percentagemPf,
        valorLiquidoProjecto: project.valorLiquido,
        valorRecebido: Math.round(project.valorLiquido * percentagemPf),
      };
      projectPayments.push(pfRecord);
      userComponents.get(project.pontoFocalId)?.push(pfRecord);
    }

    for (const assistant of project.assistants) {
      const percentagem = assistant.percentagemOverride ?? percentagemAuxEach;
      const auxRecord: ProjectPaymentRecord = {
        projectId: project.id,
        userId: assistant.userId,
        papel: "aux",
        percentagemAplicada: percentagem,
        valorLiquidoProjecto: project.valorLiquido,
        valorRecebido: Math.round(project.valorLiquido * percentagem),
      };
      projectPayments.push(auxRecord);
      userComponents.get(assistant.userId)?.push(auxRecord);
    }

    if (dgUser) {
      const dgRecord: ProjectPaymentRecord = {
        projectId: project.id,
        userId: dgUser.id,
        papel: "dg",
        percentagemAplicada: cfg.dg,
        valorLiquidoProjecto: project.valorLiquido,
        valorRecebido: Math.round(project.valorLiquido * cfg.dg),
      };
      projectPayments.push(dgRecord);
      userComponents.get(dgUser.id)?.push(dgRecord);
    }

    entradasBrutas += Math.round(project.valorLiquido * cfg.resto);
  }

  const saldo = entradasBrutas - operationalExpenses;
  const subsidioTotal = Math.round(saldo * policy.subsidio.percentagem);
  const subsidioPerPerson = Math.round(
    subsidioTotal / policy.subsidio.numPessoas,
  );

  const lines: SalaryLineResult[] = staff.map((member) => {
    const components = userComponents.get(member.id) ?? [];
    const override = overrides.find((entry) => entry.userId === member.id);
    const componentSum = components.reduce(
      (sum, component) => sum + component.valorRecebido,
      0,
    );
    const outrosBeneficios = override?.outrosBeneficios ?? 0;
    const descontos = override?.descontos ?? 0;
    const totalBruto =
      member.salarioBase +
      componentSum +
      subsidioPerPerson +
      outrosBeneficios -
      descontos;

    return {
      userId: member.id,
      salarioBase: member.salarioBase,
      componenteDinamica: components,
      subsidios: { dinamico: subsidioPerPerson },
      outrosBeneficios,
      descontos,
      totalBruto,
      totalLiquido: totalBruto,
    };
  });

  const totalBruto = lines.reduce((sum, line) => sum + line.totalBruto, 0);

  return {
    lines,
    projectPayments,
    summary: {
      totalBruto,
      totalLiquido: totalBruto,
      totalFolha: totalBruto,
      entradas_brutas_abiptom: entradasBrutas,
      saldo,
      subsidioTotal,
      subsidioPerPerson,
    },
  };
}
