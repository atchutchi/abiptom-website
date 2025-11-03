/**
 * Script para configurar webhook no Contentful automaticamente
 * 
 * Uso:
 * 1. Certifique-se de ter CONTENTFUL_SPACE_ID e CMA_TOKENS no .env.local
 * 2. Execute: npx tsx scripts/setup-contentful-webhook.ts
 */

import { createClient } from 'contentful-management'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const CMA_TOKEN = process.env.CMA_TOKENS
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function setupWebhook() {
  if (!SPACE_ID || !CMA_TOKEN) {
    console.error('❌ CONTENTFUL_SPACE_ID ou CMA_TOKENS não configurado no .env.local')
    process.exit(1)
  }

  console.log('🚀 Configurando webhook no Contentful...\n')

  try {
    const client = createClient({
      accessToken: CMA_TOKEN
    })

    const space = await client.getSpace(SPACE_ID)
    const environment = await space.getEnvironment('master')

    // Verificar se webhook já existe
    const existingWebhooks = await environment.getWebhooks()
    const webhookName = 'ABIPTOM Auto Deploy'
    
    const existing = existingWebhooks.items.find(
      (wh: any) => wh.name === webhookName
    )

    if (existing) {
      console.log('⚠️  Webhook já existe. Atualizando...')
      
      existing.url = `${SITE_URL}/api/contentful-webhook`
      existing.topics = [
        'Entry.publish',
        'Entry.unpublish',
        'Entry.delete'
      ]
      
      await existing.update()
      console.log('✅ Webhook atualizado com sucesso!')
    } else {
      // Criar novo webhook
      const webhook = await environment.createWebhook({
        name: webhookName,
        url: `${SITE_URL}/api/contentful-webhook`,
        topics: [
          'Entry.publish',
          'Entry.unpublish',
          'Entry.delete'
        ],
        filters: [
          {
            equals: [
              { doc: 'sys.contentType.sys.id' },
              'abiptomBlog'
            ]
          }
        ]
      })

      console.log('✅ Webhook criado com sucesso!')
      console.log('\n📋 Detalhes do Webhook:')
      console.log(`   Nome: ${webhook.name}`)
      console.log(`   URL: ${webhook.url}`)
      console.log(`   ID: ${webhook.sys.id}`)
    }

    console.log('\n🎉 Configuração concluída!')
    console.log('\n📝 Próximos passos:')
    console.log('   1. Publique um post no Contentful')
    console.log('   2. Verifique os logs do servidor')
    console.log('   3. O site será atualizado automaticamente!')

  } catch (error: any) {
    console.error('❌ Erro ao configurar webhook:', error.message)
    
    if (error.message.includes('401')) {
      console.error('\n💡 Dica: Verifique se o CMA_TOKENS está correto')
    }
    
    process.exit(1)
  }
}

setupWebhook()

