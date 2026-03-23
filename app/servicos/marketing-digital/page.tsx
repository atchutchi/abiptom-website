import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle } from "lucide-react"

import { AnimatedSection } from "@/components/animated-section"
import { CrawlingLine } from "@/components/crawling-line"
import { PageTransition } from "@/components/page-transition"
import { TextSplitter } from "@/components/text-splitter"
import { Button } from "@/components/ui/button"

const serviceBlocks = [
  {
    title: "SEO",
    description:
      "Otimização para motores de busca para aumentar o tráfego orgânico do seu site.",
    items: ["Pesquisa de palavras-chave", "Otimização on-page", "Construção de links", "SEO técnico"],
  },
  {
    title: "Google Ads",
    description: "Campanhas de anúncios pagos no Google para gerar leads e aumentar as conversões.",
    items: ["Anúncios de pesquisa", "Display e remarketing", "Campanhas de shopping", "Anúncios de vídeo no YouTube"],
  },
  {
    title: "Marketing de Conteúdo",
    description: "Criação de conteúdo relevante e valioso para atrair e engajar seu público-alvo.",
    items: ["Estratégia de conteúdo", "Redação para blogs", "E-books e whitepapers", "Infográficos e conteúdo visual"],
  },
  {
    title: "Email Marketing",
    description: "Comunicação direta e personalizada com seu público através de campanhas de email.",
    items: ["Estratégia de email marketing", "Criação de newsletters", "Automação de email", "Segmentação de listas"],
  },
  {
    title: "Mídia Social Paga",
    description:
      "Campanhas de anúncios nas redes sociais para aumentar o alcance e engajamento da sua marca.",
    items: [
      "Anúncios no Facebook e Instagram",
      "Campanhas no LinkedIn",
      "Twitter Ads",
      "Segmentação avançada de público",
    ],
  },
  {
    title: "Análise e Relatórios",
    description:
      "Monitoramento e análise de desempenho para otimizar suas estratégias de marketing digital.",
    items: ["Configuração de KPIs", "Relatórios personalizados", "Análise de dados", "Recomendações estratégicas"],
  },
] as const

const methodologySteps = [
  {
    step: 1,
    title: "Análise",
    description: "Estudo aprofundado do seu negócio, público-alvo, concorrentes e mercado.",
  },
  {
    step: 2,
    title: "Estratégia",
    description: "Desenvolvimento de estratégias personalizadas alinhadas aos seus objetivos de negócio.",
  },
  {
    step: 3,
    title: "Implementação",
    description: "Execução das estratégias com acompanhamento constante e ajustes em tempo real.",
  },
  {
    step: 4,
    title: "Monitoramento",
    description: "Análise contínua de resultados e otimização das campanhas para maximizar o ROI.",
  },
] as const

const MarketingDigitalPage = () => {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-obys-near-black">
        {/* Hero */}
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block font-body">Serviços</span>
            </AnimatedSection>
            <TextSplitter
              text="Marketing Digital"
              as="h1"
              className="heading-hero font-display text-white mb-8"
              splitBy="word"
              delay={0.15}
            />
            <AnimatedSection animation="fade-up" delay={350}>
              <p className="body-large text-obys-text-secondary max-w-2xl font-body">
                Estratégias digitais que aumentam a visibilidade da sua marca.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <div className="border-y border-obys-border-dark bg-obys-dark">
          <CrawlingLine
            items={["SEO", "Google Ads", "Conteúdo", "Email", "Social Ads", "Analytics", "ABIPTOM"]}
            speed={32}
            className="py-5"
          />
        </div>

        {/* Intro */}
        <section className="section-padding bg-obys-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <AnimatedSection animation="fade-up">
                <div className="space-y-6">
                  <span className="text-label text-obys-gold block font-body">Visibilidade</span>
                  <h2 className="heading-section text-white font-display">Potencialize sua presença digital</h2>
                  <p className="body-base text-obys-text-secondary font-body">
                    No mundo digital atual, ter uma estratégia de marketing eficaz é essencial para o crescimento de
                    qualquer negócio. Na ABIPTOM, desenvolvemos estratégias personalizadas que conectam sua marca ao
                    público certo, no momento certo e nos canais certos.
                  </p>
                  <p className="body-base text-obys-text-secondary font-body">
                    Nossa abordagem é baseada em dados e orientada para resultados, garantindo que cada ação de
                    marketing digital contribua para o alcance dos seus objetivos de negócio.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={150}>
                <div className="relative aspect-video overflow-hidden border border-obys-border-dark hover:border-obys-gold transition-colors duration-obys">
                  <Image
                    src="/images/servicos/marketing.png"
                    alt="Marketing Digital — estratégias e campanhas"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Serviços */}
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up">
              <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
                <span className="text-label text-obys-gold mb-4 block font-body">O que fazemos</span>
                <h2 className="heading-section text-white font-display mb-6">Nossos serviços</h2>
                <p className="body-large text-obys-text-secondary font-body">
                  Oferecemos uma ampla gama de serviços de marketing digital para impulsionar sua presença online.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {serviceBlocks.map((block, i) => (
                <AnimatedSection key={block.title} animation="fade-up" delay={i * 80}>
                  <article className="border border-obys-border-dark p-8 bg-obys-near-black hover:border-obys-gold transition-colors duration-obys h-full flex flex-col">
                    <h3 className="heading-subsection text-white font-display mb-3">{block.title}</h3>
                    <p className="body-base text-obys-text-secondary font-body mb-6 flex-1">{block.description}</p>
                    <ul className="space-y-3">
                      {block.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 font-body">
                          <CheckCircle className="w-4 h-4 text-obys-gold mt-0.5 flex-shrink-0" aria-hidden />
                          <span className="body-base text-obys-text-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Metodologia */}
        <section className="section-padding bg-obys-dark border-t border-obys-border-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up">
              <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
                <span className="text-label text-obys-gold mb-4 block font-body">Processo</span>
                <h2 className="heading-section text-white font-display mb-6">Nossa metodologia</h2>
                <p className="body-large text-obys-text-secondary font-body">
                  Trabalhamos de forma estruturada para garantir que suas campanhas de marketing digital sejam eficazes
                  e gerem os resultados esperados.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {methodologySteps.map((item, i) => (
                <AnimatedSection key={item.title} animation="fade-up" delay={i * 100}>
                  <div className="flex flex-col items-center text-center border border-obys-border-dark p-8 bg-obys-near-black hover:border-obys-gold transition-colors duration-obys h-full">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-obys-gold text-black font-display text-xl font-semibold mb-5"
                      aria-hidden
                    >
                      {item.step}
                    </div>
                    <h3 className="heading-subsection text-white font-display mb-3">{item.title}</h3>
                    <p className="body-base text-obys-text-secondary font-body">{item.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-obys-near-black border-t border-obys-border-dark">
          <div className="obys-container text-center">
            <AnimatedSection animation="scale-up">
              <h2 className="heading-hero text-white font-display mb-8">
                Pronto para impulsionar seu negócio online?
              </h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto mb-12 font-body">
                Entre em contato conosco e descubra como nossos serviços de marketing digital podem ajudar sua empresa
                a crescer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="obys-primary" size="xl">
                  <Link href="/contacto" className="flex items-center justify-center gap-2">
                    Fale conosco
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline-primary" size="xl">
                  <a
                    href="https://wa.me/245966865331"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    WhatsApp
                    <ArrowRight className="w-4 h-4" aria-hidden />
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

export default MarketingDigitalPage
