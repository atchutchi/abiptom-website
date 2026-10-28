import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { NextRequest } from 'next/server'
import { proxy } from '../proxy'
const previous = process.env.ABIPTOM_REVIEW_ONLY
afterEach(() => { if (previous === undefined) delete process.env.ABIPTOM_REVIEW_ONLY; else process.env.ABIPTOM_REVIEW_ONLY = previous })

test('anonymous API access never serves internal data even with a forged cookie', async () => {
  delete process.env.ABIPTOM_REVIEW_ONLY
  for (const path of ['/api/users', '/api/invoices/pdf/1', '/api/reports/monthly', '/api/salary/receipt/1']) {
    const response = await proxy(new NextRequest(`http://localhost:3000${path}`, { headers: { cookie: 'abiptom-core-auth=fake; role=ca' } }))
    assert.equal(response.status, 401)
    assert.equal(response.headers.get('cache-control'), 'private, no-store, max-age=0')
  }
})

test('Core write endpoints refuse requests from another origin', async () => {
  delete process.env.ABIPTOM_REVIEW_ONLY
  const response = await proxy(new NextRequest('https://www.abiptom.gw/api/messages/presence', { method: 'POST', headers: { origin: 'https://attacker.test' } }))
  assert.equal(response.status, 403)
})

test('review blocks server actions as well as cron GET requests', async () => {
  process.env.ABIPTOM_REVIEW_ONLY = '1'
  for (const [path, method] of [['/login','POST'], ['/admin/users','POST'], ['/api/cron/backup','GET'], ['/api/auth/post-login','GET'], ['/auth/confirm','GET']]) {
    const response = await proxy(new NextRequest(`http://localhost:3000${path}`, { method }))
    assert.equal(response.status, 503)
  }
})

test('Core responses prevent indexing and script execution without a nonce', async () => {
  const response = await proxy(new NextRequest('http://localhost:3000/login'))
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive')
  const csp = response.headers.get('content-security-policy')!
  assert.match(csp, /script-src 'self' 'nonce-/)
  assert.match(csp, /frame-ancestors 'none'/)
})
