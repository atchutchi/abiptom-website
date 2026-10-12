import assert from 'node:assert/strict'
import { afterEach, beforeEach, test, mock } from 'node:test'
import { createHmac } from 'node:crypto'
import { NextRequest } from 'next/server'
import { POST as webhook } from '../app/api/contentful-webhook/route'
import { GET as historyGET, POST as historyPOST } from '../app/api/chat/history/route'

const savedEnvironment = { ...process.env }
const secret = 'a'.repeat(64)
const payload = JSON.stringify({ sys: { contentType: { sys: { id: 'abiptomBlog' } } } })

beforeEach(() => {
  process.env.CONTENTFUL_WEBHOOK_SECRET = secret
  process.env.REVALIDATE_SECRET = 'test-only-revalidate-secret'
  process.env.NEXT_PUBLIC_SITE_URL = 'https://www.abiptom.gw'
  mock.method(globalThis, 'fetch', async () => { throw new Error('External requests disabled in tests') })
})

afterEach(() => {
  mock.restoreAll()
  for (const key of ['CONTENTFUL_WEBHOOK_SECRET', 'REVALIDATE_SECRET', 'NEXT_PUBLIC_SITE_URL']) {
    if (savedEnvironment[key] === undefined) delete process.env[key]
    else process.env[key] = savedEnvironment[key]
  }
})

function request(body = payload, signature?: string, timestamp = Date.now().toString()) {
  return new NextRequest('https://www.abiptom.gw/api/contentful-webhook', {
    method: 'POST', body,
    headers: signature ? { 'x-contentful-signature': signature, 'x-contentful-timestamp': timestamp, 'x-contentful-signed-headers': 'x-contentful-signed-headers,x-contentful-timestamp' } : {},
  })
}

test('webhook rejects a missing signature even when a secret exists', async () => {
  assert.equal((await webhook(request())).status, 401)
})

test('webhook is unavailable when its authentication secret is missing', async () => {
  delete process.env.CONTENTFUL_WEBHOOK_SECRET
  assert.equal((await webhook(request())).status, 503)
})

test('webhook rejects an invalid signature', async () => {
  assert.equal((await webhook(request(payload, 'invalid'))).status, 401)
})

test('authenticated malformed JSON is rejected as a client error', async () => {
  const body = '{broken'
  const timestamp = Date.now().toString()
  const signature = signed(body, timestamp)
  assert.equal((await webhook(request(body, signature, timestamp))).status, 400)
})

test('webhook does not report success when revalidation fails', async () => {
  mock.restoreAll()
  mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 503 }))
  const timestamp = Date.now().toString()
  const signature = signed(payload, timestamp)
  assert.equal((await webhook(request(payload, signature, timestamp))).status, 502)
})

test('webhook does not report success without revalidation configuration', async () => {
  delete process.env.REVALIDATE_SECRET
  const timestamp = Date.now().toString()
  const signature = signed(payload, timestamp)
  assert.equal((await webhook(request(payload, signature, timestamp))).status, 503)
})

test('authenticated webhook acknowledges successful revalidation', async () => {
  mock.restoreAll()
  let calledUrl: unknown
  let calledOptions: RequestInit | undefined
  mock.method(globalThis, 'fetch', async (url: RequestInfo | URL, options?: RequestInit) => {
    calledUrl = url
    calledOptions = options
    return new Response('{}', { status: 200 })
  })
  const timestamp = Date.now().toString()
  const signature = signed(payload, timestamp)
  assert.equal((await webhook(request(payload, signature, timestamp))).status, 200)
  assert.equal(calledUrl, 'https://www.abiptom.gw/api/revalidate')
  assert.equal(calledOptions?.redirect, 'error')
})

test('disabled conversation history never returns stored conversations', async () => {
  const response = await historyGET()
  assert.equal(response.status, 404)
  assert.equal(response.headers.get('cache-control'), 'no-store')
})

test('disabled conversation history rejects writes', async () => {
  const response = await historyPOST(new Request('https://www.abiptom.gw/api/chat/history', {
    method: 'POST', body: JSON.stringify({ messages: [{ content: 'private test data' }] }),
  }))
  assert.equal(response.status, 404)
  assert.equal(response.headers.get('cache-control'), 'no-store')
})

function signed(body: string, timestamp: string, path = '/api/contentful-webhook') {
  return createHmac('sha256', secret).update(`POST\n${path}\nx-contentful-signed-headers:x-contentful-signed-headers,x-contentful-timestamp;x-contentful-timestamp:${timestamp}\n${body}`).digest('hex')
}

test('webhook rejects expired, future and modified timestamps without calling integrations', async () => {
  for (const offset of [-30_000, 60_000]) {
    const timestamp = (Date.now() + offset).toString()
    assert.equal((await webhook(request(payload, signed(payload, timestamp), timestamp))).status, 401)
  }
  const timestamp = Date.now().toString()
  assert.equal((await webhook(request(payload, signed(payload, timestamp), (Number(timestamp) + 1).toString()))).status, 401)
})

test('webhook rejects body, path and header tampering, and the obsolete base64 format', async () => {
  const timestamp = Date.now().toString()
  const signature = signed(payload, timestamp)
  assert.equal((await webhook(request(payload + ' ', signature, timestamp))).status, 401)
  const changedPath = new NextRequest('https://www.abiptom.gw/api/other', {
    method: 'POST', body: payload, headers: request(payload, signature, timestamp).headers,
  })
  assert.equal((await webhook(changedPath)).status, 401)
  const headers = request(payload, signature, timestamp).headers
  headers.set('x-contentful-signed-headers', 'x-contentful-timestamp')
  assert.equal((await webhook(new NextRequest('https://www.abiptom.gw/api/contentful-webhook', { method: 'POST', body: payload, headers }))).status, 401)
  assert.equal((await webhook(request(payload, createHmac('sha256', secret).update(payload).digest('base64'), timestamp))).status, 401)
})
