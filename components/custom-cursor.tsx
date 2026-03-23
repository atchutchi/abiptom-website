"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [cursorVariant, setCursorVariant] = useState("default")
  const [isMobile, setIsMobile] = useState(true)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const smoothX = useSpring(cursorX, springConfig)
  const smoothY = useSpring(cursorY, springConfig)

  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 1024px)").matches ||
        "ontouchstart" in window
      setIsMobile(mobile)

      if (mobile) {
        document.body.classList.remove("custom-cursor--enabled")
      } else {
        document.body.classList.add("custom-cursor--enabled")
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      setIsMobile(true)
      return
    }

    return () => {
      window.removeEventListener("resize", checkMobile)
      document.body.classList.remove("custom-cursor--enabled")
    }
  }, [])

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const handleElementHover = () => {
      const allInteractiveElements = document.querySelectorAll(
        "a, button, [role='button'], input, textarea, select, [data-cursor='pointer']"
      )

      allInteractiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorVariant("pointer"))
        el.addEventListener("mouseleave", () => setCursorVariant("default"))
      })

      const mediaElements = document.querySelectorAll(
        "img, video, [data-cursor='media']"
      )
      mediaElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorVariant("media"))
        el.addEventListener("mouseleave", () => setCursorVariant("default"))
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    handleElementHover()

    const observer = new MutationObserver(handleElementHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      observer.disconnect()
    }
  }, [isMobile, isVisible, cursorX, cursorY])

  if (isMobile) return null

  const sizeMap = {
    default: 16,
    pointer: 40,
    media: 60,
  }

  const size = sizeMap[cursorVariant as keyof typeof sizeMap] || 16

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      animate={{
        width: size,
        height: size,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className="absolute rounded-full bg-white"
        style={{
          width: size,
          height: size,
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s ease, height 0.3s ease",
        }}
      />
    </motion.div>
  )
}
