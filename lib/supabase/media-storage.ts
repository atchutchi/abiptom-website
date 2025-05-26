import { supabase, supabaseAdmin } from './client'

// Configuração do bucket media
export const MEDIA_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'media'

// Tipos de arquivo permitidos
export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  videos: ['video/mp4', 'video/webm', 'video/ogg'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}

// Tamanhos máximos de arquivo (em bytes)
export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  document: 25 * 1024 * 1024 // 25MB
}

// Interface para opções de upload
interface UploadOptions {
  folder?: string
  fileName?: string
  upsert?: boolean
  cacheControl?: string
}

// Função para fazer upload de arquivo para o bucket media
export async function uploadToMedia(
  file: File,
  options: UploadOptions = {}
) {
  try {
    // Verificar se o cliente Supabase está disponível
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    // Validar tipo de arquivo
    const fileType = getFileType(file.type)
    if (!fileType) {
      throw new Error('Tipo de arquivo não permitido')
    }

    // Validar tamanho do arquivo
    const maxSize = MAX_FILE_SIZES[fileType]
    if (file.size > maxSize) {
      throw new Error(`Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`)
    }

    // Gerar nome único para o arquivo se não fornecido
    const fileName = options.fileName || generateUniqueFileName(file.name)
    
    // Construir o caminho completo
    const fullPath = options.folder ? `${options.folder}/${fileName}` : fileName

    // Fazer upload do arquivo
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(fullPath, file, {
        upsert: options.upsert || false,
        cacheControl: options.cacheControl || '3600'
      })

    if (error) {
      throw error
    }

    // Retornar dados do upload incluindo a URL pública
    return {
      ...data,
      publicUrl: getMediaPublicUrl(fullPath)
    }
  } catch (error) {
    console.error('Erro ao fazer upload para media:', error)
    throw error
  }
}

// Obter URL pública de um arquivo no bucket media
export function getMediaPublicUrl(path: string): string {
  if (!supabase) {
    console.warn('Supabase client not initialized')
    return ''
  }
  
  const { data } = supabase.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Listar arquivos no bucket media
export async function listMediaFiles(folder?: string) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .list(folder || '', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      throw error
    }

    // Adicionar URLs públicas aos arquivos
    return data.map((file: any) => ({
      ...file,
      publicUrl: getMediaPublicUrl(folder ? `${folder}/${file.name}` : file.name)
    }))
  } catch (error) {
    console.error('Erro ao listar arquivos:', error)
    throw error
  }
}

// Deletar arquivo do bucket media
export async function deleteFromMedia(path: string) {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not initialized')
    }

    const { error } = await supabaseAdmin.storage
      .from(MEDIA_BUCKET)
      .remove([path])

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error)
    throw error
  }
}

// Mover arquivo dentro do bucket media
export async function moveMediaFile(fromPath: string, toPath: string) {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not initialized')
    }

    const { error } = await supabaseAdmin.storage
      .from(MEDIA_BUCKET)
      .move(fromPath, toPath)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error('Erro ao mover arquivo:', error)
    throw error
  }
}

// Funções auxiliares
function getFileType(mimeType: string): 'image' | 'video' | 'document' | null {
  if (ALLOWED_FILE_TYPES.images.includes(mimeType)) return 'image'
  if (ALLOWED_FILE_TYPES.videos.includes(mimeType)) return 'video'
  if (ALLOWED_FILE_TYPES.documents.includes(mimeType)) return 'document'
  return null
}

function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  const extension = originalName.split('.').pop()
  const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.')
  
  // Remover caracteres especiais e espaços
  const cleanName = nameWithoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  return `${cleanName}-${timestamp}-${random}.${extension}`
}

// Fazer upload de múltiplos arquivos
export async function uploadMultipleToMedia(
  files: File[],
  options: UploadOptions = {}
) {
  const results = await Promise.allSettled(
    files.map(file => uploadToMedia(file, options))
  )

  const successful = results
    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
    .map(result => result.value)

  const failed = results
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map((result, index) => ({
      file: files[index].name,
      error: result.reason
    }))

  return { successful, failed }
}

// Verificar se o bucket media existe e criar se necessário
export async function ensureMediaBucketExists() {
  try {
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      throw listError
    }

    const mediaExists = buckets?.some((bucket: any) => bucket.name === MEDIA_BUCKET)

    if (!mediaExists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(MEDIA_BUCKET, {
        public: true,
        fileSizeLimit: 100 * 1024 * 1024, // 100MB
        allowedMimeTypes: [
          ...ALLOWED_FILE_TYPES.images,
          ...ALLOWED_FILE_TYPES.videos,
          ...ALLOWED_FILE_TYPES.documents
        ]
      })

      if (createError) {
        throw createError
      }

      console.log(`Bucket ${MEDIA_BUCKET} criado com sucesso`)
    } else {
      console.log(`Bucket ${MEDIA_BUCKET} já existe`)
    }

    return true
  } catch (error) {
    console.error('Erro ao verificar/criar bucket media:', error)
    throw error
  }
} 