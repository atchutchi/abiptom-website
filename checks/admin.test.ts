import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { NextRequest } from 'next/server'
import { proxy } from '../proxy'
import SupabaseTest from '../app/(public)/admin/supabase-test/page'

test('Core chat administration is not publicly available', async () => {
  const response = await proxy(new NextRequest('http://localhost:3000/admin/chat'))
  assert.equal(response.status, 307)
  assert.equal(new URL(response.headers.get('location')!).pathname, '/login')
})

test('Supabase diagnostics are not publicly available', () => {
  assert.throws(() => renderToString(createElement(SupabaseTest)), /NEXT_HTTP_ERROR_FALLBACK;404/)
})
