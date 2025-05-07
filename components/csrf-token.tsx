'use client'

import { useEffect, useState } from 'react'

/**
 * Componente que gera e armazena tokens CSRF para proteção de formulários
 * Deve ser incluído dentro de qualquer formulário que envia dados para a API
 */
export default function CSRFToken() {
  const [csrfToken, setCsrfToken] = useState<string>('')

  useEffect(() => {
    // Função para gerar token CSRF aleatório
    const generateToken = () => {
      const random = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15) +
                     Date.now().toString(36);
      return random;
    }

    // Verifica se já existe um token nos cookies, caso contrário gera um novo
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
      return '';
    }

    let token = getCookie('csrf');
    if (!token) {
      token = generateToken();
      // Configura cookie com SameSite=Strict e HttpOnly para segurança
      document.cookie = `csrf=${token}; path=/; max-age=3600; SameSite=Strict`;
    }
    
    setCsrfToken(token);
  }, []);

  // Retorna um input hidden com o token CSRF
  return (
    <>
      <input type="hidden" name="csrf_token" value={csrfToken} />
      {/* Adiciona também o token como um cabeçalho personalizado para solicitações fetch/axios */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Adiciona o token CSRF como header em todas as requisições fetch
            const originalFetch = window.fetch;
            window.fetch = function(url, options = {}) {
              options.headers = options.headers || {};
              options.headers['X-CSRF-Token'] = '${csrfToken}';
              return originalFetch(url, options);
            };
          `
        }}
      />
    </>
  );
} 