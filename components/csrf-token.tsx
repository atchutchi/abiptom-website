'use client'

import { useEffect, useState, useCallback } from 'react'

/**
 * Componente que gera e armazena tokens CSRF para proteção de formulários
 * Deve ser incluído dentro de qualquer formulário que envia dados para a API
 * 
 * Segurança:
 * - Token gerado com crypto.getRandomValues() para maior aleatoriedade
 * - Cookie configurado com SameSite=Strict
 * - Fetch interceptado para adicionar header automaticamente
 */

// Função para gerar token CSRF seguro
function generateSecureToken(): string {
  // Usa crypto.getRandomValues para maior segurança quando disponível
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  // Fallback para ambientes sem crypto
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36)
}

// Função para obter cookie
function getCookie(name: string): string {
  if (typeof document === 'undefined') return ''
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
  return ''
}

// Função para definir cookie
function setCookie(name: string, value: string, maxAge: number = 3600): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`
}

export default function CSRFToken() {
  const [csrfToken, setCsrfToken] = useState<string>('')
  const [isInitialized, setIsInitialized] = useState(false)

  // Setup do interceptor de fetch
  const setupFetchInterceptor = useCallback((token: string) => {
    if (typeof window === 'undefined') return

    // Guardar referência original se ainda não guardada
    const originalFetch = (window as any).__originalFetch || window.fetch
    if (!(window as any).__originalFetch) {
      (window as any).__originalFetch = window.fetch
    }

    // Criar novo interceptor
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const options = init || {}
      const headers = new Headers(options.headers || {})
      
      // Adicionar token CSRF apenas para requests POST, PUT, DELETE, PATCH
      const method = (options.method || 'GET').toUpperCase()
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        headers.set('X-CSRF-Token', token)
      }
      
      return originalFetch(input, {
        ...options,
        headers
      })
    }
  }, [])

  useEffect(() => {
    // Verificar se já existe um token nos cookies
    let token = getCookie('csrf')
    
    if (!token) {
      // Gerar novo token seguro
      token = generateSecureToken()
      setCookie('csrf', token, 3600) // 1 hora
    }
    
    setCsrfToken(token)
    setupFetchInterceptor(token)
    setIsInitialized(true)

    // Cleanup: restaurar fetch original quando o componente for desmontado
    return () => {
      if (typeof window !== 'undefined' && (window as any).__originalFetch) {
        window.fetch = (window as any).__originalFetch
      }
    }
  }, [setupFetchInterceptor])

  // Não renderizar nada até estar inicializado
  if (!isInitialized) {
    return null
  }

  // Retorna apenas o input hidden com o token CSRF
  return (
    <input 
      type="hidden" 
      name="csrf_token" 
      value={csrfToken} 
      aria-hidden="true"
      readOnly
    />
  )
}

// Hook para obter o token CSRF programaticamente
export function useCSRFToken(): string {
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    let csrfToken = getCookie('csrf')
    if (!csrfToken) {
      csrfToken = generateSecureToken()
      setCookie('csrf', csrfToken, 3600)
    }
    setToken(csrfToken)
  }, [])

  return token
}
