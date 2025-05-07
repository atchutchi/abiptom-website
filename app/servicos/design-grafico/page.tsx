import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function DesignGraficoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bauhaus tracking-tighter sm:text-5xl md:text-6xl text-yellow">
              Design Gráfico
            </h1>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Criação de materiais visuais que fortalecem sua marca e comunicam sua mensagem.
            </p>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Comunicação Visual Impactante</h2>
              <p className="text-gray-dark md:text-xl/relaxed">
                Na ABIPTOM, entendemos que o design gráfico é mais do que apenas criar imagens bonitas. É sobre
                comunicar sua mensagem de forma eficaz, construir sua identidade de marca e criar conexões emocionais
                com seu público-alvo.
              </p>
              <p className="text-gray-dark md:text-xl/relaxed">
                Nossa equipe de designers talentosos combina criatividade, estratégia e técnica para desenvolver
                materiais visuais que não apenas chamam a atenção, mas também transmitem os valores e a essência da sua
                marca.
              </p>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover">
              <img
                alt="Design Gráfico"
                className="aspect-video object-cover w-full"
                src="/images/servicos/design-grafico-img.png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">
              Nossos Serviços de Design Gráfico
            </h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Oferecemos uma ampla gama de serviços de design gráfico para atender às necessidades da sua empresa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Identidade Visual</h3>
              <p className="text-gray-dark mb-4">
                Criação de logotipos, paletas de cores, tipografia e elementos visuais que definem a identidade da sua
                marca.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Criação de logotipos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Manual de identidade visual</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Papelaria corporativa</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Material Impresso</h3>
              <p className="text-gray-dark mb-4">
                Design e diagramação de materiais impressos para divulgação da sua empresa e produtos.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Flyers e folhetos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Cartazes e banners</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Catálogos e revistas</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Design para Mídias Sociais</h3>
              <p className="text-gray-dark mb-4">
                Criação de conteúdo visual para suas redes sociais, aumentando o engajamento e fortalecendo sua presença
                online.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Posts para redes sociais</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Capas e avatares</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Stories e carrosséis</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Embalagens</h3>
              <p className="text-gray-dark mb-4">
                Design de embalagens que destacam seu produto nas prateleiras e proporcionam uma experiência memorável
                ao cliente.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Design de rótulos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Caixas e sacolas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Embalagens promocionais</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Sinalização</h3>
              <p className="text-gray-dark mb-4">
                Desenvolvimento de sistemas de sinalização para ambientes internos e externos, facilitando a navegação e
                reforçando sua marca.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Placas e totens</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Fachadas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Sinalização interna</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Ilustração</h3>
              <p className="text-gray-dark mb-4">
                Criação de ilustrações personalizadas para diversos fins, desde materiais promocionais até conteúdo
                editorial.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Ilustrações digitais</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Infográficos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Personagens e mascotes</span>
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
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Nosso Processo de Design</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Trabalhamos de forma colaborativa para garantir que o resultado final atenda às suas expectativas e
              objetivos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Briefing</h3>
              <p className="text-gray-dark">
                Entendemos suas necessidades, objetivos e público-alvo para alinhar o projeto com sua visão.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Pesquisa</h3>
              <p className="text-gray-dark">
                Analisamos o mercado, concorrentes e tendências para desenvolver uma estratégia visual eficaz.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Criação</h3>
              <p className="text-gray-dark">
                Desenvolvemos conceitos e alternativas visuais que atendam aos objetivos do projeto.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Finalização</h3>
              <p className="text-gray-dark">
                Refinamos o design escolhido e preparamos os arquivos para os meios de aplicação necessários.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Nossos Trabalhos</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Conheça alguns dos projetos de design gráfico que desenvolvemos para nossos clientes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt="BioGuiné"
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                  src="/images/portfolio/graphicdesign/POLO-shirt_bioGuine.png"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold font-bauhaus">BioGuiné</h3>
                <p className="text-sm text-gray-dark">
                  Design de uniforme corporativo.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt="UNDP Documento"
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                  src="/images/portfolio/graphicdesign/capa-documento-UNDP.jpg"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold font-bauhaus">UNDP</h3>
                <p className="text-sm text-gray-dark">
                  Design de capa para documento institucional.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt="Bissau Rising Creative Industry"
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                  src="/images/portfolio/graphicdesign/flyer-evento-bissau-rising-criative-industry.png"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold font-bauhaus">Creative Industry</h3>
                <p className="text-sm text-gray-dark">
                  Flyer para evento da indústria criativa.
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

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Benefícios dos Nossos Serviços</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Descubra como nossos serviços de design gráfico podem agregar valor ao seu negócio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Fortalecimento da Marca</h3>
              <p className="text-gray-dark">
                Materiais visuais consistentes e profissionais fortalecem o reconhecimento e a credibilidade da sua marca.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Comunicação Eficaz</h3>
              <p className="text-gray-dark">
                Design bem elaborado transmite sua mensagem de forma clara e impactante para seu público-alvo.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Diferenciação</h3>
              <p className="text-gray-dark">
                Design único e personalizado ajuda sua empresa a se destacar da concorrência no mercado.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Conversão de Vendas</h3>
              <p className="text-gray-dark">
                Materiais promocionais bem projetados atraem mais clientes e aumentam as chances de conversão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl md:text-5xl text-yellow">
              Pronto para transformar a identidade visual da sua empresa?
            </h2>
            <p className="max-w-[700px] text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Entre em contato conosco e descubra como nossos serviços de design gráfico podem ajudar sua empresa a se
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
