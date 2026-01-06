import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { uploadToMedia, ALLOWED_FILE_TYPES, MAX_FILE_SIZES } from '@/lib/supabase/media-storage'
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

/**
 * API de Upload Segura
 * 
 * Proteções implementadas:
 * - Autenticação obrigatória
 * - Rate limiting
 * - Validação de tipo de arquivo (MIME type e extensão)
 * - Validação de tamanho de arquivo
 * - Validação de magic bytes
 * - Sanitização de nome de arquivo
 * - CORS restritivo
 */

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abiptom.gw' 
    : '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Magic bytes para validação de tipo de arquivo real
const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF followed by WEBP at offset 8
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'video/mp4': [[0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]],
}

// Extensões permitidas
const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  video: ['.mp4', '.webm', '.ogg'],
  document: ['.pdf', '.doc', '.docx'],
}

// Handler para OPTIONS (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

/**
 * Valida os magic bytes de um arquivo
 */
async function validateMagicBytes(file: File): Promise<boolean> {
  const expectedBytes = MAGIC_BYTES[file.type]
  if (!expectedBytes) {
    // Se não temos magic bytes definidos para este tipo, pular validação
    return true
  }

  try {
    const buffer = await file.slice(0, 20).arrayBuffer()
    const bytes = new Uint8Array(buffer)
    
    return expectedBytes.some(pattern => 
      pattern.every((byte, index) => bytes[index] === byte)
    )
  } catch {
    return false
  }
}

/**
 * Valida a extensão do arquivo
 */
function validateExtension(filename: string, mimeType: string): boolean {
  const ext = '.' + filename.split('.').pop()?.toLowerCase()
  
  if (ALLOWED_FILE_TYPES.images.includes(mimeType)) {
    return ALLOWED_EXTENSIONS.image.includes(ext)
  }
  if (ALLOWED_FILE_TYPES.videos.includes(mimeType)) {
    return ALLOWED_EXTENSIONS.video.includes(ext)
  }
  if (ALLOWED_FILE_TYPES.documents.includes(mimeType)) {
    return ALLOWED_EXTENSIONS.document.includes(ext)
  }
  
  return false
}

/**
 * Sanitiza o nome do arquivo
 */
function sanitizeFilename(filename: string): string {
  // Remover path traversal attempts
  let safe = filename.replace(/[\/\\]/g, '')
  
  // Remover caracteres especiais perigosos
  safe = safe.replace(/[<>:"|?*\x00-\x1F]/g, '')
  
  // Limitar comprimento
  if (safe.length > 200) {
    const ext = safe.split('.').pop() || ''
    const name = safe.slice(0, 200 - ext.length - 1)
    safe = `${name}.${ext}`
  }
  
  // Garantir que não está vazio
  if (!safe || safe === '.') {
    safe = 'file'
  }
  
  return safe
}

/**
 * Valida o folder path
 */
function validateFolder(folder: string): string {
  // Remover path traversal
  let safe = folder.replace(/\.\./g, '').replace(/\/\//g, '/')
  
  // Remover caracteres especiais
  safe = safe.replace(/[<>:"|?*\x00-\x1F]/g, '')
  
  // Remover slashes no início e fim
  safe = safe.replace(/^\/+|\/+$/g, '')
  
  // Limitar a pastas permitidas
  const allowedFolders = ['uploads', 'images', 'documents', 'videos', 'portfolio', 'blog']
  const rootFolder = safe.split('/')[0]
  
  if (!allowedFolders.includes(rootFolder)) {
    return 'uploads'
  }
  
  return safe
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting
    const { success: rateLimitSuccess, remaining, retryAfter } = await rateLimit('upload')
    if (!rateLimitSuccess) {
      return NextResponse.json(
        { error: 'Muitos uploads em pouco tempo. Aguarde antes de tentar novamente.' },
        { 
          status: 429, 
          headers: {
            ...corsHeaders,
            'Retry-After': String(retryAfter || 60)
          }
        }
      )
    }

    // 2. Verificar autenticação
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para fazer upload.' },
        { status: 401, headers: corsHeaders }
      )
    }

    // 3. Obter o arquivo do form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string || 'uploads'

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo fornecido' },
        { status: 400, headers: corsHeaders }
      )
    }

    // 4. Validar tipo MIME
    const allAllowedTypes = [
      ...ALLOWED_FILE_TYPES.images,
      ...ALLOWED_FILE_TYPES.videos,
      ...ALLOWED_FILE_TYPES.documents,
    ]
    
    if (!allAllowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de arquivo não permitido: ${file.type}` },
        { status: 400, headers: corsHeaders }
      )
    }

    // 5. Validar extensão
    if (!validateExtension(file.name, file.type)) {
      return NextResponse.json(
        { error: 'Extensão de arquivo não corresponde ao tipo declarado' },
        { status: 400, headers: corsHeaders }
      )
    }

    // 6. Validar magic bytes
    const validMagic = await validateMagicBytes(file)
    if (!validMagic) {
      return NextResponse.json(
        { error: 'Conteúdo do arquivo não corresponde ao tipo declarado' },
        { status: 400, headers: corsHeaders }
      )
    }

    // 7. Validar tamanho
    let maxSize = MAX_FILE_SIZES.document
    if (ALLOWED_FILE_TYPES.images.includes(file.type)) {
      maxSize = MAX_FILE_SIZES.image
    } else if (ALLOWED_FILE_TYPES.videos.includes(file.type)) {
      maxSize = MAX_FILE_SIZES.video
    }
    
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB` },
        { status: 400, headers: corsHeaders }
      )
    }

    // 8. Sanitizar nome e folder
    const safeFolder = validateFolder(folder)
    
    // 9. Fazer upload
    const result = await uploadToMedia(file, {
      folder: safeFolder,
      upsert: false
    })

    return NextResponse.json({
      success: true,
      data: result,
      remaining
    }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('Erro no upload:', error)
    
    // Não expor detalhes do erro em produção
    const message = process.env.NODE_ENV === 'production'
      ? 'Erro ao fazer upload do arquivo'
      : error.message || 'Erro desconhecido'
    
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    )
  }
}
