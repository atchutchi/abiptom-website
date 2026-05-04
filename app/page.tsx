import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"
import { PortfolioPreview } from "@/app/components/portfolio-preview"
import { TestimonialSlider } from "@/components/testimonial-slider"
import { ClientLogos } from "@/components/client-logos"
import { HeroSection } from "@/components/hero-section"
import { AnimatedSection } from "@/components/animated-section"
import { TextSplitter } from "@/components/text-splitter"
import { CrawlingLine } from "@/components/crawling-line"
import { PageTransition } from "@/components/page-transition"

const services = [
  {
    title: "Design Gráfico",
    description: "Identidades visuais, logotipos, brochuras e materiais que fortalecem marcas.",
    icon: "Palette",
    link: "/servicos/design-grafico",
  },
  {
    title: "Desenvolvimento Web",
    description: "Websites modernos, responsivos e optimizados para resultados reais.",
    icon: "Code",
    link: "/servicos/desenvolvimento-web",
  },
  {
    title: "Social Media",
    description: "Estratégias personalizadas para aumentar engajamento e alcance.",
    icon: "Share2",
    link: "/servicos/social-media",
  },
  {
    title: "Produção de Vídeo",
    description: "Vídeos promocionais e conteúdo audiovisual de alta qualidade.",
    icon: "Video",
    link: "/servicos/producao-video",
  },
  {
    title: "Fotografia",
    description: "Fotografia profissional para produtos, eventos e branding.",
    icon: "Camera",
    link: "/servicos/fotografia",
  },
  {
    title: "Marketing Digital",
    description: "Campanhas digitais orientadas por dados e resultados mensuráveis.",
    icon: "TrendingUp",
    link: "/servicos/marketing-digital",
  },
]

const values = [
  "Compromisso com a Qualidade",
  "Inovação Focada",
  "Profissionalismo",
  "Integridade",
  "Respeito pelo Cliente",
]

