import { NextResponse, type NextRequest } from 'next/server'
import { buildContentSecurityPolicy } from './lib/security-csp.mjs'
import { updateSession as updatePublicSession } from './utils/supabase/middleware'
import { getCoreRouteKind, isAllowedCoreOrigin, shouldBlockPreviewRequest } from './lib/core-request-policy'
import { getSiteOrigin } from './lib/site'
import { isCoreConfigured, isCoreReviewMode } from './core/lib/environment'
import { buildSecurityHeaders } from './core/lib/security/headers'
import { resolveProtectedRouteAccess } from './core/lib/auth/session-gate'
import type { UserRole } from './core/lib/db/schema'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const kind = getCoreRouteKind(pathname)
  const reviewOnly = isCoreReviewMode()
  const nonce = btoa(crypto.randomUUID())
  const coreHeaders = buildSecurityHeaders({ nonce, development: process.env.NODE_ENV !== 'production', supabaseUrl: process.env.NEXT_PUBLIC_CORE_SUPABASE_URL })

  function finish(response: NextResponse): NextResponse {
    const headers = kind ? coreHeaders : [
      { key: 'Content-Security-Policy', value: buildContentSecurityPolicy({ development: process.env.NODE_ENV !== 'production', supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL }) },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
      { key: 'Permissions-Policy', value: 'accelerometer=(), camera=(), geolocation=(self), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
    ]
    for (const { key, value } of headers) response.headers.set(key, value)
    if (kind) {
      response.headers.set('Cache-Control', 'private, no-store, max-age=0')
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
      response.headers.set('Referrer-Policy', 'no-referrer')
    } else if (reviewOnly) {
      response.headers.set('Cache-Control', 'no-store')
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
    }
    return response
  }

  if (pathname === '/api/review-status' && ['GET', 'HEAD'].includes(request.method)) {
    return NextResponse.json({ reviewOnly }, { status: reviewOnly ? 200 : 404, headers: { 'Cache-Control': 'no-store', 'x-abiptom-review-only': reviewOnly ? '1' : '0' } })
  }
  if (shouldBlockPreviewRequest(pathname, request.method, reviewOnly)) {
    const response = finish(NextResponse.json({ error: 'Operações de escrita desactivadas nesta revisão local.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } }))
    if (!kind) response.headers.set('Cache-Control', 'no-store')
    return response
  }
  if (kind === 'disabled') return finish(NextResponse.json({ error: 'Não disponível' }, { status: 404 }))
  if (kind === 'cron') {
    if (process.env.CORE_CRON_ENABLED !== '1') return finish(NextResponse.json({ error: 'Não disponível' }, { status: 404 }))
    return finish(NextResponse.next())
  }

  if (kind) {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && !isAllowedCoreOrigin(request.headers.get('origin'), getSiteOrigin())) {
      return finish(NextResponse.json({ error: 'Pedido não autorizado.' }, { status: 403 }))
    }
    // Next reads this request CSP to attach the nonce to its own scripts.
    request.headers.set('Content-Security-Policy', coreHeaders.find(header => header.key === 'Content-Security-Policy')!.value)
    request.headers.set('x-nonce', nonce)
    const continuation = () => NextResponse.next({ request: { headers: request.headers } })
    const hasCookie = request.cookies.getAll().some(cookie => cookie.name === 'abiptom-core-auth' || cookie.name.startsWith('abiptom-core-auth.'))
    const unauthenticated = () => {
      if (kind === 'private-api') return finish(NextResponse.json({ error: 'Não autenticado' }, { status: 401 }))
      const url = new URL('/login', request.url)
      url.searchParams.set('next', pathname + request.nextUrl.search)
      return finish(NextResponse.redirect(url))
    }
    if (reviewOnly || !isCoreConfigured() || !hasCookie) {
      if (kind === 'auth' && pathname !== '/update-password') return finish(continuation())
      return unauthenticated()
    }
    try {
      const { updateSession } = await import('./core/lib/supabase/middleware')
      const { user, supabase, supabaseResponse } = await updateSession(request)
      if (kind === 'auth') return finish(supabaseResponse)
      if (!user) return unauthenticated()
      const { data: profile, error } = await supabase.from('users').select('role, activo').eq('auth_user_id', user.id).maybeSingle()
      if (error || !profile?.activo || !['ca', 'dg', 'coord', 'staff'].includes(profile.role)) return unauthenticated()
      if (kind === 'private-page') {
        const access = resolveProtectedRouteAccess({ hasUser: true, dbUser: { role: profile.role as UserRole, activo: profile.activo }, pathname })
        if (access.action === 'login') return unauthenticated()
        if (access.action === 'redirect') {
          const response = NextResponse.redirect(new URL(access.destination, request.url))
          for (const cookie of supabaseResponse.cookies.getAll()) response.cookies.set(cookie)
          return finish(response)
        }
      }
      return finish(supabaseResponse)
    } catch {
      return unauthenticated()
    }
  }

  let response = NextResponse.next()
  if (!reviewOnly && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try { response = await updatePublicSession(request) } catch { /* Public pages remain available. */ }
  }
  return finish(response)
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
