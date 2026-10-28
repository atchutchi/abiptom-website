import { describe, expect, it } from "vitest";
import {
  buildUnavailableProjectWarning,
  buildSalaryProjectEntries,
  isSalaryProjectAvailable,
} from "@/core/lib/salary/project-selection";

describe("buildSalaryProjectEntries", () => {
  it("comeca sem projectos visiveis antes de carregar facturas pagas", () => {
    expect(
      buildSalaryProjectEntries({
        projects: [{ id: "p1" }, { id: "p2" }],
        importedEntries: [],
        mode: "paid-invoices",
      }),
    ).toEqual([]);
  });

  it("mostra apenas projectos com pagamentos no mes importado", () => {
    expect(
      buildSalaryProjectEntries({
        projects: [{ id: "p1" }, { id: "p2" }],
        importedEntries: [{ projectId: "p2", valorRecebido: 150000 }],
        mode: "paid-invoices",
      }),
    ).toEqual([
      {
        projectId: "p2",
        included: true,
        valorLiquido: "150000",
      },
    ]);
  });

  it.each(["pausado", "concluido"])(
    "mantem um projecto %s disponivel para importar pagamentos",
    (estado) => {
      expect(
        isSalaryProjectAvailable(
          { id: "p1", estado },
          "paid-invoices",
        ),
      ).toBe(true);
    },
  );

  it.each(["pausado", "concluido", "cancelado"])(
    "nao disponibiliza um projecto %s para adicao manual",
    (estado) => {
      expect(
        isSalaryProjectAvailable(
          { id: "p1", estado },
          "manual",
        ),
      ).toBe(false);
    },
  );

  it("nao importa pagamentos de um projecto cancelado", () => {
    expect(
      isSalaryProjectAvailable(
        { id: "p1", estado: "cancelado" },
        "paid-invoices",
      ),
    ).toBe(false);
  });

  it("identifica pelo nome e pelas facturas um projecto indisponivel", () => {
    expect(
      buildUnavailableProjectWarning({
        projectId: "cb9fa0e5-2688-4b36-9f96-23ebd006364d",
        projectTitle: "Campanha institucional",
        invoices: [
          { invoiceId: "invoice-1", numero: 41 },
          { invoiceId: "invoice-2", numero: 52 },
        ],
      }),
    ).toBe(
      'Projecto "Campanha institucional" (cb9fa0e5-2688-4b36-9f96-23ebd006364d), associado às facturas 41 e 52, tem pagamentos no mês, mas não está disponível para a folha salarial.',
    );
  });
});
