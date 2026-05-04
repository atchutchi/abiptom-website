"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ClientLogos } from "@/components/client-logos"
import { AnimatedSection } from "@/components/animated-section"
import { TextSplitter } from "@/components/text-splitter"
import { PageTransition } from "@/components/page-transition"

type PortfolioBaseItem = {
  title: string
  category: string
  description: string
}

type ImagePortfolioItem = PortfolioBaseItem & {
  type: "image"
  src: string
}

type VideoPortfolioItem = PortfolioBaseItem & {
  type: "video"
  videoUrl: string
}

type PortfolioItem = ImagePortfolioItem | VideoPortfolioItem

const categories = ["Todos", "Websites", "Design", "Social Media", "Vídeo", "Documentos"]

const getYouTubeVideoId = (videoUrl: string) => {
  try {
    const pathnameParts = new URL(videoUrl).pathname.split("/")
    const embedIndex = pathnameParts.indexOf("embed")
    return embedIndex >= 0 ? pathnameParts[embedIndex + 1] : null
  } catch {
    return null
  }
}

const getVideoThumbnailUrl = (videoUrl: string) => {
  const videoId = getYouTubeVideoId(videoUrl)
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "/placeholder.jpg"
}

const getPortfolioCover = (item: PortfolioItem) => {
  return item.type === "video" ? getVideoThumbnailUrl(item.videoUrl) : item.src
}

const portfolioItems: PortfolioItem[] = [
  { title: "Website ARN", category: "Websites", type: "image", src: "/images/portfolio/websites/arn.png", description: "Website institucional com CMS." },
  { title: "Website APBEF", category: "Websites", type: "image", src: "/images/portfolio/websites/apbef.png", description: "Portal institucional para associação bancária." },
  { title: "Website NDJAR", category: "Websites", type: "image", src: "/images/portfolio/websites/ndjar.png", description: "Site com catálogo de produtos e serviços." },
  { title: "Website Hotel Uaque", category: "Websites", type: "image", src: "/images/portfolio/websites/hotel-uque.png", description: "Site com sistema de reservas hoteleiras." },
  { title: "Website FUNDEI", category: "Websites", type: "image", src: "/images/portfolio/websites/fundei.png", description: "Portal com área de projectos e notícias." },
  { title: "Website Magui", category: "Websites", type: "image", src: "/images/portfolio/websites/magui.png", description: "E-commerce com catálogo de produtos." },
  { title: "Website ABIPTOM", category: "Websites", type: "image", src: "/images/portfolio/websites/abiptom.png", description: "Website institucional próprio." },
  { title: "Website Dacosta Music", category: "Websites", type: "image", src: "/images/portfolio/websites/dacosta-music.png", description: "Site para agência de artista." },
  { title: "Bissau Rising", category: "Design", type: "image", src: "/images/portfolio/graphicdesign/bissaurising-banner.png", description: "Banners para fórum de investimentos." },
  { title: "Campanha MTN Boss", category: "Design", type: "image", src: "/images/portfolio/graphicdesign/campanha-boss-mtn-guine-bissau.jpg", description: "Campanha publicitária MTN." },
  { title: "Caiiro Tour", category: "Design", type: "image", src: "/images/portfolio/graphicdesign/Caiiro-tour-setembro-social-media.png", description: "Material promocional para turnê musical." },
  { title: "YSB Agenda", category: "Design", type: "image", src: "/images/portfolio/graphicdesign/YSB_Agenda.png", description: "Materiais para Youth Sounding Board." },
  { title: "Campanha .GW", category: "Design", type: "image", src: "/images/portfolio/graphicdesign/gw-banner.png", description: "Banner para domínio nacional .GW." },
  { title: "Ateliê Afrochic", category: "Design", type: "image", src: "/images/portfolio/graphicdesign/atelie-afrochic-salao.png", description: "Material promocional para salão de beleza." },
  { title: "BioGuiné", category: "Design", type: "image", src: "/images/portfolio/graphicdesign/POLO-shirt_bioGuine.png", description: "Design de uniforme corporativo." },
  { title: "UNDP", category: "Design", type: "image", src: "/images/portfolio/graphicdesign/capa-documento-UNDP.jpg", description: "Capa para documento institucional." },
  { title: "Creative Industry", category: "Design", type: "image", src: "/images/portfolio/graphicdesign/flyer-evento-bissau-rising-criative-industry.png", description: "Flyer para indústria criativa." },
  { title: "Youth Sounding Board", category: "Social Media", type: "image", src: "/images/portfolio/graphicdesign/ysb-design-social-media-1.jpg", description: "Gestão de redes sociais e criação de conteúdo." },
  { title: "Bissau Rising Social", category: "Social Media", type: "image", src: "/images/portfolio/graphicdesign/flyer-bissau_rising_novembro_2022-07.jpg", description: "Estratégia digital para evento." },
  { title: "BISSAU RISING", category: "Vídeo", type: "video", videoUrl: "https://www.youtube.com/embed/N_Oq4NavzGA", description: "Impact Investment & Trade Forum." },
  { title: "Accelerator Lab", category: "Vídeo", type: "video", videoUrl: "https://www.youtube.com/embed/Rg8RjicC89Y", description: "Stakeholder Workshop and Launch." },
  { title: "DARLING Bissau", category: "Vídeo", type: "video", videoUrl: "https://www.youtube.com/embed/caVDyyjDCtA", description: "Produção audiovisual promocional." },
  { title: "Domínio .gw", category: "Vídeo", type: "video", videoUrl: "https://www.youtube.com/embed/rKKBUsQvJrQ", description: "Campanha de promoção do domínio nacional." },
  { title: "UN-HABITAT", category: "Vídeo", type: "video", videoUrl: "https://www.youtube.com/embed/IAuD98YppLQ", description: "Animação 2D informativa para eventos." },
  { title: "Aldeias SOS", category: "Vídeo", type: "video", videoUrl: "https://www.youtube.com/embed/O45iNfSO4tQ", description: "Animação 2D para campanha escolar." },
]

