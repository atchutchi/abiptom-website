import { describe, expect, it } from "vitest";
import { calculateActual2024 } from "@/core/lib/salary/engines/actual-2024";

const POLICY_DEFAULTS = {
  percentagem_pf: 0.3,
  percentagem_aux_total: 0.15,
  percentagem_rubrica_gestao: 0.05,
  percentagem_subsidio: 0.22,
  percentagem_pf_0aux: 0.3,
  percentagem_pf_1aux: 0.3,
  percentagem_pf_2aux: 0.25,
  percentagem_aux_1aux: 0.15,
  percentagem_aux_2aux: 0.1,
};

type TestUser = {
  id: string;
  nomeCurto: string;
  salarioBaseMensal: number;
  percentagemDescontoFolha: number;
  role: "ca" | "dg" | "coord" | "staff";
};

type SalaryLineCalculated = {
  userId: string;
  salarioBase: number;
  pagamentosProjectos: number;
  pagamentoGestaoPessoa: number;
  subsidioDinamico: number;
  subsidios: {
    dinamico: number;
    rubrica_gestao: number;
  };
  outrosBeneficios: number;
  descontoPercentagem: number;
  descontoValor: number;
  totalBrutoCalculado: number;
  totalLiquidoCalculado: number;
};

type Actual2024Result = {
  projectBreakdowns: Array<{
    projectId: string;
    titulo: string;
    valorBaseSnapshot?: number;
    despesasProjecto?: number;
    valorLiquido: number;
    pagamentoPf: number;
    pagamentoAuxTotal: number;
    pagamentoGestao: number;
    restoAbiptom: number;
    percentagemPfAplicada: number;
    percentagemAuxTotalAplicada: number;
    percentagemRubricaGestaoAplicada: number;
  }>;
  projectPayments: Array<{
    projectId: string;
    userId: string;
    papel: "pf" | "aux" | "dg" | "coord";
    percentagemAplicada: number;
    valorLiquidoProjecto: number;
    valorRecebido: number;
  }>;
  salaryLines: SalaryLineCalculated[];
  aggregates: {
    totalRestoAbiptom: number;
    totalPagamentoGestao: number;
    totalDespesasOperacionais: number;
    saldoBaseSubsidios: number;
    boloSubsidios: number;
    subsidioPorPessoa: number;
    numeroElegiveis: number;
    totalFolhaBruto: number;
    totalFolhaLiquido: number;
  };
  warnings: string[];
};

function calculate(input: unknown) {
  return (calculateActual2024 as unknown as (payload: unknown) => Actual2024Result)(input);
}

function makeUser(
  id: string,
  salary: number,
  options: Partial<TestUser> = {}
): TestUser {
  return {
    id,
    nomeCurto: id,
    salarioBaseMensal: salary,
    percentagemDescontoFolha: 0,
    role: "staff",
    ...options,
  };
}

function makeParticipant(
  userId: string,
  options: {
    isElegivelSubsidio?: boolean;
    recebeRubricaGestao?: boolean;
    salarioBaseOverride?: number | null;
  } = {}
) {
  return {
    userId,
    isElegivelSubsidio: options.isElegivelSubsidio ?? true,
    recebeRubricaGestao: options.recebeRubricaGestao ?? false,
    salarioBaseOverride:
      options.salarioBaseOverride === undefined
        ? null
        : options.salarioBaseOverride,
  };
}

function makeProject(
  id: string,
  valorLiquido: number,
  options: {
    pontoFocalId?: string | null;
    assistants?: Array<{ userId: string; percentagemOverride?: number | null }>;
    percentagemPf?: number | null;
    percentagemAuxTotal?: number | null;
    percentagemRubricaGestao?: number | null;
  } = {}
) {
  return {
    id,
    titulo: id,
    valorLiquido,
    pontoFocalId:
      options.pontoFocalId === undefined ? null : options.pontoFocalId,
    assistants: options.assistants ?? [],
    percentagemPf:
      options.percentagemPf === undefined ? null : options.percentagemPf,
    percentagemAuxTotal:
      options.percentagemAuxTotal === undefined
        ? null
        : options.percentagemAuxTotal,
    percentagemRubricaGestao:
      options.percentagemRubricaGestao === undefined
        ? null
        : options.percentagemRubricaGestao,
  };
}

