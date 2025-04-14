import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Animacao2DPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">Animação 2D</h1>
            <p className="max-w-[700px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Animações criativas que dão vida às suas ideias e capturam a atenção do seu público.
            </p>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Dê Vida às Suas Ideias</h2>
              <p className="text-gray-500 md:text-xl/relaxed">
                A animação 2D é uma poderosa ferramenta de comunicação que permite explicar conceitos complexos de forma
                simples e envolvente. Na ABIPTOM, criamos animações personalizadas que capturam a essência da sua
                mensagem e a transmitem de forma clara e memorável.
              </p>
              <p className="text-gray-500 md:text-xl/relaxed">
                Nossa equipe de animadores combina criatividade, técnica e narrativa para desenvolver conteúdos animados
                que se destacam, seja para explicar um produto, contar a história da sua marca ou criar campanhas
                publicitárias impactantes.
              </p>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover">
              <img
                alt="Animação 2D"
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nossos Serviços de Animação 2D</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Oferecemos uma ampla gama de serviços de animação para atender às necessidades da sua empresa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Vídeos Explicativos</h3>
              <p className="text-gray-500 mb-4">
                Explique produtos, serviços ou conceitos complexos de forma simples e envolvente.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Roteiro didático</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Ilustrações personalizadas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Narração profissional</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Motion Graphics</h3>
              <p className="text-gray-500 mb-4">
                Elementos gráficos animados que dão vida a dados, estatísticas e informações.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Infográficos animados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Animação de dados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Transições dinâmicas</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Animação de Personagens</h3>
              <p className="text-gray-500 mb-4">
                Criação e animação de personagens que representam sua marca e conectam-se emocionalmente com o público.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Design de personagens</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Animação expressiva</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Mascotes corporativos</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Animação para Redes Sociais</h3>
              <p className="text-gray-500 mb-4">
                Conteúdo animado otimizado para diferentes plataformas de redes sociais, aumentando o engajamento.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Formatos específicos para cada plataforma</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>GIFs e loops</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Animações curtas e impactantes</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Animação de Logotipos</h3>
              <p className="text-gray-500 mb-4">
                Dê vida ao seu logotipo com animações que fortalecem a identidade visual da sua marca.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Intros e outros</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Assinaturas animadas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Transições de marca</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Vídeos Educativos</h3>
              <p className="text-gray-500 mb-4">
                Conteúdo educativo animado para treinamentos, e-learning e materiais didáticos.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Estrutura pedagógica</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Ilustrações didáticas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Interatividade</span>
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nosso Processo de Animação</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Trabalhamos de forma estruturada para garantir que sua animação atenda aos seus objetivos e supere suas
              expectativas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Briefing</h3>
              <p className="text-gray-500">Entendemos seus objetivos, público-alvo e mensagem que deseja transmitir.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Roteiro</h3>
              <p className="text-gray-500">Desenvolvemos um roteiro que estrutura a narrativa e as mensagens-chave.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Storyboard</h3>
              <p className="text-gray-500">Criamos esboços visuais que mostram como será cada cena da animação.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Animação</h3>
              <p className="text-gray-500">
                Produzimos a animação, incluindo ilustrações, movimentos e efeitos visuais.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <span className="text-xl font-bold">5</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Finalização</h3>
              <p className="text-gray-500">Adicionamos áudio, música, efeitos sonoros e realizamos ajustes finais.</p>
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
              Conheça alguns dos projetos de animação que desenvolvemos para nossos clientes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt="Animação 2D Aldeias Infantis SOS"
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                  src="/placeholder.svg?height=300&width=400"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold">Animação 2D Aldeias Infantis SOS</h3>
                <p className="text-sm text-gray-500">Produção de animação 2D para campanha de conscientização.</p>
              </div>
            </div>
            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt="Motion Graphics MTN"
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                  src="/placeholder.svg?height=300&width=400"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold">Motion Graphics MTN</h3>
                <p className="text-sm text-gray-500">
                  Animação de elementos gráficos para apresentação de novos serviços.
                </p>
              </div>
            </div>
            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt="Vídeo Explicativo PNUD"
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                  src="/placeholder.svg?height=300&width=400"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold">Vídeo Explicativo PNUD</h3>
                <p className="text-sm text-gray-500">
                  Animação explicativa sobre programa de desenvolvimento sustentável.
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
              Pronto para dar vida às suas ideias com animação?
            </h2>
            <p className="max-w-[700px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Entre em contato conosco e descubra como nossos serviços de animação 2D podem ajudar sua empresa a
              comunicar de forma mais eficaz.
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
