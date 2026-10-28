import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { isCoreConfigured } from '@/core/lib/environment'

const mocks = vi.hoisted(() => ({ updateSession: vi.fn(), profile: vi.fn(), from: vi.fn() }))
vi.mock('@/core/lib/supabase/middleware', () => ({ updateSession: mocks.updateSession }))
import { proxy } from '@/proxy'

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('ABIPTOM_REVIEW_ONLY', '')
  vi.stubEnv('VERCEL_ENV', '')
  vi.stubEnv('NEXT_PUBLIC_CORE_SUPABASE_URL', 'https://test-project.supabase.co')
  vi.stubEnv('NEXT_PUBLIC_CORE_SUPABASE_ANON_KEY', 'fake-public-test-key')
  vi.stubEnv('CORE_DATABASE_URL', 'postgresql://fake:fake@localhost/test')
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Network is forbidden in this unit test') }))
  mocks.from.mockReturnValue({ select: () => ({ eq: () => ({ maybeSingle: mocks.profile }) }) })
  mocks.profile.mockResolvedValue({ data: { role: 'ca', activo: true }, error: null })
  mocks.updateSession.mockImplementation(async () => ({ user: { id: 'verified-id', user_metadata: { role: 'ca' } }, supabase: { from: mocks.from }, supabaseResponse: NextResponse.next() }))
})
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })
const request = (path: string, cookie = 'abiptom-core-auth=fake') => new NextRequest(`https://www.abiptom.gw${path}`, { headers: { cookie } })

describe('configured proxy with no network', () => {
  it('rejects a forged cookie after the auth provider rejects it', async () => {
    mocks.updateSession.mockResolvedValue({ user: null, supabase: { from: mocks.from }, supabaseResponse: NextResponse.next() })
    expect((await proxy(request('/api/users'))).status).toBe(401)
    expect(mocks.updateSession).toHaveBeenCalledOnce()
    expect(mocks.from).not.toHaveBeenCalled()
  })
  it('refuses inactive, absent, unknown and unavailable internal profiles', async () => {
    for (const data of [null, { role: 'ca', activo: false }, { role: 'hacker', activo: true }]) {
      mocks.profile.mockResolvedValue({ data, error: null })
      expect((await proxy(request('/api/users'))).status).toBe(401)
    }
    mocks.profile.mockResolvedValue({ data: null, error: { message: 'unavailable' } })
    expect((await proxy(request('/api/users'))).status).toBe(401)
  })
  it('ignores a role claimed in metadata and applies the internal staff role', async () => {
    mocks.profile.mockResolvedValue({ data: { role: 'staff', activo: true }, error: null })
    const response = await proxy(request('/admin/users'))
    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe('/staff/me/dashboard')
  })
  it('permits an active internal administrator and retains private headers', async () => {
    const response = await proxy(request('/admin/users'))
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toContain('no-store')
    expect(mocks.profile).toHaveBeenCalledOnce()
  })
  it('does not treat the public site cookie as a Core session', async () => {
    expect((await proxy(request('/api/users', 'sb-public-auth=some-token'))).status).toBe(401)
    expect(mocks.updateSession).not.toHaveBeenCalled()
  })
  it('fails closed on authentication exceptions', async () => {
    mocks.updateSession.mockRejectedValue(new Error('private-provider-error'))
    const response = await proxy(request('/api/users'))
    expect(response.status).toBe(401)
    expect(await response.text()).not.toContain('private-provider-error')
  })
  it('never initializes Core auth in review despite complete configuration', async () => {
    vi.stubEnv('ABIPTOM_REVIEW_ONLY', '1')
    expect((await proxy(request('/api/users'))).status).toBe(401)
    expect(mocks.updateSession).not.toHaveBeenCalled()
  })
  it('accepts the same direct database fallback as the database client', () => {
    vi.stubEnv('CORE_DATABASE_URL', '')
    vi.stubEnv('CORE_DATABASE_DIRECT_URL', 'postgresql://fake:fake@localhost/test')
    expect(isCoreConfigured()).toBe(true)
  })
})
