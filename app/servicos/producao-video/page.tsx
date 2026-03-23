import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"

import { AnimatedSection } from "@/components/animated-section"
import { CrawlingLine } from "@/components/crawling-line"
import { PageTransition } from "@/components/page-transition"
import { TextSplitter } from "@/components/text-splitter"
import { Button } from "@/components/ui/button"

const videoServices = [
  {
    title: "Vídeo Institucional",
    description:
      "Apresente a sua empresa, valores e equipa com narrativa clara e imagem profissional que reforça confiança.",
    bullets: ["Roteiro alinhado à marca", "Filmagem em alta definição", "Tom adequado ao público-alvo"],
  },
  {
    title: "Vídeo Promocional",
    description:
      "Destaque produtos e serviços com mensagens diretas, criatividade e apelo emocional para converter atenção em ação.",
    bullets: ["Conceito e storytelling", "Foco em benefícios", "Calls-to-action eficazes"],
  },
  {
    title: "Cobertura de Eventos",
    description:
      "Registo completo de conferências, lançamentos e encontros corporativos, com material pronto para redes e arquivo institucional.",
    bullets: ["Multi-câmara quando necessário", "Entrevistas e momentos-chave", "Resumos e highlights"],
  },
  {
    title: "Animação 2D / Motion Graphics",
    description:
      "Explique ideias complexas com motion design, infografia animada e identidade em movimento.",
    bullets: ["Storyboard e style frames", "Motion graphics e tipografia animada", "Entrega em formatos digitais"],
  },
  {
    title: "Edição e Pós-Produção",
    description:
      "Montagem, cor, som, legendas e masterização para entregar ficheiros prontos para web, TV ou redes sociais.",
    bullets: ["Corte rítmico e narrativo", "Cor e tratamento de imagem", "Mixagem e exportação multiformato"],
  },
]

const processSteps = [
  {
    step: "01",
    title: "Briefing",
    description:
      "Alinhamos objetivos, público, mensagens-chave, prazos e canais de distribuição para definir o rumo do projeto.",
  },
  {
    step: "02",
    title: "Pré-Produção",
    description:
      "Roteiro, planeamento de locações ou assets gráficos, casting e cronograma — tudo documentado antes de gravar ou animar.",
  },
  {
    step: "03",
    title: "Filmagem / Criação",
    description:
      "Execução em campo com equipa e equipamento adequados, ou produção de frames e animação conforme o formato acordado.",
  },
  {
    step: "04",
    title: "Edição",
    description:
      "Montagem, motion, música, voz-off e revisões em ciclos claros até fecharmos a versão final.",
  },
  {
    step: "05",
    title: "Entrega",
    description:
      "Exportação nos formatos pedidos (redes, web, projeção), com ficheiros mestres arquivados para futuras atualizações.",
  },
]

export default function ProducaoVideoPage() {
  return (
    <PageTransition>
      <div className="flex flex-col">
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block">Audiovisual</span>
            </AnimatedSection>
            <TextSplitter
              text="Produção de Vídeo"
              as="h1"
              className="heading-hero text-white mb-8"
              splitBy="word"
              delay={0.15}
            />
            <AnimatedSection animation="fade-up" delay={350}>
              <p className="body-large text-obys-text-secondary max-w-2xl">
                Vídeos promocionais, animações e conteúdo audiovisual para marcas que precisam de presença forte e
                narrativa consistente.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="section-padding bg-obys-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
              <AnimatedSection animation="fade-right">
                <span className="text-label text-obys-gold mb-4 block">O que fazemos</span>
                <h2 className="heading-section text-white mb-8">Conteúdo audiovisual com impacto</h2>
                <p className="body-large text-obys-text-secondary mb-6">
                  O vídeo é uma das formas mais eficazes de comunicar: resume ideias, gera emoção e permanece na memória.
                  Na ABIPTOM unimos criatividade, técnica e estratégia para produzir peças que apoiam marketing,
                  institucional e eventos.
                </p>
                <p className="body-base text-obys-text-secondary">
                  Desde roteiro à entrega final, acompanhamos cada fase para garantir qualidade, coerência com a sua marca
                  e resultados mensuráveis em digital.
                </p>
              </AnimatedSection>
              <AnimatedSection animation="fade-left" delay={150}>
                <div className="aspect-video overflow-hidden rounded-sm border border-obys-border-dark bg-obys-near-black">
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/Rg8RjicC89Y"
                    title="Produção de vídeo ABIPTOM — exemplo de projeto"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <div className="border-y border-obys-border-dark bg-obys-near-black">
          <CrawlingLine
            items={[
              "Vídeo institucional",
              "Promo",
              "Eventos",
              "Motion",
              "Pós-produção",
              "Storytelling",
            ]}
            speed={32}
            className="py-6"
          />
        </div>

        <section className="section-padding bg-obys-near-black">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up" className="mb-16 md:mb-20">
              <span className="text-label text-obys-gold mb-4 block">Serviços</span>
              <h2 className="heading-section text-white mb-6">Linha de produção</h2>
              <p className="body-large text-obys-text-secondary max-w-2xl">
                Soluções modulares — pode contratar o pacote completo ou fases específicas (só edição, só animação,
                cobertura de um dia de evento).
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videoServices.map((service, index) => (
                <AnimatedSection key={service.title} animation="fade-up" delay={index * 80}>
                  <article className="border border-obys-border-dark bg-obys-near-black p-8 transition-colors duration-obys ease-obys-default hover:border-obys-gold h-full flex flex-col">
                    <h3 className="heading-subsection text-white mb-4">{service.title}</h3>
                    <p className="body-base text-obys-text-secondary mb-6 grow">{service.description}</p>
                    <ul className="space-y-3">
                      {service.bullets.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-obys-gold" aria-hidden />
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

        <section className="section-padding bg-obys-dark border-t border-obys-border-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up" className="mb-16 md:mb-20 text-center">
              <span className="text-label text-obys-gold mb-4 block">Processo</span>
              <h2 className="heading-section text-white mb-6">Como trabalhamos</h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto">
                Um fluxo em cinco etapas para previsibilidade, revisões organizadas e entrega no prazo.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
              {processSteps.map((item, index) => (
                <AnimatedSection key={item.title} animation="fade-up" delay={index * 70}>
                  <div className="flex flex-col items-center text-center h-full">
                    <div
                      className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-obys-gold text-obys-gold font-body text-sm font-medium"
                      aria-hidden
                    >
                      {item.step}
                    </div>
                    <h3 className="heading-subsection text-white mb-3">{item.title}</h3>
                    <p className="body-base text-obys-text-secondary">{item.description}</p>
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
              <h2 className="heading-hero text-white mb-8">Vamos produzir o seu próximo vídeo?</h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto mb-12">
                Conte-nos a ideia, o prazo e o canal (web, redes, evento). Respondemos com proposta, orçamento e
                referências alinhadas ao projeto.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="obys-primary" size="xl">
                  <Link href="/contacto" className="inline-flex items-center gap-2">
                    Fale conosco
                    <ArrowRight className="h-4 w-4" aria-hidden />
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
