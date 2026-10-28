import { describe, expect, it } from "vitest";
import {
  buildInvoiceExportRows,
  createInvoiceExportWorkbook,
} from "@/core/lib/invoices/export";

describe("invoice export", () => {
  it("normaliza linhas de factura sem depender da biblioteca xlsx", () => {
    const rows = buildInvoiceExportRows([
      {
        numero: 42,
        tipo: "definitiva",
        estado: "paga",
        dataEmissao: "2026-06-23",
        dataVencimento: null,
        moeda: "XOF",
        subtotal: "1000",
        igvPercentagem: "0",
        igvValor: "0",
        total: "1000",
        formaPagamento: null,
        enviadaEm: new Date("2026-06-23T10:20:00.000Z"),
        client: { nome: "ABIPTOM SARL" },
      },
    ]);

    expect(rows).toEqual([
      {
        numero: "00042",
        tipo: "definitiva",
        estado: "paga",
        cliente: "ABIPTOM SARL",
        dataEmissao: "2026-06-23",
        dataVencimento: "",
        moeda: "XOF",
        subtotal: 1000,
        igvPercentagem: 0,
        igvValor: 0,
        total: 1000,
        formaPagamento: "",
        enviadaEm: "2026-06-23",
      },
    ]);
  });

  it("gera um ficheiro xlsx valido a partir das linhas normalizadas", async () => {
    const buffer = await createInvoiceExportWorkbook(
      [
        {
          numero: "Rascunho",
          tipo: "proforma",
          estado: "rascunho",
          cliente: "Cliente Teste",
          dataEmissao: "2026-06-23",
          dataVencimento: "",
          moeda: "XOF",
          subtotal: 1000,
          igvPercentagem: 0,
          igvValor: 0,
          total: 1000,
          formaPagamento: "",
          enviadaEm: "",
        },
      ],
      "2026-06"
    );

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.subarray(0, 2).toString("utf8")).toBe("PK");
  });
});