function makeExpense(
  id: string,
  valorXof: number,
  options: {
    moeda?: "XOF" | "EUR" | "USD";
    projectId?: string | null;
    beneficiarioUserId?: string | null;
  } = {}
) {
  return {
    id,
    valorXof,
    moeda: options.moeda ?? "XOF",
    projectId: options.projectId === undefined ? null : options.projectId,
    beneficiarioUserId:
      options.beneficiarioUserId === undefined
        ? null
        : options.beneficiarioUserId,
  };
}

function lineByUser(result: Actual2024Result, userId: string) {
  const line = result.salaryLines.find((entry) => entry.userId === userId);
  expect(line, `Linha salarial não encontrada para ${userId}`).toBeTruthy();
  return line!;
}

function typicalFixture() {
  const users = [
    makeUser("arianna", 100_000),
    makeUser("alisson", 80_000, { percentagemDescontoFolha: 0.3 }),
    makeUser("amelissa", 70_000),
    makeUser("emerson", 150_000, { role: "dg" }),
    makeUser("sweline", 90_000, { percentagemDescontoFolha: 0.6, role: "coord" }),
    makeUser("valber", 60_000),
    makeUser("jose", 50_000),
  ];

  const participants = [
    makeParticipant("arianna"),
    makeParticipant("alisson"),
    makeParticipant("amelissa"),
    makeParticipant("emerson", { recebeRubricaGestao: true }),
    makeParticipant("sweline"),
    makeParticipant("valber"),
    makeParticipant("jose", { isElegivelSubsidio: false }),
  ];

  const projects = [
    makeProject("p1", 100_000, {
      pontoFocalId: "arianna",
      assistants: [{ userId: "alisson" }],
    }),
    makeProject("p2", 200_000, {
      pontoFocalId: "arianna",
      assistants: [{ userId: "alisson" }, { userId: "amelissa" }],
    }),
    makeProject("p3", 150_000, {
      assistants: [{ userId: "amelissa" }],
    }),
    makeProject("p4", 120_000, {
      pontoFocalId: "sweline",
    }),
    makeProject("p5", 80_000),
  ];

  const expenses = [
    makeExpense("e1", 24_000),
    makeExpense("e2", 16_000),
    makeExpense("e3", 20_000, { beneficiarioUserId: "valber" }),
  ];

  return {
    period: { year: 2026, month: 3 },
    projects,
    participants,
    expenses,
    users,
    policyDefaults: POLICY_DEFAULTS,
  };
}

