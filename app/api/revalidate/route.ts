import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const path = searchParams.get('path')
    const tag = searchParams.get('tag')
    
    // Verificar o secret para segurança
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      )
    }
    
    // Revalidar por path
    if (path) {
      revalidatePath(path)
      console.log(`✅ Revalidated path: ${path}`)
      
      return NextResponse.json({
        revalidated: true,
        path,
        now: Date.now()
      })
    }
    
    // Revalidar por tag
    if (tag) {
      revalidateTag(tag)
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
    message: 'Revalidate API is active. Use POST with secret, and path or tag parameters.',
    timestamp: new Date().toISOString()
  })
}

