import assert from 'node:assert/strict'
import { afterEach, mock, test } from 'node:test'
import { submitChatLead } from '../lib/chat/submit-lead'

afterEach(() => mock.restoreAll())
const lead = { name: 'Pessoa Teste', email: 'test@example.test', interest: 'Website' }

test('lead capture reports failure when the server rejects it', async () => {
  mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 502 }))
  assert.equal(await submitChatLead(lead), false)
})

test('lead capture reports failure when the network fails', async () => {
  mock.method(globalThis, 'fetch', async () => { throw new Error('Offline') })
  assert.equal(await submitChatLead(lead), false)
})

test('lead capture confirms only a successful server response', async () => {
  let submitted: RequestInit | undefined
  mock.method(globalThis, 'fetch', async (_url: RequestInfo | URL, options?: RequestInit) => {
    submitted = options
    return new Response('{}', { status: 200 })
  })
  assert.equal(await submitChatLead(lead), true)
  assert.equal(submitted?.method, 'POST')
  assert.equal(JSON.parse(submitted?.body as string).email, lead.email)
})
