'use client'

import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'fade-in' | 'scale-up'
  delay?: number
  className?: string
}

export function AnimatedSection({
  children,
  animation = 'fade-up',
  delay = 0,
  className = ''
}: AnimatedSectionProps) {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true
  })

  const animationClasses = {
    'fade-up': 'translate-y-10 opacity-0',
    'fade-left': 'translate-x-10 opacity-0',
    'fade-right': '-translate-x-10 opacity-0',
    'fade-in': 'opacity-0',
    'scale-up': 'scale-95 opacity-0'
  }

  const visibleClasses = 'translate-y-0 translate-x-0 opacity-100 scale-100'

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? visibleClasses : animationClasses[animation]
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

