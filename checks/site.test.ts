import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { getSiteOrigin, isAllowedFormOrigin } from '../lib/site'

const previous = { site: process.env.NEXT_PUBLIC_SITE_URL, mode: process.env.NODE_ENV }
afterEach(() => {
  for (const [key, value] of [['NEXT_PUBLIC_SITE_URL', previous.site], ['NODE_ENV', previous.mode]]) {
    if (value === undefined) delete process.env[key!]
    else process.env[key!] = value
  }
})

test('default canonical host is the published www host', () => {
  delete process.env.NEXT_PUBLIC_SITE_URL
  assert.equal(getSiteOrigin(), 'https://www.abiptom.gw')
})

test('site URL paths and trailing slashes are normalized to the origin', () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://www.abiptom.gw/path/'
  assert.equal(getSiteOrigin(), 'https://www.abiptom.gw')
})

test('production accepts only the configured exact origin', () => {
  Object.assign(process.env, { NODE_ENV: 'production' })
  process.env.NEXT_PUBLIC_SITE_URL = 'https://www.abiptom.gw/'
  assert.equal(isAllowedFormOrigin('https://www.abiptom.gw'), true)
  for (const origin of [null, 'null', 'https://abiptom.gw', 'https://www.abiptom.gw.evil.test', 'http://localhost:3000']) {
    assert.equal(isAllowedFormOrigin(origin), false)
  }
})

test('local development permits loopback but not arbitrary network origins', () => {
  Object.assign(process.env, { NODE_ENV: 'development' })
  process.env.NEXT_PUBLIC_SITE_URL = 'https://www.abiptom.gw'
  assert.equal(isAllowedFormOrigin('http://localhost:3000'), true)
  assert.equal(isAllowedFormOrigin('http://192.168.17.16:3000'), false)
  assert.equal(isAllowedFormOrigin('https://evil.test'), false)
})

test('production refuses HTTP or credential-bearing canonical URLs', () => {
  Object.assign(process.env, { NODE_ENV: 'production' })
  for (const url of ['http://www.abiptom.gw', 'https://user:password@www.abiptom.gw', 'not-a-url']) {
    process.env.NEXT_PUBLIC_SITE_URL = url
    assert.throws(() => getSiteOrigin())
  }
})
