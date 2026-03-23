"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (sessionStorage.getItem("preloaded") || prefersReducedMotion) {
      setIsLoading(false)
      setHasLoaded(true)
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
      sessionStorage.setItem("preloaded", "true")
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading && !hasLoaded) {
      const exitTimer = setTimeout(() => setHasLoaded(true), 800)
      return () => clearTimeout(exitTimer)
    }
  }, [isLoading, hasLoaded])

  if (hasLoaded) return null

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ backgroundColor: "var(--bg-black)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.4, 0, 0, 1] } }}
        >
          <div className="flex flex-col items-center gap-8">
            <motion.h1
              className="font-display text-obys-gold text-5xl md:text-7xl font-light tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.3, 0.86, 0.36, 0.95] }}
            >
              ABIPTOM
            </motion.h1>
            <motion.p
              className="font-body text-obys-text-secondary text-sm tracking-[0.2em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Guardião das Novas Tecnologias
            </motion.p>
            <motion.div
              className="w-24 h-[1px] bg-obys-gold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.4, 0, 0, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
