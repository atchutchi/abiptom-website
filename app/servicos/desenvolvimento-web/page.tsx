import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function DesenvolvimentoWebPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bauhaus tracking-tighter sm:text-5xl md:text-6xl text-yellow">
              Desenvolvimento Web
            </h1>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Websites modernos, responsivos e otimizados para SEO que convertem visitantes em clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Presença Digital Eficiente</h2>
              <p className="text-gray-dark md:text-xl/relaxed">
                Na era digital, ter um website não é apenas uma opção, mas uma necessidade para qualquer negócio que
                deseja crescer. Na ABIPTOM, desenvolvemos websites que não são apenas visualmente atraentes, mas também
                funcionais, rápidos e otimizados para mecanismos de busca.
              </p>
              <p className="text-gray-dark md:text-xl/relaxed">
                Nossa equipe de desenvolvedores web combina conhecimento técnico com design centrado no usuário para
                criar experiências digitais que engajam visitantes e os convertem em clientes.
              </p>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover">
              <img
                alt="Desenvolvimento Web"
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
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Nossos Serviços de Desenvolvimento Web</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Oferecemos soluções web completas para atender às necessidades específicas do seu negócio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Websites Institucionais</h3>
              <p className="text-gray-dark mb-4">
                Criação de websites profissionais que apresentam sua empresa, produtos e serviços de forma clara e
                atrativa.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Design personalizado</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Responsivo para todos os dispositivos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Otimizado para SEO</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">E-commerce</h3>
              <p className="text-gray-dark mb-4">
                Desenvolvimento de lojas virtuais completas para vender seus produtos online de forma segura e
                eficiente.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Catálogo de produtos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Carrinho de compras</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Integração com meios de pagamento</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Landing Pages</h3>
              <p className="text-gray-dark mb-4">
                Criação de páginas de destino otimizadas para conversão, ideais para campanhas de marketing digital.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Foco em conversão</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Formulários de captura de leads</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Integração com ferramentas de marketing</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Portais e Sistemas Web</h3>
              <p className="text-gray-dark mb-4">
                Desenvolvimento de portais e sistemas web personalizados para otimizar processos internos da sua
                empresa.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Intranets</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Sistemas de gestão</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Plataformas educacionais</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Blogs e Portais de Conteúdo</h3>
              <p className="text-gray-dark mb-4">
                Criação de blogs e portais de conteúdo para fortalecer sua estratégia de marketing de conteúdo.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Sistema de gerenciamento de conteúdo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Categorização e tags</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Integração com redes sociais</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Manutenção e Atualização</h3>
              <p className="text-gray-dark mb-4">
                Serviços de manutenção e atualização para garantir que seu website esteja sempre funcionando
                perfeitamente.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Atualizações de segurança</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Backup regular</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Suporte técnico</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Tecnologias que Utilizamos</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Trabalhamos com as tecnologias mais modernas e eficientes para desenvolver soluções web de alta qualidade.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            <div className="flex flex-col items-center justify-center p-4">
              <img alt="HTML5" className="h-16 w-auto mb-2" src="/images/servicos/JavaScript-logo.png" />
              <span className="text-sm font-medium">JavaScript</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <img alt="CSS3" className="h-16 w-auto mb-2" src="/images/servicos/React_Logo_SVG.svg.png" />
              <span className="text-sm font-medium">React</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <img alt="JavaScript" className="h-16 w-auto mb-2" src="/images/servicos/Node.js_logo.svg" />
              <span className="text-sm font-medium">Node.js</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <img alt="React" className="h-16 w-auto mb-2" src="/images/servicos/Python-logo-notext.svg.png" />
              <span className="text-sm font-medium">Python</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <img alt="WordPress" className="h-16 w-auto mb-2" src="/images/servicos/SQL-Database.png" />
              <span className="text-sm font-medium">SQL</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <img alt="PHP" className="h-16 w-auto mb-2" src="/images/servicos/flutter-logo-white-inset.svg" />
              <span className="text-sm font-medium">Flutter</span>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Nosso Processo de Desenvolvimento</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Seguimos uma metodologia estruturada para garantir que seu projeto seja entregue com qualidade e dentro do
              prazo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Planejamento</h3>
              <p className="text-gray-dark">Definimos os objetivos, público-alvo e funcionalidades do seu website.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Design</h3>
              <p className="text-gray-dark">Criamos wireframes e layouts que atendam às necessidades do seu negócio.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Desenvolvimento</h3>
              <p className="text-gray-dark">
                Codificamos o website utilizando as tecnologias mais adequadas para o projeto.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Testes</h3>
              <p className="text-gray-dark">
                Realizamos testes rigorosos para garantir que tudo funcione perfeitamente.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">5</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Lançamento</h3>
              <p className="text-gray-dark">Publicamos seu website e fornecemos suporte contínuo após o lançamento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Nossos Trabalhos</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Conheça alguns dos websites que desenvolvemos para nossos clientes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt="Website NDJAR"
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                  src="/images/portfolio/websites/ndjar.png"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold font-bauhaus">Website NDJAR</h3>
                <p className="text-sm text-gray-dark">
                  Site institucional com catálogo de produtos e serviços.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt="Website ABIPTOM"
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                  src="/images/portfolio/websites/abiptom.png"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold font-bauhaus">Website ABIPTOM</h3>
                <p className="text-sm text-gray-dark">
                  Desenvolvimento do nosso próprio website institucional.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt="Website Hotel Uque"
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                  src="/images/portfolio/websites/hotel-uque.png"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold font-bauhaus">Website Hotel Uque</h3>
                <p className="text-sm text-gray-dark">
                  Website com sistema de reservas para hotel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Benefícios dos Nossos Serviços</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Descubra como nossos serviços de desenvolvimento web podem impulsionar seu negócio online.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Aumento da Visibilidade</h3>
              <p className="text-gray-dark">
                Websites otimizados para SEO que ajudam sua empresa a ser encontrada pelos clientes ideais.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Experiência do Usuário</h3>
              <p className="text-gray-dark">
                Interfaces intuitivas e responsivas que proporcionam a melhor experiência em qualquer dispositivo.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Geração de Leads</h3>
              <p className="text-gray-dark">
                Estratégias de conversão que transformam visitantes em leads qualificados para seu negócio.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Credibilidade</h3>
              <p className="text-gray-dark">
                Um website profissional e moderno que transmite confiança e fortalece a imagem da sua marca.
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
              Pronto para criar ou renovar seu website?
            </h2>
            <p className="max-w-[700px] text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Entre em contato conosco e descubra como nossos serviços de desenvolvimento web podem ajudar sua empresa a
              crescer online.
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
