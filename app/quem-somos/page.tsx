import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/animated-section"
import { TextSplitter } from "@/components/text-splitter"
import { CrawlingLine } from "@/components/crawling-line"
import { PageTransition } from "@/components/page-transition"

const team = [
  {
    name: "Atchutchi Ferreira",
    role: "CEO e Gestor de Projetos",
    image: "/images/team/atchtchi.jpg",
    bio: "Fundador da Empresa, Especialista em TI, Full Stack Developer e Gestor de projetos, com mais de 10 anos de experiência profissional.",
  },
  {
    name: "Clayton da Cruz L.J. Correia",
    role: "Chief Technology Officer (CTO)",
    image: "/images/team/clayton.jpg",
    bio: "Com mais de 15 anos de experiência em desenvolvimento de software, infraestruturas digitais e gestão de sistemas.",
  },
  {
    name: "Emerson Demésio Mendes",
    role: "Director Geral",
    image: "/images/team/emerson.jpg",
    bio: "Economista altamente qualificado, com formação em Economia com especialização em Finanças e Crédito.",
  },
  {
    name: "Sweline J. Mota Sambú",
    role: "Coordenadora Administrativa e Operações, Relações Institucionais e Jurista",
    image: "/images/team/sweline.jpeg",
    bio: "Responsável pela coordenação administrativa e operacional da ABIPTOM, assegurando também as relações institucionais e o apoio jurídico. Licenciada em Direito, com pós-graduações em Direito Bancário e Direito Penal Ambiental.",
  },
  {
    name: "Valbert Valentim",
    role: "Assistente Administrativo",
    image: "/images/team/valbert.jpeg",
    bio: "O suporte organizacional da ABIPTOM, garantindo que cada processo interno decorra com eficiência e precisão, responsável pelo apoio administrativo e logístico.",
  },
  {
    name: "Arianna Duarte",
    role: "Gestora de Marketing e B2B",
    image: "/images/team/arianna.jpg",
    bio: "Lidera a implementação de estratégias comerciais, gestão de redes sociais e captação de novos clientes.",
  },
  {
    name: "Alison Okica",
    role: "Host de Social Media",
    image: "/images/team/alison.jpeg",
    bio: "A energia e a voz por trás das campanhas digitais da ABIPTOM, com carisma e presença cativante, representa as marcas em frente às câmaras e participa na criação de roteiros e conteúdos.",
  },
  {
    name: "Amelissa Barreto Duarte",
    role: "Designer Gráfico",
    image: "/images/team/amelissa.svg",
    bio: "Responsável por dar forma e cor às ideias da ABIPTOM, com um olhar apurado para o detalhe e paixão pelo design, transforma conceitos em peças visuais marcantes.",
  },
  {
    name: "Carlos Rittos dos Santos",
    role: "Designer Gráfico",
    image: "/images/team/carlos-rittos-dos-santos.jpeg",
    bio: "Especialista em design editorial, identidade visual e conteúdos digitais, com domínio avançado das ferramentas Adobe.",
  },
  {
    name: "Abdul Karim",
    role: "Designer Gráfico",
    image: "/images/team/abdul-karim.jpg",
    bio: "Criativo e versátil, traz uma visão contemporânea ao design da ABIPTOM, aliando sensibilidade estética e domínio técnico na criação de identidades visuais, materiais gráficos e conteúdos digitais de impacto.",
  },
  {
    name: "José",
    role: "Videomaker",
    image: "/images/team/jose.png",
    bio: "Responsável pela captação e edição de conteúdos audiovisuais para projetos institucionais e promocionais.",
  },
]

const metrics = [
  { value: "10+", label: "Anos de experiência" },
  { value: "200+", label: "Projectos entregues" },
  { value: "50+", label: "Clientes satisfeitos" },
  { value: "11", label: "Especialistas na equipa" },
]

