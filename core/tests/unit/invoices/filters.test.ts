import { describe, expect, it } from "vitest";
import { normalizeInvoiceFilters } from "@/core/lib/invoices/filters";

describe("normalizeInvoiceFilters", () => {
  it("calcula o ultimo dia real do mes seleccionado", () => {
    expect(normalizeInvoiceFilters({ mes: "2026-02" })).toMatchObject({
      mesInicio: "2026-02-01",
      mesFim: "2026-02-28",
    });
  });

  it("preserva filtros operacionais e desactiva estado quando vencidas esta activo", () => {
    expect(
      normalizeInvoiceFilters({
        vencidas: "1",
        estado: "paga",
        clientId: "c1",
        projectId: "p1",
        numero: "42",
        tipo: "definitiva",
        moeda: "XOF",
        dataInicio: "2026-07-01",
        dataFim: "2026-07-31",
        pagoNoMes: "2026-07",
      }),
    ).toEqual({
      estado: undefined,
      clientId: "c1",
      projectId: "p1",
      numero: 42,
      tipo: "definitiva",
      moeda: "XOF",
      mesInicio: undefined,
      mesFim: undefined,
      dataInicio: "2026-07-01",
      dataFim: "2026-07-31",
      vencidas: true,
      pagoInicio: "2026-07-01",
      pagoFim: "2026-07-31",
      hasActiveFilters: true,
    });
  });
});
