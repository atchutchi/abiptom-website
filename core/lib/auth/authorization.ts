import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User as InternalUser, UserRole } from "@/core/lib/db/schema";

type AuthUserLike = Pick<SupabaseUser, "id">;
type InternalUserLike = Pick<InternalUser, "id" | "role" | "activo">;

export const OPERATION_PERMISSIONS = {
  usersWrite: ["ca", "dg"],
  salaryRead: ["ca", "dg"],
  salaryWrite: ["ca", "dg"],
  dividendsRead: ["ca", "dg"],
  dividendsWrite: ["ca", "dg"],
  reportsRead: ["ca", "dg"],
  invoicesRead: ["ca", "dg", "coord"],
  invoicesWrite: ["ca", "dg", "coord"],
  expensesRead: ["ca", "dg", "coord"],
  expensesWrite: ["ca", "dg", "coord"],
  projectsRead: ["ca", "dg", "coord"],
  projectsWrite: ["ca", "dg", "coord"],
  tasksRead: ["ca", "dg", "coord", "staff"],
  tasksManage: ["ca", "dg", "coord"],
  stockRead: ["ca", "dg", "coord"],
  stockWrite: ["ca", "dg", "coord"],
  servicesWrite: ["ca", "dg", "coord"],
  servicesToggle: ["ca"],
} as const satisfies Record<string, readonly UserRole[]>;

export type ProtectedOperation = keyof typeof OPERATION_PERMISSIONS;

export type AuthorizationResult<
  AuthUser extends AuthUserLike = SupabaseUser,
  DbUser extends InternalUserLike = InternalUser,
> =
  | { success: true; user: AuthUser; dbUser: DbUser }
  | { success: false; error: "Não autenticado" | "Não autorizado" };

export function isRoleAllowed(
  role: UserRole,
  allowedRoles: readonly UserRole[],
): boolean {
  return allowedRoles.includes(role);
}

export function isOperationAllowed(
  operation: ProtectedOperation,
  role: UserRole,
): boolean {
  return isRoleAllowed(role, OPERATION_PERMISSIONS[operation]);
}

export function resolveAuthorization<
  AuthUser extends AuthUserLike,
  DbUser extends InternalUserLike,
>(
  context: { user: AuthUser | null; dbUser: DbUser | null },
  allowedRoles: readonly UserRole[],
): AuthorizationResult<AuthUser, DbUser> {
  const { user, dbUser } = context;

  if (!user || !dbUser || !dbUser.activo) {
    return { success: false, error: "Não autenticado" };
  }

  if (!isRoleAllowed(dbUser.role, allowedRoles)) {
    return { success: false, error: "Não autorizado" };
  }

  return { success: true, user, dbUser };
}

export async function authorizeRoles(
  allowedRoles: readonly UserRole[],
): Promise<AuthorizationResult> {
  const { getCurrentUser } = await import("@/core/lib/auth/session");
  const context = await getCurrentUser();

  return resolveAuthorization(context, allowedRoles);
}

export async function authorizeOperation(
  operation: ProtectedOperation,
): Promise<AuthorizationResult> {
  const { getCurrentUser } = await import("@/core/lib/auth/session");
  const context = await getCurrentUser();
  const result = resolveAuthorization(context, OPERATION_PERMISSIONS[operation]);

  if (!result.success && result.error === "Não autorizado" && context.dbUser) {
    const { recordSecurityEvent } = await import("@/core/lib/security/events");
    await recordSecurityEvent({
      actorId: context.dbUser.id,
      action: `authorization.${operation}`,
      entity: "security",
      result: "denied",
      severity: "warning",
    });
  }

  return result;
}
