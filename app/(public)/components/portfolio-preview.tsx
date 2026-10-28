"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { caseStudies } from "@/lib/case-studies"

const projects = caseStudies.map(item => ({
  title: item.client, category: 'Websites', image: item.portfolioImage, imageAlt: `Apresentação de ${item.client} em dispositivos`,
  description: item.description, href: `/blog/${item.slug}`,
}))

export function PortfolioPreview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
      {projects.map((project, i) => (
        <motion.div
          key={project.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            ease: [0.3, 0.86, 0.36, 0.95],
          }}
        >
          <Link href={project.href} className="group relative block overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-obys-dark">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                className="object-cover transition-transform duration-700 ease-obys-default group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-obys" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-obys">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-label text-obys-gold mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl text-white">
                      {project.title}
                    </h3>
                    <p className="font-body text-sm text-obys-text-secondary mt-1 max-w-md">
                      {project.description}
                    </p>
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center border border-white/30 text-white/60 group-hover:border-obys-gold group-hover:text-obys-gold transition-colors duration-obys flex-shrink-0 ml-4">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
