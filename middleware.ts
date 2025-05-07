import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Obtém a resposta
  const response = NextResponse.next()

  // Adicionar headers de segurança
  // Prevenir MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Prevenir clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  
  // Proteção XSS básica
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Política de referenciamento
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // HTTP Strict Transport Security
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://cdn.emailjs.com; " +
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://api.emailjs.com; " +
    "img-src 'self' data: https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "frame-src 'self';"
  )
  
  // Retorna a resposta com os headers adicionados
  return response
}

// Configure para quais rotas o middleware deve ser executado
export const config = {
  matcher: [
    // Executar em todas as rotas exceto assets e API
    '/((?!_next/static|_next/image|favicon.ico|images|fonts|api).*)',
  ],
} 