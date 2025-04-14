import { CheckCircle } from "lucide-react"

export default function MarketingDigitalPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">Marketing Digital</h1>
            <p className="max-w-[700px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Estratégias completas de marketing digital para aumentar sua visibilidade online e gerar leads.
            </p>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Estratégias Digitais que Convertem</h2>
              <p className="text-gray-500 md:text-xl/relaxed">
                No mundo digital atual, estar presente online não é suficiente. É preciso se destacar, engajar e
                converter. Na ABIPTOM, desenvolvemos estratégias de marketing digital personalizadas que ajudam sua
                empresa a alcançar os objetivos de negócio.
              </p>
              <p className="text-gray-500 md:text-xl/relaxed">
                Nossa equipe de especialistas em marketing digital combina análise de dados, criatividade e conhecimento
                das tendências para criar campanhas eficazes que geram resultados mensuráveis, seja aumentando o tráfego
                do seu site, gerando leads qualificados ou impulsionando suas vendas.
              </p>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover">
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nossos Serviços de Marketing Digital</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Oferecemos uma gama completa de serviços para potencializar sua presença digital.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">SEO (Otimização para Motores de Busca)</h3>
              <p className="text-gray-500 mb-4">
                Melhore o posicionamento do seu site nos resultados de busca, aumentando sua visibilidade orgânica.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Análise de palavras-chave</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Otimização on-page</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Link building</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Google Ads</h3>
              <p className="text-gray-500 mb-4">
                Campanhas de anúncios pagos no Google que direcionam tráfego qualificado para seu site.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Anúncios de pesquisa</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Display</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Remarketing</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Marketing de Conteúdo</h3>
              <p className="text-gray-500 mb-4">
                Criação e distribuição de conteúdo relevante que atrai, engaja e converte seu público-alvo.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Planejamento de conteúdo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Criação de blog posts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>E-books e materiais ricos</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Email Marketing</h3>
              <p className="text-gray-500 mb-4">
                Estratégias de comunicação por email que nutrem leads e fortalecem o relacionamento com clientes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Criação de newsletters</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Automação de email</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Segmentação de listas</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Mídia Social Paga</h3>
              <p className="text-gray-500 mb-4">
                Anúncios nas principais plataformas de redes sociais para ampliar o alcance da sua marca.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Facebook e Instagram Ads</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>LinkedIn Ads</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Twitter Ads</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Análise e Relatórios</h3>
              <p className="text-gray-500 mb-4">
                Monitoramento e análise do desempenho das suas campanhas digitais, com relatórios detalhados e insights
                estratégicos.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Google Analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Relatórios personalizados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Recomendações estratégicas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nossa Metodologia</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Trabalhamos de forma estruturada para garantir que suas campanhas de marketing digital gerem resultados
              efetivos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Análise</h3>
              <p className="text-gray-500">
                Estudamos seu negócio, concorrentes e mercado para entender o cenário completo.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Estratégia</h3>
              <p className="text-gray-500">
                Desenvolvemos um plano de marketing digital alinhado aos seus objetivos de negócio.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">\
