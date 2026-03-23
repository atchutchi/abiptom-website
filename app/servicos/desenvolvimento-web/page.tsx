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
    title: "Websites Institucionais",
    description:
      "Websites profissionais que apresentam a sua empresa, produtos e serviços de forma clara e atrativa.",
    bullets: ["Design personalizado", "Responsivo em todos os dispositivos", "Otimizado para SEO"],
  },
  {
    title: "E-commerce",
    description:
      "Lojas virtuais completas para vender online com segurança, desde o catálogo ao checkout.",
    bullets: ["Catálogo de produtos", "Carrinho de compras", "Integração com meios de pagamento"],
  },
  {
    title: "Landing Pages",
    description:
      "Páginas de destino focadas em conversão, ideais para campanhas e lançamentos.",
    bullets: ["Foco em conversão", "Formulários de leads", "Integração com ferramentas de marketing"],
  },
  {
    title: "Portais e Sistemas Web",
    description:
      "Portais e sistemas à medida para otimizar processos internos e relação com utilizadores.",
    bullets: ["Intranets", "Sistemas de gestão", "Plataformas educacionais"],
  },
  {
    title: "Blogs",
    description:
      "Blogs e hubs de conteúdo para reforçar a sua estratégia de marketing e autoridade de marca.",
    bullets: ["Gestão de conteúdo", "Categorias e tags", "Integração com redes sociais"],
  },
  {
    title: "Manutenção",
    description:
      "Manutenção e atualização contínua para o seu site permanecer seguro, rápido e atualizado.",
    bullets: ["Atualizações de segurança", "Backup regular", "Suporte técnico"],
  },
] as const

const technologies = [
  { name: "JavaScript", src: "/images/servicos/JavaScript-logo.png", width: 64, height: 64 },
  { name: "React", src: "/images/servicos/React_Logo_SVG.svg.png", width: 64, height: 64 },
  { name: "Node.js", src: "/images/servicos/Node.js_logo.svg", width: 64, height: 64 },
  { name: "Python", src: "/images/servicos/Python-logo-notext.svg.png", width: 64, height: 64 },
  { name: "SQL", src: "/images/servicos/SQL-Database.png", width: 64, height: 64 },
  { name: "Flutter", src: "/images/servicos/flutter-logo-white-inset.svg", width: 64, height: 64 },
] as const

const processSteps = [
  {
    step: 1,
    title: "Planejamento",
    description: "Definimos objetivos, público-alvo e funcionalidades do seu website.",
  },
  {
    step: 2,
    title: "Design",
    description: "Wireframes e interfaces alinhadas à identidade e às necessidades do negócio.",
  },
  {
    step: 3,
    title: "Desenvolvimento",
    description: "Implementação técnica com as tecnologias mais adequadas ao projeto.",
  },
  {
    step: 4,
    title: "Testes",
    description: "Testes de qualidade para garantir performance, acessibilidade e estabilidade.",
  },
  {
    step: 5,
    title: "Lançamento",
    description: "Publicação, monitorização inicial e suporte após o go-live.",
  },
] as const

const portfolioItems = [
  {
    title: "Website NDJAR",
    description: "Site institucional com catálogo de produtos e serviços.",
    image: "/images/portfolio/websites/ndjar.png",
  },
  {
    title: "Website ABIPTOM",
    description: "Website institucional da ABIPTOM.",
    image: "/images/portfolio/websites/abiptom.png",
  },
  {
    title: "Website Hotel Uque",
    description: "Presença online com foco em reservas e hospitalidade.",
    image: "/images/portfolio/websites/hotel-uque.png",
  },
] as const

