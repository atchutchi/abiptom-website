'use client'

import { useState, useRef } from 'react'
import { uploadToMedia } from '@/lib/supabase/media-storage'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, Upload, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface FileUploadProps {
  onUploadComplete?: (url: string, path: string) => void
  folder?: string
  accept?: string
  maxSize?: number
  className?: string
}

export function FileUpload({
  onUploadComplete,
  folder = 'uploads',
  accept = 'image/*,video/*,application/pdf',
  maxSize = 100 * 1024 * 1024, // 100MB
  className
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    
    // Validar tamanho
    if (file.size > maxSize) {
      setError(`Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`)
      return
    }

    // Mostrar preview para imagens
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }

    // Fazer upload
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    setProgress(0)

    try {
      // Simular progresso (você pode implementar progresso real com XMLHttpRequest)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const result = await uploadToMedia(file, { folder })
      
      clearInterval(progressInterval)
      setProgress(100)

      if (onUploadComplete) {
        onUploadComplete(result.publicUrl, result.path)
      }

      // Limpar após sucesso
      setTimeout(() => {
        setProgress(0)
        setPreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }, 1000)

    } catch (error) {
      console.error('Erro no upload:', error)
      setError(error instanceof Error ? error.message : 'Erro ao fazer upload')
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const cancelUpload = () => {
    setPreview(null)
    setError(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Input de arquivo */}
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              variant="outline"
              disabled={uploading}
              className="cursor-pointer"
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Selecionar arquivo
              </span>
            </Button>
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-w-xs max-h-48 rounded-lg border"
            />
            {!uploading && (
              <button
                onClick={cancelUpload}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Progresso */}
        {uploading && progress > 0 && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Enviando... {progress}%
            </p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
} 