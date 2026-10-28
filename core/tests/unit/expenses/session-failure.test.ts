import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  currentUser: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
}));

vi.mock("@/core/lib/auth/actions", () => ({ getCurrentUser: mocks.currentUser }));
vi.mock("@/core/lib/db", () => ({
  dbAdmin: {
    insert: mocks.insert,
    update: mocks.update,
    query: { expenses: { findFirst: vi.fn() } },
  },
}));
vi.mock("@/core/lib/db/audit", () => ({ insertAuditLog: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));

import { createExpense, updateExpense } from "@/core/lib/expenses/actions";

describe("expense form authentication failure", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each(["create", "update"])(
    "returns a recoverable result without writing data on %s",
    async (operation) => {
      mocks.currentUser.mockResolvedValue({ user: null, dbUser: null });
      const data = new FormData();
      data.set("descricao", "Despesa de exemplo");

      const result = operation === "create"
        ? createExpense(null, data)
        : updateExpense("expense-1", null, data);

      await expect(result).resolves.toMatchObject({
        authRequired: true,
        error: expect.any(String),
      });
      expect(mocks.insert).not.toHaveBeenCalled();
      expect(mocks.update).not.toHaveBeenCalled();
    },
  );
});