const PortfolioPage = () => {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  const filtered = activeCategory === "Todos"
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Hero */}
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block">Portfólio</span>
            </AnimatedSection>
            <TextSplitter
              text="Os nossos projectos"
              as="h1"
              className="heading-hero text-white mb-8"
              splitBy="word"
              delay={0.2}
            />
            <AnimatedSection animation="fade-up" delay={400}>
              <p className="body-large text-obys-text-secondary max-w-2xl">
                Projectos que demonstram a nossa capacidade de transformar visões em resultados tangíveis.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Filters + Gallery */}
        <section className="section-padding bg-obys-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            {/* Filter Tabs */}
            <AnimatedSection animation="fade-up">
              <div className="flex flex-wrap gap-3 mb-16">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-label px-4 py-2 border transition-all duration-obys ease-obys-default ${
                      activeCategory === cat
                        ? "border-obys-gold text-obys-gold bg-obys-gold/10"
                        : "border-obys-border-dark text-obys-text-muted hover:border-obys-gold hover:text-obys-gold"
                    }`}
                    type="button"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </AnimatedSection>

            {/* Gallery Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => (
                  <motion.div
                    key={item.title}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.3, 0.86, 0.36, 0.95] }}
                  >
                    <div className="group relative overflow-hidden bg-obys-near-black">
                      <div className="relative aspect-video overflow-hidden">
                        {item.type === "video" && playingVideo === item.title ? (
                          <iframe
                            src={item.videoUrl}
                            title={item.title}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <>
                            <Image
                              src={getPortfolioCover(item)}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-700 ease-obys-default group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-obys" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-obys-default">
                              <span className="text-label text-obys-gold mb-1 block">{item.category}</span>
                              <h3 className="font-display text-lg text-white mb-1">{item.title}</h3>
                              <p className="font-body text-xs text-obys-text-secondary">{item.description}</p>
                            </div>
                            {item.type === "video" && (
                              <button
                                onClick={() => setPlayingVideo(item.title)}
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-obys"
                                aria-label={`Reproduzir: ${item.title}`}
                                type="button"
                              >
                                <div className="w-16 h-16 rounded-full bg-obys-gold text-black flex items-center justify-center hover:scale-110 transition-transform">
                                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Clients */}
        <section className="section-padding-sm bg-obys-near-black border-y border-obys-border-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-in">
              <div className="text-center mb-10">
                <span className="text-label text-obys-text-muted">Clientes que confiam em nós</span>
              </div>
            </AnimatedSection>
            <ClientLogos />
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-obys-dark">
          <div className="obys-container text-center">
            <AnimatedSection animation="scale-up">
              <h2 className="heading-hero text-white mb-8">
                Vamos criar o seu próximo projecto?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="obys-primary" size="xl">
                  <Link href="/contacto">Fale Conosco</Link>
                </Button>
                <Button asChild variant="outline-primary" size="xl">
                  <a href="https://wa.me/245966865331" target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default PortfolioPage
