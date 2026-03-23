import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"

import { AnimatedSection } from "@/components/animated-section"
import { CrawlingLine } from "@/components/crawling-line"
import { PageTransition } from "@/components/page-transition"
import { TextSplitter } from "@/components/text-splitter"
import { Button } from "@/components/ui/button"

const services = [
  {
    title: "Identidade Visual",
    description:
      "Criação de logotipos, paletas de cores, tipografia e elementos visuais que definem a identidade da sua marca.",
    items: ["Criação de logotipos", "Manual de identidade visual", "Papelaria corporativa"],
  },
  {
    title: "Material Impresso",
    description: "Design e diagramação de materiais impressos para divulgação da sua empresa e produtos.",
    items: ["Flyers e folhetos", "Cartazes e banners", "Catálogos e revistas"],
  },
  {
    title: "Design para Mídias Sociais",
    description:
      "Criação de conteúdo visual para as suas redes sociais, aumentando o engajamento e fortalecendo a presença online.",
    items: ["Posts para redes sociais", "Capas e avatares", "Stories e carrosséis"],
  },
  {
    title: "Embalagens",
    description:
      "Design de embalagens que destacam o seu produto nas prateleiras e proporcionam uma experiência memorável ao cliente.",
    items: ["Design de rótulos", "Caixas e sacolas", "Embalagens promocionais"],
  },
  {
    title: "Sinalização",
    description:
      "Desenvolvimento de sistemas de sinalização para ambientes internos e externos, facilitando a navegação e reforçando a marca.",
    items: ["Placas e totens", "Fachadas", "Sinalização interna"],
  },
  {
    title: "Ilustração",
    description:
      "Criação de ilustrações personalizadas para diversos fins, desde materiais promocionais até conteúdo editorial.",
    items: ["Ilustrações digitais", "Infográficos", "Personagens e mascotes"],
  },
] as const

const processSteps = [
  {
    step: 1,
    title: "Briefing",
    description:
      "Entendemos as suas necessidades, objetivos e público-alvo para alinhar o projeto com a sua visão.",
  },
  {
    step: 2,
    title: "Pesquisa",
    description:
      "Analisamos o mercado, concorrentes e tendências para desenvolver uma estratégia visual eficaz.",
  },
  {
    step: 3,
    title: "Criação",
    description: "Desenvolvemos conceitos e alternativas visuais que atendam aos objetivos do projeto.",
  },
  {
    step: 4,
    title: "Finalização",
    description:
      "Refinamos o design escolhido e preparamos os ficheiros para os meios de aplicação necessários.",
  },
] as const

const portfolioItems = [
  {
    title: "BioGuiné",
    description: "Design de uniforme corporativo.",
    src: "/images/portfolio/graphicdesign/POLO-shirt_bioGuine.png",
    alt: "Polo corporativo BioGuiné",
  },
  {
    title: "UNDP",
    description: "Design de capa para documento institucional.",
    src: "/images/portfolio/graphicdesign/capa-documento-UNDP.jpg",
    alt: "Capa de documento UNDP",
  },
  {
    title: "Creative Industry",
    description: "Flyer para evento da indústria criativa.",
    src: "/images/portfolio/graphicdesign/flyer-evento-bissau-rising-criative-industry.png",
    alt: "Flyer Bissau Rising Creative Industry",
  },
] as const

