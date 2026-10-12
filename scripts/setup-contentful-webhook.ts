/** Default: local plan only. --apply requires separately authorised external configuration. */
import { createClient } from 'contentful-management'
import * as dotenv from 'dotenv'
import { requireExistingSigning, webhookPlan } from '../lib/contentful/webhook-setup'

dotenv.config({ path: '.env.local', quiet: true })

async function setupWebhook() {
  const plan = webhookPlan()
  if (!process.argv.includes('--apply')) {
    console.log('Plano local; nenhuma chamada ao Contentful nem alteração externa.')
    console.log(JSON.stringify(plan, null, 2))
    console.log('Requer assinatura nativa ativa no espaço e CONTENTFUL_WEBHOOK_SECRET correspondente no servidor. Ver REVIEW-PHASE1.md.')
    return
  }
  const spaceId = process.env.CONTENTFUL_SPACE_ID ?? ''
  const token = process.env.CMA_TOKENS ?? ''
  await requireExistingSigning(spaceId, token, process.env.CONTENTFUL_WEBHOOK_SECRET ?? '')
  const space = await createClient({ accessToken: token }).getSpace(spaceId)
  const webhooks = await space.getWebhooks()
  const matches = webhooks.items.filter(webhook => webhook.name === plan.name)
  if (matches.length > 1) throw new Error('Existem webhooks duplicados; rever manualmente antes de alterar.')
  if (matches[0]) {
    Object.assign(matches[0], plan)
    await matches[0].update()
  } else {
    await space.createWebhook(plan)
  }
  console.log('Webhook configurado. Validar uma entrega assinada autorizada; a CMA não permite verificar a correspondência completa do segredo.')
}

setupWebhook().catch(() => {
  // SDK errors may contain request headers or credentials. Do not print them.
  console.error('Configuração interrompida. Confirmar credenciais, assinatura ativa e ausência de webhooks duplicados; ver REVIEW-PHASE1.md.')
  process.exitCode = 1
})
