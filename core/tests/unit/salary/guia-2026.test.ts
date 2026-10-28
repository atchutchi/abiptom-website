import { describe, it, expect } from "vitest";
import { calculateGuia2026 } from "@/core/lib/salary/engines/guia-2026";
import type { Guia2026PolicyConfig, ProjectInput, StaffInput } from "@/core/lib/salary/types";

// ─── Fixtures ────────────────────────────────────────────────────────────────
// Designed to exactly reproduce SPEC acceptance values:
//   Cenário A (1 PF + 1 Aux, total net 831.250):
//     Arianna 267.813, Alisson 123.125, Sweline 91.563, Valber 30.000
//   Cenário B (1 PF + 2 Aux, same net):
//     Arianna 226.250, Alisson 102.344, Amelissa 87.344, Sweline 91.563, Valber 30.000
//
// P1=250.000, P2=225.000, P3=200.000, P4=156.250  → total = 831.250
// Cenário A: PF 25% = 207.813 (via rounding), Aux 10% = 83.125, Coord 5% = 41.563
// Cenário B: PF 20% = 166.250, Aux 7.5% each = 62.344, Coord 5% = 41.563

const ARIANNA = "arianna";
const ALISSON = "alisson";
const AMELISSA = "amelissa";
const SWELINE = "sweline";
const VALBER = "valber";

const policy: Guia2026PolicyConfig = {
  tipo: "guia_2026",
  percentagens: {
    reserva: 0.10,
    fundo: 0.05,
    pf_1aux: 0.25,
    pf_2aux: 0.20,
    aux_1aux: 0.10,
    aux_2aux: 0.075,
    coord: 0.05,
    custos: 0.20,
    margem: 0.25,
  },
};

const staffA: StaffInput[] = [
  { id: ARIANNA, nomeCurto: "Arianna", role: "staff", salarioBase: 60_000 },
  { id: ALISSON, nomeCurto: "Alisson", role: "staff", salarioBase: 40_000 },
  { id: SWELINE, nomeCurto: "Sweline", role: "coord", salarioBase: 50_000 },
  { id: VALBER, nomeCurto: "Valber", role: "staff", salarioBase: 30_000 },
];

const staffB: StaffInput[] = [
  ...staffA,
  { id: AMELISSA, nomeCurto: "Amelissa", role: "staff", salarioBase: 25_000 },
];

const projectsA: ProjectInput[] = [
  { id: "p1", titulo: "Proj 1", valorLiquido: 250_000, pontoFocalId: ARIANNA, coordId: SWELINE, assistants: [{ userId: ALISSON }] },
  { id: "p2", titulo: "Proj 2", valorLiquido: 225_000, pontoFocalId: ARIANNA, coordId: SWELINE, assistants: [{ userId: ALISSON }] },
  { id: "p3", titulo: "Proj 3", valorLiquido: 200_000, pontoFocalId: ARIANNA, coordId: SWELINE, assistants: [{ userId: ALISSON }] },
  { id: "p4", titulo: "Proj 4", valorLiquido: 156_250, pontoFocalId: ARIANNA, coordId: SWELINE, assistants: [{ userId: ALISSON }] },
];

