import assert from 'node:assert/strict'
import { test } from 'node:test'
import { requireExistingSigning } from '../lib/contentful/webhook-setup'

test('webhook setup refuses missing signing configuration before any API call', async () => {
  const read = (async () => { throw new Error('No requests allowed') }) as typeof fetch
  await assert.rejects(requireExistingSigning('space', 'test-token', '', read), /incompleta/)
})

test('webhook setup only reads signing metadata and refuses absent signing', async () => {
  let calls = 0
  const read = (async (url: RequestInfo | URL, options?: RequestInit) => {
    calls++
    assert.equal(String(url), 'https://api.contentful.com/spaces/test-space/webhook_settings/signing_secret')
    assert.equal(options?.method, 'GET')
    assert.equal(options?.redirect, 'error')
    return new Response('{}', { status: 404 })
  }) as typeof fetch
  await assert.rejects(requireExistingSigning('test-space', 'test-token', 'a'.repeat(64), read), /assinatura ativa/)
  assert.equal(calls, 1)
})

test('webhook setup accepts official signing metadata without generating secrets', async () => {
  const read = (async () => new Response(JSON.stringify({ redactedValue: 'aaaa', sys: { type: 'WebhookSigningSecret' } }))) as typeof fetch
  await requireExistingSigning('test-space', 'test-token', 'a'.repeat(64), read)
})
