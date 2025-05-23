import { supabase, supabaseAdmin } from './client'

// Bucket names
export const STORAGE_BUCKETS = {
  IMAGES: 'images',
  DOCUMENTS: 'documents',
  ASSETS: 'assets'
} as const

// Upload file to Supabase Storage
export async function uploadFile(
  file: File,
  bucket: string,
  path: string,
  options?: {
    upsert?: boolean
    cacheControl?: string
  }
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: options?.upsert || false,
        cacheControl: options?.cacheControl || '3600'
      })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Get public URL for a file
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Upload from URL (for migrating existing files)
export async function uploadFromUrl(
  url: string,
  bucket: string,
  path: string,
  options?: {
    upsert?: boolean
    cacheControl?: string
  }
) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, blob, {
        upsert: options?.upsert || true,
        cacheControl: options?.cacheControl || '3600'
      })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error uploading from URL:', error)
    throw error
  }
}

// Delete file from storage
export async function deleteFile(bucket: string, path: string) {
  try {
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

// List files in a bucket/folder
export async function listFiles(bucket: string, folder?: string) {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .list(folder || '', {
        limit: 100,
        offset: 0
      })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error listing files:', error)
    throw error
  }
}

// Create storage buckets if they don't exist
export async function createBuckets() {
  const buckets = Object.values(STORAGE_BUCKETS)
  
  for (const bucket of buckets) {
    try {
      const { error } = await supabaseAdmin.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 100, // 100MB limit
        allowedMimeTypes: [
          'image/*',
          'application/pdf',
          'text/*',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
      })

      if (error && !error.message.includes('already exists')) {
        console.error(`Error creating bucket ${bucket}:`, error)
      } else {
        console.log(`Bucket ${bucket} created or already exists`)
      }
    } catch (error) {
      console.error(`Error creating bucket ${bucket}:`, error)
    }
  }
} 