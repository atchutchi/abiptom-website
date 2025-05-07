"use client";

import { useEffect, useRef } from 'react';

interface MapEmbedProps {
  src: string;
  title: string;
  className?: string;
  height?: string | number;
}

export default function MapEmbed({ src, title, className = "w-full h-full", height = "100%" }: MapEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Carregar o iframe apenas do lado do cliente
    if (iframeRef.current) {
      iframeRef.current.src = src;
    }
    
    // Adicionar tratamento de erro para o iframe
    const handleIframeError = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg text-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-12 h-12 text-gray-400 mb-3">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            <p class="text-sm text-gray-600">O mapa não pôde ser carregado</p>
            <a href="https://goo.gl/maps/p9AQU44n2ey3Q8gZ7" target="_blank" rel="noopener noreferrer" class="text-yellow-600 text-sm mt-2 hover:underline">
              Ver no Google Maps
            </a>
          </div>
        `;
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('error', handleIframeError);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('error', handleIframeError);
      }
    };
  }, [src]);

  return (
    <div ref={containerRef} className={`overflow-hidden rounded-lg ${className}`} style={{ height }}>
      <iframe
        ref={iframeRef}
        title={title}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
} 