const projectsB: ProjectInput[] = projectsA.map((p) => ({
  ...p,
  assistants: [{ userId: ALISSON }, { userId: AMELISSA }],
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("guia_2026 - Cenário A: 1 PF + 1 Aux (SPEC acceptance)", () => {
  it("Arianna total = 267.813 XOF", () => {
    const r = calculateGuia2026(policy, projectsA, staffA);
    expect(r.lines.find((l) => l.userId === ARIANNA)!.totalLiquido).toBe(267_813);
  });

  it("Alisson total = 123.125 XOF", () => {
    const r = calculateGuia2026(policy, projectsA, staffA);
    expect(r.lines.find((l) => l.userId === ALISSON)!.totalLiquido).toBe(123_125);
  });

  it("Sweline total = 91.563 XOF (base + 5% coord)", () => {
    const r = calculateGuia2026(policy, projectsA, staffA);
    expect(r.lines.find((l) => l.userId === SWELINE)!.totalLiquido).toBe(91_563);
  });

  it("Valber total = 30.000 XOF (salário base only)", () => {
    const r = calculateGuia2026(policy, projectsA, staffA);
    expect(r.lines.find((l) => l.userId === VALBER)!.totalLiquido).toBe(30_000);
  });
});

describe("guia_2026 - Cenário B: 1 PF + 2 Aux (SPEC acceptance)", () => {
  it("Arianna total = 226.250 XOF", () => {
    const r = calculateGuia2026(policy, projectsB, staffB);
    expect(r.lines.find((l) => l.userId === ARIANNA)!.totalLiquido).toBe(226_250);
  });

  it("Alisson total = 102.344 XOF", () => {
    const r = calculateGuia2026(policy, projectsB, staffB);
    expect(r.lines.find((l) => l.userId === ALISSON)!.totalLiquido).toBe(102_344);
  });

  it("Amelissa total = 87.344 XOF", () => {
    const r = calculateGuia2026(policy, projectsB, staffB);
    expect(r.lines.find((l) => l.userId === AMELISSA)!.totalLiquido).toBe(87_344);
  });

  it("Sweline total = 91.563 XOF (unchanged between cenários)", () => {
    const r = calculateGuia2026(policy, projectsB, staffB);
    expect(r.lines.find((l) => l.userId === SWELINE)!.totalLiquido).toBe(91_563);
  });

  it("Valber total = 30.000 XOF", () => {
    const r = calculateGuia2026(policy, projectsB, staffB);
    expect(r.lines.find((l) => l.userId === VALBER)!.totalLiquido).toBe(30_000);
  });
});

describe("guia_2026 - distribuição percentual", () => {
  it("100.000 net: PF 25%, Aux 10%, Coord 5%, Reserva 10%, Fundo 5%, Custos 20%, Margem 25%", () => {
    const p: ProjectInput[] = [{
      id: "t", titulo: "T", valorLiquido: 100_000,
      pontoFocalId: ARIANNA, coordId: SWELINE, assistants: [{ userId: ALISSON }],
    }];
    const r = calculateGuia2026(policy, p, staffA);
    const pf = r.lines.find((l) => l.userId === ARIANNA)!.componenteDinamica[0];
    const ax = r.lines.find((l) => l.userId === ALISSON)!.componenteDinamica[0];
    const co = r.lines.find((l) => l.userId === SWELINE)!.componenteDinamica[0];
    expect(pf.valorRecebido).toBe(25_000);
    expect(ax.valorRecebido).toBe(10_000);
    expect(co.valorRecebido).toBe(5_000);
    expect(r.summary.reservaEstrategica).toBe(10_000);
    expect(r.summary.fundoInvestimento).toBe(5_000);
    expect(r.summary.custos).toBe(20_000);
    expect(r.summary.margemEmpresa).toBe(25_000);
  });

  it("2 aux: PF 20%, Aux 7.5% cada", () => {
    const p: ProjectInput[] = [{
      id: "t", titulo: "T", valorLiquido: 100_000,
      pontoFocalId: ARIANNA, assistants: [{ userId: ALISSON }, { userId: AMELISSA }],
    }];
    const r = calculateGuia2026(policy, p, staffB);
    const pf = r.lines.find((l) => l.userId === ARIANNA)!.componenteDinamica[0];
    const ax1 = r.lines.find((l) => l.userId === ALISSON)!.componenteDinamica[0];
    const ax2 = r.lines.find((l) => l.userId === AMELISSA)!.componenteDinamica[0];
    expect(pf.valorRecebido).toBe(20_000);
    expect(ax1.valorRecebido).toBe(7_500);
    expect(ax2.valorRecebido).toBe(7_500);
  });
});
