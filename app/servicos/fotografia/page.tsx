import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function FotografiaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bauhaus tracking-tighter sm:text-5xl md:text-6xl text-yellow">Fotografia</h1>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Serviços fotográficos profissionais para produtos, eventos e conteúdo corporativo.
            </p>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Imagens que Contam sua História</h2>
              <p className="text-gray-dark md:text-xl/relaxed">
                Uma imagem vale mais que mil palavras, e na ABIPTOM entendemos o poder da fotografia para comunicar
                valores, transmitir emoções e destacar produtos. Nossos serviços fotográficos profissionais capturam a
                essência da sua marca e criam conexões visuais com seu público.
              </p>
              <p className="text-gray-dark md:text-xl/relaxed">
                Com equipamentos de última geração e fotógrafos experientes, oferecemos soluções fotográficas completas
                para empresas de todos os tamanhos e setores, garantindo imagens de alta qualidade que elevam sua
                comunicação visual.
              </p>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover">
              <img
                alt="Fotografia"
                className="aspect-video object-cover w-full"
                src="/placeholder.svg?height=400&width=600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Nossos Serviços de Fotografia</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Oferecemos uma ampla gama de serviços fotográficos para atender às necessidades da sua empresa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Fotografia de Produtos</h3>
              <p className="text-gray-dark mb-4">
                Destaque seus produtos com imagens profissionais que ressaltam suas características e qualidades.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Iluminação profissional</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Composição estratégica</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Pós-produção de alta qualidade</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Fotografia Corporativa</h3>
              <p className="text-gray-dark mb-4">
                Registre a identidade da sua empresa com fotos de equipe, retratos profissionais e ambiente de trabalho.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Retratos corporativos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Fotos de equipe</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Ambiente de trabalho</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Fotografia de Eventos</h3>
              <p className="text-gray-dark mb-4">
                Documentação completa de eventos corporativos, lançamentos de produtos, conferências e celebrações.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Cobertura completa</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Momentos-chave</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Entrega rápida</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Fotografia Arquitetônica</h3>
              <p className="text-gray-dark mb-4">
                Valorize seus espaços físicos com fotografias que destacam a arquitetura e o design de interiores.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Interiores e exteriores</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Iluminação natural e artificial</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Composição espacial</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Fotografia para Redes Sociais</h3>
              <p className="text-gray-dark mb-4">
                Imagens otimizadas para plataformas digitais, aumentando o engajamento e fortalecendo sua presença
                online.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Formatos específicos para cada plataforma</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Estética contemporânea</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Planejamento visual</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Banco de Imagens Personalizado</h3>
              <p className="text-gray-dark mb-4">
                Criação de um acervo fotográfico exclusivo para sua empresa, disponível para uso em diversos materiais
                de comunicação.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Imagens exclusivas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Organização e categorização</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Atualizações periódicas</span>
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
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Nosso Processo Fotográfico</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Trabalhamos de forma estruturada para garantir que suas imagens atendam aos seus objetivos e superem suas
              expectativas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Briefing</h3>
              <p className="text-gray-dark">
                Entendemos suas necessidades, objetivos e como as imagens serão utilizadas.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Planejamento</h3>
              <p className="text-gray-dark">Definimos locais, equipamentos, iluminação e todos os detalhes técnicos.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Produção</h3>
              <p className="text-gray-dark">
                Realizamos a sessão fotográfica com atenção aos detalhes e à qualidade técnica.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Pós-produção</h3>
              <p className="text-gray-dark">
                Selecionamos, editamos e finalizamos as imagens para entrega nos formatos necessários.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise & Quality */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl text-black">Nossa Expertise</h2>
            <p className="max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Combinamos técnica, criatividade e experiência para entregar resultados excepcionais.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white p-8 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
              <div className="absolute top-0 left-0 w-2 h-full bg-yellow transform origin-left transition-transform group-hover:scale-y-110"></div>
              <div className="pl-6">
                <h3 className="text-xl font-bauhaus mb-4 text-black relative">Equipamentos Profissionais</h3>
                <p className="text-gray-600 relative">
                  Utilizamos câmeras e lentes de última geração, sistemas de iluminação avançados e equipamentos especializados para garantir a mais alta qualidade em cada projeto.
                </p>
              </div>
            </div>
            <div className="group relative bg-white p-8 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
              <div className="absolute top-0 left-0 w-2 h-full bg-yellow transform origin-left transition-transform group-hover:scale-y-110"></div>
              <div className="pl-6">
                <h3 className="text-xl font-bauhaus mb-4 text-black relative">Equipe Especializada</h3>
                <p className="text-gray-600 relative">
                  Nossa equipe é formada por fotógrafos experientes com formação técnica e artística, garantindo um olhar profissional em cada captura.
                </p>
              </div>
            </div>
            <div className="group relative bg-white p-8 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
              <div className="absolute top-0 left-0 w-2 h-full bg-yellow transform origin-left transition-transform group-hover:scale-y-110"></div>
              <div className="pl-6">
                <h3 className="text-xl font-bauhaus mb-4 text-black relative">Pós-produção Profissional</h3>
                <p className="text-gray-600 relative">
                  Processo de edição meticuloso com softwares profissionais, garantindo o melhor resultado em cada imagem entregue.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <div className="flex items-center mb-6 pl-6">
                <div className="w-12 h-12 rounded-full bg-yellow/10 flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-yellow" />
                </div>
                <h3 className="text-xl font-bauhaus text-black">Garantia de Qualidade</h3>
              </div>
              <ul className="space-y-4 pl-24">
                <li className="text-gray-600">
                  • Backup seguro de todas as imagens
                </li>
                <li className="text-gray-600">
                  • Entrega em múltiplos formatos e resoluções
                </li>
                <li className="text-gray-600">
                  • Prazo de entrega garantido
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <div className="flex items-center mb-6 pl-6">
                <div className="w-12 h-12 rounded-full bg-yellow/10 flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-yellow" />
                </div>
                <h3 className="text-xl font-bauhaus text-black">Diferenciais</h3>
              </div>
              <ul className="space-y-4 pl-24">
                <li className="text-gray-600">
                  • Atendimento personalizado e consultivo
                </li>
                <li className="text-gray-600">
                  • Flexibilidade para projetos de qualquer escala
                </li>
                <li className="text-gray-600">
                  • Suporte pós-entrega
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl md:text-5xl text-yellow">
              Pronto para elevar a qualidade visual da sua comunicação?
            </h2>
            <p className="max-w-[700px] text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Entre em contato conosco e descubra como nossos serviços de fotografia podem ajudar sua empresa a se
              destacar.
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
