import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function DesenvolvimentoSoftwarePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bauhaus tracking-tighter sm:text-5xl md:text-6xl text-yellow">
              Desenvolvimento de Software
            </h1>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Soluções de software personalizadas para otimizar processos e aumentar a produtividade.
            </p>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Soluções Digitais Sob Medida</h2>
              <p className="text-gray-dark md:text-xl/relaxed">
                No mundo digital atual, o software certo pode transformar completamente a eficiência e competitividade
                do seu negócio. Na ABIPTOM, desenvolvemos soluções de software personalizadas que atendem às
                necessidades específicas da sua empresa, automatizando processos, integrando sistemas e fornecendo
                insights valiosos para tomada de decisões.
              </p>
              <p className="text-gray-dark md:text-xl/relaxed">
                Nossa equipe de desenvolvedores experientes combina conhecimento técnico com compreensão de negócios
                para criar aplicações robustas, escaláveis e intuitivas que impulsionam a produtividade e a inovação na
                sua organização.
              </p>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover">
              <img
                alt="Desenvolvimento de Software"
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
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">
              Nossos Serviços de Desenvolvimento de Software
            </h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Oferecemos uma ampla gama de serviços de desenvolvimento para atender às necessidades específicas do seu
              negócio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Aplicações Web Personalizadas</h3>
              <p className="text-gray-dark mb-4">
                Desenvolvimento de aplicações web sob medida para atender às necessidades específicas do seu negócio.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Interfaces intuitivas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Arquitetura escalável</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Integração com sistemas existentes</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Aplicativos Móveis</h3>
              <p className="text-gray-dark mb-4">
                Criação de aplicativos móveis nativos ou híbridos para iOS e Android que conectam sua empresa aos
                clientes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Experiência do usuário otimizada</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Funcionalidades offline</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Notificações push</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Sistemas de Gestão Empresarial</h3>
              <p className="text-gray-dark mb-4">
                Desenvolvimento de sistemas ERP, CRM e outras soluções de gestão adaptadas ao seu modelo de negócio.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Automação de processos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Relatórios personalizados</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Gestão integrada</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Integrações de Sistemas</h3>
              <p className="text-gray-dark mb-4">
                Conectamos diferentes sistemas e aplicações para garantir o fluxo eficiente de dados em toda a sua
                organização.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>APIs personalizadas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Middleware</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Sincronização de dados</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Desenvolvimento de E-commerce</h3>
              <p className="text-gray-dark mb-4">
                Criação de plataformas de comércio eletrônico personalizadas ou adaptação de soluções existentes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Integração com meios de pagamento</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Gestão de estoque</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Experiência de compra otimizada</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Manutenção e Suporte</h3>
              <p className="text-gray-dark mb-4">
                Serviços contínuos de manutenção, atualização e suporte para garantir o funcionamento ideal dos seus
                sistemas.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Monitoramento proativo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Atualizações de segurança</span>
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
              Trabalhamos com as tecnologias mais modernas e eficientes para desenvolver soluções de software de alta
              qualidade.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            <div className="flex flex-col items-center justify-center p-4">
              <img alt="JavaScript" className="h-16 w-auto mb-2" src="/images/servicos/JavaScript-logo.png" />
              <span className="text-sm font-medium">JavaScript</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <img alt="Python" className="h-16 w-auto mb-2" src="/images/servicos/Python-logo-notext.svg.png" />
              <span className="text-sm font-medium">Python</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <img alt="React" className="h-16 w-auto mb-2" src="/images/servicos/React_Logo_SVG.svg.png" />
              <span className="text-sm font-medium">React</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <img alt="Node.js" className="h-16 w-auto mb-2" src="/images/servicos/Node.js_logo.svg" />
              <span className="text-sm font-medium">Node.js</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <img alt="Flutter" className="h-16 w-auto mb-2" src="/images/servicos/flutter-logo-white-inset.svg" />
              <span className="text-sm font-medium">Flutter</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <img alt="SQL" className="h-16 w-auto mb-2" src="/images/servicos/SQL-Database.png" />
              <span className="text-sm font-medium">SQL</span>
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
              <h3 className="text-xl font-bauhaus mb-2">Análise de Requisitos</h3>
              <p className="text-gray-dark">
                Entendemos suas necessidades e definimos os requisitos funcionais e técnicos do projeto.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Design e Arquitetura</h3>
              <p className="text-gray-dark">
                Projetamos a arquitetura do sistema e criamos protótipos de interface do usuário.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Desenvolvimento</h3>
              <p className="text-gray-dark">
                Codificamos o software seguindo as melhores práticas e padrões de qualidade.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Testes</h3>
              <p className="text-gray-dark">
                Realizamos testes rigorosos para garantir a qualidade e o funcionamento correto do software.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-xl font-bold">5</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Implantação e Suporte</h3>
              <p className="text-gray-dark">
                Implantamos o software em ambiente de produção e fornecemos suporte contínuo.
              </p>
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

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl md:text-5xl text-yellow">
              Pronto para transformar sua ideia em software?
            </h2>
            <p className="max-w-[700px] text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Entre em contato conosco e descubra como nossos serviços de desenvolvimento de software podem ajudar sua
              empresa a crescer e se tornar mais eficiente.
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
