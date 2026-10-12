import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'
import { caseStudies } from '../lib/case-studies'
import sitemap from '../app/sitemap'

test('os cinco projectos têm fontes e artigos no blog sem duplicar rotas do portfólio', () => {
  assert.equal(caseStudies.length, 5)
  const slugs = new Set(caseStudies.map(item => item.slug))
  assert.equal(slugs.size, caseStudies.length)
  for (const item of caseStudies) {
    assert.ok(item.problem && item.work && item.result)
    assert.ok(item.sources.some(source => source.url === item.siteUrl))
    assert.ok(existsSync(`public${item.image}`), item.image)
    assert.ok(existsSync(`public${item.portfolioImage}`), item.portfolioImage)
    assert.ok(sitemap().some(route => new URL(route.url).pathname === `/blog/${item.slug}`))
    assert.ok(!sitemap().some(route => new URL(route.url).pathname === `/portfolio/${item.slug}`))
  }
  assert.ok(slugs.has('abiptom-admin'))
  assert.ok(slugs.has('inunde-call-center'))
})
