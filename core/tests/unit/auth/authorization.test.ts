import { describe, expect, it } from "vitest";
import {
  OPERATION_PERMISSIONS,
  isOperationAllowed,
  isRoleAllowed,
  resolveAuthorization,
} from "@/core/lib/auth/authorization";

describe("isRoleAllowed", () => {
  it("restringe operações financeiras a ca e dg", () => {
    expect(isRoleAllowed("ca", ["ca", "dg"])).toBe(true);
    expect(isRoleAllowed("dg", ["ca", "dg"])).toBe(true);
    expect(isRoleAllowed("coord", ["ca", "dg"])).toBe(false);
    expect(isRoleAllowed("staff", ["ca", "dg"])).toBe(false);
  });
});

describe("isOperationAllowed", () => {
  it("aplica uma matriz única às operações críticas", () => {
    expect(OPERATION_PERMISSIONS.salaryWrite).toEqual(["ca", "dg"]);
    expect(OPERATION_PERMISSIONS.invoicesWrite).toEqual([
      "ca",
      "dg",
      "coord",
    ]);
    expect(isOperationAllowed("salaryWrite", "coord")).toBe(false);
    expect(isOperationAllowed("tasksManage", "coord")).toBe(true);
    expect(isOperationAllowed("servicesToggle", "dg")).toBe(false);
    expect(isOperationAllowed("servicesToggle", "ca")).toBe(true);
  });
});

describe("resolveAuthorization", () => {
  const authUser = { id: "auth-user" };
  const activeUser = { id: "internal-user", role: "dg" as const, activo: true };

  it("rejeita uma sessão sem utilizador interno activo", () => {
    expect(
      resolveAuthorization({ user: authUser, dbUser: null }, ["ca", "dg"]),
    ).toEqual({ success: false, error: "Não autenticado" });

    expect(
      resolveAuthorization(
        { user: authUser, dbUser: { ...activeUser, activo: false } },
        ["ca", "dg"],
      ),
    ).toEqual({ success: false, error: "Não autenticado" });
  });

  it("rejeita um papel interno sem permissão", () => {
    expect(
      resolveAuthorization(
        {
          user: authUser,
          dbUser: { ...activeUser, role: "coord" },
        },
        ["ca", "dg"],
      ),
    ).toEqual({ success: false, error: "Não autorizado" });
  });

  it("devolve a sessão autorizada sem alterar os utilizadores", () => {
    expect(
      resolveAuthorization(
        { user: authUser, dbUser: activeUser },
        ["ca", "dg"],
      ),
    ).toEqual({ success: true, user: authUser, dbUser: activeUser });
  });
});
