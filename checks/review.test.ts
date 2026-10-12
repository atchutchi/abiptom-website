import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { NextRequest } from 'next/server'
import { proxy } from '../proxy'
import { assertReviewServer } from '../scripts/assert-review-server'
import config from '../playwright.config'

const previous = process.env.ABIPTOM_REVIEW_ONLY
afterEach(() => {
  if (previous === undefined) delete process.env.ABIPTOM_REVIEW_ONLY
  else process.env.ABIPTOM_REVIEW_ONLY = previous
})

test('browser tests never reuse an existing server, including outside CI', () => {
  assert.equal((config.webServer as { reuseExistingServer: boolean }).reuseExistingServer, false)
  assert.equal(config.globalSetup, './scripts/assert-review-server.ts')
})

test('review assertion rejects ordinary servers before any browser tests or writes', async () => {
  delete process.env.ABIPTOM_REVIEW_ONLY
  let reads = 0
  const read = (async (url: RequestInfo | URL, options?: RequestInit) => {
    reads++
    assert.equal(options?.method, 'GET')
    assert.equal(new URL(String(url)).pathname, '/api/review-status')
    return proxy(new NextRequest(url, { method: 'GET' }))
  }) as typeof fetch
  await assert.rejects(assertReviewServer('http://localhost:3000', read), /sem bloqueio/)
  assert.equal(reads, 1)
  process.env.ABIPTOM_REVIEW_ONLY = '1'
  await assertReviewServer('http://localhost:3000', read)
})

test('review assertion refuses public origins and unmarked successful responses', async () => {
  const read = (async () => new Response(JSON.stringify({ reviewOnly: true }))) as typeof fetch
  await assert.rejects(assertReviewServer('https://www.abiptom.gw', read), /local/)
  await assert.rejects(assertReviewServer('http://localhost:3000', read), /sem bloqueio/)
})

test('local review refuses all API writes before integration code runs', async () => {
  process.env.ABIPTOM_REVIEW_ONLY = '1'
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
    const response = await proxy(new NextRequest('http://localhost:3000/api/contact', { method }))
    assert.equal(response.status, 503)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  }
})
