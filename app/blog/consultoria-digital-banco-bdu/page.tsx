import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ConsultoriaBDUPost() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <span className="text-yellow font-semibold">Consultoria Digital</span>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white font-bauhaus max-w-[900px]">
              Transformação Digital do Banco BDU: Um Caso de Sucesso em Inovação Bancária
            </h1>
            <p className="text-sm text-gray-400">10 Março, 2024</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <p className="lead">
                A ABIPTOM teve o privilégio de liderar um projeto de consultoria digital para o Banco BDU, 
                focado na modernização dos serviços bancários e na melhoria da experiência do cliente através 
                da implementação de soluções digitais inovadoras.
              </p>

              <h2 className="text-2xl font-bauhaus mt-8 mb-4">Desafios e Objetivos</h2>
              <p>
                O Banco BDU enfrentava desafios significativos na adaptação às demandas digitais do setor bancário:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Necessidade de modernizar a infraestrutura tecnológica</li>
                <li>Demanda por serviços bancários digitais mais acessíveis</li>
                <li>Exigência de maior segurança nas transações online</li>
                <li>Competição crescente com fintechs e bancos digitais</li>
              </ul>

              <h2 className="text-2xl font-bauhaus mt-8 mb-4">Nossa Solução</h2>
              <p>
                Desenvolvemos uma estratégia abrangente de transformação digital que incluiu:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Análise detalhada da infraestrutura existente e identificação de pontos de melhoria</li>
                <li>Desenvolvimento de um roadmap de transformação digital personalizado</li>
                <li>Implementação de novas soluções tecnológicas para mobile banking e internet banking</li>
                <li>Treinamento das equipes para adoção das novas tecnologias</li>
                <li>Consultoria em segurança cibernética e proteção de dados</li>
              </ul>

              <h2 className="text-2xl font-bauhaus mt-8 mb-4">Resultados Alcançados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bauhaus mb-3">Eficiência Operacional</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Redução de 40% no tempo de processamento de transações</li>
                    <li>Automação de 60% dos processos manuais</li>
                    <li>Diminuição de 30% nos custos operacionais</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bauhaus mb-3">Satisfação do Cliente</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Aumento de 85% na satisfação dos clientes</li>
                    <li>Crescimento de 150% na adoção de serviços digitais</li>
                    <li>Redução de 70% nas reclamações relacionadas a serviços online</li>
                  </ul>
                </div>
              </div>

              <p>
                A transformação digital do Banco BDU não apenas modernizou suas operações, mas também 
                estabeleceu novas referências para o setor bancário na Guiné-Bissau. O projeto demonstrou 
                como a tecnologia pode ser utilizada para melhorar significativamente a eficiência 
                operacional e a experiência do cliente no setor financeiro.
              </p>

              <h2 className="text-2xl font-bauhaus mt-8 mb-4">Próximos Passos</h2>
              <p>
                Continuamos a trabalhar em estreita colaboração com o Banco BDU para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Implementar novas funcionalidades baseadas no feedback dos clientes</li>
                <li>Expandir as capacidades de análise de dados e inteligência artificial</li>
                <li>Desenvolver soluções inovadoras para pagamentos móveis</li>
                <li>Fortalecer ainda mais a segurança cibernética</li>
              </ul>
            </div>

            {/* Share and Contact */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-bauhaus mb-2">Interessado em transformar seu negócio?</h3>
                  <p className="text-gray-600">Descubra como nossa consultoria digital pode ajudar sua empresa.</p>
                </div>
                <Button asChild className="bg-yellow text-black hover:bg-yellow-hover">
                  <Link href="/contacto">Fale Conosco</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
} 