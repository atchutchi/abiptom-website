import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(), findFirst: vi.fn(), update: vi.fn(), set: vi.fn(),
  where: vi.fn(), returning: vi.fn(), authUpdate: vi.fn(), repair: vi.fn(),
  audit: vi.fn(), revalidate: vi.fn(),
}));
vi.mock("@/core/lib/auth/actions", () => ({ getCurrentUser: mocks.getCurrentUser }));
vi.mock("@/core/lib/db", () => ({ dbAdmin: {
  query: { users: { findFirst: mocks.findFirst } }, update: mocks.update,
} }));
vi.mock("@/core/lib/db/audit", () => ({ insertAuditLog: mocks.audit }));
vi.mock("@/core/lib/users/auth-link", () => ({ repairAuthLinkForInternalUser: mocks.repair }));
vi.mock("@/core/lib/supabase/admin", () => ({ createAdminClient: () => ({ auth: {
  admin: { updateUserById: mocks.authUpdate },
} }) }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));

import { activateUser, deactivateUser } from "@/core/lib/users/actions";
const target = { id: "11111111-1111-4111-8111-111111111111",
  authUserId: "22222222-2222-4222-8222-222222222222", activo: false,
  role: "staff", mfaEnabled: true };
const actor = { id: "33333333-3333-4333-8333-333333333333", activo: true, role: "ca" };

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getCurrentUser.mockResolvedValue({ dbUser: actor });
  mocks.findFirst.mockResolvedValue(target);
  mocks.repair.mockResolvedValue(target);
  mocks.authUpdate.mockResolvedValue({ error: null });
  mocks.update.mockReturnValue({ set: mocks.set });
  mocks.set.mockReturnValue({ where: mocks.where });
  mocks.where.mockReturnValue({ returning: mocks.returning });
  mocks.returning.mockResolvedValue([{ ...target, activo: true }]);
});

describe("activação de utilizadores internos", () => {
  it.each([null, { ...actor, activo: false }, { ...actor, role: "staff" }, { ...actor, role: "coord" }])(
    "recusa actores sem permissão antes de consultar ou alterar contas: %j", async dbUser => {
      mocks.getCurrentUser.mockResolvedValue({ dbUser });
      expect(await activateUser(target.id)).toEqual({ error: "Sem permissão." });
      expect(mocks.findFirst).not.toHaveBeenCalled();
      expect(mocks.authUpdate).not.toHaveBeenCalled();
      expect(mocks.update).not.toHaveBeenCalled();
    });

  it.each(["ca", "dg"])("permite %s e sincroniza Auth e perfil sem alterar função ou MFA", async role => {
    mocks.getCurrentUser.mockResolvedValue({ dbUser: { ...actor, role } });
    expect(await activateUser(target.id)).toEqual({ success: true });
    expect(mocks.authUpdate).toHaveBeenCalledWith(target.authUserId, {
      app_metadata: { role: "staff", active: true, mfa_enabled: true },
    });
    expect(mocks.set).toHaveBeenCalledWith({ activo: true, updatedAt: expect.any(Date) });
    expect(mocks.audit).toHaveBeenCalledWith(expect.objectContaining({
      userId: actor.id, acao: "activar_utilizador", entidade: "users", entidadeId: target.id,
      dadosAntes: target, dadosDepois: expect.objectContaining({ activo: true }),
    }));
    expect(mocks.revalidate).toHaveBeenCalledWith("/admin/users");
    expect(mocks.revalidate).toHaveBeenCalledWith(`/admin/users/${target.id}`);
  });

  it("não altera o perfil se a sincronização Auth falhar", async () => {
    mocks.authUpdate.mockResolvedValue({ error: { message: "Falha Auth" } });
    expect(await activateUser(target.id)).toEqual({ error: "Falha Auth" });
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.audit).not.toHaveBeenCalled();
  });

  it("recusa utilizador inexistente ou sem ligação Auth", async () => {
    mocks.findFirst.mockResolvedValueOnce(null);
    expect(await activateUser(target.id)).toEqual({ error: "Utilizador não encontrado." });
    mocks.repair.mockResolvedValueOnce(null);
    expect(await activateUser(target.id)).toEqual({ error: "Conta Auth não encontrada para este utilizador." });
    expect(mocks.authUpdate).not.toHaveBeenCalled();
  });

  it("mantém a desactivação e impede a auto-desactivação", async () => {
    expect(await deactivateUser(actor.id)).toEqual({ error: "Não podes desactivar a tua própria conta." });
    expect(mocks.findFirst).not.toHaveBeenCalled();
    mocks.returning.mockResolvedValueOnce([{ ...target, activo: false }]);
    expect(await deactivateUser(target.id)).toEqual({ success: true });
    expect(mocks.authUpdate).toHaveBeenCalledWith(target.authUserId, {
      app_metadata: { role: "staff", active: false, mfa_enabled: true },
    });
    expect(mocks.set).toHaveBeenCalledWith({ activo: false, updatedAt: expect.any(Date) });
  });
});
