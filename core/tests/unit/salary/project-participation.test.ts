import { describe, expect, it } from "vitest";
import { applyPeriodProjectExclusions } from "@/core/lib/salary/project-participation";
import { calculateActual2024 } from "@/core/lib/salary/engines/actual-2024";

const project = {
  id: "projecto-teste", titulo: "Projecto de teste", valorLiquido: 150_000,
  pontoFocalId: "pf", percentagemPf: null, percentagemAuxTotal: null,
  percentagemRubricaGestao: null,
  assistants: ["aux1", "ausente", "aux2"].map(userId => ({ userId, percentagemOverride: null })),
};
const defaults = { percentagem_pf: .3, percentagem_aux_total: .15,
  percentagem_rubrica_gestao: .05, percentagem_subsidio: .22,
  percentagem_pf_2aux: .25, percentagem_aux_2aux: .1 };
const participant = (userId: string) => ({ userId, isElegivelSubsidio: true,
  recebeRubricaGestao: false, salarioBaseOverride: null });
const user = (id: string) => ({ id, nomeCurto: id, salarioBaseMensal: 0,
  percentagemDescontoFolha: 0, role: "staff" as const });

describe("exclusões de atribuições apenas no período salarial", () => {
  it("preserva atribuições e percentagens quando não existem exclusões", () => {
    expect(applyPeriodProjectExclusions(project, [])).toEqual(project);
  });

  it("retira só o auxiliar indicado sem alterar o projecto original", () => {
    const result = applyPeriodProjectExclusions(project, ["ausente"]);
    expect(result.assistants.map(a => a.userId)).toEqual(["aux1", "aux2"]);
    expect(result.pontoFocalId).toBe("pf");
    expect(project.assistants.map(a => a.userId)).toEqual(["aux1", "ausente", "aux2"]);
    expect(result.assistants[0]).toEqual(project.assistants[0]);
  });

  it("permite excluir o ponto focal apenas neste período", () => {
    const result = applyPeriodProjectExclusions(project, ["pf", "irrelevante"]);
    expect(result.pontoFocalId).toBeNull();
    expect(result.assistants).toEqual(project.assistants);
    expect(project.pontoFocalId).toBe("pf");
  });

  it("exclui também a coordenação quando o auxiliar acumula esse papel", () => {
    const withCoordinator = { ...project, coordId: "ausente" };
    const result = applyPeriodProjectExclusions(withCoordinator, ["ausente"]);
    expect(result.coordId).toBeNull();
    expect(result.assistants.map(a => a.userId)).not.toContain("ausente");
    expect(withCoordinator.coordId).toBe("ausente");
    expect(applyPeriodProjectExclusions(withCoordinator, []).coordId).toBe("ausente");
  });

  it("calcula com dois auxiliares e conserva o histórico de três auxiliares", () => {
    const input = { period: { year: 2026, month: 10 }, expenses: [],
      users: ["pf", "aux1", "ausente", "aux2"].map(user),
      participants: ["pf", "aux1", "aux2"].map(participant), policyDefaults: defaults };
    const current = calculateActual2024({ ...input,
      projects: [applyPeriodProjectExclusions(project, ["ausente"])] });
    expect(current.salaryLines.map(l => l.userId)).not.toContain("ausente");
    expect(current.projectPayments.map(p => p.userId)).not.toContain("ausente");
    expect(current.projectBreakdowns[0]).toMatchObject({ pagamentoPf: 37_500,
      pagamentoAuxTotal: 30_000, pagamentoGestao: 7_500, restoAbiptom: 75_000 });
    expect(current.salaryLines.find(l => l.userId === "aux1")?.pagamentosProjectos).toBe(15_000);
    expect(current.salaryLines.find(l => l.userId === "aux2")?.pagamentosProjectos).toBe(15_000);
    const historical = calculateActual2024({ ...input, period: { year: 2026, month: 9 },
      participants: [...input.participants, participant("ausente")], projects: [project] });
    expect(historical.projectBreakdowns[0].pagamentoAuxTotal).toBe(45_000);
    expect(historical.salaryLines.find(l => l.userId === "ausente")?.pagamentosProjectos).toBe(15_000);
  });

  it("continua a bloquear outro beneficiário ausente que não foi explicitamente excluído", () => {
    expect(() => calculateActual2024({ period: { year: 2026, month: 10 },
      projects: [applyPeriodProjectExclusions(project, ["aux1"])],
      participants: [participant("pf"), participant("aux2")],
      users: ["pf", "aux1", "aux2", "ausente"].map(user), expenses: [],
      policyDefaults: defaults })).toThrow(/ausente/);
  });
});
