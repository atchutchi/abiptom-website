import { getDefaultRoute, canAccessRoute } from "@/core/lib/auth/rbac";
import type { UserRole } from "@/core/lib/db/schema";

function isSafeInternalPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") && !/[\\\u0000-\u0020\u007f]/.test(path) && !/%(?:2f|5c|0[0-9a-f]|1[0-9a-f]|7f)/i.test(path);
}

export function getSafeRedirectPath(
  path: string | null | undefined,
  fallback: string
) {
  if (!path) {
    return fallback;
  }

  const candidate = path.trim();
  if (!isSafeInternalPath(candidate)) return fallback;
  const base = 'https://internal.invalid';
  const parsed = new URL(candidate, base);
  const normalized = parsed.pathname + parsed.search + parsed.hash;
  return parsed.origin === base && isSafeInternalPath(normalized) ? normalized : fallback;
}

export function getPostLoginRedirectPath(
  role: UserRole,
  nextPath: string | null | undefined
) {
  const fallback = getDefaultRoute(role);
  const candidate = getSafeRedirectPath(nextPath, fallback);
  const pathname = new URL(candidate, 'https://internal.invalid').pathname;
  const privatePath = ['/admin', '/staff'].some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'));
  return privatePath && canAccessRoute(role, pathname) ? candidate : fallback;
}
