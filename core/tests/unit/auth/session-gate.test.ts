import { describe, expect, it } from "vitest";
import { resolveProtectedRouteAccess } from "@/core/lib/auth/session-gate";

describe("resolveProtectedRouteAccess", () => {
  it("redirecciona quando a sessao autenticada nao tem utilizador interno", () => {
    const decision = resolveProtectedRouteAccess({
      hasUser: true,
      dbUser: null,
      pathname: "/admin/users",
    });

    expect(decision).toEqual({ action: "login" });
  });

  it("usa apenas o papel interno e ignora qualquer papel vindo dos metadados Auth", () => {
    const decision = resolveProtectedRouteAccess({
      hasUser: true,
      dbUser: { role: "staff", activo: true },
      pathname: "/admin/users",
      authMetadataRole: "ca",
    });

    expect(decision).toEqual({
      action: "redirect",
      destination: "/staff/me/dashboard",
    });
  });

  it("permite ca e dg com login por password sem exigir MFA", () => {
    const decision = resolveProtectedRouteAccess({
      hasUser: true,
      dbUser: { role: "ca", activo: true },
      pathname: "/admin/dashboard",
    });

    expect(decision).toEqual({ action: "allow", role: "ca" });
  });
});
