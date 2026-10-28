import { describe, expect, it } from "vitest";
import { canAccessRoute } from "@/core/lib/auth/rbac";

describe("canAccessRoute", () => {
  it("permite operacao diaria ao perfil de coordenacao", () => {
    const allowedRoutes = [
      "/admin/clients",
      "/admin/clients/new",
      "/admin/clients/client-id",
      "/admin/invoices",
      "/admin/invoices/new",
      "/admin/projects",
      "/admin/projects/new",
      "/admin/expenses",
      "/admin/expenses/new",
      "/admin/settings",
      "/admin/settings/services",
      "/admin/settings/services/new",
    ];

    for (const route of allowedRoutes) {
      expect(canAccessRoute("coord", route), route).toBe(true);
    }
  });

  it("mantem areas financeiras e administrativas restritas para coordenacao", () => {
    const deniedRoutes = [
      "/admin/users",
      "/admin/salary",
      "/admin/reports",
      "/admin/dividends",
      "/admin/settings/policies",
      "/admin/settings/other",
    ];

    for (const route of deniedRoutes) {
      expect(canAccessRoute("coord", route), route).toBe(false);
    }
  });

  it("nao transfere privilegios de coordenacao para staff", () => {
    const deniedRoutes = [
      "/admin/clients",
      "/admin/invoices",
      "/admin/projects",
      "/admin/expenses",
      "/admin/settings/services",
    ];

    for (const route of deniedRoutes) {
      expect(canAccessRoute("staff", route), route).toBe(false);
    }

    expect(canAccessRoute("staff", "/staff/me/dashboard")).toBe(true);
  });
});
