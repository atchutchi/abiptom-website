"use client"

import { useState, useEffect } from 'react'
import { FileUploader } from '@/components/admin/FileUploader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { createBuckets, listFiles, STORAGE_BUCKETS } from '@/lib/supabase/storage'
import { getAssetUrl, getPortfolioPdfUrl, getImageUrl } from '@/lib/utils/assets'
import { Database, Upload, Image, FileText, Settings, CheckCircle, AlertCircle } from 'lucide-react'

export default function SupabaseTestPage() {
  const [bucketFiles, setBucketFiles] = useState<{[key: string]: any[]}>({})
  const [bucketsCreated, setBucketsCreated] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadBucketFiles = async () => {
    setLoading(true)
    try {
      const files: {[key: string]: any[]} = {}
      
      for (const bucket of Object.values(STORAGE_BUCKETS)) {
        try {
          const bucketFiles = await listFiles(bucket)
          files[bucket] = bucketFiles || []
        } catch (error) {
          console.error(`Error loading files from ${bucket}:`, error)
          files[bucket] = []
        }
      }
      
      setBucketFiles(files)
    } catch (error) {
      console.error('Error loading bucket files:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeBuckets = async () => {
    setLoading(true)
    try {
      await createBuckets()
      setBucketsCreated(true)
      await loadBucketFiles()
    } catch (error) {
      console.error('Error creating buckets:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBucketFiles()
  }, [])

  const handleUploadComplete = (url: string, path: string) => {
    console.log('Upload completed:', { url, path })
    loadBucketFiles() // Refresh file list
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Database className="h-8 w-8 text-blue-600" />
          Teste do Supabase Storage
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Esta página permite testar as funcionalidades do Supabase Storage, fazer upload de arquivos 
          e verificar se a integração está funcionando corretamente.
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Status da Configuração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Cliente Supabase Configurado</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Variáveis de Ambiente</span>
            </div>
            <div className="flex items-center gap-2">
              {bucketsCreated ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="text-sm">Buckets Criados</span>
            </div>
          </div>
          
          {!bucketsCreated && (
            <Button 
              onClick={initializeBuckets} 
              disabled={loading}
              className="w-full md:w-auto"
            >
              Inicializar Buckets do Storage
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Imagens
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Arquivos
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FileUploader 
              type="image" 
              onUploadComplete={handleUploadComplete}
            />
            <FileUploader 
              type="pdf" 
              onUploadComplete={handleUploadComplete}
            />
            <FileUploader 
              type="any" 
              onUploadComplete={handleUploadComplete}
            />
          </div>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teste de URLs de Imagens</CardTitle>
              <CardDescription>
                Teste das funções de URL para diferentes tipos de imagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Imagem Local (placeholder.jpg)</h4>
                  <p className="text-sm text-gray-600">
                    URL: {getImageUrl('/placeholder.jpg')}
                  </p>
                  <img 
                    src={getImageUrl('/placeholder.jpg')} 
                    alt="Placeholder" 
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg'
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Logo ABIPTOM</h4>
                  <p className="text-sm text-gray-600">
                    URL: {getImageUrl('/images/abiptom.png')}
                  </p>
                  <img 
                    src={getImageUrl('/images/abiptom.png')} 
                    alt="ABIPTOM Logo" 
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src = '/images/abiptom.png'
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teste de URLs de Documentos</CardTitle>
              <CardDescription>
                Teste das funções de URL para documentos PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  'Relatorio-Anual-laboratorio-de-aceleracao-undp-2022.pdf',
                  'Capa-unicef.pdf',
                  'forum-bissau-rising-guine-bissau-UNDP.pdf'
                ].map((filename) => (
                  <div key={filename} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{filename}</h4>
                      <p className="text-sm text-gray-600">
                        URL: {getPortfolioPdfUrl(filename)}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(getPortfolioPdfUrl(filename), '_blank')}
                    >
                      Abrir PDF
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(STORAGE_BUCKETS).map(([key, bucketName]) => (
              <Card key={bucketName}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Bucket: {bucketName}</span>
                    <Badge variant="secondary">
                      {bucketFiles[bucketName]?.length || 0} arquivos
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm text-gray-500">Carregando...</p>
                  ) : bucketFiles[bucketName]?.length > 0 ? (
                    <div className="space-y-2">
                      {bucketFiles[bucketName].slice(0, 5).map((file, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          <div className="font-medium truncate">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {(file.metadata?.size ? (file.metadata.size / 1024).toFixed(1) : '?')} KB
                          </div>
                        </div>
                      ))}
                      {bucketFiles[bucketName].length > 5 && (
                        <p className="text-xs text-gray-500">
                          +{bucketFiles[bucketName].length - 5} mais arquivos...
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum arquivo encontrado</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={loadBucketFiles} 
              disabled={loading}
              variant="outline"
            >
              Recarregar Lista de Arquivos
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 