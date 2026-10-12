import assert from 'node:assert/strict'
import { test } from 'node:test'
import { existsSync } from 'node:fs'
import sitemap from '../app/sitemap'
import { getCaseStudy } from '../lib/case-studies'

test('o sitemap inclui apenas páginas públicas existentes e todos os serviços', () => {
  const routes = sitemap()
  const paths = routes.map(route => new URL(route.url).pathname)
  assert.ok(paths.includes('/servicos/desenvolvimento-web'))
  assert.ok(paths.includes('/servicos/social-media'))
  assert.ok(paths.includes('/blog/branding-unido-amae-guine-bissau'))
  assert.ok(!paths.includes('/servicos/web-design'))
  for (const path of paths) {
    const publishedCase = path.startsWith('/blog/') && getCaseStudy(path.split('/')[2])
    assert.ok(existsSync(`app${path === '/' ? '' : path}/page.tsx`) || (publishedCase && existsSync('app/blog/[slug]/page.tsx')), path)
    assert.ok(!path.startsWith('/admin'))
  }
})

test('o sitemap não inventa datas de alteração', () => {
  for (const route of sitemap()) assert.equal(route.lastModified, undefined)
})
