import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ currentUser: vi.fn(), insert: vi.fn(), update: vi.fn() }));
vi.mock("@/core/lib/auth/actions", () => ({ getCurrentUser: mocks.currentUser }));
vi.mock("@/core/lib/db", () => ({ dbAdmin: { insert: mocks.insert, update: mocks.update } }));
vi.mock("@/core/lib/db/audit", () => ({ insertAuditLog: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
import { createClient, updateClient } from "@/core/lib/clients/actions";

describe("client form authentication failure", () => {
  beforeEach(() => vi.clearAllMocks());
  it.each(["create", "update"])("returns a recoverable result and does not write data on %s", async (operation) => {
    mocks.currentUser.mockResolvedValue({ user: null, dbUser: null });
    const data = new FormData();
    data.set("nome", "Cliente de exemplo");
    const result = operation === "create"
      ? createClient(null, data) : updateClient("client-1", null, data);
    await expect(result).resolves.toMatchObject({ authRequired: true, error: expect.any(String) });
    expect(mocks.insert).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("still denies writes for an authenticated staff user", async () => {
    mocks.currentUser.mockResolvedValue({ user: { id: "user-1" }, dbUser: { role: "staff", activo: true } });
    expect(await createClient(null, new FormData())).toEqual({ error: "Sem permissão" });
    expect(mocks.insert).not.toHaveBeenCalled();
  });
});
