/** Política partilhada pelo Next.js e pelo proxy, sem origens divergentes. */
export function buildContentSecurityPolicy({ development = false, supabaseUrl = 'https://smakmuyzyaoifhpjapkj.supabase.co' } = {}) {
  const supabaseOrigin = new URL(supabaseUrl).origin
  const scripts = ["'self'", "'unsafe-inline'", ...(development ? ["'unsafe-eval'"] : []),
    'https://www.googletagmanager.com', 'https://www.google-analytics.com',
    'https://connect.facebook.net', 'https://www.youtube.com', 'https://maps.googleapis.com']
  const connect = ["'self'", 'https://www.google-analytics.com', 'https://*.google-analytics.com',
    'https://analytics.google.com', 'https://www.googletagmanager.com',
    'https://www.facebook.com', 'https://connect.facebook.net', 'https://maps.googleapis.com',
    supabaseOrigin, supabaseOrigin.replace('https:', 'wss:')]
  const images = ["'self'", 'data:', 'blob:', 'https://www.google-analytics.com',
    'https://www.facebook.com', 'https://maps.googleapis.com', 'https://*.googleapis.com',
    'https://img.youtube.com', 'https://*.ytimg.com', 'https://images.ctfassets.net', supabaseOrigin]
  return [
    "default-src 'self'", `script-src ${scripts.join(' ')}`, `connect-src ${connect.join(' ')}`,
    `img-src ${images.join(' ')}`, `media-src 'self' blob: ${supabaseOrigin}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
    "frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com",
    "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'self'",
    ...(!development ? ['upgrade-insecure-requests'] : []),
  ].join('; ')
}
