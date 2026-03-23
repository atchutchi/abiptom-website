"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

type TextSplitterProps = {
  text: string
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
  className?: string
  splitBy?: "word" | "char"
  delay?: number
  staggerDelay?: number
  once?: boolean
}

export const TextSplitter = ({
  text,
  as: Tag = "h2",
  className = "",
  splitBy = "word",
  delay = 0,
  staggerDelay = 0.04,
  once = true,
}: TextSplitterProps) => {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })

  const parts = splitBy === "word" ? text.split(" ") : text.split("")

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  const itemVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.3, 0.86, 0.36, 0.95],
      },
    },
  }

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`overflow-hidden ${className}`}
      aria-label={text}
    >
      <Tag className={className}>
        {parts.map((part, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              variants={itemVariants}
            >
              {part}
              {splitBy === "word" && i < parts.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  )
}
