import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow font-bauhaus">Blog</h1>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Notícias, insights e atualizações sobre nosso trabalho e a indústria criativa.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="group">
            <Link href="/blog/branding-unido-amae-guine-bissau">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    alt="Projeto de Branding UNIDO e AMAE"
                    className="object-cover w-full h-full transition-all group-hover:scale-105"
                    src="/images/blog/reuniao-com-unido-e-amae-branding.jpg"
                  />
                </div>
                <div>
                  <span className="text-yellow font-semibold">Projeto em Destaque</span>
                  <h2 className="text-2xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus mt-2">
                    Concluímos com Sucesso o Projeto de Branding para 21 Marcas de Mulheres Empreendedoras na Guiné-Bissau
                  </h2>
                  <p className="text-sm text-gray-dark mt-2">15 Março, 2024</p>
                  <p className="text-gray-dark mt-4">
                    Em colaboração com a UNIDO e a AMAE, desenvolvemos identidades visuais e um catálogo completo para 21 marcas lideradas por mulheres empreendedoras em várias regiões da Guiné-Bissau.
                  </p>
                  <Button className="mt-4 bg-yellow text-black hover:bg-yellow-hover">
                    Ler mais
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Post 1 - Nova Consultoria Digital */}
            <div className="group">
              <Link href="/blog/consultoria-digital-banco-bdu">
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    alt="Consultoria Digital para o Banco BDU"
                    className="object-cover w-full h-full transition-all group-hover:scale-105"
                    src="/placeholder.svg?height=400&width=600"
                  />
                </div>
                <h3 className="text-xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus">
                  ABIPTOM Lidera Transformação Digital do Banco BDU
                </h3>
                <p className="text-sm text-gray-dark mt-2">10 Março, 2024</p>
                <p className="text-gray-dark mt-2">
                  Implementação bem-sucedida de estratégia digital completa, incluindo novo website, app mobile e presença nas redes sociais.
                </p>
              </Link>
            </div>

            {/* Post 2 - Projeto de Marketing Digital */}
            <div className="group">
              <Link href="/blog/campanha-digital-orange-bissau">
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    alt="Campanha Digital Orange Bissau"
                    className="object-cover w-full h-full transition-all group-hover:scale-105"
                    src="/placeholder.svg?height=400&width=600"
                  />
                </div>
                <h3 className="text-xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus">
                  Campanha Digital de Sucesso para Orange Bissau
                </h3>
                <p className="text-sm text-gray-dark mt-2">5 Março, 2024</p>
                <p className="text-gray-dark mt-2">
                  Estratégia integrada de marketing digital que alcançou mais de 100 mil pessoas e aumentou o engagement em 300%.
                </p>
              </Link>
            </div>

            {/* Post 3 - Galeria UNIDO */}
            <div className="group">
              <Link href="/blog/galeria-projeto-unido-amae">
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    alt="Galeria de Fotos - Projeto UNIDO e AMAE"
                    className="object-cover w-full h-full transition-all group-hover:scale-105"
                    src="/images/blog/visita-amuguimapa-bafata-branding.jpg"
                  />
                </div>
                <h3 className="text-xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus">
                  Galeria: Nos Bastidores do Projeto UNIDO e AMAE
                </h3>
                <p className="text-sm text-gray-dark mt-2">15 Março, 2024</p>
                <p className="text-gray-dark mt-2">
                  Uma jornada visual pelos momentos marcantes do projeto de branding com as empreendedoras da Guiné-Bissau.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow font-bauhaus">
              Inscreva-se em nossa newsletter
            </h2>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Receba as últimas notícias e atualizações diretamente em seu e-mail.
            </p>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex flex-col gap-2 min-[400px]:flex-row">
                <input
                  className="flex-1 h-10 px-3 rounded-md border"
                  placeholder="Seu e-mail"
                  type="email"
                />
                <Button className="bg-yellow text-black hover:bg-yellow-hover">
                  Inscrever-se
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
