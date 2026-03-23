import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { CrawlingLine } from "@/components/crawling-line"
import { PageTransition } from "@/components/page-transition"
import { TextSplitter } from "@/components/text-splitter"

const packages = [
  {
    name: "Básico",
    popular: false,
    features: [
      "10–12 posts por mês",
      "Até 3 plataformas geridas",
      "Consulta inicial e alinhamento",
      "Planificação estratégica simplificada",
    ],
  },
  {
    name: "Silver",
    popular: false,
    features: [
      "15–20 posts por mês",
      "Até 4 plataformas geridas",
      "2 posts patrocinados",
      "3 posts personalizados",
      "10 Instagram / Facebook Stories",
    ],
  },
  {
    name: "Gold",
    popular: true,
    features: [
      "26–30 posts por mês",
      "Até 5 plataformas geridas",
      "4 posts patrocinados",
      "5 posts personalizados",
      "15 Instagram / Facebook Stories",
      "1 concurso ou challenge",
    ],
  },
  {
    name: "Premium+",
    popular: false,
    features: [
      "31–40 posts por mês",
      "Até 5 plataformas geridas",
      "8 posts patrocinados",
      "10 posts personalizados",
      "20 Instagram / Facebook Stories",
      "Relatórios completos semanais",
    ],
  },
] as const

const processSteps = [
  {
    title: "Diagnóstico e briefing",
    description:
      "Reunimos contexto da marca, público-alvo, tom de voz e objetivos de negócio para definir o que as redes devem entregar.",
  },
  {
    title: "Estratégia e calendário",
    description:
      "Construímos linhas editoriais, temas e formatos por plataforma, com calendário claro de publicações e campanhas.",
  },
  {
    title: "Produção e publicação",
    description:
      "Criamos copy e peças visuais, agendamos posts e stories e garantimos consistência visual e narrativa.",
  },
  {
    title: "Monitorização e comunidade",
    description:
      "Acompanhamos comentários, mensagens e menções, respondendo com critério e protegendo a reputação da marca.",
  },
  {
    title: "Relatório e otimização",
    description:
      "Analisamos métricas, partilhamos insights e ajustamos conteúdo e investimento para melhorar resultados mês a mês.",
  },
] as const