const AboutPage = () => {
  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Hero */}
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block">
                Quem Somos
              </span>
            </AnimatedSection>
            <TextSplitter
              text="Guardião das Novas Tecnologias"
              as="h1"
              className="heading-hero text-white mb-8"
              splitBy="word"
              delay={0.2}
            />
            <AnimatedSection animation="fade-up" delay={400}>
              <p className="body-large text-obys-text-secondary max-w-2xl">
                Na interseção da tecnologia e da arte, construímos experiências digitais que ajudam marcas a destacarem-se.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* About Content */}
        <section className="section-padding bg-obys-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <AnimatedSection animation="fade-right">
                <div>
                  <h2 className="heading-section text-white mb-10">
                    ABIPTOM, SARL
                  </h2>
                  <p className="body-large text-obys-text-secondary mb-8">
                    Somos um grupo de Consultores nacionais e internacionais especializados em Marketing, Design Gráfico, Web Design e Desenvolvimento de Software.
                  </p>
                  <p className="body-base text-obys-text-secondary">
                    Com uma forte presença na Guiné-Bissau, transformamos ideias em realidade através de soluções digitais personalizadas e de alto calibre.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="fade-left" delay={200}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    alt="Equipa ABIPTOM"
                    className="object-cover"
                    src="/images/foto_1.jpg"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="section-padding-sm bg-obys-near-black border-y border-obys-border-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {metrics.map((metric, i) => (
                <AnimatedSection key={metric.label} animation="fade-up" delay={i * 100}>
                  <div className="text-center py-8">
                    <span className="font-display text-5xl md:text-6xl text-obys-gold block mb-3">
                      {metric.value}
                    </span>
                    <span className="text-label text-obys-text-muted">
                      {metric.label}
                    </span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="section-padding bg-obys-dark">
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block">
                Princípios
              </span>
              <h2 className="heading-section text-white mb-20">
                O que nos move
              </h2>
            </AnimatedSection>

            <div className="grid gap-16 md:grid-cols-3">
              <AnimatedSection animation="fade-up" delay={0}>
                <div className="border-t border-obys-gold pt-8">
                  <h3 className="heading-subsection text-white mb-6">Missão</h3>
                  <p className="body-base text-obys-text-secondary">
                    Entregar resultados excepcionais que promovem o crescimento das empresas e marcas que confiam em nós. Através de expertise técnica e criativa, oferecemos soluções digitais de alto impacto.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={150}>
                <div className="border-t border-obys-gold pt-8">
                  <h3 className="heading-subsection text-white mb-6">Visão</h3>
                  <p className="body-base text-obys-text-secondary">
                    Ser referência indiscutível em tecnologia e design na Guiné-Bissau. Construir uma reputação sólida baseada na entrega consistente de serviços de alta qualidade com impacto real.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={300}>
                <div className="border-t border-obys-gold pt-8">
                  <h3 className="heading-subsection text-white mb-6">Valores</h3>
                  <ul className="space-y-3">
                    {[
                      "Compromisso com a Qualidade",
                      "Inovação Focada",
                      "Profissionalismo",
                      "Integridade",
                      "Respeito pelo Cliente",
                    ].map((value) => (
                      <li key={value} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-obys-gold flex-shrink-0" />
                        <span className="body-base text-obys-text-secondary">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Crawling Line */}
        <div className="border-y border-obys-border-dark bg-obys-near-black">
          <CrawlingLine
            items={["Qualidade", "Inovação", "Compromisso", "Excelência", "Integridade"]}
            speed={35}
            className="py-6"
          />
        </div>

        {/* Team */}
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block">
                Equipa
              </span>
              <h2 className="heading-section text-white mb-20">
                Quem faz acontecer
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              {team.map((member, i) => (
                <AnimatedSection key={member.name} animation="fade-up" delay={i * 80}>
                  <div className="group border border-obys-border-dark p-6 lg:p-8 hover:border-obys-gold transition-colors duration-obys bg-obys-near-black hover:bg-obys-dark/50 h-full">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden mb-6 border border-obys-border-dark group-hover:border-obys-gold transition-colors duration-obys">
                      <Image
                        alt={member.name}
                        className="object-cover"
                        src={member.image}
                        fill
                        sizes="96px"
                      />
                    </div>
                    <h3 className="font-display text-xl text-white mb-1 group-hover:text-obys-gold transition-colors duration-obys">
                      {member.name}
                    </h3>
                    <p className="text-label text-obys-gold mb-4">{member.role}</p>
                    <p className="body-base text-obys-text-secondary text-sm">
                      {member.bio}
                    </p>
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
                Vamos trabalhar juntos?
              </h2>
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

export default AboutPage
