import { useState, useCallback } from 'react'
import { uploadFile, STORAGE_BUCKETS, getPublicUrl } from '@/lib/supabase/storage'

interface UseFileUploadOptions {
  bucket?: string
  maxSize?: number // in bytes
  allowedTypes?: string[]
  onSuccess?: (url: string, path: string) => void
  onError?: (error: Error) => void
}

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
  url: string | null
  path: string | null
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    bucket = STORAGE_BUCKETS.ASSETS,
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/*', 'application/pdf', 'text/*'],
    onSuccess,
    onError
  } = options

  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    url: null,
    path: null
  })

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `Arquivo muito grande. Tamanho máximo: ${(maxSize / 1024 / 1024).toFixed(1)}MB`
    }

    // Check file type
    const isAllowedType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.replace('/*', '')
        return file.type.startsWith(baseType)
      }
      return file.type === type
    })

    if (!isAllowedType) {
      return `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`
    }

    return null
  }, [maxSize, allowedTypes])

  const upload = useCallback(async (
    file: File,
    customPath?: string,
    customBucket?: string
  ) => {
    setState(prev => ({
      ...prev,
      uploading: true,
      progress: 0,
      error: null,
      url: null,
      path: null
    }))

    try {
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        throw new Error(validationError)
      }

      // Generate path if not provided
      const timestamp = Date.now()
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const path = customPath || `uploads/${timestamp}_${cleanFileName}`
      const targetBucket = customBucket || bucket

      // Simulate progress (Supabase doesn't provide real progress)
      setState(prev => ({ ...prev, progress: 25 }))

      // Upload file
      const uploadResult = await uploadFile(file, targetBucket, path, {
        upsert: true,
        cacheControl: '3600'
      })

      setState(prev => ({ ...prev, progress: 75 }))

      // Get public URL
      const publicUrl = getPublicUrl(targetBucket, path)

      setState(prev => ({
        ...prev,
        uploading: false,
        progress: 100,
        url: publicUrl,
        path
      }))

      // Call success callback
      onSuccess?.(publicUrl, path)

      return {
        url: publicUrl,
        path,
        uploadResult
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      
      setState(prev => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: errorMessage
      }))

      onError?.(error instanceof Error ? error : new Error(errorMessage))
      throw error
    }
  }, [bucket, validateFile, onSuccess, onError])

  const reset = useCallback(() => {
    setState({
      uploading: false,
      progress: 0,
      error: null,
      url: null,
      path: null
    })
  }, [])

  return {
    upload,
    reset,
    ...state
  }
}

// Specialized hooks for different file types
export function useImageUpload(options: Omit<UseFileUploadOptions, 'bucket' | 'allowedTypes'> = {}) {
  return useFileUpload({
    ...options,
    bucket: STORAGE_BUCKETS.IMAGES,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  })
}

export function usePdfUpload(options: Omit<UseFileUploadOptions, 'bucket' | 'allowedTypes'> = {}) {
  return useFileUpload({
    ...options,
    bucket: STORAGE_BUCKETS.DOCUMENTS,
    allowedTypes: ['application/pdf']
  })
}

export function useDocumentUpload(options: Omit<UseFileUploadOptions, 'bucket' | 'allowedTypes'> = {}) {
  return useFileUpload({
    ...options,
    bucket: STORAGE_BUCKETS.DOCUMENTS,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
  })
} 