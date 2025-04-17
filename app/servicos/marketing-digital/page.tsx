import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function MarketingDigitalPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow-400 font-bauhaus">Marketing Digital</h1>
            <p className="max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Estratégias digitais que aumentam a visibilidade da sua marca e geram resultados mensuráveis.
            </p>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-bauhaus text-black">Potencialize sua Presença Digital</h2>
              <p className="text-gray-700 md:text-xl/relaxed">
                No mundo digital atual, ter uma estratégia de marketing eficaz é essencial para o crescimento de qualquer negócio. Na ABIPTOM, desenvolvemos estratégias personalizadas que conectam sua marca ao público certo, no momento certo e nos canais certos.
              </p>
              <p className="text-gray-700 md:text-xl/relaxed">
                Nossa abordagem é baseada em dados e orientada para resultados, garantindo que cada ação de marketing digital contribua para o alcance dos seus objetivos de negócio.
              </p>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover border-4 border-yellow-400">
              <img
                alt="Marketing Digital"
                className="aspect-video object-cover w-full"
                src="/placeholder.svg?height=400&width=600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-bauhaus text-black">Nossos Serviços</h2>
            <p className="max-w-[700px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Oferecemos uma ampla gama de serviços de marketing digital para impulsionar sua presença online.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 font-bauhaus">SEO</h3>
              <p className="text-gray-700 mb-4">
                Otimização para motores de busca para aumentar o tráfego orgânico do seu site.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Pesquisa de palavras-chave</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Otimização on-page</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Construção de links</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>SEO técnico</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Google Ads</h3>
              <p className="text-gray-700 mb-4">
                Campanhas de anúncios pagos no Google para gerar leads e aumentar as conversões.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Anúncios de pesquisa</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Display e remarketing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Campanhas de shopping</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Anúncios de vídeo no YouTube</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Marketing de Conteúdo</h3>
              <p className="text-gray-700 mb-4">
                Criação de conteúdo relevante e valioso para atrair e engajar seu público-alvo.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Estratégia de conteúdo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Redação para blogs</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>E-books e whitepapers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Infográficos e conteúdo visual</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Email Marketing</h3>
              <p className="text-gray-700 mb-4">
                Comunicação direta e personalizada com seu público através de campanhas de email.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Estratégia de email marketing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Criação de newsletters</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Automação de email</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Segmentação de listas</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Mídia Social Paga</h3>
              <p className="text-gray-700 mb-4">
                Campanhas de anúncios nas redes sociais para aumentar o alcance e engajamento da sua marca.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Anúncios no Facebook e Instagram</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Campanhas no LinkedIn</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Twitter Ads</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Segmentação avançada de público</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Análise e Relatórios</h3>
              <p className="text-gray-700 mb-4">
                Monitoramento e análise de desempenho para otimizar suas estratégias de marketing digital.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Configuração de KPIs</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Relatórios personalizados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Análise de dados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Recomendações estratégicas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-16 md:py-24 bg-white text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-bauhaus text-black">Nossa Metodologia</h2>
            <p className="max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Trabalhamos de forma estruturada para garantir que suas campanhas de marketing digital sejam eficazes e
              gerem os resultados esperados.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-black mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Análise</h3>
              <p className="text-gray-300">
                Estudo aprofundado do seu negócio, público-alvo, concorrentes e mercado.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-black mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Estratégia</h3>
              <p className="text-gray-300">
                Desenvolvimento de estratégias personalizadas alinhadas aos seus objetivos de negócio.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-black mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Implementação</h3>
              <p className="text-gray-300">
                Execução das estratégias com acompanhamento constante e ajustes em tempo real.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-black mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Monitoramento</h3>
              <p className="text-gray-300">
                Análise contínua de resultados e otimização das campanhas para maximizar o ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-yellow-400">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black font-bauhaus">
              Pronto para impulsionar seu negócio online?
            </h2>
            <p className="max-w-[700px] text-gray-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Entre em contato conosco e descubra como nossos serviços de marketing digital podem ajudar sua empresa a crescer.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild className="bg-black text-yellow-400 hover:bg-gray-900 font-bauhaus">
                <Link href="/contacto">Fale conosco</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
