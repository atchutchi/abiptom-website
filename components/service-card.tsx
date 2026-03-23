"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { motion } from "framer-motion"

type ServiceCardProps = {
  title: string
  description: string
  icon: string
  link: string
  index?: number
}

export function ServiceCard({ title, description, icon, link, index = 0 }: ServiceCardProps) {
  const Icon = LucideIcons[icon as keyof typeof LucideIcons] as LucideIcon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.3, 0.86, 0.36, 0.95],
      }}
    >
      <Link href={link} className="group block">
        <div className="border border-obys-border-dark p-8 lg:p-10 transition-all duration-obys ease-obys-default hover:border-obys-gold bg-obys-near-black hover:bg-obys-dark/50">
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 flex items-center justify-center border border-obys-border-dark text-obys-text-secondary group-hover:border-obys-gold group-hover:text-obys-gold transition-colors duration-obys ease-obys-default">
              {Icon && <Icon className="w-5 h-5" />}
            </div>
            <ArrowUpRight className="w-5 h-5 text-obys-text-muted group-hover:text-obys-gold transition-all duration-obys ease-obys-default group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <h3 className="font-display text-xl lg:text-2xl xl:text-[1.75rem] font-normal leading-tight text-white mb-4 group-hover:text-obys-gold transition-colors duration-obys ease-obys-default break-words hyphens-auto">
            {title}
          </h3>
          <p className="body-base text-obys-text-secondary">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
