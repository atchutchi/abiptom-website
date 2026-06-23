"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Facebook, Instagram, Linkedin, Youtube } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { TextSplitter } from "@/components/text-splitter"
import { CrawlingLine } from "@/components/crawling-line"
import { TikTokIcon } from "./icons/tiktok"

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/abiptomsarl", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/abiptom_gb", icon: Instagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/abiptom-sarl", icon: Linkedin },
  { label: "YouTube", href: "https://youtube.com/@abiptom", icon: Youtube },
  { label: "TikTok", href: "https://www.tiktok.com/@abiptomsarl", icon: TikTokIcon },
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.3, 0.86, 0.36, 0.95] as const,
    },
  }),
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-obys-near-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_section.gif"
          alt=""
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="obys-container flex-1 flex flex-col justify-center py-32 lg:py-40 relative z-10">
        <div className="max-w-5xl">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-label text-obys-text-muted">
              Guardião das Novas Tecnologias
            </span>
          </motion.div>

          <TextSplitter
            text="Transformamos visões em experiências digitais"
            as="h1"
            className="heading-hero text-white mb-8"
            splitBy="word"
            delay={0.5}
            staggerDelay={0.06}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-12">
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <p className="body-large text-obys-text-secondary max-w-md">
                Soluções digitais de alto calibre para marcas que querem liderar. Design, desenvolvimento e estratégia sob medida.
              </p>
            </motion.div>

            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="obys-primary" size="lg">
                  <Link href="/servicos" className="flex items-center gap-2">
                    Nossos Serviços
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline-primary" size="lg">
                  <Link href="/contacto">Fale Conosco</Link>
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="flex items-center gap-5 mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center text-obys-text-muted hover:text-obys-gold transition-colors duration-obys ease-obys-default"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="border-t border-obys-border-dark relative z-10">
        <CrawlingLine
          items={[
            "Web Design",
            "Software",
            "Redes Sociais",
            "Audiovisual",
            "Design Gráfico",
            "Marketing Digital",
            "Fotografia",
            "Animação 2D",
          ]}
          speed={35}
          className="py-6"
        />
      </div>
    </section>
  )
}