const SocialMediaPage = () => {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-obys-near-black">
        {/* Hero */}
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block">Serviços</span>
            </AnimatedSection>
            <TextSplitter
              text="Social Media"
              as="h1"
              className="heading-hero text-white mb-8"
              splitBy="word"
              delay={0.15}
            />
            <AnimatedSection animation="fade-up" delay={350}>
              <p className="body-large text-obys-text-secondary max-w-3xl">
                Gestão profissional de redes sociais com estratégia, conteúdo e acompanhamento contínuo — para marcas
                que querem presença consistente, engajamento real e decisões baseadas em dados.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <div className="border-y border-obys-border-dark bg-obys-dark">
          <CrawlingLine
            items={[
              "Estratégia",
              "Conteúdo",
              "Instagram",
              "Facebook",
              "LinkedIn",
              "Community management",
              "Relatórios",
              "ABIPTOM",
            ]}
            speed={38}
            className="py-6"
          />
        </div>

        {/* Abordagem — 2 colunas */}
        <section className="section-padding bg-obys-dark" aria-labelledby="abordagem-heading">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
              <AnimatedSection animation="fade-right">
                <div>
                  <span className="text-label text-obys-gold mb-6 block">Como trabalhamos</span>
                  <h2 id="abordagem-heading" className="heading-section text-white mb-10">
                    Presença digital com método
                  </h2>
                  <p className="body-large text-obys-text-secondary mb-8">
                    As redes sociais são hoje um dos principais pontos de contacto entre marcas e audiências. Na ABIPTOM
                    planeamos cada plataforma em função dos seus objetivos: awareness, leads, comunidade ou suporte à
                    venda.
                  </p>
                  <p className="body-base text-obys-text-secondary">
                    Combinamos criatividade, rotinas de publicação fiáveis e leitura de métricas para que o esforço no
                    social se traduza em conversas, confiança e crescimento mensurável — sem depender apenas de
                    improviso ou trends isoladas.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="fade-left" delay={200}>
                <div className="relative aspect-video overflow-hidden border border-obys-border-dark">
                  <Image
                    alt="Serviços de gestão de redes sociais pela ABIPTOM"
                    className="object-cover"
                    src="/images/servicos/social-media.png"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Pacotes */}
        <section className="section-padding bg-obys-near-black" aria-labelledby="pacotes-heading">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
              <span className="text-label text-obys-gold mb-6 block">Oferta</span>
              <h2 id="pacotes-heading" className="heading-section text-white mb-8">
                Pacotes de gestão
              </h2>
              <p className="body-large text-obys-text-secondary">
                Escolha o nível de intensidade e de canais que faz sentido para a sua operação. Todos os planos podem
                ser ajustados após conversa com a nossa equipa.
              </p>
            </AnimatedSection>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {packages.map((pkg, index) => (
                <AnimatedSection key={pkg.name} animation="fade-up" delay={index * 80}>
                  <div
                    className={`relative flex flex-col h-full border p-8 bg-obys-near-black transition-colors duration-obys hover:border-obys-gold ${
                      pkg.popular ? "border-2 border-obys-gold" : "border-obys-border-dark"
                    }`}
                  >
                    {pkg.popular ? (
                      <span className="text-label text-obys-gold absolute -top-3 left-1/2 -translate-x-1/2 bg-obys-near-black px-4">
                        Popular
                      </span>
                    ) : null}
                    <h3 className="heading-subsection text-white mb-2 text-center">{pkg.name}</h3>
                    <p className="body-base text-obys-text-secondary text-center mb-8">Consultar preço</p>
                    <ul className="space-y-4 flex-1 mb-10">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-obys-text-secondary body-base">
                          <Check className="h-5 w-5 shrink-0 text-obys-gold mt-0.5" aria-hidden />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="obys-primary" size="xl" className="w-full mt-auto gap-2" asChild>
                      <Link href="/contacto">
                        Escolher plano
                        <ArrowRight className="h-5 w-5" aria-hidden />
                      </Link>
                    </Button>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Processo */}
        <section className="section-padding bg-obys-dark border-t border-obys-border-dark" aria-labelledby="processo-heading">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up" className="mb-16 lg:mb-20">
              <span className="text-label text-obys-gold mb-6 block">Processo</span>
              <h2 id="processo-heading" className="heading-section text-white mb-8 max-w-3xl">
                Como gerimos as suas contas
              </h2>
              <p className="body-large text-obys-text-secondary max-w-2xl">
                Um fluxo claro da primeira reunião à melhoria contínua, para que saiba sempre o que esperar em cada fase.
              </p>
            </AnimatedSection>

            <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 list-none p-0 m-0">
              {processSteps.map((step, index) => (
                <AnimatedSection key={step.title} animation="fade-up" delay={index * 70}>
                  <li className="border border-obys-border-dark p-8 bg-obys-near-black hover:border-obys-gold transition-colors duration-obys h-full flex flex-col">
                    <span className="text-label text-obys-gold mb-4">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="heading-subsection text-white mb-4">{step.title}</h3>
                    <p className="body-base text-obys-text-secondary flex-1">{step.description}</p>
                  </li>
                </AnimatedSection>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-obys-near-black border-t border-obys-border-dark">
          <div className="obys-container text-center">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block">Próximo passo</span>
              <h2 className="heading-hero text-white mb-8">Vamos conversar sobre o seu social?</h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto mb-12">
                Peça uma proposta ou esclareça dúvidas sobre pacotes, plataformas e prazos. Estamos disponíveis por
                formulário de contacto ou WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="obys-primary" size="xl" className="gap-2" asChild>
                  <Link href="/contacto">
                    Contactar a ABIPTOM
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </Link>
                </Button>
                <Button variant="outline-primary" size="xl" asChild>
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

export default SocialMediaPage
