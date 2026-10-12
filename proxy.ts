import { buildContentSecurityPolicy } from './lib/security-csp.mjs'
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
function buildCSP(): string {
  return buildContentSecurityPolicy({
    development: process.env.NODE_ENV !== 'production',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  })
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
  if (request.nextUrl.pathname === '/api/review-status' && ['GET', 'HEAD'].includes(request.method)) {
    const reviewOnly = process.env.ABIPTOM_REVIEW_ONLY === '1'
    return NextResponse.json({ reviewOnly }, {
      status: reviewOnly ? 200 : 404,
      headers: { 'Cache-Control': 'no-store', 'x-abiptom-review-only': reviewOnly ? '1' : '0' },
    })
  }
  if (process.env.ABIPTOM_REVIEW_ONLY === '1' &&
      request.nextUrl.pathname.startsWith('/api/') &&
      !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return NextResponse.json({ error: 'Operações de escrita desactivadas nesta revisão local.' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    })
  }
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
