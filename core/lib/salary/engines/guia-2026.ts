import type {
  Guia2026PolicyConfig,
  ProjectInput,
  StaffInput,
  SalaryOverride,
  ProjectPaymentRecord,
  SalaryLineResult,
  SalaryCalculationResult,
} from "../types";

export function calculateGuia2026(
  policy: Guia2026PolicyConfig,
  projects: ProjectInput[],
  staff: StaffInput[],
  overrides: SalaryOverride[] = []
): SalaryCalculationResult {
  const cfg = policy.percentagens;

  const projectPayments: ProjectPaymentRecord[] = [];
  const userComponents = new Map<string, ProjectPaymentRecord[]>(
    staff.map((s) => [s.id, []])
  );

  let totalReserva = 0;
  let totalFundo = 0;
  let totalCustos = 0;
  let totalMargem = 0;

  for (const project of projects) {
    const net = project.valorLiquido;
    const numAux = project.assistants.length;

    const pfPct =
      project.pfPercentagemOverride ??
      (numAux >= 2 ? cfg.pf_2aux : cfg.pf_1aux);
    const auxPctEach = numAux >= 2 ? cfg.aux_2aux : cfg.aux_1aux;

    if (project.pontoFocalId) {
      const record: ProjectPaymentRecord = {
        projectId: project.id,
        userId: project.pontoFocalId,
        papel: "pf",
        percentagemAplicada: pfPct,
        valorLiquidoProjecto: net,
        valorRecebido: Math.round(net * pfPct),
      };
      projectPayments.push(record);
      userComponents.get(project.pontoFocalId)?.push(record);
    }

    for (const aux of project.assistants) {
      const pct = aux.percentagemOverride ?? auxPctEach;
      const record: ProjectPaymentRecord = {
        projectId: project.id,
        userId: aux.userId,
        papel: "aux",
        percentagemAplicada: pct,
        valorLiquidoProjecto: net,
        valorRecebido: Math.round(net * pct),
      };
      projectPayments.push(record);
      userComponents.get(aux.userId)?.push(record);
    }

    if (project.coordId) {
      const record: ProjectPaymentRecord = {
        projectId: project.id,
        userId: project.coordId,
        papel: "coord",
        percentagemAplicada: cfg.coord,
        valorLiquidoProjecto: net,
        valorRecebido: Math.round(net * cfg.coord),
      };
      projectPayments.push(record);
      userComponents.get(project.coordId)?.push(record);
    }

    totalReserva += Math.round(net * cfg.reserva);
    totalFundo += Math.round(net * cfg.fundo);
    totalCustos += Math.round(net * cfg.custos);
    totalMargem += Math.round(net * cfg.margem);
  }

  const lines: SalaryLineResult[] = staff.map((member) => {
    const components = userComponents.get(member.id) ?? [];
    const override = overrides.find((o) => o.userId === member.id);

    const componentSum = components.reduce(
      (sum, c) => sum + c.valorRecebido,
      0
    );
    const outrosBeneficios = override?.outrosBeneficios ?? 0;
    const descontos = override?.descontos ?? 0;

    const totalBruto =
      member.salarioBase + componentSum + outrosBeneficios - descontos;

    return {
      userId: member.id,
      salarioBase: member.salarioBase,
      componenteDinamica: components,
      subsidios: {},
      outrosBeneficios,
      descontos,
      totalBruto,
      totalLiquido: totalBruto,
    };
  });

  const totalBruto = lines.reduce((sum, l) => sum + l.totalBruto, 0);

  return {
    lines,
    projectPayments,
    summary: {
      totalBruto,
      totalLiquido: totalBruto,
      totalFolha: totalBruto,
      reservaEstrategica: totalReserva,
      fundoInvestimento: totalFundo,
      custos: totalCustos,
      margemEmpresa: totalMargem,
    },
  };
}
