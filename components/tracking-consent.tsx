'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CONSENT_KEY, PREFERENCES_EVENT, readConsent, saveConsent, startMeasurement, trackPageView, trackContactClick, revokeMeasurement, nextConsentCheckDelay } from '@/lib/tracking'

export function CookiePreferencesButton() {
  return <button type="button" className="font-body text-xs text-obys-text-secondary hover:text-obys-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-obys-gold" onClick={() => window.dispatchEvent(new Event(PREFERENCES_EVENT))}>Preferências de cookies</button>
}

export function TrackingConsent({ gaId }: { gaId?: string }) {
  const pathname = usePathname()
  const [consent, setConsent] = useState<boolean | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = readConsent()
    setConsent(saved)
    setOpen(saved === null)
    const showPreferences = () => setOpen(true)
    const syncChoice = (event: StorageEvent) => {
      if (event.key !== CONSENT_KEY && event.key !== null) return
      // Recarregar também descarrega bibliotecas já carregadas noutra escolha.
      if (readConsent() !== true) revokeMeasurement()
      window.location.reload()
    }
    window.addEventListener(PREFERENCES_EVENT, showPreferences)
    window.addEventListener('storage', syncChoice)
    return () => {
      window.removeEventListener(PREFERENCES_EVENT, showPreferences)
      window.removeEventListener('storage', syncChoice)
    }
  }, [])

  useEffect(() => {
    if (consent !== true) return
    let timer: ReturnType<typeof setTimeout>
    const checkExpiry = () => {
      clearTimeout(timer)
      if (readConsent() !== true) {
        revokeMeasurement()
        window.location.reload()
        return
      }
      timer = setTimeout(checkExpiry, nextConsentCheckDelay())
    }
    checkExpiry()
    document.addEventListener('visibilitychange', checkExpiry)
    window.addEventListener('pageshow', checkExpiry)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', checkExpiry)
      window.removeEventListener('pageshow', checkExpiry)
    }
  }, [consent])

  useEffect(() => {
    if (consent !== true || !pathname || pathname.startsWith('/admin')) return
    startMeasurement(gaId)
    trackPageView(pathname, gaId)
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement)) return
      if (link.protocol === 'tel:') trackContactClick('phone')
      else if (link.protocol === 'mailto:') trackContactClick('email')
      else if (['wa.me', 'api.whatsapp.com'].includes(link.hostname)) trackContactClick('whatsapp')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [consent, pathname, gaId])

  const choose = (accepted: boolean) => {
    const wasAccepted = consent === true
    saveConsent(accepted)
    setConsent(accepted)
    setOpen(false)
    if (!accepted) {
      revokeMeasurement()
      if (wasAccepted) window.location.reload()
    }
  }

  if (!open) return null
  return (
    <section aria-label="Preferências de medição" className="fixed inset-x-3 bottom-3 z-[10001] mx-auto max-w-3xl border border-obys-gold bg-[#0A0A0A] p-5 text-white shadow-xl sm:p-6">
      <h2 className="font-display text-2xl mb-2">A tua escolha de cookies</h2>
      <p className="font-body text-sm leading-relaxed text-obys-text-secondary">Com a tua autorização, usamos o Meta Pixel e, quando configurado, o Google Analytics para medir visitas, pedidos de contacto e resultados de campanhas. Estes fornecedores recebem dados de navegação. Podes recusar e continuar a usar o site. Podes alterar a escolha no rodapé.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => choose(false)} className="min-h-11 border border-obys-gold px-5 py-2 font-body text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">Recusar medição</button>
        <button type="button" onClick={() => choose(true)} className="min-h-11 border border-obys-gold px-5 py-2 font-body text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">Aceitar medição</button>
        {consent !== null && <button type="button" onClick={() => setOpen(false)} className="min-h-11 px-3 py-2 font-body text-sm underline">Fechar</button>}
      </div>
    </section>
  )
}
