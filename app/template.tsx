"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

const Template = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.3, 0.86, 0.36, 0.95],
      }}
    >
      {children}
    </motion.div>
  )
}

export default Template