const DesignGraficoPage = () => {
  return (
    <PageTransition>
      <div className="flex flex-col">
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link
                  href="/servicos"
                  className="text-label text-obys-gold hover:text-obys-gold-hover transition-colors duration-obys"
                >
                  Serviços
                </Link>
                <span className="text-label text-obys-text-muted" aria-hidden>
                  /
                </span>
                <span className="text-label text-obys-text-secondary">Design Gráfico</span>
              </div>
            </AnimatedSection>
            <TextSplitter
              text="Design Gráfico"
              as="h1"
              className="heading-hero text-white mb-8"
              splitBy="word"
              delay={0.15}
            />
            <AnimatedSection animation="fade-up" delay={350}>
              <p className="body-large text-obys-text-secondary max-w-2xl">
                Criação de materiais visuais que fortalecem a sua marca e comunicam a sua mensagem.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <div className="border-y border-obys-border-dark bg-obys-dark">
          <CrawlingLine
            items={[
              "Identidade Visual",
              "Impresso",
              "Social Media",
              "Embalagens",
              "Sinalização",
              "Ilustração",
            ]}
            speed={38}
            className="py-6"
          />
        </div>

        <section className="section-padding bg-obys-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <AnimatedSection animation="fade-up">
                <div className="space-y-6">
                  <span className="text-label text-obys-gold block">Comunicação visual</span>
                  <h2 className="heading-section text-white">Comunicação Visual Impactante</h2>
                  <p className="body-base text-obys-text-secondary">
                    Na ABIPTOM, entendemos que o design gráfico é mais do que criar imagens bonitas. Trata-se de
                    comunicar a sua mensagem de forma eficaz, construir a identidade de marca e criar conexões
                    emocionais com o público-alvo.
                  </p>
                  <p className="body-base text-obys-text-secondary">
                    A nossa equipa combina criatividade, estratégia e técnica para desenvolver materiais visuais que
                    chamam a atenção e transmitem os valores e a essência da sua marca.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={150}>
                <div className="relative aspect-video overflow-hidden rounded-sm border border-obys-border-dark bg-obys-near-black">
                  <Image
                    src="/images/servicos/design-grafico-img.png"
                    alt="Design gráfico — trabalho da ABIPTOM"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="section-padding bg-obys-near-black">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up" className="mb-14 md:mb-20 text-center max-w-3xl mx-auto">
              <span className="text-label text-obys-gold mb-4 block">O que fazemos</span>
              <h2 className="heading-section text-white mb-6">Serviços de Design Gráfico</h2>
              <p className="body-large text-obys-text-secondary">
                Oferecemos uma gama completa de serviços para responder às necessidades da sua empresa.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {services.map((service, i) => (
                <AnimatedSection key={service.title} animation="fade-up" delay={i * 80}>
                  <div className="border border-obys-border-dark p-8 bg-obys-near-black hover:border-obys-gold transition-colors duration-obys h-full flex flex-col">
                    <h3 className="heading-subsection text-white mb-3">{service.title}</h3>
                    <p className="body-base text-obys-text-secondary mb-6 flex-1">{service.description}</p>
                    <ul className="space-y-2.5">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-obys-gold mt-0.5 shrink-0" aria-hidden />
                          <span className="body-base text-obys-text-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <div className="border-y border-obys-border-dark bg-obys-dark">
          <CrawlingLine
            items={["Briefing", "Pesquisa", "Criação", "Finalização", "ABIPTOM"]}
            speed={40}
            className="py-5"
          />
        </div>

        <section className="section-padding bg-obys-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up" className="mb-14 md:mb-20 text-center max-w-3xl mx-auto">
              <span className="text-label text-obys-gold mb-4 block">Metodologia</span>
              <h2 className="heading-section text-white mb-6">O Nosso Processo de Design</h2>
              <p className="body-large text-obys-text-secondary">
                Trabalhamos de forma colaborativa para garantir que o resultado final corresponde às suas expectativas
                e objetivos.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {processSteps.map((item, i) => (
                <AnimatedSection key={item.title} animation="fade-up" delay={i * 100}>
                  <div className="flex flex-col items-center text-center border border-obys-border-dark bg-obys-near-black hover:border-obys-gold transition-colors duration-obys p-8 h-full">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-obys-gold text-black font-display text-lg font-semibold mb-5"
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

        <section className="section-padding bg-obys-near-black">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up" className="mb-14 md:mb-20 text-center max-w-3xl mx-auto">
              <span className="text-label text-obys-gold mb-4 block">Portfólio</span>
              <h2 className="heading-section text-white mb-6">Nossos Trabalhos</h2>
              <p className="body-large text-obys-text-secondary">
                Alguns projetos de design gráfico que desenvolvemos para os nossos clientes.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {portfolioItems.map((project, i) => (
                <AnimatedSection key={project.title} animation="fade-up" delay={i * 100}>
                  <article className="group border border-obys-border-dark bg-obys-near-black hover:border-obys-gold transition-colors duration-obys overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={project.src}
                        alt={project.alt}
                        fill
                        className="object-cover transition-transform duration-obys ease-obys-default group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 border-t border-obys-border-dark flex-1 flex flex-col">
                      <h3 className="heading-subsection text-white mb-2">{project.title}</h3>
                      <p className="body-base text-obys-text-secondary text-sm">{project.description}</p>
                    </div>
                  </article>
                </AnimatedSection>
              ))}
            </div>
            <AnimatedSection animation="fade-up" delay={200} className="flex justify-center mt-12">
              <Button asChild variant="outline-primary" size="xl">
                <Link href="/portfolio" className="flex items-center gap-2">
                  Ver mais trabalhos
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              </Button>
            </AnimatedSection>
          </div>
        </section>

        <section className="section-padding bg-obys-dark border-t border-obys-border-dark">
          <div className="obys-container text-center">
            <AnimatedSection animation="scale-up">
              <span className="text-label text-obys-gold mb-6 block">Próximo passo</span>
              <h2 className="heading-hero text-white mb-8">
                Pronto para transformar a identidade visual da sua empresa?
              </h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto mb-12">
                Fale connosco e descubra como o nosso design gráfico pode ajudar a destacar-se no mercado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="obys-primary" size="xl">
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
                <Button asChild variant="outline-primary" size="xl">
                  <Link href="/contacto" className="flex items-center justify-center gap-2">
                    Fale connosco
                    <ArrowRight className="w-4 h-4" aria-hidden />
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

export default DesignGraficoPage
