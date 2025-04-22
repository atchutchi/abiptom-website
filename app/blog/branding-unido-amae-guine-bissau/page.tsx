import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BrandingUNIDOPost() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <span className="text-yellow font-semibold">Projeto Concluído</span>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white font-bauhaus max-w-[900px]">
              Concluímos com Sucesso o Projeto de Branding para 21 Marcas de Mulheres Empreendedoras na Guiné-Bissau
            </h1>
            <p className="text-sm text-gray-400">15 Março, 2024</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Featured Image */}
            <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
              <img
                alt="Reunião com UNIDO e AMAE"
                className="object-cover w-full h-full"
                src="/images/blog/reuniao-com-unido-e-amae-branding.jpg"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <p className="lead">
                Durante o verão de 2024, a ABIPTOM teve a honra de liderar, em estreita colaboração com a UNIDO e a AMAE, 
                um projeto transformador de branding e desenvolvimento de catálogo para 21 marcas lideradas por mulheres 
                empreendedoras em várias regiões da Guiné-Bissau.
              </p>

              <p>
                Este trabalho enquadra-se no âmbito do programa WACOMP-GB, financiado pela União Europeia, e teve como 
                principal objetivo reforçar a identidade visual e a presença de mercado de pequenos negócios com forte 
                componente local e sustentável.
              </p>

              <h2 className="text-2xl font-bauhaus mt-8 mb-4">O que fizemos</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Criação de 21 logotipos personalizados, respeitando a identidade, história e missão de cada marca.</li>
                <li>Desenvolvimento de guidelines (manuais de normas gráficas) para garantir a correta aplicação das marcas.</li>
                <li>Elaboração de um catálogo de produtos com fotografias profissionais, descrições detalhadas, contactos e informações comerciais.</li>
                <li>Criação do selo de confiança da AMAE, uma certificação simbólica que reconhece a conformidade e qualidade dos produtos alimentares produzidos pelas associadas.</li>
              </ul>

              {/* Image Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    alt="Visita à AMUGUIMAPA em Bafatá"
                    className="object-cover w-full h-full"
                    src="/images/blog/visita-amuguimapa-bafata-branding.jpg"
                  />
                </div>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    alt="Visita à Nha Guinendadi em Pelundo"
                    className="object-cover w-full h-full"
                    src="/images/blog/visita-nha-guinendadi-em-pelundo-branding.jpg"
                  />
                </div>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    alt="Sessão fotográfica dos produtos"
                    className="object-cover w-full h-full"
                    src="/images/blog/photo-shooting-branding.jpg"
                  />
                </div>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    alt="Visita à MEHED em Bafatá"
                    className="object-cover w-full h-full"
                    src="/images/blog/visita-a-mehed-bafata-branding.jpg"
                  />
                </div>
              </div>

              <p>
                O trabalho envolveu viagens de campo às regiões de Bafatá, Cacheu, Oio e Bissau, sessões de escuta com os 
                grupos beneficiários, entrevistas, recolha de conteúdos e sessões fotográficas. Foi um processo colaborativo, 
                com encontros regulares com os técnicos da UNIDO e os representantes da AMAE, garantindo a participação 
                ativa dos beneficiários em todas as fases.
              </p>

              <h2 className="text-2xl font-bauhaus mt-8 mb-4">Impacto</h2>
              <p>
                O novo branding permitiu às marcas reforçar a sua identidade visual, comunicar com mais clareza e confiança, 
                e posicionar-se melhor no mercado. O catálogo, por sua vez, abre portas a novas oportunidades de 
                comercialização, parcerias e exportação, contribuindo diretamente para a valorização da produção local.
              </p>

              <p>
                Este projeto é um exemplo do compromisso da ABIPTOM com o desenvolvimento económico sustentável e com a 
                capacitação de mulheres empreendedoras através de soluções criativas, digitais e inclusivas.
              </p>

              {/* Seal Image */}
              <div className="flex justify-center my-8">
                <img
                  alt="Selo AMAE"
                  className="h-32 w-auto"
                  src="/images/blog/selo_amae.jpg"
                />
              </div>
            </div>

            {/* Share and Contact */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-bauhaus mb-2">Interessado em nossos serviços?</h3>
                  <p className="text-gray-600">Entre em contato para saber como podemos ajudar seu negócio.</p>
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