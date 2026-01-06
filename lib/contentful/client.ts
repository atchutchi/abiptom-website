import { createClient, ContentfulClientApi } from 'contentful'

// Verificar se as variáveis de ambiente estão configuradas
const spaceId = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master'

// Criar cliente do Contentful apenas se as credenciais existirem
let client: ContentfulClientApi<undefined> | null = null

if (spaceId && accessToken) {
  client = createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: environment,
  })
} else {
  console.warn('⚠️ Contentful credentials not configured. Blog features will be disabled.')
}

export default client

// Tipos para o blog post
export interface ContentfulBlogPost {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    title: string
    slug: string
    excerpt: string
    content: any // Rich text
    coverImage: {
      fields: {
        file: {
          url: string
        }
      }
    }
    author: string
    publishDate: string
    categories: string[]
    tags: string[]
    featured: boolean
  }
}

// Função para buscar todos os posts
export async function getAllBlogPosts(locale: string = 'pt'): Promise<any[]> {
  if (!client) {
    console.warn('⚠️ Contentful client not initialized')
    return []
  }

  try {
    const entries = await client.getEntries({
      content_type: 'abiptomBlog', // Content type ID do Contentful
      locale,
      order: ['-sys.createdAt'], // Ordenar por data de criação
    })
    
    console.log(`✅ Fetched ${entries.items.length} posts from Contentful`)
    return entries.items as any[]
  } catch (error: any) {
    console.error('❌ Error fetching blog posts from Contentful:', error.message)
    return []
  }
}

// Função para buscar um post específico pelo slug
export async function getBlogPostBySlug(slug: string, locale: string = 'pt'): Promise<any | null> {
  if (!client) {
    console.warn('⚠️ Contentful client not initialized')
    return null
  }

  try {
    const entries = await client.getEntries({
      content_type: 'abiptomBlog', // Content type ID do Contentful
      'fields.slug': slug,
      locale,
      limit: 1,
    })
    
    if (entries.items.length > 0) {
      return entries.items[0]
    }
    
    return null
  } catch (error: any) {
    console.error(`❌ Error fetching blog post with slug ${slug}:`, error.message)
    return null
  }
}

// Função para buscar posts em destaque
export async function getFeaturedBlogPosts(locale: string = 'pt'): Promise<any[]> {
  if (!client) {
    console.warn('⚠️ Contentful client not initialized')
    return []
  }

  try {
    const entries = await client.getEntries({
      content_type: 'abiptomBlog', // Content type ID do Contentful
      'fields.featured': true,
      locale,
      order: ['-sys.createdAt'],
      limit: 3,
    })
    
    return entries.items as any[]
  } catch (error: any) {
    console.error('❌ Error fetching featured blog posts:', error.message)
    return []
  }
}
