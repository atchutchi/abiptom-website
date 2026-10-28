import { describe, expect, it } from "vitest";
import { getDefaultInvoiceBankAccount } from "@/core/lib/invoices/bank-account";

describe("getDefaultInvoiceBankAccount", () => {
  it("devolve a conta ECOBANK exacta usada nas facturas", () => {
    expect(getDefaultInvoiceBankAccount()).toBe(
      "ECOBANK Conta nº 180936560001\nGW143 01001 180936560001",
    );
  });
});
