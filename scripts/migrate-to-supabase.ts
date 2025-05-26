import { promises as fs } from 'fs'
import path from 'path'
import { uploadFromUrl } from '../lib/supabase/storage'
import { ensureMediaBucketExists } from '../lib/supabase/media-storage'

// Configurar variáveis de ambiente
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

// Extensões de arquivo permitidas
const ALLOWED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
  '.mp4', '.webm', '.pdf'
]

async function getFilesRecursively(dir: string): Promise<string[]> {
  const files: string[] = []
  
  async function scan(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      
      if (entry.isDirectory()) {
        await scan(fullPath)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (ALLOWED_EXTENSIONS.includes(ext)) {
          files.push(fullPath)
        }
      }
    }
  }
  
  await scan(dir)
  return files
}

async function migrateFiles() {
  console.log('🚀 Iniciando migração de arquivos para Supabase...')
  
  try {
    // Verificar se o bucket existe
    await ensureMediaBucketExists()
    console.log('✅ Bucket media verificado')
    
    // Obter todos os arquivos da pasta public
    const files = await getFilesRecursively(PUBLIC_DIR)
    console.log(`📁 Encontrados ${files.length} arquivos para migrar`)
    
    const results = {
      success: [] as string[],
      failed: [] as { file: string; error: string }[]
    }
    
    for (const file of files) {
      const relativePath = path.relative(PUBLIC_DIR, file)
      const supabasePath = relativePath.replace(/\\/g, '/')
      
      try {
        // Construir URL local do arquivo
        const fileUrl = `${BASE_URL}/${relativePath.replace(/\\/g, '/')}`
        
        console.log(`📤 Migrando: ${relativePath}`)
        
        await uploadFromUrl(fileUrl, 'media', supabasePath, {
          upsert: true
        })
        
        results.success.push(relativePath)
        console.log(`✅ Sucesso: ${relativePath}`)
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        results.failed.push({ file: relativePath, error: errorMessage })
        console.error(`❌ Falha: ${relativePath} - ${errorMessage}`)
      }
    }
    
    // Resumo
    console.log('\n📊 Resumo da migração:')
    console.log(`✅ Sucesso: ${results.success.length} arquivos`)
    console.log(`❌ Falhas: ${results.failed.length} arquivos`)
    
    if (results.failed.length > 0) {
      console.log('\n❌ Arquivos que falharam:')
      results.failed.forEach(({ file, error }) => {
        console.log(`  - ${file}: ${error}`)
      })
    }
    
  } catch (error) {
    console.error('💥 Erro durante a migração:', error)
    process.exit(1)
  }
}

// Executar migração
migrateFiles().then(() => {
  console.log('\n✨ Migração concluída!')
  process.exit(0)
}) 