const DesenvolvimentoWebPage = () => {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-obys-near-black">
        {/* Hero */}
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container text-center lg:text-left">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block">Serviços</span>
            </AnimatedSection>
            <TextSplitter
              text="Desenvolvimento Web"
              as="h1"
              className="heading-hero text-white mb-8"
              splitBy="word"
              delay={0.15}
            />
            <AnimatedSection animation="fade-up" delay={350}>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto lg:mx-0">
                Websites modernos, responsivos e otimizados para SEO que convertem visitantes em clientes.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <div className="border-y border-obys-border-dark bg-obys-near-black">
          <CrawlingLine
            items={["React", "Next.js", "Performance", "SEO", "Acessibilidade", "UX"]}
            speed={32}
            className="py-6"
          />
        </div>

        {/* Intro */}
        <section className="section-padding bg-obys-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <AnimatedSection animation="fade-right">
                <div>
                  <span className="text-label text-obys-gold mb-6 block">Presença digital</span>
                  <h2 className="heading-section text-white mb-10">Eficiência e resultado</h2>
                  <p className="body-large text-obys-text-secondary mb-8">
                    Na era digital, um website deixa de ser opcional para quem quer crescer. Na ABIPTOM,
                    desenvolvemos soluções visualmente fortes, rápidas e preparadas para mecanismos de busca.
                  </p>
                  <p className="body-base text-obys-text-secondary">
                    A nossa equipa alia rigor técnico a design centrado no utilizador para criar experiências que
                    envolvem visitantes e os conduzem à ação.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="fade-left">
                <div className="relative aspect-video overflow-hidden border border-obys-border-dark hover:border-obys-gold transition-colors duration-obys bg-obys-near-black">
                  <Image
                    src="/images/servicos/desenvolvimento-web.png"
                    alt="Desenvolvimento Web — equipa e projeto digital"
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

        {/* Serviços */}
        <section className="section-padding bg-obys-near-black border-t border-obys-border-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up" className="text-center mb-16 lg:mb-20">
              <span className="text-label text-obys-gold mb-6 block">O que fazemos</span>
              <h2 className="heading-section text-white mb-8">Soluções web completas</h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto">
                Oferecemos um leque de serviços para responder às necessidades específicas do seu negócio.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <AnimatedSection key={service.title} animation="fade-up" delay={index * 80}>
                  <article className="border border-obys-border-dark p-8 bg-obys-near-black hover:border-obys-gold transition-colors duration-obys h-full flex flex-col">
                    <h3 className="heading-subsection text-white mb-4">{service.title}</h3>
                    <p className="body-base text-obys-text-secondary mb-6 flex-1">{service.description}</p>
                    <ul className="space-y-3">
                      {service.bullets.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-obys-gold shrink-0 mt-0.5" aria-hidden />
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

        {/* Tecnologias */}
        <section className="section-padding bg-obys-dark border-t border-obys-border-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up" className="text-center mb-16 lg:mb-20">
              <span className="text-label text-obys-gold mb-6 block">Stack</span>
              <h2 className="heading-section text-white mb-8">Tecnologias que utilizamos</h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto">
                Trabalhamos com ferramentas modernas para entregar soluções web robustas e escaláveis.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {technologies.map((tech, index) => (
                <AnimatedSection key={tech.name} animation="scale-up" delay={index * 60}>
                  <div className="border border-obys-border-dark p-6 bg-obys-near-black hover:border-obys-gold transition-colors duration-obys flex flex-col items-center justify-center text-center h-full min-h-[140px]">
                    <Image
                      src={tech.src}
                      alt={tech.name}
                      width={tech.width}
                      height={tech.height}
                      className="h-14 w-auto object-contain mb-3"
                      unoptimized={tech.src.endsWith(".svg")}
                    />
                    <span className="text-label text-obys-text-secondary">{tech.name}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <div className="border-y border-obys-border-dark bg-obys-near-black">
          <CrawlingLine
            items={["Planejamento", "Design", "Código", "Testes", "Lançamento"]}
            speed={38}
            className="py-6"
          />
        </div>

        {/* Processo */}
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up" className="text-center mb-16 lg:mb-20">
              <span className="text-label text-obys-gold mb-6 block">Metodologia</span>
              <h2 className="heading-section text-white mb-8">Processo de desenvolvimento</h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto">
                Um fluxo estruturado para entregar qualidade, prazos claros e alinhamento constante consigo.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
              {processSteps.map((phase, index) => (
                <AnimatedSection key={phase.title} animation="fade-up" delay={index * 100}>
                  <div className="flex flex-col items-center text-center border border-obys-border-dark p-8 bg-obys-near-black hover:border-obys-gold transition-colors duration-obys h-full">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-obys-gold text-obys-gold font-display text-xl mb-6"
                      aria-hidden
                    >
                      {phase.step}
                    </div>
                    <h3 className="heading-subsection text-white mb-4">{phase.title}</h3>
                    <p className="body-base text-obys-text-secondary">{phase.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section className="section-padding bg-obys-dark border-t border-obys-border-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up" className="text-center mb-16 lg:mb-20">
              <span className="text-label text-obys-gold mb-6 block">Portfólio</span>
              <h2 className="heading-section text-white mb-8">Trabalhos em destaque</h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto">
                Alguns dos websites que desenvolvemos para organizações e marcas que confiam na ABIPTOM.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <AnimatedSection key={item.title} animation="fade-up" delay={index * 100}>
                  <Link
                    href="/portfolio"
                    className="group block border border-obys-border-dark bg-obys-near-black hover:border-obys-gold transition-colors duration-obys overflow-hidden h-full"
                  >
                    <div className="relative aspect-video overflow-hidden border-b border-obys-border-dark group-hover:border-obys-gold transition-colors duration-obys">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-obys ease-obys-default group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="heading-subsection text-white group-hover:text-obys-gold transition-colors duration-obys mb-3">
                        {item.title}
                      </h3>
                      <p className="body-base text-obys-text-secondary text-sm">{item.description}</p>
                      <span className="text-label text-obys-gold inline-flex items-center gap-2 mt-6">
                        Ver portfólio
                        <ArrowRight className="w-4 h-4" aria-hidden />
                      </span>
                    </div>
                  </Link>
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

        {/* CTA */}
        <section className="section-padding bg-obys-near-black border-t border-obys-border-dark">
          <div className="obys-container text-center">
            <AnimatedSection animation="scale-up">
              <span className="text-label text-obys-gold mb-6 block">Próximo passo</span>
              <h2 className="heading-hero text-white mb-8 max-w-3xl mx-auto">
                Pronto para criar ou renovar o seu website?
              </h2>
              <p className="body-large text-obys-text-secondary max-w-2xl mx-auto mb-10">
                Fale connosco e descubra como o desenvolvimento web da ABIPTOM pode ajudar a sua empresa a crescer
                online.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="obys-primary" size="xl">
                  <Link href="/contacto" className="flex items-center gap-2">
                    Fale connosco
                    <ArrowRight className="w-4 h-4" aria-hidden />
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

export default DesenvolvimentoWebPage
