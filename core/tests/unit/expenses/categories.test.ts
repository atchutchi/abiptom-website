import { describe, expect, it } from "vitest";
import { EXPENSE_CATEGORY_LABEL } from "@/core/lib/expenses/labels";

describe("expense categories", () => {
  it("inclui as novas categorias operacionais", () => {
    expect(EXPENSE_CATEGORY_LABEL).toMatchObject({
      impressao: "Impressão",
      fundo_maneio: "Fundo de maneio",
      comunicacao: "Comunicação",
    });
  });
});
