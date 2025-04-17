import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow-400 font-bauhaus">Trabalhe Conosco</h1>
            <p className="max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Junte-se à nossa equipe e faça parte de projetos inovadores.
            </p>
          </div>
        </div>
      </section>

      {/* Careers Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4 font-bauhaus">Por que trabalhar na ABIPTOM?</h2>
                <p className="text-gray-700">
                  Na ABIPTOM, acreditamos que nosso maior ativo são as pessoas. Buscamos profissionais talentosos e
                  apaixonados que queiram fazer a diferença no mercado digital da Guiné-Bissau e além.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-yellow-400">
                  <h3 className="text-xl font-bold mb-2 font-bauhaus">Ambiente Inovador</h3>
                  <p className="text-gray-700">
                    Trabalhamos com as mais recentes tecnologias e metodologias, proporcionando um ambiente de constante
                    aprendizado e inovação.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-yellow-400">
                  <h3 className="text-xl font-bold mb-2 font-bauhaus">Crescimento Profissional</h3>
                  <p className="text-gray-700">
                    Oferecemos oportunidades de desenvolvimento e crescimento dentro da empresa, com projetos
                    desafiadores e diversificados.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-yellow-400">
                  <h3 className="text-xl font-bold mb-2 font-bauhaus">Equipe Colaborativa</h3>
                  <p className="text-gray-700">
                    Valorizamos o trabalho em equipe e a colaboração, criando um ambiente de trabalho positivo e
                    produtivo.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 font-bauhaus">Áreas de Atuação</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Design Gráfico</li>
                  <li>Desenvolvimento Web</li>
                  <li>Marketing Digital</li>
                  <li>Gestão de Redes Sociais</li>
                  <li>Produção de Vídeo</li>
                  <li>Fotografia</li>
                  <li>Animação 2D</li>
                </ul>
              </div>
            </div>
            <div>
              <Card className="border-yellow-400 border-2">
                <CardHeader className="bg-black text-white">
                  <CardTitle className="font-bauhaus text-yellow-400">Candidate-se</CardTitle>
                  <CardDescription className="text-gray-300">
                    Preencha o formulário abaixo e envie seu currículo para se candidatar a uma vaga na ABIPTOM.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">Nome</Label>
                        <Input id="first-name" placeholder="Seu nome" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Sobrenome</Label>
                        <Input id="last-name" placeholder="Seu sobrenome" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" placeholder="Seu email" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" placeholder="Seu telefone" type="tel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Área de Interesse</Label>
                      <Input id="position" placeholder="Ex: Design Gráfico, Desenvolvimento Web, etc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea
                        className="min-h-[120px]"
                        id="message"
                        placeholder="Conte-nos um pouco sobre você e sua experiência"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cv">Currículo (PDF)</Label>
                      <Input id="cv" type="file" accept=".pdf" />
                    </div>
                    <Button type="submit" className="w-full bg-black text-yellow-400 hover:bg-gray-900 font-bauhaus">
                      Enviar Candidatura
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
