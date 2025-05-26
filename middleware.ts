import { NextResponse, NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()
  
  // Tentar atualizar a sessão do Supabase, mas não falhar se houver erro
  try {
    // Verificar se as variáveis de ambiente existem antes de tentar usar o Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      response = await updateSession(request)
    }
  } catch (error) {
    console.warn('Erro ao atualizar sessão do Supabase:', error)
    // Continuar com a resposta padrão se houver erro
  }

  // Adicionar headers de segurança
  // Prevenir MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Proteção XSS básica
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Política de referenciamento
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // HTTP Strict Transport Security
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // Content Security Policy atualizada para permitir YouTube, Google Maps e Supabase Storage
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://cdn.emailjs.com https://www.youtube.com https://*.youtube.com https://maps.googleapis.com https://*.googleapis.com; " +
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://api.emailjs.com https://maps.googleapis.com https://*.googleapis.com https://smakmuyzyaoifhpjapkj.supabase.co https://smakmuyzyaoifhpjapkj.supabase.co/storage/v1/* wss://smakmuyzyaoifhpjapkj.supabase.co; " +
    "img-src 'self' data: blob: https://www.google-analytics.com https://maps.googleapis.com https://*.googleapis.com https://img.youtube.com https://*.ytimg.com https://i.ytimg.com https://smakmuyzyaoifhpjapkj.supabase.co https://smakmuyzyaoifhpjapkj.supabase.co/storage/v1/*; " +
    "media-src 'self' blob: https://smakmuyzyaoifhpjapkj.supabase.co https://smakmuyzyaoifhpjapkj.supabase.co/storage/v1/*; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; " +
    "frame-src 'self' https://www.google.com https://*.google.com https://www.youtube.com https://*.youtube.com https://youtube.com https://maps.google.com https://www.google.com/maps; " +
    "object-src 'none';"
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