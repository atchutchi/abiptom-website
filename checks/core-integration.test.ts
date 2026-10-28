import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getCoreRouteKind, isAllowedCoreOrigin, shouldBlockPreviewRequest } from '../lib/core-request-policy'

test('Core routes use exact boundaries and include every private API family', () => {
  for (const path of ['/admin', '/admin/users', '/staff/me/dashboard']) assert.equal(getCoreRouteKind(path), 'private-page')
  for (const path of ['/api/users', '/api/invoices/pdf/1', '/api/reports/monthly', '/api/salary/receipt/1', '/api/messages/presence']) assert.equal(getCoreRouteKind(path), 'private-api')
  for (const path of ['/login', '/forgot-password', '/update-password', '/auth/confirm']) assert.equal(getCoreRouteKind(path), 'auth')
  assert.equal(getCoreRouteKind('/api/auth/post-login'), 'private-api')
  assert.equal(getCoreRouteKind('/api/cron/backup'), 'cron')
  assert.equal(getCoreRouteKind('/api/admin/seed'), 'disabled')
  for (const path of ['/', '/administer', '/staffing', '/api/chat', '/api/contact', '/login-other', '/api/users-extra']) assert.equal(getCoreRouteKind(path), null)
})

test('Core write origins must match the configured origin exactly', () => {
  const origin = 'https://www.abiptom.gw'
  assert.equal(isAllowedCoreOrigin(origin, origin), true)
  for (const hostile of [null, 'null', 'https://attacker.test', 'https://www.abiptom.gw.attacker.test', 'http://www.abiptom.gw', 'https://abiptom.gw']) assert.equal(isAllowedCoreOrigin(hostile, origin), false)
})

test('preview refuses mutations on pages and APIs including server actions', () => {
  for (const path of ['/login', '/admin/users', '/api/users', '/api/contact', '/auth/confirm', '/']) {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) assert.equal(shouldBlockPreviewRequest(path, method, true), true)
  }
  for (const path of ['/api/cron/backup', '/api/cron/monthly-report', '/auth/confirm', '/api/auth/post-login']) assert.equal(shouldBlockPreviewRequest(path, 'GET', true), true)
  assert.equal(shouldBlockPreviewRequest('/login', 'GET', true), false)
  assert.equal(shouldBlockPreviewRequest('/api/users', 'GET', true), false)
  assert.equal(shouldBlockPreviewRequest('/login', 'POST', false), false)
})
