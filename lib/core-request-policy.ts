export type CoreRouteKind = 'auth' | 'private-page' | 'private-api' | 'cron' | 'disabled'

const PRIVATE_API_PREFIXES = ['/api/users', '/api/invoices', '/api/reports', '/api/salary', '/api/messages']
const AUTH_PATHS = ['/login', '/forgot-password', '/update-password', '/auth/confirm']
const under = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`)

export function getCoreRouteKind(pathname: string): CoreRouteKind | null {
  if (under(pathname, '/api/admin')) return 'disabled'
  if (under(pathname, '/api/cron')) return 'cron'
  if (pathname === '/api/auth/post-login' || PRIVATE_API_PREFIXES.some(prefix => under(pathname, prefix))) return 'private-api'
  if (under(pathname, '/admin') || under(pathname, '/staff')) return 'private-page'
  if (AUTH_PATHS.includes(pathname)) return 'auth'
  return null
}

export function isAllowedCoreOrigin(origin: string | null, expectedOrigin: string): boolean {
  return origin !== null && origin === expectedOrigin
}

export function shouldBlockPreviewRequest(pathname: string, method: string, preview: boolean): boolean {
  if (!preview) return false
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) return true
  return getCoreRouteKind(pathname) === 'cron' || pathname === '/auth/confirm' || pathname === '/api/auth/post-login'
}
