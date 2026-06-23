'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Mostrar o botão quando o usuário rolar mais de 500px
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Adicionar listener de scroll
    window.addEventListener('scroll', toggleVisibility)

    // Limpar listener quando o componente for desmontado
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 rounded-full w-12 h-12 bg-yellow hover:bg-yellow-hover shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
    >
      <ArrowUp className="h-6 w-6 text-black" />
    </button>
  )
}
