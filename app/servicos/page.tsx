import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"
import { AnimatedSection } from "@/components/animated-section"
import { TextSplitter } from "@/components/text-splitter"
import { CrawlingLine } from "@/components/crawling-line"
import { PageTransition } from "@/components/page-transition"

const services = [
  {
    title: "Design Gráfico",
    description: "Identidades visuais, logotipos, brochuras e materiais que fortalecem a sua marca.",
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
    title: "Animação 2D",
    description: "Animações criativas que capturam a atenção do público.",
    icon: "Zap",
    link: "/servicos/animacao-2d",
  },
  {
    title: "Marketing Digital",
    description: "Campanhas orientadas por dados para gerar leads e visibilidade.",
    icon: "TrendingUp",
    link: "/servicos/marketing-digital",
  },
  {
    title: "Desenvolvimento de Software",
    description: "Soluções de software personalizadas para optimizar processos.",
    icon: "Database",
    link: "/servicos/desenvolvimento-software",
  },
  {
    title: "Redes, Cablagem e HelpDesk",
    description: "Infraestrutura de rede, cablagem e suporte técnico especializado.",
    icon: "Server",
    link: "/servicos/redes-cablagem-helpdesk",
  },
]

const packages = [
  {
    name: "Básico",
    features: ["15-20 Posts por mês", "3 plataformas geridas", "Consulta inicial", "Planificação estratégica simplificada"],
    highlighted: false,
  },
  {
    name: "Silver",
    features: ["21-25 Posts por mês", "4 plataformas geridas", "2 posts pagos", "3 posts personalizados", "10 Instagram/Facebook Stories"],
    highlighted: false,
  },
  {
    name: "Gold",
    features: ["26-30 Posts por mês", "5 plataformas geridas", "4 posts pagos", "5 posts personalizados", "15 Instagram/Facebook Stories", "1 Concurso/Challenge"],
    highlighted: true,
  },
  {
    name: "Premium+",
    features: ["31-40 Posts por mês", "5 plataformas geridas", "8 posts pagos", "10 posts personalizados", "20 Instagram/Facebook Stories", "Relatórios completos semanais"],
    highlighted: false,
  },
]

const ServicesPage = () => {
  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Hero */}
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block">Serviços</span>
            </AnimatedSection>
            <TextSplitter
              text="Soluções que transformam"
              as="h1"
              className="heading-hero text-white mb-8"
              splitBy="word"
              delay={0.2}
            />
            <AnimatedSection animation="fade-up" delay={400}>
              <p className="body-large text-obys-text-secondary max-w-2xl">
                Soluções digitais personalizadas e de alto calibre para impulsionar o seu negócio.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section-padding bg-obys-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              {services.map((service, i) => (
                <ServiceCard key={service.title} {...service} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Crawling Line */}
        <div className="border-y border-obys-border-dark bg-obys-near-black">
          <CrawlingLine
            items={["Web Design", "Software", "Redes Sociais", "Audiovisual", "Design Gráfico", "Marketing"]}
            speed={35}
            className="py-6"
          />
        </div>

        {/* Social Media Packages */}
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up">
              <div className="mb-16 md:mb-24">
                <span className="text-label text-obys-gold mb-4 block">Pacotes</span>
                <h2 className="heading-section text-white mb-6">
                  Gestão de Redes Sociais
                </h2>
                <p className="body-large text-obys-text-secondary max-w-xl">
                  As redes sociais são uma das maneiras mais importantes de criar confiança com os clientes.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
              {packages.map((pkg, i) => (
                <AnimatedSection key={pkg.name} animation="fade-up" delay={i * 100}>
                  <div
                    className={`relative p-8 lg:p-10 border transition-colors duration-obys ${
                      pkg.highlighted
                        ? "border-obys-gold bg-obys-dark"
                        : "border-obys-border-dark bg-obys-near-black hover:border-obys-gold"
                    }`}
                  >
                    {pkg.highlighted && (
                      <span className="absolute top-0 right-0 bg-obys-gold text-black text-xs font-bold uppercase tracking-wider px-3 py-1">
                        Popular
                      </span>
                    )}
                    <h3 className={`font-display text-2xl mb-6 ${pkg.highlighted ? "text-obys-gold" : "text-white"}`}>
                      {pkg.name}
                    </h3>
                    <p className="text-label text-obys-text-muted mb-8">Consultar preço</p>
                    <ul className="space-y-3 mb-10">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-obys-gold mt-0.5 flex-shrink-0" />
                          <span className="font-body text-sm text-obys-text-secondary">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant={pkg.highlighted ? "obys-primary" : "outline-primary"}
                      className="w-full"
                    >
                      <Link href="/contacto">Escolher Plano</Link>
                    </Button>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-obys-dark border-t border-obys-border-dark">
          <div className="obys-container text-center">
            <AnimatedSection animation="scale-up">
              <h2 className="heading-hero text-white mb-8">
                Vamos transformar as suas ideias?
              </h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto mb-12">
                Entre em contacto e descubra como podemos ajudar a sua empresa a crescer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="obys-primary" size="xl">
                  <Link href="/contacto" className="flex items-center gap-2">
                    Fale Conosco <ArrowRight className="w-4 h-4" />
                  </Link>
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

export default ServicesPage
