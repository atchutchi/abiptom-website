import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Animacao2DPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow-400 font-bauhaus">Animação 2D</h1>
            <p className="max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Soluções criativas de animação para comunicar sua mensagem de forma impactante e memorável.
            </p>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-bauhaus text-black">Animações que Comunicam</h2>
              <p className="text-gray-700 md:text-xl/relaxed">
                A animação 2D é uma poderosa ferramenta de comunicação visual que permite transmitir mensagens complexas de forma simples e envolvente. Através de elementos gráficos em movimento, conseguimos captar a atenção do público e criar uma conexão emocional com sua marca.
              </p>
              <p className="text-gray-700 md:text-xl/relaxed">
                Nossa equipe de animadores combina criatividade, técnica e estratégia para desenvolver animações que não apenas encantam, mas também comunicam de forma eficaz os valores e mensagens da sua empresa.
              </p>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover border-4 border-yellow-400">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/O45iNfSO4tQ"
                title="Animação 2D ABIPTOM"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
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
              Oferecemos uma ampla gama de serviços de animação 2D para atender às necessidades da sua empresa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Vídeos Explicativos</h3>
              <p className="text-gray-700 mb-4">
                Transforme conceitos complexos em explicações simples e envolventes através da animação.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Simplificação de conceitos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Narrativa clara</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Comunicação eficaz</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Motion Graphics</h3>
              <p className="text-gray-700 mb-4">
                Elementos gráficos em movimento que adicionam dinamismo e atratividade à sua comunicação visual.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Animação de infográficos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Transições dinâmicas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Efeitos visuais</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Animação de Personagens</h3>
              <p className="text-gray-700 mb-4">
                Dê vida a personagens exclusivos que representam a identidade e valores da sua marca.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Design de personagens</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Expressões e movimentos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Narrativas com personagens</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Animação para Redes Sociais</h3>
              <p className="text-gray-700 mb-4">
                Conteúdos animados otimizados para diferentes plataformas de redes sociais.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Formatos específicos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Conteúdos curtos e impactantes</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Storytelling adaptado</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Animação de Logotipos</h3>
              <p className="text-gray-700 mb-4">
                Dê movimento à identidade visual da sua empresa, tornando-a mais dinâmica e memorável.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Animação de logos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Intros e outros</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Assinaturas animadas</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Vídeos Educativos</h3>
              <p className="text-gray-700 mb-4">
                Conteúdos animados que facilitam o aprendizado e a retenção de informações.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Tutoriais animados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Vídeos de treinamento</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>Apresentações interativas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-white text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-bauhaus text-yellow-400">Nosso Processo</h2>
            <p className="max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Trabalhamos de forma estruturada e colaborativa para criar animações que atendam às suas necessidades.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-black mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Briefing</h3>
              <p className="text-gray-300">
                Entendemos seus objetivos, público-alvo e mensagem a ser comunicada.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-black mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Roteiro</h3>
              <p className="text-gray-300">
                Desenvolvemos o roteiro que servirá como base para a animação.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-black mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Storyboard</h3>
              <p className="text-gray-300">
                Criamos o storyboard visual para planejar cada cena da animação.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-black mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Animação</h3>
              <p className="text-gray-300">
                Realizamos a animação dos elementos de acordo com o planejado.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-black mb-4">
                <span className="text-2xl font-bold">5</span>
              </div>
              <h3 className="text-xl font-bold mb-2 font-bauhaus">Finalização</h3>
              <p className="text-gray-300">
                Adicionamos áudio, efeitos sonoros e fazemos os ajustes finais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-bauhaus text-black">Nosso Portfólio</h2>
            <p className="max-w-[700px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Confira alguns dos projetos de animação 2D que desenvolvemos para nossos clientes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/IAuD98YppLQ"
                  title="VÍDEO INFORMATIVO PARA EVENTOS UN-HABITAT"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold font-bauhaus">UN-HABITAT</h3>
                <p className="text-sm text-gray-dark">
                  Vídeo informativo em animação 2D para eventos.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/O45iNfSO4tQ"
                  title="ALDEIA DAS CRIANÇAS SOS Guiné-Bissau"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold font-bauhaus">Aldeias SOS</h3>
                <p className="text-sm text-gray-dark">
                  Animação 2D para campanha de regresso às aulas.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/i2sEd7MQ-ro"
                  title="Tabaski AC Covid"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold font-bauhaus">Tabaski AC Covid</h3>
                <p className="text-sm text-gray-dark">
                  Animação 2D educativa sobre prevenção Covid-19.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Button asChild className="bg-yellow text-black hover:bg-yellow-hover">
              <Link href="/portfolio">Ver mais trabalhos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-yellow-400">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black font-bauhaus">
              Pronto para dar vida às suas ideias?
            </h2>
            <p className="max-w-[700px] text-gray-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Entre em contato conosco e descubra como a animação 2D pode transformar a comunicação da sua empresa.
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
