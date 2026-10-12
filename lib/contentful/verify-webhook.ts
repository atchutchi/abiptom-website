import { createHmac, timingSafeEqual } from 'node:crypto'
import { escape } from 'node:querystring'

export const isSigningSecret = (secret: string) => /^[0-9a-zA-Z+/=_-]{64}$/.test(secret)

/** Contentful's canonical request contract; no parsed/reserialised JSON. */
export function verifyWebhook(request: Request, body: string, secret: string, now = Date.now()): boolean {
  const signature = request.headers.get('x-contentful-signature') ?? ''
  const timestamp = request.headers.get('x-contentful-timestamp') ?? ''
  const signedHeaders = request.headers.get('x-contentful-signed-headers') ?? ''
  if (!isSigningSecret(secret) || !/^[a-f0-9]{64}$/.test(signature) || !/^\d{13}$/.test(timestamp)) return false
  const age = now - Number(timestamp)
  if (age >= 30_000 || age < -5_000) return false
  const names = signedHeaders.split(',')
  if (new Set(names).size !== names.length ||
      names.some(name => !/^[a-z0-9-]+$/.test(name) || !request.headers.has(name)) ||
      names.includes('x-contentful-signature') ||
      !names.includes('x-contentful-timestamp') || !names.includes('x-contentful-signed-headers')) return false
  const orderedNames = [...names].sort()
  if (orderedNames.join(',') !== signedHeaders) return false
  const url = new URL(request.url)
  const [pathname, query] = `${url.pathname}${url.search}`.split('?')
  // Match getNormalizedEncodedURI in Contentful's node-apps-toolkit.
  const path = encodeURI(query ? `${pathname}?${escape(query)}` : pathname)
  const headers = orderedNames.map(name => `${name}:${request.headers.get(name)!.trim()}`).join(';')
  const expected = createHmac('sha256', secret).update([request.method, path, headers, body].join('\n')).digest()
  return timingSafeEqual(Buffer.from(signature, 'hex'), expected)
}
