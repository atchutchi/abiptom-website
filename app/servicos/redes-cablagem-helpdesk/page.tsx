import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function RedesCablagemHelpdeskPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bauhaus tracking-tighter sm:text-5xl md:text-6xl text-yellow">
              Redes, Cablagem e HelpDesk
            </h1>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Soluções completas de infraestrutura de rede, cablagem estruturada e suporte técnico para sua empresa.
            </p>
          </div>
        </div>
      </section>

      {/* Service Description */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Infraestrutura Confiável</h2>
              <p className="text-gray-dark md:text-xl/relaxed">
                Uma infraestrutura de rede robusta e bem planejada é fundamental para o funcionamento eficiente de
                qualquer empresa moderna. Na ABIPTOM, oferecemos soluções completas de redes e cablagem estruturada,
                garantindo conectividade estável, segura e de alta performance para o seu negócio.
              </p>
              <p className="text-gray-dark md:text-xl/relaxed">
                Complementamos nossa oferta com serviços de HelpDesk, proporcionando suporte técnico especializado para
                resolver problemas rapidamente e manter seus sistemas funcionando sem interrupções, permitindo que você
                se concentre no que realmente importa: o crescimento do seu negócio.
              </p>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover">
              <img
                alt="Redes e Cablagem"
                className="aspect-video object-cover w-full"
                src="/images/servicos/redes.png"
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
              Nossos Serviços de Redes, Cablagem e HelpDesk
            </h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Oferecemos uma gama completa de serviços para garantir a infraestrutura e o suporte técnico que sua
              empresa precisa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Projeto e Instalação de Redes</h3>
              <p className="text-gray-dark mb-4">
                Planejamento e implementação de infraestrutura de rede adaptada às necessidades específicas da sua
                empresa.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Redes LAN e WAN</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Redes sem fio (Wi-Fi)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Configuração de equipamentos</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Cablagem Estruturada</h3>
              <p className="text-gray-dark mb-4">
                Instalação profissional de sistemas de cablagem que garantem organização, eficiência e escalabilidade.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Cabos de rede Cat5e, Cat6 e Cat6a</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Fibra óptica</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Organização de racks e patch panels</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Serviços de HelpDesk</h3>
              <p className="text-gray-dark mb-4">
                Suporte técnico especializado para resolver problemas e atender às necessidades dos usuários.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Suporte remoto e presencial</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Resolução de problemas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Atendimento personalizado</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Segurança de Rede</h3>
              <p className="text-gray-dark mb-4">
                Implementação de soluções de segurança para proteger sua rede e dados contra ameaças cibernéticas.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Configuração de firewalls</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>VPNs para acesso remoto seguro</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Políticas de segurança</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Manutenção Preventiva</h3>
              <p className="text-gray-dark mb-4">
                Serviços regulares de manutenção para prevenir falhas e garantir o funcionamento contínuo da sua
                infraestrutura.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Verificação de equipamentos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Atualização de firmware</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Limpeza e organização</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-2">Consultoria em TI</h3>
              <p className="text-gray-dark mb-4">
                Assessoria especializada para ajudar sua empresa a tomar decisões estratégicas em relação à
                infraestrutura de TI.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Análise de necessidades</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Planejamento de capacidade</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-yellow" />
                  <span>Recomendações tecnológicas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Benefícios dos Nossos Serviços</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Descubra como nossos serviços de redes, cablagem e HelpDesk podem beneficiar sua empresa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Maior Produtividade</h3>
              <p className="text-gray-dark">
                Redes estáveis e suporte técnico eficiente reduzem o tempo de inatividade e aumentam a produtividade dos
                colaboradores.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Segurança Reforçada</h3>
              <p className="text-gray-dark">
                Implementação de medidas de segurança que protegem seus dados e sistemas contra ameaças cibernéticas.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Escalabilidade</h3>
              <p className="text-gray-dark">
                Infraestrutura projetada para crescer com sua empresa, permitindo expansões futuras sem grandes
                reformulações.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Redução de Custos</h3>
              <p className="text-gray-dark">
                Prevenção de problemas e manutenção adequada reduzem custos com reparos emergenciais e substituição de
                equipamentos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl">Nossa Metodologia de Trabalho</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Seguimos um processo estruturado para garantir a implementação eficiente e de alta qualidade dos nossos
              serviços.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Diagnóstico</h3>
              <p className="text-gray-dark">
                Avaliação detalhada das necessidades e infraestrutura existente.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Planejamento</h3>
              <p className="text-gray-dark">
                Desenvolvimento de soluções personalizadas e cronograma de implementação.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Implementação</h3>
              <p className="text-gray-dark">
                Execução dos serviços com mínimo impacto nas operações.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow text-black mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bauhaus mb-2">Monitoramento</h3>
              <p className="text-gray-dark">
                Acompanhamento contínuo e suporte pós-implementação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl text-yellow">Por Que Escolher a ABIPTOM?</h2>
            <p className="max-w-[700px] text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nossa experiência e compromisso com a excelência nos tornam a escolha ideal para suas necessidades de TI.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-yellow-400 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-4 text-black">Experiência Comprovada</h3>
              <p className="text-gray-dark">
                Nossa equipe possui vasta experiência em projetos de infraestrutura de TI, garantindo soluções robustas e confiáveis.
              </p>
            </div>
            <div className="bg-yellow-400 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-4 text-black">Suporte 24/7</h3>
              <p className="text-gray-dark">
                Oferecemos suporte técnico disponível 24 horas por dia, 7 dias por semana, para garantir a continuidade dos seus negócios.
              </p>
            </div>
            <div className="bg-yellow-400 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bauhaus mb-4 text-black">Tecnologia de Ponta</h3>
              <p className="text-gray-dark">
                Utilizamos as mais recentes tecnologias e melhores práticas do mercado para entregar soluções de alta performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
              Pronto para melhorar sua infraestrutura de TI?
            </h2>
            <p className="max-w-[700px] text-gray-800 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Entre em contato conosco para uma avaliação gratuita das suas necessidades.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild className="bg-yellow-400 text-black hover:bg-gray-900 font-bauhaus">
                <Link href="/contacto">Fale Conosco</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
