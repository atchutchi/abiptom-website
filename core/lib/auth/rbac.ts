import type { UserRole } from "@/core/lib/db/schema";

// Rotas acessíveis por papel
export const ROLE_ROUTES: Record<UserRole, string[]> = {
  ca: ["/admin", "/staff"],
  dg: ["/admin", "/staff"],
  coord: [
    "/admin/projects",
    "/admin/clients",
    "/admin/invoices",
    "/admin/expenses",
    "/admin/stock",
    "/admin/tasks",
    "/admin/chat",
    "/admin/messages",
    "/admin/profile",
    "/admin/settings",
    "/admin/settings/services",
    "/staff",
  ],
  staff: ["/staff"],
};

// Rotas admin restritas a ca e dg
export const ADMIN_ONLY_ROUTES = [
  "/admin/users",
  "/admin/salary",
  "/admin/dividends",
  "/admin/reports",
];

// Rotas restritas a ca
export const CA_ONLY_ROUTES = ["/admin/settings/policies"];

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  if (role === "ca") return true;
  if (role === "dg") return !CA_ONLY_ROUTES.some((r) => pathname.startsWith(r));

  if (ADMIN_ONLY_ROUTES.some((r) => pathname.startsWith(r))) return false;

  if (role === "coord") {
    return (
      pathname.startsWith("/admin/profile") ||
      pathname.startsWith("/admin/projects") ||
      pathname.startsWith("/admin/clients") ||
      pathname.startsWith("/admin/stock") ||
      pathname.startsWith("/admin/tasks") ||
      pathname.startsWith("/admin/chat") ||
      pathname.startsWith("/admin/messages") ||
      pathname.startsWith("/admin/expenses") ||
      pathname.startsWith("/admin/invoices") ||
      pathname === "/admin/settings" ||
      pathname.startsWith("/admin/settings/services") ||
      pathname.startsWith("/staff")
    );
  }

  // staff: só /staff/*
  return pathname.startsWith("/staff");
}

export function getDefaultRoute(role: UserRole): string {
  if (role === "ca" || role === "dg") return "/admin/dashboard";
  if (role === "coord") return "/staff/me/dashboard";
  return "/staff/me/dashboard";
}
