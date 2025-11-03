import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Função para validar a assinatura do webhook do Contentful
function verifyContentfulWebhook(
  body: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('base64')
  
  return hash === signature
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-contentful-signature')
    const topic = request.headers.get('x-contentful-topic')
    
    // Ler o body como texto para validação
    const body = await request.text()
    
    // Verificar assinatura (se configurada)
    const webhookSecret = process.env.CONTENTFUL_WEBHOOK_SECRET
    
    // Verificar assinatura para segurança (opcional se não configurado)
    if (webhookSecret && signature) {
      const isValid = verifyContentfulWebhook(body, signature, webhookSecret)
      
      if (!isValid) {
        console.error('❌ Invalid webhook signature')
        console.log('📋 Debug: Secret length:', webhookSecret.length)
        console.log('📋 Debug: Signature length:', signature.length)
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
      console.log('✅ Webhook signature verified')
    } else {
      console.warn('⚠️ Webhook signature validation skipped (not configured)')
    }
    
    // Parse do body
    const data = JSON.parse(body)
    
    console.log('📝 Contentful Webhook received:', {
      topic,
      entryId: data?.sys?.id,
      contentType: data?.sys?.contentType?.sys?.id,
      timestamp: new Date().toISOString()
    })
    
    // Verificar se é um Blog Post
    if (data?.sys?.contentType?.sys?.id === 'abiptomBlog') {
      console.log('📰 Blog post updated:', data?.fields?.title?.['pt'] || data?.fields?.title)
      
      // Aqui você pode adicionar lógica adicional, como:
      // - Limpar cache
      // - Notificar equipe
      // - Gerar sitemap
      // - etc.
    }
    
    // Disparar revalidação do Next.js (ISR)
    // Isso vai regenerar as páginas estáticas
    if (process.env.REVALIDATE_SECRET) {
      const revalidateUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}&path=/blog`
      
      try {
        await fetch(revalidateUrl, { method: 'POST' })
        console.log('✅ Revalidation triggered')
      } catch (error) {
        console.error('❌ Revalidation failed:', error)
      }
    }
    
    return NextResponse.json({
      message: 'Webhook processed successfully',
      topic,
      received: true
    })
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET para testar se o endpoint está acessível
export async function GET() {
  return NextResponse.json({
    message: 'Contentful webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}

