import { afterEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { getSafeRedirectPath, getPostLoginRedirectPath } from '@/core/lib/auth/redirects'
import { isAuthorizedCronRequest } from '@/core/lib/cron/auth'
import { assertCoreDataAccess } from '@/core/lib/environment'

afterEach(() => vi.unstubAllEnvs())

describe('integration security', () => {
  it('rejects browser-normalized external redirects and control characters', () => {
    for (const path of ['//attacker.test', '/\\attacker.test', '/%5cattacker.test', '/%2fattacker.test', '/admin\n/users', 'https://attacker.test', '/a/..//attacker.test', '/a/%2e%2e//attacker.test']) {
      expect(getSafeRedirectPath(path, '/login'), path).toBe('/login')
    }
    expect(getSafeRedirectPath('/admin/projects?state=open', '/login')).toBe('/admin/projects?state=open')
  })
  it('redirects each profile only to paths that profile can access', () => {
    expect(getPostLoginRedirectPath('staff', '/admin/users')).toBe('/staff/me/dashboard')
    expect(getPostLoginRedirectPath('coord', '/admin/reports')).toBe('/staff/me/dashboard')
    expect(getPostLoginRedirectPath('ca', '/admin/users')).toBe('/admin/users')
    expect(getPostLoginRedirectPath('staff', '/staff/me/tasks')).toBe('/staff/me/tasks')
  })
  it('refuses cron without a strong secret in every environment', () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('CRON_SECRET', '')
    expect(isAuthorizedCronRequest(new NextRequest('http://localhost/api/cron/backup'))).toBe(false)
    vi.stubEnv('CRON_SECRET', 'short')
    expect(isAuthorizedCronRequest(new NextRequest('http://localhost/api/cron/backup', { headers: { authorization: 'Bearer short' } }))).toBe(false)
    vi.stubEnv('CRON_SECRET', 'a'.repeat(40))
    expect(isAuthorizedCronRequest(new NextRequest('http://localhost/api/cron/backup', { headers: { authorization: `Bearer ${'a'.repeat(40)}` } }))).toBe(true)
  })
  it('refuses data connections in review even if credentials are present', () => {
    vi.stubEnv('ABIPTOM_REVIEW_ONLY', '1')
    vi.stubEnv('CORE_DATABASE_URL', 'postgresql://fake:fake@localhost/test')
    expect(() => assertCoreDataAccess()).toThrow(/pré-visualização/)
  })
})
