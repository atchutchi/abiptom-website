import { NextResponse } from 'next/server'
import { getAllBlogPosts } from '@/lib/contentful/client'

export const revalidate = 60 // Revalidar a cada 60 segundos

export async function GET() {
  try {
    const contentfulPosts = await getAllBlogPosts()
    
    // Mapear posts do Contentful para o formato esperado pela UI
    const posts = contentfulPosts.map((post: any) => ({
      id: post.sys.id,
      title: post.fields.title,
      slug: post.fields.slug,
      excerpt: post.fields.excerpt || '',
      coverImage: post.fields.featuredImage?.fields?.file?.url 
        ? `https:${post.fields.featuredImage.fields.file.url}`
        : '/images/blog/default.jpg',
      date: post.fields.publishedAt || post.sys.createdAt,
      readingTime: `${Math.ceil((post.fields.content?.content?.length || 0) / 1000)} min de leitura`,
      categories: post.fields.categories?.map((cat: any) => ({
        id: cat.sys.id,
        name: cat.fields.name,
        slug: cat.fields.slug,
      })) || [],
      tags: post.fields.tags?.map((tag: any) => ({
        id: tag.sys.id,
        name: tag.fields.name,
        slug: tag.fields.slug,
      })) || [],
    }))
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error)
    // Retornar array vazio em caso de erro
    return NextResponse.json([])
  }
}

