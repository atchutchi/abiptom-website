import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import ChatAdmin from '../app/admin/chat/page'
import SupabaseTest from '../app/admin/supabase-test/page'

test('unfinished chat administration is not publicly available', () => {
  assert.throws(() => renderToString(createElement(ChatAdmin)), /NEXT_HTTP_ERROR_FALLBACK;404/)
})

test('Supabase diagnostics are not publicly available', () => {
  assert.throws(() => renderToString(createElement(SupabaseTest)), /NEXT_HTTP_ERROR_FALLBACK;404/)
})
