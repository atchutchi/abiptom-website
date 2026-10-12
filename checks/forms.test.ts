import assert from 'node:assert/strict'
import { afterEach, beforeEach, mock, test } from 'node:test'
import { POST as contact } from '../app/api/contact/route'
import { POST as careers } from '../app/api/careers/route'

const previous = { site: process.env.NEXT_PUBLIC_SITE_URL, mode: process.env.NODE_ENV }
beforeEach(() => {
  Object.assign(process.env, { NODE_ENV: 'production' })
  process.env.NEXT_PUBLIC_SITE_URL = 'https://www.abiptom.gw'
  mock.method(globalThis, 'fetch', async () => { throw new Error('External requests disabled') })
})
afterEach(() => {
  mock.restoreAll()
  for (const [key, value] of [['NEXT_PUBLIC_SITE_URL', previous.site], ['NODE_ENV', previous.mode]]) {
    if (value === undefined) delete process.env[key!]
    else process.env[key!] = value
  }
})

let requestNumber = 0
function request(body: string, origin = 'https://www.abiptom.gw', csrf = true, ip = `192.0.2.${++requestNumber}`) {
  return new Request('https://www.abiptom.gw/api/contact', {
    method: 'POST', body,
    headers: { origin, 'content-type': 'application/json', 'x-forwarded-for': ip, ...(csrf ? {
      cookie: 'csrf=test-token', 'x-csrf-token': 'test-token',
    } : {}) },
  })
}

for (const [name, handler] of [['contact', contact], ['careers', careers]] as const) {
  test(`${name} also rate-limits repeated invalid forms`, async () => {
    const limit = name === 'contact' ? 5 : 3
    for (let index = 0; index < limit; index++) {
      assert.equal((await handler(request('{}', undefined, true, '192.0.2.200'))).status, 400)
    }
    assert.equal((await handler(request('{}', undefined, true, '192.0.2.200'))).status, 429)
  })
  test(`${name} rejects another host before processing a form`, async () => {
    const response = await handler(request('{}', 'https://evil.test')).catch(() => null)
    assert.equal(response?.status, 403)
  })
  test(`${name} still rejects missing CSRF protection`, async () => {
    const response = await handler(request('{}', undefined, false)).catch(() => null)
    assert.equal(response?.status, 403)
  })
  for (const body of ['{broken', 'null', '[]', '{"firstName":{"value":"test"}}']) {
    test(`${name} returns a client error for invalid payload ${body}`, async () => {
      const response = await handler(request(body)).catch(() => null)
      assert.equal(response?.status, 400)
    })
  }
}
