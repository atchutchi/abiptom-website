import { createClient } from 'contentful'

// Criar cliente do Contentful
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
})

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
export async function getAllBlogPosts(locale: string = 'pt'): Promise<ContentfulBlogPost[]> {
  try {
    const entries = await client.getEntries<ContentfulBlogPost['fields']>({
      content_type: 'blogPost',
      locale,
      order: ['-fields.publishDate'],
    })
    
    return entries.items as ContentfulBlogPost[]
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Função para buscar um post específico pelo slug
export async function getBlogPostBySlug(slug: string, locale: string = 'pt'): Promise<ContentfulBlogPost | null> {
  try {
    const entries = await client.getEntries<ContentfulBlogPost['fields']>({
      content_type: 'blogPost',
      'fields.slug': slug,
      locale,
      limit: 1,
    })
    
    if (entries.items.length > 0) {
      return entries.items[0] as ContentfulBlogPost
    }
    
    return null
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    return null
  }
}

// Função para buscar posts em destaque
export async function getFeaturedBlogPosts(locale: string = 'pt'): Promise<ContentfulBlogPost[]> {
  try {
    const entries = await client.getEntries<ContentfulBlogPost['fields']>({
      content_type: 'blogPost',
      'fields.featured': true,
      locale,
      order: ['-fields.publishDate'],
      limit: 3,
    })
    
    return entries.items as ContentfulBlogPost[]
  } catch (error) {
    console.error('Error fetching featured blog posts:', error)
    return []
  }
}

