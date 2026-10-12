import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'
import { caseStudies } from '../lib/case-studies'
import sitemap from '../app/sitemap'

test('os casos publicados têm evidência pública, captura e uma rota no sitemap', () => {
  assert.equal(caseStudies.length, 3)
  const slugs = new Set(caseStudies.map(item => item.slug))
  assert.equal(slugs.size, caseStudies.length)
  for (const item of caseStudies) {
    assert.ok(item.problem && item.work && item.result)
    assert.ok(item.sources.some(source => source.url === item.siteUrl))
    assert.ok(existsSync(`public${item.image}`), item.image)
    assert.ok(sitemap().some(route => new URL(route.url).pathname === `/portfolio/${item.slug}`))
    assert.ok(!item.siteUrl.includes('login') && !item.siteUrl.includes('call-center'))
  }
})
