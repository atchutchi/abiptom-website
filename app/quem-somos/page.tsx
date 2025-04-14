import { CheckCircle } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow font-bauhaus">
              Quem Somos
            </h1>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Conheça a ABIPTOM, uma empresa comprometida com a inovação e excelência.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-black font-bauhaus">ABIPTOM, SARL</h2>
              <p className="text-gray-dark md:text-xl/relaxed">
                Somos a ABIPTOM, SARL, um grupo de Consultores nacionais e internacionais especializados em Marketing,
                Design Gráfico e Web Design e Desenvolvimento de Software. Com uma forte presença na Guiné-Bissau,
                transformamos ideias em realidade através de soluções digitais personalizadas e de alto calibre.
              </p>
              <p className="text-gray-dark md:text-xl/relaxed">
                Na interseção da tecnologia e da arte, construímos experiências digitais impressionantes que ajudam as
                marcas a destacarem-se.
              </p>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover">
              <img
                alt="Equipe Abiptom"
                className="aspect-video object-cover w-full"
                src="/placeholder.svg?height=400&width=600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3 md:gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-black font-bauhaus">Missão</h3>
              <p className="text-gray-dark">
                Nossa missão é entregar resultados. Somos dedicados a oferecer serviços excepcionais que promovem o
                crescimento das empresas e marcas que confiam em nós. Através de uma combinação de expertise técnica e
                criativa, oferecemos soluções digitais de alto impacto que geram valor tangível.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-black font-bauhaus">Visão</h3>
              <p className="text-gray-dark">
                Ambicionamos ser uma referência indiscutível no campo da tecnologia e do design na Guiné-Bissau.
                Trabalhamos para criar um futuro no qual a ABIPTOM, SARL seja sinónimo de excelência e inovação no
                Marketing, Design Gráfico e Web Design. Nosso objetivo é construir uma reputação sólida baseada na
                entrega consistente de serviços de alta qualidade que criam um impacto real para os nossos clientes.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-black font-bauhaus">Valores</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span className="text-gray-dark">
                    Compromisso com a Qualidade: Priorizamos a excelência em todas as etapas do nosso trabalho. A
                    qualidade não é negociável.
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span className="text-gray-dark">
                    Inovação Focada: Empregamos a tecnologia mais recente para entregar soluções inovadoras e
                    funcionais.
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span className="text-gray-dark">
                    Profissionalismo: Mantemos os mais altos padrões de profissionalismo em todos os nossos
                    compromissos.
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span className="text-gray-dark">Integridade: Fazemos negócios de maneira ética e transparente.</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span className="text-gray-dark">
                    Respeito pelo Cliente: Valorizamos os nossos clientes e nos esforçamos para superar as suas
                    expectativas em cada projeto.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-black font-bauhaus">Nossa Equipe</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Conheça os profissionais que fazem a ABIPTOM acontecer.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="overflow-hidden rounded-full">
                <Image
                  alt="Atchutchi Ferreira"
                  className="aspect-square object-cover w-40 h-40"
                  src="/images/team/atchtchi.jpg"
                  width={160}
                  height={160}
                  priority
                />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold text-black font-bauhaus">Atchutchi Ferreira</h3>
                <p className="text-sm text-yellow font-semibold">CEO e Gestor de Projetos</p>
                <p className="text-sm text-gray-dark">
                  Especialista em TI, comunicador e gestor de projetos, com forte experiência profissional em várias
                  áreas, incluindo gestão de sistemas de informação, desenvolvimento de conteúdo digital, e marketing em
                  redes sociais.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="overflow-hidden rounded-full">
                <Image
                  alt="Clayton da Cruz L.J. Correia"
                  className="aspect-square object-cover w-40 h-40"
                  src="/images/team/clayton.jpg"
                  width={160}
                  height={160}
                  priority
                />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold text-black font-bauhaus">Clayton da Cruz L.J. Correia</h3>
                <p className="text-sm text-yellow font-semibold">Engenheiro Informático</p>
                <p className="text-sm text-gray-dark">
                  Engenheiro informático e programador com uma rica experiência profissional internacional e um
                  histórico comprovado de contribuições significativas em workshops e missões técnicas relacionadas à
                  inovação digital.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="overflow-hidden rounded-full">
                <Image
                  alt="Emerson Demésio Mendes"
                  className="aspect-square object-cover w-40 h-40"
                  src="/images/team/emerson.png"
                  width={160}
                  height={160}
                  priority
                />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold text-black font-bauhaus">Emerson Demésio Mendes</h3>
                <p className="text-sm text-yellow font-semibold">Economista</p>
                <p className="text-sm text-gray-dark">
                  Economista altamente qualificado, com formação em Economia com especialização em Finanças e Crédito
                  pela Universidade Estatal Orçamentária de Construção Civil de Rostov-on-Don, Federação da Rússia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