const Home = () => {
  return (
    <PageTransition>
      <div className="flex flex-col">
        <HeroSection />

        {/* Services */}
        <section
          className="section-padding bg-obys-near-black"
          aria-labelledby="services-heading"
        >
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <div className="mb-16 md:mb-24">
                <span className="text-label text-obys-gold mb-4 block">
                  Serviços
                </span>
                <TextSplitter
                  text="O que fazemos"
                  as="h2"
                  className="heading-section text-white"
                  splitBy="word"
                />
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              {services.map((service, i) => (
                <ServiceCard
                  key={service.title}
                  {...service}
                  index={i}
                />
              ))}
            </div>

            <AnimatedSection animation="fade-up" delay={400}>
              <div className="flex justify-center mt-16">
                <Button asChild variant="outline-primary" size="lg">
                  <Link href="/servicos" className="flex items-center gap-2">
                    Ver todos os serviços
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* About Preview */}
        <section
          className="section-padding bg-obys-dark"
          aria-labelledby="about-heading"
        >
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <AnimatedSection animation="fade-right">
                <div>
                  <span className="text-label text-obys-gold mb-4 block">
                    Quem Somos
                  </span>
                  <h2
                    id="about-heading"
                    className="heading-section text-white mb-8"
                  >
                    Guardião das Novas Tecnologias
                  </h2>
                  <p className="body-large text-obys-text-secondary mb-10">
                    Somos um grupo de consultores nacionais e internacionais
                    especializados em Marketing, Design Gráfico, Web Design e
                    Desenvolvimento de Software. Com forte presença na
                    Guiné-Bissau, transformamos ideias em realidade.
                  </p>
                  <div className="space-y-4 mb-10">
                    {values.map((value) => (
                      <div key={value} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-obys-gold flex-shrink-0" />
                        <span className="font-body text-obys-text-light text-sm">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="obys-primary" size="lg">
                    <Link href="/quem-somos">Saiba mais sobre nós</Link>
                  </Button>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-left" delay={200}>
                <div className="relative aspect-[4/5] overflow-hidden bg-obys-near-black">
                  <Image
                    alt="Equipa ABIPTOM"
                    className="object-cover"
                    src="/images/foto_1.png"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obys-dark/40 to-transparent" />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Crawling Line Divider */}
        <div className="border-y border-obys-border-dark bg-obys-near-black">
          <CrawlingLine
            items={[
              "Inovação",
              "Qualidade",
              "Compromisso",
              "Criatividade",
              "Profissionalismo",
              "Excelência",
            ]}
            speed={40}
            className="py-6"
          />
        </div>

        {/* Portfolio */}
        <section
          className="section-padding bg-obys-near-black"
          aria-labelledby="portfolio-heading"
        >
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24 gap-6">
                <div>
                  <span className="text-label text-obys-gold mb-4 block">
                    Portfólio
                  </span>
                  <h2
                    id="portfolio-heading"
                    className="heading-section text-white"
                  >
                    Projectos
                  </h2>
                </div>
                <p className="body-base text-obys-text-secondary max-w-md">
                  Projectos que demonstram a nossa capacidade de transformar visões em resultados tangíveis.
                </p>
              </div>
            </AnimatedSection>

            <PortfolioPreview />

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="flex justify-center mt-16">
                <Button asChild variant="outline-primary" size="lg">
                  <Link href="/portfolio" className="flex items-center gap-2">
                    Ver portfólio completo
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Testimonials */}
        <section
          className="section-padding bg-obys-dark"
          aria-labelledby="testimonials-heading"
        >
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <div className="text-center mb-16 md:mb-24">
                <span className="text-label text-obys-gold mb-4 block">
                  Depoimentos
                </span>
                <h2
                  id="testimonials-heading"
                  className="heading-section text-white"
                >
                  Confiança
                </h2>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={200}>
              <TestimonialSlider />
            </AnimatedSection>
          </div>
        </section>

        {/* Clients */}
        <section
          className="section-padding-sm bg-obys-near-black border-y border-obys-border-dark"
          aria-labelledby="clients-heading"
        >
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-in">
              <div className="text-center mb-10">
                <span className="text-label text-obys-text-muted">
                  Empresas que confiam em nós
                </span>
              </div>
            </AnimatedSection>
            <ClientLogos />
          </div>
        </section>

        {/* CTA */}
        <section
          className="section-padding bg-obys-near-black"
          aria-labelledby="cta-heading"
        >
          <div className="obys-container text-center">
            <AnimatedSection animation="scale-up">
              <span className="text-label text-obys-gold mb-6 block">
                Pronto?
              </span>
              <h2
                id="cta-heading"
                className="heading-hero text-white mb-8"
              >
                Vamos criar algo extraordinário
              </h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto mb-12">
                Entre em contacto e descubra como podemos transformar a presença digital da sua marca.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="obys-primary" size="xl">
                  <Link href="/contacto">Fale Conosco</Link>
                </Button>
                <Button asChild variant="outline-primary" size="xl">
                  <a
                    href="https://wa.me/245966865331"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Blog Preview */}
        <section
          className="section-padding bg-obys-dark"
          aria-labelledby="blog-heading"
        >
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <div className="mb-16 md:mb-24">
                <span className="text-label text-obys-gold mb-4 block">
                  Blog
                </span>
                <h2
                  id="blog-heading"
                  className="heading-section text-white"
                >
                  Insights
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={100}>
              <Link href="/blog/branding-unido-amae-guine-bissau" className="group block">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="relative aspect-video overflow-hidden bg-obys-near-black">
                    <Image
                      alt="Projeto de Branding UNIDO e AMAE"
                      className="object-cover transition-transform duration-700 ease-obys-default group-hover:scale-105"
                      src="/images/blog/reuniao-com-unido-e-amae-branding.jpg"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="py-4">
                    <span className="text-label text-obys-text-muted mb-4 block">
                      15 Março, 2024
                    </span>
                    <h3 className="heading-subsection text-white mb-4 group-hover:text-obys-gold transition-colors duration-obys">
                      Concluímos com Sucesso o Projeto de Branding para 21 Marcas
                    </h3>
                    <p className="body-base text-obys-text-secondary">
                      Em colaboração com a UNIDO e a AMAE, desenvolvemos identidades visuais para 21 marcas de mulheres empreendedoras.
                    </p>
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="flex justify-center mt-16">
                <Button asChild variant="outline-primary" size="lg">
                  <Link href="/blog" className="flex items-center gap-2">
                    Ver todos os artigos
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default Home
