export const META_PIXEL_ID = '2017555742213828'
export const CONSENT_KEY = 'abiptom.measurement.v1'
export const PREFERENCES_EVENT = 'abiptom:cookie-preferences'
const MAX_AGE = 180 * 24 * 60 * 60 * 1000
type Pixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue?: unknown[][]
  push?: Pixel
  loaded?: boolean
  version?: string
}
declare global {
  interface Window {
    fbq?: Pixel
    _fbq?: Pixel
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

let volatileChoice: boolean | null = null
let volatileSavedAt = 0
let initialized = false
let lastPath: string | null = null
let activeGAId: string | undefined

export function readConsent(): boolean | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY)
    if (!raw) return Date.now() - volatileSavedAt <= MAX_AGE ? volatileChoice : null
    const value = JSON.parse(raw)
    if (value.version !== 1 || typeof value.accepted !== 'boolean' || typeof value.savedAt !== 'number' ||
        !Number.isFinite(value.savedAt) || value.savedAt > Date.now() + 60000 || Date.now() - value.savedAt > MAX_AGE) return null
    return value.accepted
  } catch { return Date.now() - volatileSavedAt <= MAX_AGE ? volatileChoice : null }
}

export function saveConsent(accepted: boolean) {
  volatileChoice = accepted
  volatileSavedAt = Date.now()
  try { window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 1, accepted, savedAt: volatileSavedAt })) } catch { /* Recusar continua possível sem armazenamento. */ }
}

export function nextConsentCheckDelay(): number {
  let savedAt = volatileSavedAt
  try { savedAt = JSON.parse(window.localStorage.getItem(CONSENT_KEY) || '{}').savedAt ?? savedAt } catch { /* Usar a escolha temporária. */ }
  return Math.max(1, Math.min(savedAt + MAX_AGE - Date.now(), 2_147_000_000))
}

function pageContext(path = window.location.pathname) {
  let referrer = ''
  try { const url = new URL(document.referrer); referrer = url.origin + url.pathname } catch { /* Uma visita directa não tem referenciador. */ }
  return { page_path: path, page_location: window.location.origin + path, page_referrer: referrer }
}

function appendScript(id: string, src: string) {
  if (document.getElementById(id)) return
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

export function startMeasurement(gaId?: string) {
  if (readConsent() !== true || initialized) return
  initialized = true
  if (!window.fbq) {
    const pixel: Pixel = (...args) => {
      if (pixel.callMethod) pixel.callMethod(...args)
      else pixel.queue!.push(args)
    }
    pixel.queue = []
    pixel.push = pixel
    pixel.loaded = true
    pixel.version = '2.0'
    window.fbq = pixel
    window._fbq = pixel
  }
  window.fbq('consent', 'grant')
  window.fbq('set', 'autoConfig', false, META_PIXEL_ID)
  window.fbq('init', META_PIXEL_ID)
  appendScript('abiptom-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js')
  if (gaId && /^G-[A-Z0-9]{6,15}$/i.test(gaId)) {
    activeGAId = gaId
    ;(window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = false
    window.dataLayer = window.dataLayer || []
    // gtag espera arguments, não um array simples.
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function () { window.dataLayer.push(arguments) }
    window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
    window.gtag('js', new Date())
    window.gtag('set', pageContext())
    window.gtag('config', gaId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, ...pageContext() })
    appendScript('abiptom-google-analytics', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`)
  }
}

export function trackPageView(path: string, gaId?: string) {
  if (readConsent() !== true || !initialized || path.startsWith('/admin') || path === lastPath) return
  lastPath = path
  window.fbq?.('trackSingle', META_PIXEL_ID, 'PageView')
  if (gaId && activeGAId === gaId) {
    window.gtag?.('set', pageContext(path))
    window.gtag?.('event', 'page_view', { ...pageContext(path), send_to: gaId })
  }
}

export function trackLead(source: 'contact_form' | 'chatbot') {
  if (typeof window === 'undefined' || readConsent() !== true || !initialized) return
  try {
    window.fbq?.('trackSingle', META_PIXEL_ID, 'Lead', { content_name: source })
    if (activeGAId) window.gtag?.('event', 'generate_lead', { method: source, ...pageContext(), send_to: activeGAId })
  } catch { /* A medição nunca deve impedir a confirmação de um contacto. */ }
}

export function trackContactClick(channel: 'whatsapp' | 'phone' | 'email') {
  if (readConsent() !== true || !initialized) return
  try {
    window.fbq?.('trackSingle', META_PIXEL_ID, 'Contact', { content_name: channel })
    if (activeGAId) window.gtag?.('event', 'contact_click', { channel, ...pageContext(), send_to: activeGAId })
  } catch { /* O link continua a funcionar se o fornecedor estiver indisponível. */ }
}

export function revokeMeasurement() {
  if (activeGAId) (window as unknown as Record<string, unknown>)[`ga-disable-${activeGAId}`] = true
  window.fbq?.('consent', 'revoke')
  window.gtag?.('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
  initialized = false
  lastPath = null
  activeGAId = undefined
  // Eliminar cookies acessíveis ao site, incluindo os definidos no domínio pai.
  const hostParts = window.location.hostname.split('.')
  const domains = ['', ...hostParts.map((_, i) => hostParts.slice(i).join('.')).filter(host => host.includes('.'))]
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0]
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$)|_fbp$|_fbc$)/.test(name)) continue
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax`
  }
}
