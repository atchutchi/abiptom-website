"use client";

import { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface MapEmbedProps {
  src: string;
  title: string;
  className?: string;
  height?: string | number;
  fallbackUrl?: string;
}

/**
 * Componente seguro para embed de mapas do Google
 * - Não usa innerHTML ou dangerouslySetInnerHTML
 * - Validação de URL do iframe
 * - Fallback visual em caso de erro
 */
export default function MapEmbed({ 
  src, 
  title, 
  className = "w-full h-full", 
  height = "100%",
  fallbackUrl = "https://goo.gl/maps/p9AQU44n2ey3Q8gZ7"
}: MapEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Validar URL do mapa - apenas permitir URLs do Google Maps
  const isValidMapUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      const allowedHosts = [
        'www.google.com',
        'google.com',
        'maps.google.com',
        'www.google.com.br',
        'google.com.br'
      ];
      return allowedHosts.some(host => parsedUrl.hostname === host || parsedUrl.hostname.endsWith('.google.com'));
    } catch {
      return false;
    }
  };

  useEffect(() => {
    // Validar URL antes de carregar
    if (!isValidMapUrl(src)) {
      console.warn('URL de mapa inválida ou não permitida:', src);
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Carregar o iframe apenas do lado do cliente
    if (iframeRef.current) {
      iframeRef.current.src = src;
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Componente de fallback em caso de erro
  if (hasError) {
    return (
      <div 
        className={`overflow-hidden rounded-lg ${className}`} 
        style={{ height }}
      >
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center h-full">
          <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            O mapa não pôde ser carregado
          </p>
          <a 
            href={fallbackUrl}
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-500 text-sm mt-2 hover:underline"
          >
            Ver no Google Maps
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`overflow-hidden rounded-lg relative ${className}`} 
      style={{ height }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
          <MapPin className="w-8 h-8 text-gray-400 animate-bounce" />
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        title={title}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={handleLoad}
        onError={handleError}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
}
