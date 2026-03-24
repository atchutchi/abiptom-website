"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

const projects = [
  {
    title: "Website ARN",
    category: "Desenvolvimento Web",
    image: "/images/portfolio/websites/arn.png",
    description: "Website institucional com sistema de gestão de conteúdo.",
  },
  {
    title: "Bissau Rising",
    category: "Design Gráfico",
    image: "/images/portfolio/graphicdesign/bissaurising-banner.png",
    description: "Banners e materiais para o fórum de investimentos.",
  },
  {
    title: "Youth Sounding Board",
    category: "Social Media",
    image: "/images/portfolio/graphicdesign/ysb-design-social-media-1.jpg",
    description: "Gestão de redes sociais e criação de conteúdo.",
  },
  {
    title: "Campanha MTN Boss",
    category: "Design Gráfico",
    image: "/images/portfolio/graphicdesign/campanha-boss-mtn-guine-bissau.jpg",
    description: "Campanha publicitária da MTN Guiné-Bissau.",
  },
  {
    title: "Hotel Uaque",
    category: "Desenvolvimento Web",
    image: "/images/portfolio/websites/hotel-uque.png",
    description: "Site com sistema de reservas e gestão hoteleira.",
  },
]

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
          className={i === 0 ? "md:col-span-2" : ""}
        >
          <Link href="/portfolio" className="group relative block overflow-hidden">
            <div className={`relative ${i === 0 ? "aspect-[21/9]" : "aspect-video"} overflow-hidden bg-obys-dark`}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 ease-obys-default group-hover:scale-105"
                sizes={i === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-obys" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
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
