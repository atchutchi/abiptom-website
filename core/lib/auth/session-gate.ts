import { canAccessRoute, getDefaultRoute } from "@/core/lib/auth/rbac";
import type { UserRole } from "@/core/lib/db/schema";

type InternalUserForAccess = {
  role: UserRole;
  activo: boolean;
};

type ResolveProtectedRouteAccessInput = {
  hasUser: boolean;
  dbUser: InternalUserForAccess | null;
  pathname: string;
  authMetadataRole?: unknown;
};

export type ProtectedRouteAccessDecision =
  | { action: "allow"; role: UserRole }
  | { action: "login" }
  | { action: "redirect"; destination: string };

export function resolveProtectedRouteAccess({
  hasUser,
  dbUser,
  pathname,
}: ResolveProtectedRouteAccessInput): ProtectedRouteAccessDecision {
  if (!hasUser || !dbUser || !dbUser.activo) {
    return { action: "login" };
  }

  const { role } = dbUser;

  if (!canAccessRoute(role, pathname)) {
    return { action: "redirect", destination: getDefaultRoute(role) };
  }

  return { action: "allow", role };
}
