"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"

type AnimatedSectionProps = {
  children: ReactNode
  animation?: "fade-up" | "fade-left" | "fade-right" | "fade-in" | "scale-up"
  delay?: number
  className?: string
}

const animationMap = {
  "fade-up": { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
  "fade-left": { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
  "fade-right": { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  "fade-in": { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  "scale-up": { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
}

export function AnimatedSection({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const variants = animationMap[animation]

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            duration: 0.7,
            delay: delay / 1000,
            ease: [0.3, 0.86, 0.36, 0.95],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
