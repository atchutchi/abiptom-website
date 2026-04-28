import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

const ALLOWED_PATHS = new Set([
  '/',
  '/blog',
  '/portfolio',
  '/servicos',
  '/quem-somos',
  '/contacto',
  '/trabalhe-conosco',
  '/sitemap.xml',
  '/rss.xml',
])

function isAllowedPath(path: string): boolean {
  if (!path.startsWith('/')) return false
  if (path.includes('..')) return false
  if (ALLOWED_PATHS.has(path)) return true
  return path.startsWith('/blog/') || path.startsWith('/servicos/')
}

function isAllowedTag(tag: string): boolean {
  return /^[a-zA-Z0-9:_-]{1,64}$/.test(tag)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const secret = request.headers.get('x-revalidate-secret') || body.secret
    const path = typeof body.path === 'string' ? body.path : undefined
    const tag = typeof body.tag === 'string' ? body.tag : undefined
    
    if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      )
    }
    
    if (path) {
      if (!isAllowedPath(path)) {
        return NextResponse.json(
          { message: 'Path not allowed' },
          { status: 400 }
        )
      }

      revalidatePath(path)
      console.log(`✅ Revalidated path: ${path}`)
      
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now()
      })
    }
    
    if (tag) {
      if (!isAllowedTag(tag)) {
        return NextResponse.json(
          { message: 'Tag not allowed' },
          { status: 400 }
        )
      }

      revalidateTag(tag, 'max')
      console.log(`✅ Revalidated tag: ${tag}`)
      
      return NextResponse.json({
        revalidated: true,
        tag,
        now: Date.now()
      })
    }
    
    return NextResponse.json(
      { message: 'Missing path or tag parameter' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('❌ Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Revalidate API is active. Use POST with x-revalidate-secret and path or tag in JSON body.',
    timestamp: new Date().toISOString()
  })
}
