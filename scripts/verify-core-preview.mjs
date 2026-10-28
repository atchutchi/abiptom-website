import assert from 'node:assert/strict'

const base = process.env.ABIPTOM_PREVIEW_URL || 'http://127.0.0.1:3100'
if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('A verificação requer o servidor local de teste.')
const status = await fetch(new URL('/api/review-status', base), { signal: AbortSignal.timeout(10_000) })
assert.equal(status.headers.get('x-abiptom-review-only'), '1')
assert.equal((await status.json()).reviewOnly, true)
let count = 0
async function check(path, expected, options = {}) {
  const response = await fetch(new URL(path, base), { redirect: 'manual', ...options, signal: AbortSignal.timeout(55_000) })
  assert.equal(response.status, expected, `${options.method || 'GET'} ${path}`)
  count++
  return response
}
const login = await check('/login', 200)
const html = await login.text()
assert.ok(html.includes('Área de acesso restrito'))
assert.ok(html.includes('início de sessão está desactivado'))
assert.equal(login.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive')
assert.match(login.headers.get('content-security-policy'), /nonce-/)
assert.match(login.headers.get('cache-control'), /no-store/)
for (const path of ['/admin', '/admin/users', '/admin/projects/a.png', '/staff/me/dashboard']) {
  const response = await check(path, 307, { headers: { cookie: 'abiptom-core-auth=fake; role=ca' } })
  assert.equal(new URL(response.headers.get('location'), base).pathname, '/login')
}
for (const path of ['/api/users', '/api/invoices/pdf/1', '/api/invoices/export', '/api/invoices/payments/1/receipt', '/api/reports/monthly', '/api/reports/pl', '/api/salary/receipt/1']) {
  const response = await check(path, 401, { headers: { cookie: 'abiptom-core-auth=fake; role=ca' } })
  assert.equal((await response.json()).error, 'Não autenticado')
}
for (const path of ['/login', '/admin/users', '/api/users', '/api/contact', '/api/messages/presence']) {
  await check(path, 503, { method: 'POST', headers: { origin: 'https://attacker.test' } })
}
for (const path of ['/api/cron/backup', '/api/cron/messages-email', '/api/cron/monthly-report', '/auth/confirm', '/api/auth/post-login']) await check(path, 503)
await check('/api/admin/seed', 404)
const css = await check('/core-assets/core.css', 200)
assert.ok((await css.text()).includes('--brand-gold'))
console.log(`${count} verificações HTTP passaram. Sem autenticação de produção ou operações externas.`)
