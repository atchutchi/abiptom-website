import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"
import { PortfolioPreview } from "@/app/components/portfolio-preview"
import { TestimonialSlider } from "@/components/testimonial-slider"
import { ClientLogos } from "@/components/client-logos"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-yellow/10 px-3 py-1 text-sm text-yellow font-semibold">Nossos Serviços</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-bauhaus text-black">
              Transformamos ideias em realidade digital
            </h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Oferecemos soluções digitais personalizadas e de alto calibre para ajudar sua marca a se destacar.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              title="Design Gráfico"
              description="Criação de logotipos, flyers, cartazes, brochuras e materiais visuais que fortalecem sua marca."
              icon="Palette"
              link="/servicos/design-grafico"
            />
            <ServiceCard
              title="Desenvolvimento Web"
              description="Websites modernos, responsivos e otimizados para SEO que convertem visitantes em clientes."
              icon="Code"
              link="/servicos/desenvolvimento-web"
            />
            <ServiceCard
              title="Social Media"
              description="Gestão profissional de redes sociais com estratégias personalizadas para aumentar seu engajamento."
              icon="Share2"
              link="/servicos/social-media"
            />
            <ServiceCard
              title="Produção de Vídeo"
              description="Vídeos promocionais, animações e conteúdo audiovisual para impulsionar sua comunicação."
              icon="Video"
              link="/servicos/producao-video"
            />
            <ServiceCard
              title="Fotografia"
              description="Serviços fotográficos profissionais para produtos, eventos e conteúdo corporativo."
              icon="Camera"
              link="/servicos/fotografia"
            />
            <ServiceCard
              title="Animação 2D"
              description="Animações criativas que dão vida às suas ideias e capturam a atenção do seu público."
              icon="Zap"
              link="/servicos/animacao-2d"
            />
          </div>
          <div className="flex justify-center mt-12">
            <Button asChild className="bg-yellow text-black hover:bg-yellow-hover">
              <Link href="/servicos">
                Ver todos os serviços <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section Preview */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-yellow/10 px-3 py-1 text-sm text-yellow font-semibold">Quem Somos</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-bauhaus text-black">
                ABIPTOM, Guardião das Novas Tecnologias
              </h2>
              <p className="text-gray-dark md:text-xl/relaxed">
                Somos um grupo de consultores nacionais e internacionais especializados em Marketing, Design Gráfico,
                Web Design e Desenvolvimento de Software. Com forte presença na Guiné-Bissau, transformamos ideias em
                realidade através de soluções digitais personalizadas.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span className="text-gray-dark">Compromisso com a Qualidade</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span className="text-gray-dark">Inovação Focada</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span className="text-gray-dark">Profissionalismo</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span className="text-gray-dark">Integridade</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span className="text-gray-dark">Respeito pelo Cliente</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild className="bg-yellow text-black hover:bg-yellow-hover">
                  <Link href="/quem-somos">Saiba mais sobre nós</Link>
                </Button>
              </div>
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

      {/* Portfolio Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-yellow/10 px-3 py-1 text-sm text-yellow font-semibold">Nosso Portfólio</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-bauhaus text-black">
              Trabalhos que nos orgulhamos
            </h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Conheça alguns dos projetos que desenvolvemos para nossos clientes.
            </p>
          </div>
          <PortfolioPreview />
          <div className="flex justify-center mt-12">
            <Button asChild className="bg-yellow text-black hover:bg-yellow-hover">
              <Link href="/portfolio">
                Ver portfólio completo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-yellow/10 px-3 py-1 text-sm text-yellow font-semibold">Depoimentos</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-bauhaus text-black">O que nossos clientes dizem</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A satisfação de nossos clientes é nossa maior recompensa.
            </p>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      {/* Clients */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-yellow/10 px-3 py-1 text-sm text-yellow font-semibold">Nossos Clientes</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-bauhaus text-black">Empresas que confiam em nós</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Trabalhamos com empresas e organizações de diversos setores.
            </p>
          </div>
          <ClientLogos />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow font-bauhaus">
              Pronto para transformar suas ideias em realidade?
            </h2>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Entre em contato conosco e descubra como podemos ajudar sua empresa a crescer.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild className="bg-yellow text-black hover:bg-yellow-hover">
                <Link href="/contacto">Fale conosco</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-yellow/10 px-3 py-1 text-sm text-yellow font-semibold">Blog</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-bauhaus text-black">Últimas do nosso blog</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Fique por dentro das novidades e tendências do mundo digital.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/blog/post-1" className="group">
              <div className="space-y-3">
                <img
                  alt="Blog post thumbnail"
                  className="aspect-video overflow-hidden rounded-lg object-cover transition-all group-hover:scale-105"
                  src="/placeholder.svg?height=200&width=300"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus">
                    Como o design gráfico pode impulsionar sua marca
                  </h3>
                  <p className="text-gray-dark">
                    Descubra como um bom design pode transformar a percepção da sua marca no mercado.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">12 Abril, 2025</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-400">5 min de leitura</span>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/blog/post-2" className="group">
              <div className="space-y-3">
                <img
                  alt="Blog post thumbnail"
                  className="aspect-video overflow-hidden rounded-lg object-cover transition-all group-hover:scale-105"
                  src="/placeholder.svg?height=200&width=300"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus">
                    Estratégias de marketing digital para pequenas empresas
                  </h3>
                  <p className="text-gray-dark">
                    Conheça as melhores práticas para promover seu negócio online com orçamento limitado.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">5 Abril, 2025</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-400">8 min de leitura</span>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/blog/post-3" className="group">
              <div className="space-y-3">
                <img
                  alt="Blog post thumbnail"
                  className="aspect-video overflow-hidden rounded-lg object-cover transition-all group-hover:scale-105"
                  src="/placeholder.svg?height=200&width=300"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus">
                    A importância de um website responsivo
                  </h3>
                  <p className="text-gray-dark">
                    Por que seu site precisa funcionar perfeitamente em todos os dispositivos.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">28 Março, 2025</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-400">6 min de leitura</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="flex justify-center mt-12">
            <Button asChild className="bg-yellow text-black hover:bg-yellow-hover">
              <Link href="/blog">
                Ver todos os artigos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
