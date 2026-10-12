/** One explicit host; aliases and preview domains are not automatically trusted. */
export function getSiteOrigin(): string {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abiptom.gw')
  const localDevelopment = process.env.NODE_ENV !== 'production' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if (url.username || url.password ||
      (url.protocol !== 'https:' && !(localDevelopment && url.protocol === 'http:'))) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTPS origin without credentials')
  }
  return url.origin
}

export function isAllowedFormOrigin(origin: string | null): boolean {
  return origin === getSiteOrigin() ||
    (process.env.NODE_ENV !== 'production' && origin === 'http://localhost:3000')
}
