import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"

import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { CrawlingLine } from "@/components/crawling-line"
import { PageTransition } from "@/components/page-transition"
import { TextSplitter } from "@/components/text-splitter"

const photographyServices = [
  {
    title: "Fotografia de Produto",
    description:
      "Imagens de catálogo e e-commerce que destacam materiais, texturas e detalhes, prontas para vender online ou em suportes impressos.",
    points: ["Iluminação de estúdio ou cenário", "Composição alinhada à marca", "Exportação em alta resolução"],
  },
  {
    title: "Fotografia Corporativa",
    description:
      "Retratos de equipa, ambientes e reportagens institucionais que reforçam confiança e profissionalismo junto de clientes e parceiros.",
    points: ["Retratos e headshots", "Reportagem de escritório e operações", "Banco de imagens para comunicação"],
  },
  {
    title: "Cobertura de Eventos",
    description:
      "Registo completo de conferências, lançamentos, cerimónias e encontros corporativos, com foco nos momentos que importam.",
    points: ["Cobertura contínua do evento", "Momentos-chave e networking", "Entrega ágil para redes e imprensa"],
  },
  {
    title: "Fotografia para Redes Sociais",
    description:
      "Séries de imagens pensadas para feed, stories e campanhas, com formatos e ritmo visual adequados a cada plataforma.",
    points: ["Planificação de conteúdo visual", "Formatos otimizados por rede", "Coerência com a identidade da marca"],
  },
  {
    title: "Fotografia de Interiores / Arquitectura",
    description:
      "Valorização de espaços comerciais, hotéis, escritórios e projectos arquitectónicos com perspectiva, luz e detalhe.",
    points: ["Interiores e exteriores", "Correcção de perspectiva e cor", "Entrega para web, brochuras e concursos"],
  },
]

const processSteps = [
  {
    step: "01",
    title: "Briefing",
    description:
      "Reunimos objectivos, público-alvo, locais, prazos e canais de utilização das imagens para definir um plano claro.",
  },
  {
    step: "02",
    title: "Sessão",
    description:
      "Realizamos a produção no local ou em estúdio, com equipamento profissional e direcção para obter o máximo de cada enquadramento.",
  },
  {
    step: "03",
    title: "Edição",
    description:
      "Selecção, retoque e tratamento de cor para um resultado consistente com a sua marca e com os formatos acordados.",
  },
  {
    step: "04",
    title: "Entrega",
    description:
      "Entrega dos ficheiros finais nos formatos e resoluções necessários, com organização para fácil uso pela sua equipa.",
  },
]

const FotografiaPage = () => {
  return (
    <PageTransition>
      <div className="flex flex-col">
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block">Serviços</span>
            </AnimatedSection>
            <TextSplitter
              text="Fotografia"
              as="h1"
              className="heading-hero text-white mb-8"
              splitBy="word"
              delay={0.15}
            />
            <AnimatedSection animation="fade-up" delay={350}>
              <p className="body-large text-obys-text-secondary max-w-2xl">
                Fotografia profissional para produtos, eventos e conteúdo corporativo — imagens que elevam a sua comunicação
                visual.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <div className="border-y border-obys-border-dark bg-obys-near-black">
          <CrawlingLine
            items={["Produto", "Corporativo", "Eventos", "Redes sociais", "Arquitectura", "Marca"]}
            speed={32}
            className="py-6"
          />
        </div>

        <section className="section-padding bg-obys-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <AnimatedSection animation="fade-up">
                <span className="text-label text-obys-gold mb-4 block">Descrição</span>
                <h2 className="heading-section text-white mb-8">Imagens com propósito</h2>
                <p className="body-large text-obys-text-secondary mb-6">
                  Combinamos técnica, luz e narrativa visual para que cada sessão responda a objectivos concretos: vender,
                  informar, celebrar ou posicionar a sua marca.
                </p>
                <p className="body-base text-obys-text-secondary">
                  Trabalhamos com equipamento profissional e fluxos de edição consistentes, desde o primeiro contacto até à
                  entrega final, em estreita colaboração com a sua equipa.
                </p>
              </AnimatedSection>
              <AnimatedSection animation="fade-left" delay={150}>
                <div className="relative aspect-video w-full overflow-hidden border border-obys-border-dark">
                  <Image
                    src="/images/servicos/fotografias.jpg"
                    alt="Sessão de fotografia profissional ABIPTOM"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <div className="border-y border-obys-border-dark bg-obys-dark">
          <CrawlingLine
            items={["Luz", "Composição", "Cor", "Detalhe", "Marca", "Resultado"]}
            speed={28}
            className="py-6"
          />
        </div>

        <section className="section-padding bg-obys-near-black">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up">
              <div className="mb-16 md:mb-20">
                <span className="text-label text-obys-gold mb-4 block">O que fazemos</span>
                <h2 className="heading-section text-white mb-6">Serviços de fotografia</h2>
                <p className="body-large text-obys-text-secondary max-w-2xl">
                  Soluções à medida para produto, institucional, eventos, digital e espaços físicos.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photographyServices.map((item, i) => (
                <AnimatedSection key={item.title} animation="fade-up" delay={i * 80}>
                  <article className="border border-obys-border-dark p-8 bg-obys-near-black hover:border-obys-gold transition-colors duration-obys h-full flex flex-col">
                    <h3 className="heading-subsection text-white mb-4">{item.title}</h3>
                    <p className="body-base text-obys-text-secondary mb-6 flex-1">{item.description}</p>
                    <ul className="space-y-3">
                      {item.points.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-obys-gold mt-0.5 shrink-0" aria-hidden />
                          <span className="body-base text-obys-text-secondary">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-obys-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up">
              <div className="mb-16 md:mb-20 text-center max-w-2xl mx-auto">
                <span className="text-label text-obys-gold mb-4 block">Processo</span>
                <h2 className="heading-section text-white mb-6">Do briefing à entrega</h2>
                <p className="body-large text-obys-text-secondary">
                  Quatro fases claras para garantir imagens alinhadas com a sua expectativa e prazos.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((phase, i) => (
                <AnimatedSection key={phase.title} animation="fade-up" delay={i * 100}>
                  <div className="border border-obys-border-dark p-8 bg-obys-near-black hover:border-obys-gold transition-colors duration-obys h-full text-center">
                    <span className="text-label text-obys-gold mb-4 block">{phase.step}</span>
                    <h3 className="heading-subsection text-white mb-4">{phase.title}</h3>
                    <p className="body-base text-obys-text-secondary">{phase.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-obys-near-black border-t border-obys-border-dark">
          <div className="obys-container text-center">
            <AnimatedSection animation="scale-up">
              <span className="text-label text-obys-gold mb-6 block">Contacto</span>
              <h2 className="heading-hero text-white mb-8">Vamos planear a sua próxima sessão?</h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto mb-12">
                Fale connosco para orçamento, disponibilidade ou ideias de projecto. Respondemos por email, formulário ou
                WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="obys-primary" size="xl">
                  <Link href="/contacto" className="flex items-center gap-2">
                    Contactar <ArrowRight className="w-4 h-4" aria-hidden />
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

export default FotografiaPage
