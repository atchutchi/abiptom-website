import { NextRequest, NextResponse } from 'next/server'
import { isSigningSecret, verifyWebhook } from '@/lib/contentful/verify-webhook'
import { getSiteOrigin } from '@/lib/site'

const response = (error: string, status: number) =>
  NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request: NextRequest) {
  const secret = process.env.CONTENTFUL_WEBHOOK_SECRET
  if (!secret || !isSigningSecret(secret)) return response('Webhook authentication is not configured', 503)

  try {
    const body = await request.text()
    if (!verifyWebhook(request, body, secret)) {
      return response('Invalid signature', 401)
    }
    let data: unknown
    try { data = JSON.parse(body) } catch { return response('Invalid JSON', 400) }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return response('Invalid webhook payload', 400)
    }
    const revalidateSecret = process.env.REVALIDATE_SECRET
    if (!revalidateSecret) return response('Revalidation is not configured', 503)

    // Never send the secret through a redirect to another origin.
    const revalidated = await fetch(`${getSiteOrigin()}/api/revalidate`, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10_000),
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': revalidateSecret },
      body: JSON.stringify({ path: '/blog' }),
    })
    if (!revalidated.ok) return response('Revalidation failed', 502)
    return NextResponse.json({ received: true, revalidated: true }, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return response('Webhook processing failed', 502)
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use authenticated POST requests.' }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
