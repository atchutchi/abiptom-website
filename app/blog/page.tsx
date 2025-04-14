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

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Post 1 */}
            <div className="group">
              <Link href="/blog/post-1">
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    alt="Como criar uma marca forte"
                    className="object-cover w-full h-full transition-all group-hover:scale-105"
                    src="/images/blog/branding.jpg"
                  />
                </div>
                <h3 className="text-xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus">
                  Como criar uma marca forte
                </h3>
                <p className="text-sm text-gray-dark mt-2">12 Março, 2024</p>
                <p className="text-gray-dark mt-2">
                  Descubra as estratégias essenciais para desenvolver uma marca memorável e impactante.
                </p>
              </Link>
            </div>

            {/* Post 2 */}
            <div className="group">
              <Link href="/blog/post-2">
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    alt="Tendências de Design para 2024"
                    className="object-cover w-full h-full transition-all group-hover:scale-105"
                    src="/images/blog/design-trends.jpg"
                  />
                </div>
                <h3 className="text-xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus">
                  Tendências de Design para 2024
                </h3>
                <p className="text-sm text-gray-dark mt-2">5 Março, 2024</p>
                <p className="text-gray-dark mt-2">
                  As principais tendências de design que estão moldando o mercado criativo este ano.
                </p>
              </Link>
            </div>

            {/* Post 3 */}
            <div className="group">
              <Link href="/blog/post-3">
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    alt="Marketing Digital na Guiné-Bissau"
                    className="object-cover w-full h-full transition-all group-hover:scale-105"
                    src="/images/blog/digital-marketing.jpg"
                  />
                </div>
                <h3 className="text-xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus">
                  Marketing Digital na Guiné-Bissau
                </h3>
                <p className="text-sm text-gray-dark mt-2">1 Março, 2024</p>
                <p className="text-gray-dark mt-2">
                  O panorama atual e as oportunidades do marketing digital no mercado guineense.
                </p>
              </Link>
            </div>

            {/* Post 4 */}
            <div className="group">
              <Link href="/blog/post-4">
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    alt="Produção de Vídeo: Do Conceito à Execução"
                    className="object-cover w-full h-full transition-all group-hover:scale-105"
                    src="/images/blog/video-production.jpg"
                  />
                </div>
                <h3 className="text-xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus">
                  Produção de Vídeo: Do Conceito à Execução
                </h3>
                <p className="text-sm text-gray-dark mt-2">25 Fevereiro, 2024</p>
                <p className="text-gray-dark mt-2">
                  Um guia completo sobre o processo de produção de vídeos profissionais.
                </p>
              </Link>
            </div>

            {/* Post 5 */}
            <div className="group">
              <Link href="/blog/post-5">
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    alt="Redes Sociais para Negócios"
                    className="object-cover w-full h-full transition-all group-hover:scale-105"
                    src="/images/blog/social-media.jpg"
                  />
                </div>
                <h3 className="text-xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus">
                  Redes Sociais para Negócios
                </h3>
                <p className="text-sm text-gray-dark mt-2">20 Fevereiro, 2024</p>
                <p className="text-gray-dark mt-2">
                  Como utilizar as redes sociais de forma estratégica para impulsionar seu negócio.
                </p>
              </Link>
            </div>

            {/* Post 6 */}
            <div className="group">
              <Link href="/blog/post-6">
                <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                  <img
                    alt="Web Design Responsivo"
                    className="object-cover w-full h-full transition-all group-hover:scale-105"
                    src="/images/blog/responsive-design.jpg"
                  />
                </div>
                <h3 className="text-xl font-bold text-black group-hover:text-yellow transition-colors font-bauhaus">
                  Web Design Responsivo
                </h3>
                <p className="text-sm text-gray-dark mt-2">15 Fevereiro, 2024</p>
                <p className="text-gray-dark mt-2">
                  A importância do design responsivo no desenvolvimento de websites modernos.
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
