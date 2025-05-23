"use client"

import { useCallback, useState } from 'react'
import { useDropzone, Accept } from 'react-dropzone'
import { useFileUpload, useImageUpload, usePdfUpload } from '@/hooks/useFileUpload'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, File, Image, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploaderProps {
  type?: 'any' | 'image' | 'pdf' | 'document'
  onUploadComplete?: (url: string, path: string) => void
  className?: string
}

export function FileUploader({ type = 'any', onUploadComplete, className }: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string
    url: string
    path: string
    type: string
  }>>([])

  // Select appropriate hook based on type
  const upload = type === 'image' 
    ? useImageUpload({ onSuccess: handleUploadSuccess })
    : type === 'pdf'
    ? usePdfUpload({ onSuccess: handleUploadSuccess })
    : useFileUpload({ onSuccess: handleUploadSuccess })

  function handleUploadSuccess(url: string, path: string) {
    onUploadComplete?.(url, path)
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        const result = await upload.upload(file)
        
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          url: result.url,
          path: result.path,
          type: file.type
        }])
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }
  }, [upload])

  const acceptTypes = getAcceptTypes(type)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: upload.uploading,
    accept: acceptTypes
  })

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Arquivos
          </CardTitle>
          <CardDescription>
            {getDescription(type)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${upload.uploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              {getUploadIcon(type)}
              <div>
                <p className="text-sm font-medium">
                  {isDragActive 
                    ? 'Solte os arquivos aqui...' 
                    : 'Clique aqui ou arraste arquivos para fazer upload'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getAcceptedFormats(type)}
                </p>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {upload.uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Fazendo upload...</span>
                <span>{upload.progress}%</span>
              </div>
              <Progress value={upload.progress} className="w-full" />
            </div>
          )}

          {/* Error Display */}
          {upload.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{upload.error}</AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {upload.url && !upload.uploading && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Arquivo enviado com sucesso! URL: 
                <a 
                  href={upload.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600 underline"
                >
                  Ver arquivo
                </a>
              </AlertDescription>
            </Alert>
          )}

          {/* Reset Button */}
          {(upload.error || upload.url) && (
            <Button 
              variant="outline" 
              onClick={upload.reset}
              className="w-full"
            >
              Fazer novo upload
            </Button>
          )}

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Arquivos enviados:</h4>
              <div className="space-y-1">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                    {getFileIcon(file.type)}
                    <span className="flex-1 truncate">{file.name}</span>
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getAcceptTypes(type: string): Accept | undefined {
  switch (type) {
    case 'image':
      return { 
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/gif': ['.gif'],
        'image/webp': ['.webp'],
        'image/svg+xml': ['.svg']
      } as Accept
    case 'pdf':
      return { 
        'application/pdf': ['.pdf'] 
      } as Accept
    case 'document':
      return { 
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'text/plain': ['.txt']
      } as Accept
    default:
      return undefined
  }
}

function getDescription(type: string) {
  switch (type) {
    case 'image':
      return 'Envie imagens para o storage do Supabase'
    case 'pdf':
      return 'Envie documentos PDF para o storage do Supabase'
    case 'document':
      return 'Envie documentos para o storage do Supabase'
    default:
      return 'Envie qualquer tipo de arquivo para o storage do Supabase'
  }
}

function getAcceptedFormats(type: string) {
  switch (type) {
    case 'image':
      return 'JPG, PNG, GIF, WebP, SVG (máx. 10MB)'
    case 'pdf':
      return 'PDF (máx. 10MB)'
    case 'document':
      return 'PDF, DOC, DOCX, TXT (máx. 10MB)'
    default:
      return 'Todos os tipos de arquivo (máx. 10MB)'
  }
}

function getUploadIcon(type: string) {
  switch (type) {
    case 'image':
      return <Image className="h-8 w-8 mx-auto text-gray-400" />
    case 'pdf':
    case 'document':
      return <FileText className="h-8 w-8 mx-auto text-gray-400" />
    default:
      return <File className="h-8 w-8 mx-auto text-gray-400" />
  }
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return <Image className="h-4 w-4 text-blue-500" />
  }
  if (mimeType === 'application/pdf') {
    return <FileText className="h-4 w-4 text-red-500" />
  }
  return <File className="h-4 w-4 text-gray-500" />
} 