describe("actual_2024 - contrato novo do motor", () => {
  it("1. fluxo completo típico: totais, descontos, subsídios e outros benefícios batem certo", () => {
    const result = calculate(typicalFixture());

    expect(result.warnings).toEqual([]);
    expect(result.salaryLines).toHaveLength(7);
    expect(result.aggregates).toMatchObject({
      totalRestoAbiptom: 424_000,
      totalPagamentoGestao: 32_500,
      totalDespesasOperacionais: 60_000,
      saldoBaseSubsidios: 364_000,
      boloSubsidios: 80_080,
      subsidioPorPessoa: 13_347,
      numeroElegiveis: 6,
      totalFolhaBruto: 926_082,
      totalFolhaLiquido: 803_970,
    });

    expect(lineByUser(result, "alisson")).toMatchObject({
      pagamentosProjectos: 35_000,
      subsidioDinamico: 13_347,
      descontoPercentagem: 0.3,
      descontoValor: 38_504,
      totalBrutoCalculado: 128_347,
      totalLiquidoCalculado: 89_843,
    });

    expect(lineByUser(result, "sweline")).toMatchObject({
      pagamentosProjectos: 36_000,
      descontoPercentagem: 0.6,
      descontoValor: 83_608,
      totalBrutoCalculado: 139_347,
      totalLiquidoCalculado: 55_739,
    });

    expect(lineByUser(result, "valber")).toMatchObject({
      outrosBeneficios: 20_000,
      totalBrutoCalculado: 93_347,
    });
  });

  it("2. projecto sem auxiliar deixa a parcela de auxiliares no resto_abiptom", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [makeProject("p1", 100_000, { pontoFocalId: "arianna" })],
      participants: [
        makeParticipant("arianna"),
        makeParticipant("emerson", { recebeRubricaGestao: true }),
      ],
      expenses: [],
      users: [makeUser("arianna", 0), makeUser("emerson", 0, { role: "dg" })],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(result.projectBreakdowns[0]).toMatchObject({
      pagamentoPf: 30_000,
      pagamentoAuxTotal: 0,
      pagamentoGestao: 5_000,
      restoAbiptom: 65_000,
    });
  });

  it("3. projecto sem PF deixa a parcela do PF no resto_abiptom", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [
        makeProject("p1", 100_000, {
          assistants: [{ userId: "alisson" }],
        }),
      ],
      participants: [
        makeParticipant("alisson"),
        makeParticipant("emerson", { recebeRubricaGestao: true }),
      ],
      expenses: [],
      users: [makeUser("alisson", 0), makeUser("emerson", 0, { role: "dg" })],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(result.projectBreakdowns[0]).toMatchObject({
      pagamentoPf: 0,
      pagamentoAuxTotal: 15_000,
      pagamentoGestao: 5_000,
      restoAbiptom: 80_000,
    });
  });

  it("4. projecto sem PF nem auxiliar deixa tudo excepto gestão no resto_abiptom", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [makeProject("p1", 100_000)],
      participants: [makeParticipant("emerson", { recebeRubricaGestao: true })],
      expenses: [],
      users: [makeUser("emerson", 0, { role: "dg" })],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(result.projectBreakdowns[0]).toMatchObject({
      pagamentoPf: 0,
      pagamentoAuxTotal: 0,
      pagamentoGestao: 5_000,
      restoAbiptom: 95_000,
    });
  });

  it("5. dois auxiliares com override 50/50 recebem metade do pagamento_aux_total", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [
        makeProject("p1", 100_000, {
          percentagemAuxTotal: 0.2,
          assistants: [
            { userId: "alisson", percentagemOverride: 0.5 },
            { userId: "amelissa", percentagemOverride: 0.5 },
          ],
        }),
      ],
      participants: [makeParticipant("alisson"), makeParticipant("amelissa")],
      expenses: [],
      users: [makeUser("alisson", 0), makeUser("amelissa", 0)],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(lineByUser(result, "alisson").pagamentosProjectos).toBe(10_000);
    expect(lineByUser(result, "amelissa").pagamentosProjectos).toBe(10_000);
  });

  it("6. dois auxiliares com override 70/30 distribuem correctamente", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [
        makeProject("p1", 100_000, {
          percentagemAuxTotal: 0.2,
          assistants: [
            { userId: "alisson", percentagemOverride: 0.7 },
            { userId: "amelissa", percentagemOverride: 0.3 },
          ],
        }),
      ],
      participants: [makeParticipant("alisson"), makeParticipant("amelissa")],
      expenses: [],
      users: [makeUser("alisson", 0), makeUser("amelissa", 0)],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(lineByUser(result, "alisson").pagamentosProjectos).toBe(14_000);
    expect(lineByUser(result, "amelissa").pagamentosProjectos).toBe(6_000);
  });

  it("6b. dois auxiliares sem override usam PF 25% e 10% por auxiliar", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [
        makeProject("p1", 100_000, {
          pontoFocalId: "arianna",
          assistants: [{ userId: "alisson" }, { userId: "amelissa" }],
        }),
      ],
      participants: [
        makeParticipant("arianna"),
        makeParticipant("alisson"),
        makeParticipant("amelissa"),
      ],
      expenses: [],
      users: [
        makeUser("arianna", 0),
        makeUser("alisson", 0),
        makeUser("amelissa", 0),
      ],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(result.projectBreakdowns[0]).toMatchObject({
      pagamentoPf: 25_000,
      pagamentoAuxTotal: 20_000,
      percentagemPfAplicada: 0.25,
      percentagemAuxTotalAplicada: 0.2,
    });
    expect(lineByUser(result, "alisson").pagamentosProjectos).toBe(10_000);
    expect(lineByUser(result, "amelissa").pagamentosProjectos).toBe(10_000);
  });

  it("7. auxiliares com overrides que não somam 1.0 lançam erro", () => {
    expect(() =>
      calculate({
        period: { year: 2026, month: 1 },
        projects: [
          makeProject("p1", 100_000, {
            assistants: [
              { userId: "alisson", percentagemOverride: 0.7 },
              { userId: "amelissa", percentagemOverride: 0.2 },
            ],
          }),
        ],
        participants: [makeParticipant("alisson"), makeParticipant("amelissa")],
        expenses: [],
        users: [makeUser("alisson", 0), makeUser("amelissa", 0)],
        policyDefaults: POLICY_DEFAULTS,
      })
    ).toThrow();
  });

  it("8. zero elegíveis aos subsídios dá subsídio por pessoa igual a zero", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [makeProject("p1", 100_000)],
      participants: [
        makeParticipant("arianna", { isElegivelSubsidio: false }),
        makeParticipant("emerson", {
          isElegivelSubsidio: false,
          recebeRubricaGestao: true,
        }),
      ],
      expenses: [],
      users: [makeUser("arianna", 0), makeUser("emerson", 0, { role: "dg" })],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(result.aggregates.subsidioPorPessoa).toBe(0);
    expect(lineByUser(result, "arianna").subsidioDinamico).toBe(0);
    expect(lineByUser(result, "emerson").subsidioDinamico).toBe(0);
  });

  it("9. zero beneficiário da rubrica de gestão não atribui gestão a ninguém", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [makeProject("p1", 100_000)],
      participants: [makeParticipant("arianna"), makeParticipant("emerson")],
      expenses: [],
      users: [makeUser("arianna", 0), makeUser("emerson", 0, { role: "dg" })],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(result.aggregates.totalPagamentoGestao).toBe(5_000);
    expect(
      result.salaryLines.reduce(
        (sum: number, line) => sum + line.pagamentoGestaoPessoa,
        0
      )
    ).toBe(0);
    expect(
      result.projectPayments.filter((entry) => entry.papel === "dg")
    ).toHaveLength(0);
  });

  it("10. dois beneficiários da rubrica de gestão lançam erro claro", () => {
    expect(() =>
      calculate({
        period: { year: 2026, month: 1 },
        projects: [makeProject("p1", 100_000)],
        participants: [
          makeParticipant("arianna", { recebeRubricaGestao: true }),
          makeParticipant("emerson", { recebeRubricaGestao: true }),
        ],
        expenses: [],
        users: [makeUser("arianna", 0), makeUser("emerson", 0, { role: "dg" })],
        policyDefaults: POLICY_DEFAULTS,
      })
    ).toThrow();
  });

  it("11. despesa sem beneficiário reduz o saldo mas não aparece em outros benefícios", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [makeProject("p1", 100_000)],
      participants: [
        makeParticipant("arianna"),
        makeParticipant("emerson", { recebeRubricaGestao: true }),
      ],
      expenses: [makeExpense("e1", 10_000)],
      users: [makeUser("arianna", 0), makeUser("emerson", 0, { role: "dg" })],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(result.aggregates.saldoBaseSubsidios).toBe(85_000);
    expect(lineByUser(result, "arianna").outrosBeneficios).toBe(0);
    expect(lineByUser(result, "emerson").outrosBeneficios).toBe(0);
  });

  it("12. despesa com beneficiário aparece como outros benefícios e também reduz o saldo", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [makeProject("p1", 100_000)],
      participants: [
        makeParticipant("arianna"),
        makeParticipant("valber"),
        makeParticipant("emerson", { recebeRubricaGestao: true }),
      ],
      expenses: [makeExpense("e1", 10_000, { beneficiarioUserId: "valber" })],
      users: [
        makeUser("arianna", 0),
        makeUser("valber", 0),
        makeUser("emerson", 0, { role: "dg" }),
      ],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(result.aggregates.saldoBaseSubsidios).toBe(85_000);
    expect(lineByUser(result, "valber").outrosBeneficios).toBe(10_000);
  });

  it("12b. despesa ligada ao projecto reduz a base antes de calcular PF, auxiliares e rubrica", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [
        makeProject("p1", 100_000, {
          pontoFocalId: "pf1",
          assistants: [{ userId: "aux1" }],
        }),
      ],
      participants: [
        makeParticipant("pf1"),
        makeParticipant("aux1"),
        makeParticipant("emerson", { recebeRubricaGestao: true }),
      ],
      expenses: [makeExpense("e1", 20_000, { projectId: "p1" })],
      users: [
        makeUser("pf1", 0),
        makeUser("aux1", 0),
        makeUser("emerson", 0, { role: "dg" }),
      ],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(result.aggregates.totalDespesasOperacionais).toBe(0);
    expect(result.projectBreakdowns[0]).toMatchObject({
      valorBaseSnapshot: 100_000,
      despesasProjecto: 20_000,
      valorLiquido: 80_000,
      pagamentoPf: 24_000,
      pagamentoAuxTotal: 12_000,
      pagamentoGestao: 4_000,
      restoAbiptom: 40_000,
    });
  });

  it("13. desconto percentual por colaborador altera o líquido como esperado", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [],
      participants: [makeParticipant("alisson"), makeParticipant("sweline")],
      expenses: [],
      users: [
        makeUser("alisson", 100_000, { percentagemDescontoFolha: 0.3 }),
        makeUser("sweline", 100_000, { percentagemDescontoFolha: 0.6 }),
      ],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(lineByUser(result, "alisson")).toMatchObject({
      totalBrutoCalculado: 100_000,
      descontoValor: 30_000,
      totalLiquidoCalculado: 70_000,
    });
    expect(lineByUser(result, "sweline")).toMatchObject({
      totalBrutoCalculado: 100_000,
      descontoValor: 60_000,
      totalLiquidoCalculado: 40_000,
    });
  });

  it("14. validação de coerência mantém a soma dos brutos consistente", () => {
    const result = calculate(typicalFixture());

    const somaBrutaReal = result.salaryLines.reduce(
      (sum: number, line) => sum + line.totalBrutoCalculado,
      0
    );

    expect(somaBrutaReal).toBe(result.aggregates.totalFolhaBruto);
    expect(() => calculate(typicalFixture())).not.toThrow();
  });

  it("15. salario_base_override sobrepõe null, valor e zero correctamente", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [],
      participants: [
        makeParticipant("arianna", { salarioBaseOverride: null }),
        makeParticipant("alisson", { salarioBaseOverride: 120_000 }),
        makeParticipant("jose", { salarioBaseOverride: 0 }),
      ],
      expenses: [],
      users: [
        makeUser("arianna", 100_000),
        makeUser("alisson", 80_000),
        makeUser("jose", 50_000),
      ],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(lineByUser(result, "arianna").salarioBase).toBe(100_000);
    expect(lineByUser(result, "alisson").salarioBase).toBe(120_000);
    expect(lineByUser(result, "jose").salarioBase).toBe(0);
  });

  it("16. despesa em moeda não XOF emite warning e é ignorada no cálculo", () => {
    const result = calculate({
      period: { year: 2026, month: 1 },
      projects: [makeProject("p1", 100_000)],
      participants: [
        makeParticipant("arianna"),
        makeParticipant("emerson", { recebeRubricaGestao: true }),
      ],
      expenses: [makeExpense("e1", 999_999, { moeda: "EUR" })],
      users: [makeUser("arianna", 0), makeUser("emerson", 0, { role: "dg" })],
      policyDefaults: POLICY_DEFAULTS,
    });

    expect(result.warnings).toHaveLength(1);
    expect(result.aggregates.totalDespesasOperacionais).toBe(0);
    expect(result.aggregates.saldoBaseSubsidios).toBe(95_000);
  });
});
