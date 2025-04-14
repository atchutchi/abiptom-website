import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function SocialMediaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">Social Media</h1>
            <p className="max-w-[700px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Gestão profissional de redes sociais com estratégias personalizadas para aumentar seu engajamento.
            </p>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Presença Digital Estratégica</h2>
              <p className="text-gray-500 md:text-xl/relaxed">
                As redes sociais são hoje um dos principais canais de comunicação entre empresas e clientes. Na ABIPTOM,
                desenvolvemos estratégias personalizadas para cada plataforma, criando conteúdo relevante e engajador
                que conecta sua marca ao público-alvo.
              </p>
              <p className="text-gray-500 md:text-xl/relaxed">
                Nossa equipe de especialistas em social media combina criatividade, análise de dados e conhecimento das
                tendências para maximizar o impacto da sua presença nas redes sociais, gerando resultados mensuráveis
                para o seu negócio.
              </p>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover">
              <img
                alt="Social Media"
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nossos Serviços de Social Media</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Oferecemos uma gama completa de serviços para potencializar sua presença nas redes sociais.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Gestão de Redes Sociais</h3>
              <p className="text-gray-500 mb-4">
                Administração completa das suas redes sociais, desde a criação de conteúdo até o monitoramento e
                interação com seguidores.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Planejamento de conteúdo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Criação e publicação de posts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Monitoramento e resposta a comentários</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Criação de Conteúdo</h3>
              <p className="text-gray-500 mb-4">
                Desenvolvimento de conteúdo visual e textual atrativo e relevante para suas redes sociais.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Design de posts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Copywriting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Produção de fotos e vídeos</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Publicidade em Redes Sociais</h3>
              <p className="text-gray-500 mb-4">
                Criação e gestão de campanhas publicitárias nas principais plataformas de redes sociais.
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
              <h3 className="text-xl font-bold mb-2">Estratégia de Conteúdo</h3>
              <p className="text-gray-500 mb-4">
                Desenvolvimento de estratégias de conteúdo alinhadas aos objetivos do seu negócio e às características
                do seu público.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Análise de público-alvo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Definição de tom de voz</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Calendário editorial</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Análise e Relatórios</h3>
              <p className="text-gray-500 mb-4">
                Monitoramento e análise do desempenho das suas redes sociais, com relatórios detalhados e insights
                estratégicos.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Métricas de engajamento</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Análise de concorrência</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Recomendações estratégicas</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Gestão de Comunidade</h3>
              <p className="text-gray-500 mb-4">
                Construção e gestão de comunidades online, fortalecendo o relacionamento com seu público e aumentando a
                fidelidade à marca.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Moderação de comentários</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Resposta a mensagens</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Gestão de crises</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Pacotes de Gestão de Redes Sociais</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Escolha o pacote que melhor se adapta às necessidades do seu negócio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Básico</h3>
                <div className="mt-4 text-center">
                  <span className="text-4xl font-bold">150.000 XOF</span>
                  <span className="text-sm text-gray-500">/mês</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>15-20 Posts por mês</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>3 plataformas geridas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Consulta inicial</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Planificação estratégica simplificada</span>
                </li>
              </ul>
              <Button className="mt-auto bg-blue-600 hover:bg-blue-700">Escolher Plano</Button>
            </div>
            <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Silver</h3>
                <div className="mt-4 text-center">
                  <span className="text-4xl font-bold">250.000 XOF</span>
                  <span className="text-sm text-gray-500">/mês</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>21-25 Posts por mês</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>4 plataformas geridas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>2 posts pagos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>3 posts personalizados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>10 Instagram/Facebook Stories</span>
                </li>
              </ul>
              <Button className="mt-auto bg-blue-600 hover:bg-blue-700">Escolher Plano</Button>
            </div>
            <div className="flex flex-col p-6 bg-blue-600 shadow-lg rounded-lg text-white relative">
              <div className="absolute top-0 right-0 -mt-4 mr-4 bg-yellow-400 text-black font-bold py-1 px-4 rounded-full text-xs uppercase">
                Popular
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Gold</h3>
                <div className="mt-4 text-center">
                  <span className="text-4xl font-bold">300.000 XOF</span>
                  <span className="text-sm text-blue-200">/mês</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-400" />
                  <span>26-30 Posts por mês</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-400" />
                  <span>5 plataformas geridas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-400" />
                  <span>4 posts pagos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-400" />
                  <span>5 posts personalizados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-400" />
                  <span>15 Instagram/Facebook Stories</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-400" />
                  <span>1 Concurso/Challenge</span>
                </li>
              </ul>
              <Button className="mt-auto bg-white text-blue-600 hover:bg-gray-100">Escolher Plano</Button>
            </div>
            <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Premium+</h3>
                <div className="mt-4 text-center">
                  <span className="text-4xl font-bold">400.000 XOF</span>
                  <span className="text-sm text-gray-500">/mês</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>31-40 Posts por mês</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>5 plataformas geridas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>8 posts pagos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>10 posts personalizados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>20 Instagram/Facebook Stories</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Relatórios completos semanais</span>
                </li>
              </ul>
              <Button className="mt-auto bg-blue-600 hover:bg-blue-700">Escolher Plano</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nossos Trabalhos</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Conheça alguns dos projetos de social media que desenvolvemos para nossos clientes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt="Campanha MTN"
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                  src="/placeholder.svg?height=300&width=400"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold">Campanha MTN</h3>
                <p className="text-sm text-gray-500">
                  Gestão de redes sociais e criação de conteúdo para campanha promocional.
                </p>
              </div>
            </div>
            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt="Conteúdo Modas Brazil"
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                  src="/placeholder.svg?height=300&width=400"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold">Conteúdo Modas Brazil</h3>
                <p className="text-sm text-gray-500">
                  Estratégia de conteúdo e gestão de mídias sociais para loja de moda.
                </p>
              </div>
            </div>
            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt="Marketing Digital Restaurante Ná Tábua"
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                  src="/placeholder.svg?height=300&width=400"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold">Marketing Digital Restaurante Ná Tábua</h3>
                <p className="text-sm text-gray-500">
                  Estratégia de marketing digital e gestão de redes sociais para restaurante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Pronto para potencializar sua presença nas redes sociais?
            </h2>
            <p className="max-w-[700px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Entre em contato conosco e descubra como nossos serviços de social media podem ajudar sua empresa a se
              conectar com seu público.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/contacto">Fale conosco</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
