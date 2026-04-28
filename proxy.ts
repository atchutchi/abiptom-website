import { NextResponse, NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

/**
 * Middleware de Segurança
 * 
 * Implementa:
 * - Headers de segurança HTTP
 * - Content Security Policy (CSP)
 * - Proteção contra ataques comuns
 * - Gestão de sessão Supabase
 */

// Configuração do CSP baseada no ambiente
function buildCSP(nonce?: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://smakmuyzyaoifhpjapkj.supabase.co'
  
  // Em produção, idealmente usaríamos nonces, mas por compatibilidade mantemos unsafe-inline
  // TODO: Migrar para nonces quando possível
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'", // Necessário para Next.js e GA
    "'unsafe-eval'",   // Necessário para algumas libs
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://ssl.google-analytics.com',
    'https://www.youtube.com',
    'https://*.youtube.com',
    'https://maps.googleapis.com',
    'https://*.googleapis.com',
  ].join(' ')

  const connectSrc = [
    "'self'",
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://maps.googleapis.com',
    'https://*.googleapis.com',
    supabaseUrl,
    `${supabaseUrl}/storage/v1/*`,
    `wss://${supabaseUrl.replace('https://', '')}`,
  ].join(' ')

  const imgSrc = [
    "'self'",
    'data:',
    'blob:',
    'https://www.google-analytics.com',
    'https://maps.googleapis.com',
    'https://*.googleapis.com',
    'https://img.youtube.com',
    'https://*.ytimg.com',
    'https://i.ytimg.com',
    supabaseUrl,
    `${supabaseUrl}/storage/v1/*`,
  ].join(' ')

  const mediaSrc = [
    "'self'",
    'blob:',
    supabaseUrl,
    `${supabaseUrl}/storage/v1/*`,
  ].join(' ')

  const styleSrc = [
    "'self'",
    "'unsafe-inline'", // Necessário para styled-components e Tailwind
    'https://fonts.googleapis.com',
    'https://*.googleapis.com',
  ].join(' ')

  const fontSrc = [
    "'self'",
    'https://fonts.gstatic.com',
    'https://fonts.googleapis.com',
  ].join(' ')

  const frameSrc = [
    "'self'",
    'https://www.google.com',
    'https://*.google.com',
    'https://www.youtube.com',
    'https://*.youtube.com',
    'https://youtube.com',
    'https://maps.google.com',
    'https://www.google.com/maps',
  ].join(' ')

  return [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `connect-src ${connectSrc}`,
    `img-src ${imgSrc}`,
    `media-src ${mediaSrc}`,
    `style-src ${styleSrc}`,
    `font-src ${fontSrc}`,
    `frame-src ${frameSrc}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'self'`,
    `upgrade-insecure-requests`,
  ].join('; ')
}

// Headers de segurança adicionais
function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevenir MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Proteção XSS (legado, mas ainda útil para navegadores antigos)
    'X-XSS-Protection': '1; mode=block',
    
    // Prevenir clickjacking
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Política de referenciamento
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // HTTP Strict Transport Security
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Permissions Policy (anteriormente Feature Policy)
    'Permissions-Policy': [
      'accelerometer=()',
      'camera=()',
      'geolocation=(self)',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=()',
      'usb=()',
    ].join(', '),
    
    // Cross-Origin policies
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    
    // Content Security Policy
    'Content-Security-Policy': buildCSP(),
  }
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next()
  
  // Tentar atualizar a sessão do Supabase
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      response = await updateSession(request)
    }
  } catch (error) {
    console.warn('Erro ao atualizar sessão do Supabase:', error)
    // Continuar com a resposta padrão se houver erro
  }

  // Adicionar headers de segurança
  const securityHeaders = getSecurityHeaders()
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }

  // Headers adicionais baseados no tipo de request
  const pathname = request.nextUrl.pathname
  
  // Para assets estáticos, adicionar cache headers
  if (pathname.startsWith('/_next/static') || pathname.startsWith('/images') || pathname.startsWith('/fonts')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Para páginas dinâmicas, evitar cache de dados sensíveis
  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

// Configure para quais rotas o middleware deve ser executado
export const config = {
  matcher: [
    // Executar em todas as rotas exceto assets estáticos e API
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
