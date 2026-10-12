import { isSigningSecret } from './verify-webhook'
import { getSiteOrigin } from '../site'

export function webhookPlan() {
  const origin = getSiteOrigin()
  if (!origin.startsWith('https://')) throw new Error('O webhook requer o domínio HTTPS publicado.')
  return {
    name: 'ABIPTOM Auto Deploy', url: `${origin}/api/contentful-webhook`,
    topics: ['Entry.publish', 'Entry.unpublish', 'Entry.delete'],
    filters: [{ equals: [{ doc: 'sys.contentType.sys.id' }, 'abiptomBlog'] as [{ doc: 'sys.contentType.sys.id' }, string] }],
  }
}

/** Read-only preflight; never creates or rotates the space's signing secret. */
export async function requireExistingSigning(space: string, token: string, secret: string, read: typeof fetch = fetch) {
  if (!space || !token || !isSigningSecret(secret)) throw new Error('Configuração de assinatura incompleta.')
  const response = await read(`https://api.contentful.com/spaces/${encodeURIComponent(space)}/webhook_settings/signing_secret`, {
    method: 'GET', redirect: 'error', signal: AbortSignal.timeout(10_000),
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Não foi possível confirmar uma assinatura ativa no espaço Contentful.')
  const metadata = await response.json()
  if (metadata?.sys?.type !== 'WebhookSigningSecret') throw new Error('Assinatura Contentful não confirmada.')
  // CMA only returns redacted metadata. Matching the full key requires a signed delivery test.
}
