'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense, useMemo } from 'react'

// Declaração para TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

/**
 * Valida o formato do Google Analytics Measurement ID
 * Formatos válidos: G-XXXXXXXX (GA4) ou UA-XXXXXXX-X (Universal Analytics)
 */
function isValidGAMeasurementId(id: string): boolean {
  if (!id || typeof id !== 'string') return false
  
  // GA4 format: G-XXXXXXXXXX (G- followed by alphanumeric characters)
  const ga4Pattern = /^G-[A-Z0-9]{6,15}$/i
  
  // Universal Analytics format: UA-XXXXXXX-X
  const uaPattern = /^UA-\d{4,10}-\d{1,4}$/
  
  return ga4Pattern.test(id) || uaPattern.test(id)
}

/**
 * Escapa caracteres especiais para evitar XSS em strings injetadas
 */
function escapeForJS(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/</g, '\\x3c')
    .replace(/>/g, '\\x3e')
    .replace(/&/g, '\\x26')
}

function GoogleAnalyticsInner({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && typeof window !== 'undefined' && window.gtag) {
      // Sanitizar o pathname antes de enviar
      const safePath = pathname.replace(/[<>"'&]/g, '')
      const safeSearch = searchParams.toString().replace(/[<>"'&]/g, '')
      
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: safePath + (safeSearch ? `?${safeSearch}` : ''),
      })
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID])

  return null
}

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string
}

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) {
  // Validar o ID antes de renderizar
  const isValid = useMemo(() => isValidGAMeasurementId(GA_MEASUREMENT_ID), [GA_MEASUREMENT_ID])
  
  // Se o ID não for válido, não renderizar nada
  if (!isValid) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`GoogleAnalytics: Invalid GA_MEASUREMENT_ID format: ${GA_MEASUREMENT_ID}`)
    }
    return null
  }

  // Escapar o ID para uso seguro no script
  const safeGAId = escapeForJS(GA_MEASUREMENT_ID)

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${safeGAId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=Strict;Secure'
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <GoogleAnalyticsInner GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
      </Suspense>
    </>
  )
}
