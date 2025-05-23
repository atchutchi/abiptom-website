import { getPublicUrl, STORAGE_BUCKETS } from '../supabase/storage'

// Asset URL configuration
export const ASSET_CONFIG = {
  USE_SUPABASE: process.env.NODE_ENV === 'production', // Use Supabase in production
  FALLBACK_TO_LOCAL: true // Fallback to local files if Supabase fails
}

// Asset URL mappings
const ASSET_MAPPINGS = {
  // Images
  '/images/': STORAGE_BUCKETS.IMAGES,
  '/placeholder': STORAGE_BUCKETS.ASSETS,
  // Documents
  '/docs/': STORAGE_BUCKETS.DOCUMENTS,
  // Assets
  '/fonts/': STORAGE_BUCKETS.ASSETS,
}

/**
 * Get the appropriate URL for an asset
 * @param path - The asset path (e.g., '/images/logo.png')
 * @returns The URL to use (either local or Supabase)
 */
export function getAssetUrl(path: string): string {
  // Remove leading slash for consistency
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // If not using Supabase, return local path
  if (!ASSET_CONFIG.USE_SUPABASE) {
    return path.startsWith('/') ? path : `/${path}`
  }
  
  // Determine bucket from path
  const bucket = getBucketFromPath(path)
  
  if (bucket) {
    try {
      // Get Supabase URL
      const supabaseUrl = getPublicUrl(bucket, cleanPath)
      return supabaseUrl
    } catch (error) {
      console.warn(`Failed to get Supabase URL for ${path}:`, error)
      
      // Fallback to local if enabled
      if (ASSET_CONFIG.FALLBACK_TO_LOCAL) {
        return path.startsWith('/') ? path : `/${path}`
      }
      
      throw error
    }
  }
  
  // Default to local path if no mapping found
  return path.startsWith('/') ? path : `/${path}`
}

/**
 * Get bucket name from asset path
 */
function getBucketFromPath(path: string): string | null {
  for (const [pattern, bucket] of Object.entries(ASSET_MAPPINGS)) {
    if (path.includes(pattern)) {
      return bucket
    }
  }
  
  // Determine bucket by file extension
  const ext = path.split('.').pop()?.toLowerCase()
  
  if (ext && ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
    return STORAGE_BUCKETS.IMAGES
  }
  
  if (ext && ['pdf', 'doc', 'docx'].includes(ext)) {
    return STORAGE_BUCKETS.DOCUMENTS
  }
  
  return STORAGE_BUCKETS.ASSETS
}

/**
 * Convert local image path to Supabase Storage path
 */
export function getImageUrl(imagePath: string): string {
  return getAssetUrl(imagePath)
}

/**
 * Convert local document path to Supabase Storage path
 */
export function getDocumentUrl(docPath: string): string {
  return getAssetUrl(docPath)
}

/**
 * Get portfolio PDF URL
 */
export function getPortfolioPdfUrl(filename: string): string {
  return getAssetUrl(`/docs/portfolio/${filename}`)
}

/**
 * Get team member image URL
 */
export function getTeamImageUrl(filename: string): string {
  return getAssetUrl(`/images/team/${filename}`)
}

/**
 * Get client logo URL
 */
export function getClientLogoUrl(filename: string): string {
  return getAssetUrl(`/images/clients/${filename}`)
}

/**
 * Get service icon URL
 */
export function getServiceIconUrl(filename: string): string {
  return getAssetUrl(`/images/servicos/${filename}`)
}

/**
 * Get portfolio image URL
 */
export function getPortfolioImageUrl(filename: string): string {
  return getAssetUrl(`/images/portfolio/${filename}`)
}

/**
 * Get blog image URL
 */
export function getBlogImageUrl(filename: string): string {
  return getAssetUrl(`/images/blog/${filename}`)
} 