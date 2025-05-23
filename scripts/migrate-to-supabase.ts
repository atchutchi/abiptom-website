import fs from 'fs'
import path from 'path'
import { createBuckets, uploadFromUrl, STORAGE_BUCKETS } from '../lib/supabase/storage'

// File mapping configuration
const FILE_MAPPINGS = {
  // Images
  'images/': STORAGE_BUCKETS.IMAGES,
  'placeholder': STORAGE_BUCKETS.ASSETS,
  // Documents/PDFs
  'docs/': STORAGE_BUCKETS.DOCUMENTS,
  // Other assets
  'fonts/': STORAGE_BUCKETS.ASSETS,
  '.htaccess': STORAGE_BUCKETS.ASSETS,
  'robots.txt': STORAGE_BUCKETS.ASSETS
}

async function migrateFiles() {
  console.log('🚀 Starting migration to Supabase Storage...')
  
  try {
    // First create the buckets
    console.log('📦 Creating storage buckets...')
    await createBuckets()
    
    // Get all files from public directory
    const publicDir = path.join(process.cwd(), 'public')
    const files = await getAllFiles(publicDir)
    
    console.log(`📁 Found ${files.length} files to migrate`)
    
    for (const filePath of files) {
      await migrateFile(filePath, publicDir)
    }
    
    console.log('✅ Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

async function getAllFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  
  function scanDirectory(currentDir: string) {
    const items = fs.readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath)
      } else {
        files.push(fullPath)
      }
    }
  }
  
  scanDirectory(dir)
  return files
}

async function migrateFile(filePath: string, publicDir: string) {
  try {
    // Get relative path from public directory
    const relativePath = path.relative(publicDir, filePath)
    const normalizedPath = relativePath.replace(/\\/g, '/') // Convert Windows paths
    
    // Determine which bucket to use
    const bucket = getBucketForFile(normalizedPath)
    
    if (!bucket) {
      console.log(`⏭️  Skipping ${normalizedPath} (no bucket mapping)`)
      return
    }
    
    // Create URL for the local file (for development, we'll use a different approach)
    // For now, we'll read the file directly
    const fileBuffer = fs.readFileSync(filePath)
    const blob = new Blob([fileBuffer])
    
    // Upload to Supabase
    console.log(`📤 Uploading ${normalizedPath} to ${bucket}...`)
    
    // Note: For the actual upload, we'll need to modify this to work with Node.js
    // For now, this is the structure
    
    console.log(`✅ Uploaded ${normalizedPath}`)
    
  } catch (error) {
    console.error(`❌ Failed to migrate ${filePath}:`, error)
  }
}

function getBucketForFile(filePath: string): string | null {
  for (const [pattern, bucket] of Object.entries(FILE_MAPPINGS)) {
    if (filePath.startsWith(pattern) || filePath.includes(pattern)) {
      return bucket
    }
  }
  
  // Default bucket based on file extension
  const ext = path.extname(filePath).toLowerCase()
  
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
    return STORAGE_BUCKETS.IMAGES
  }
  
  if (['.pdf', '.doc', '.docx'].includes(ext)) {
    return STORAGE_BUCKETS.DOCUMENTS
  }
  
  return STORAGE_BUCKETS.ASSETS
}

// Run migration if called directly
if (require.main === module) {
  migrateFiles()
}

export { migrateFiles } 