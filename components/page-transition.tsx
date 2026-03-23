"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

type PageTransitionProps = {
  children: ReactNode
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.3, 0.86, 0.36, 0.95],
      }}
    >
      {children}
    </motion.div>
  )
}
