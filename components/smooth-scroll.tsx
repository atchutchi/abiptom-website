"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Lenis from "lenis"

type SmoothScrollProps = {
  children: ReactNode
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    document.body.classList.add("has-scroll-smooth")

    return () => {
      lenis.destroy()
      document.body.classList.remove("has-scroll-smooth")
    }
  }, [])

  return <>{children}</>
}
