import assert from 'node:assert/strict'
import { beforeEach, afterEach, test } from 'node:test'
import { CONSENT_KEY, saveConsent, readConsent, startMeasurement, trackPageView, trackLead, revokeMeasurement } from '../lib/tracking'

let scripts: unknown[]
let pixels: unknown[][]
beforeEach(() => {
  scripts = []
  pixels = []
  const storage = new Map<string, string>()
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) },
    location: { origin: 'https://www.abiptom.gw', hostname: 'www.abiptom.gw', pathname: '/contacto', href: 'https://www.abiptom.gw/contacto?email=pessoa@example.test' },
    fbq: (...args: unknown[]) => pixels.push(args), dataLayer: [],
  } })
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {
    referrer: 'https://example.test/origem?email=pessoa@example.test', cookie: '',
    getElementById: () => null, createElement: () => ({}), head: { appendChild: (script: unknown) => scripts.push(script) },
  } })
  saveConsent(false)
  revokeMeasurement()
  pixels = []
})
afterEach(() => {
  delete (globalThis as { window?: Window }).window
  delete (globalThis as { document?: Document }).document
})

test('nenhum SDK ou lead é carregado sem consentimento', () => {
  startMeasurement('G-TEST123456')
  trackLead('contact_form')
  assert.equal(scripts.length, 0)
  assert.equal(pixels.length, 0)
})

test('uma escolha expirada exige nova aceitação', () => {
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 1, accepted: true, savedAt: Date.now() - 181 * 86400000 }))
  assert.equal(readConsent(), null)
  startMeasurement()
  assert.equal(scripts.length, 0)
})

test('o Google recebe contexto sem dados pessoais nos parâmetros da página', () => {
  saveConsent(true)
  startMeasurement('G-TEST123456')
  trackPageView('/contacto', 'G-TEST123456')
  trackLead('contact_form')
  const calls = window.dataLayer.map(args => Array.from(args as ArrayLike<unknown>))
  const config = calls.find(args => args[0] === 'config')!
  assert.equal((config[2] as Record<string, unknown>).page_location, 'https://www.abiptom.gw/contacto')
  assert.equal((config[2] as Record<string, unknown>).page_referrer, 'https://example.test/origem')
  const lead = calls.find(args => args[1] === 'generate_lead')!
  assert.equal((lead[2] as Record<string, unknown>).page_location, 'https://www.abiptom.gw/contacto')
  assert.ok(!JSON.stringify(calls).includes('pessoa@example.test'))
})

test('retirar o consentimento desativa por completo a medição Google', () => {
  saveConsent(true)
  startMeasurement('G-TEST123456')
  saveConsent(false)
  revokeMeasurement()
  assert.equal((window as unknown as Record<string, unknown>)['ga-disable-G-TEST123456'], true)
})
