import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bauhaus tracking-tighter sm:text-5xl md:text-6xl text-yellow">
              Nossos Serviços
            </h1>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Soluções digitais personalizadas para impulsionar o seu negócio.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
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
            <ServiceCard
              title="Marketing Digital"
              description="Estratégias completas de marketing digital para aumentar sua visibilidade online e gerar leads."
              icon="TrendingUp"
              link="/servicos/marketing-digital"
            />
            <ServiceCard
              title="Desenvolvimento de Software"
              description="Soluções de software personalizadas para otimizar processos e aumentar a produtividade."
              icon="Database"
              link="/servicos/desenvolvimento-software"
            />
            <ServiceCard
              title="Redes, Cablagem e HelpDesk"
              description="Serviços de infraestrutura de rede, cablagem estruturada e suporte técnico especializado."
              icon="Server"
              link="/servicos/redes-cablagem-helpdesk"
            />
          </div>
        </div>
      </section>

      {/* Social Media Packages */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Pacotes de Gestão de Redes Sociais</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              As redes sociais são uma das maneiras mais importantes de se envolver com os clientes e criar confiança.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bauhaus">Básico</h3>
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-dark">Consultar preço</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>15-20 Posts por mês</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>3 plataformas geridas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Consulta inicial</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Planificação estratégica simplificada</span>
                </li>
              </ul>
              <Button asChild className="mt-auto bg-yellow text-black hover:bg-yellow-hover">
                <Link href="/contacto">Escolher Plano</Link>
              </Button>
            </div>
            <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bauhaus">Silver</h3>
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-dark">Consultar preço</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>21-25 Posts por mês</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>4 plataformas geridas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>2 posts pagos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>3 posts personalizados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>10 Instagram/Facebook Stories</span>
                </li>
              </ul>
              <Button asChild className="mt-auto bg-yellow text-black hover:bg-yellow-hover">
                <Link href="/contacto">Escolher Plano</Link>
              </Button>
            </div>
            <div className="flex flex-col p-6 bg-grey shadow-lg rounded-lg text-white relative">
              <div className="absolute top-0 right-0 -mt-4 mr-4 bg-yellow text-black font-bold py-1 px-4 rounded-full text-xs uppercase">
                Popular
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bauhaus text-yellow">Gold</h3>
                <div className="mt-4 text-center">
                  <span className="text-sm text-black">Consultar preço</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>26-30 Posts por mês</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>5 plataformas geridas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>4 posts pagos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>5 posts personalizados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>15 Instagram/Facebook Stories</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>1 Concurso/Challenge</span>
                </li>
              </ul>
              <Button asChild className="mt-auto bg-yellow text-black hover:bg-yellow-hover">
                <Link href="/contacto">Escolher Plano</Link>
              </Button>
            </div>
            <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bauhaus">Premium+</h3>
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-dark">Consultar preço</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>31-40 Posts por mês</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>5 plataformas geridas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>8 posts pagos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>10 posts personalizados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>20 Instagram/Facebook Stories</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Relatórios completos semanais</span>
                </li>
              </ul>
              <Button asChild className="mt-auto bg-yellow text-black hover:bg-yellow-hover">
                <Link href="/contacto">Escolher Plano</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl md:text-5xl text-yellow">
              Pronto para transformar suas ideias em realidade?
            </h2>
            <p className="max-w-[700px] text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
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
    </div>
  )
}
