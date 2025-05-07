import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PortfolioGallery } from "@/app/components/portfolio-gallery"
import { PDFPreview } from "@/app/components/pdf-preview"
import Link from "next/link"
import { ClientLogos } from "@/components/client-logos"

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow font-bauhaus">Nosso Portfólio</h1>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Conheça alguns dos projetos que desenvolvemos para nossos clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-2">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="websites">Websites</TabsTrigger>
              <TabsTrigger value="design">Design Gráfico</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="video">Vídeo</TabsTrigger>
              <TabsTrigger value="pdf">PDFs</TabsTrigger>
              </TabsList>
            <TabsContent value="todos">
              <PortfolioGallery />
            </TabsContent>
            <TabsContent value="design">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Bissau Rising - Banners e Social Media"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/graphicdesign/bissaurising-banner.png"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Bissau Rising</h3>
                    <p className="text-sm text-gray-dark">
                      Design de banners e materiais para redes sociais do fórum de investimentos.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Campanha MTN Boss"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/graphicdesign/campanha-boss-mtn-guine-bissau.jpg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Campanha MTN Boss</h3>
                    <p className="text-sm text-gray-dark">
                      Design para campanha publicitária da MTN Guiné-Bissau.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Caiiro Tour"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/graphicdesign/Caiiro-tour-setembro-social-media.png"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Caiiro Tour</h3>
                    <p className="text-sm text-gray-dark">
                      Material promocional para turnê musical em redes sociais.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Yunus Social Business"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/graphicdesign/YSB_Agenda.png"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">YSB Agenda</h3>
                    <p className="text-sm text-gray-dark">
                      Design de materiais para Yunus Social Business.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Domínio .GW"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/graphicdesign/.gw-banner.png"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Campanha .GW</h3>
                    <p className="text-sm text-gray-dark">
                      Banner para campanha do domínio nacional .GW.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Ateliê Afrochic"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/graphicdesign/atelie-afrochic-salao.png"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Ateliê Afrochic</h3>
                    <p className="text-sm text-gray-dark">
                      Material promocional para salão de beleza.
                    </p>
                  </div>
                </div>

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
            </TabsContent>
            <TabsContent value="websites">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Website ARN"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/websites/arn.png"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Website ARN</h3>
                    <p className="text-sm text-gray-dark">
                      Desenvolvimento de website institucional com sistema de gestão de conteúdo.
                    </p>
                  </div>
                </div>
                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Website APBEF"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/websites/apbef.png"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Website APBEF</h3>
                    <p className="text-sm text-gray-dark">
                      Portal institucional para Associação Profissional dos Bancos.
                    </p>
                  </div>
                </div>
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
                      Site com sistema de reservas e gestão hoteleira.
                    </p>
                  </div>
                </div>
                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Website FUNDEI"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/websites/fundei.png"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Website FUNDEI</h3>
                    <p className="text-sm text-gray-dark">
                      Portal institucional com área de projetos e notícias.
                    </p>
                  </div>
                </div>
                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Website Magui"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/websites/magui.png"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Website Magui</h3>
                    <p className="text-sm text-gray-dark">
                      Site de comércio eletrônico com catálogo de produtos.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="social">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Campanha MTN Boss"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/graphicdesign/campanha-boss-mtn-guine-bissau.jpg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Campanha MTN Boss</h3>
                    <p className="text-sm text-gray-dark">
                      Gestão de redes sociais e criação de conteúdo para campanha promocional.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Caiiro Tour"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/graphicdesign/Caiiro-tour-setembro-social-media.png"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Caiiro Tour</h3>
                    <p className="text-sm text-gray-dark">
                      Estratégia de conteúdo e gestão de mídias sociais para evento musical.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Yunus Social Business"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/graphicdesign/ysb-design-social-media-1.jpg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Yunus Social Business</h3>
                    <p className="text-sm text-gray-dark">
                      Gestão de redes sociais e criação de conteúdo para organização social.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Bissau Rising"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/graphicdesign/flyer-bissau_rising_novembro_2022-07.jpg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Bissau Rising</h3>
                    <p className="text-sm text-gray-dark">
                      Estratégia digital e gestão de redes sociais para evento de investimentos.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt="Ateliê Afrochic"
                      className="object-cover w-full h-full transition-all group-hover:scale-105"
                      src="/images/portfolio/graphicdesign/atelie-afrochic-salao.png"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Ateliê Afrochic</h3>
                    <p className="text-sm text-gray-dark">
                      Gestão de redes sociais e marketing digital para salão de beleza.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="video">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/N_Oq4NavzGA"
                      title="BISSAU RISING - Impact Investment & Trade Forum"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">BISSAU RISING</h3>
                    <p className="text-sm text-gray-dark">
                      Impact Investment & Trade Forum - Produção audiovisual do evento.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/Rg8RjicC89Y"
                      title="Accelerator Lab Guinea-Bissau"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Accelerator Lab Guinea-Bissau</h3>
                    <p className="text-sm text-gray-dark">
                      Stakeholder Workshop and Launch - Cobertura do evento.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/H5W2LleZMF4"
                      title="Conheça o Accelerator Lab Guiné-Bissau"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Accelerator Lab Guiné-Bissau</h3>
                    <p className="text-sm text-gray-dark">
                      Vídeo institucional apresentando o Accelerator Lab.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/caVDyyjDCtA"
                      title="DARLING Bissau"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">DARLING Bissau</h3>
                    <p className="text-sm text-gray-dark">
                      Produção audiovisual promocional.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/rKKBUsQvJrQ"
                      title="Campanha de promoção do domínio .gw"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Domínio .gw</h3>
                    <p className="text-sm text-gray-dark">
                      Campanha de promoção do domínio nacional.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/IAuD98YppLQ"
                      title="VÍDEO INFORMATIVO PARA EVENTOS UN-HABITAT"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">UN-HABITAT</h3>
                    <p className="text-sm text-gray-dark">
                      Vídeo informativo em animação 2D para eventos.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/O45iNfSO4tQ"
                      title="ALDEIA DAS CRIANÇAS SOS Guiné-Bissau"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Aldeias SOS</h3>
                    <p className="text-sm text-gray-dark">
                      Animação 2D para campanha de regresso às aulas.
                    </p>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-lg border">
                  <div className="relative aspect-video overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/i2sEd7MQ-ro"
                      title="Tabaski AC Covid-19"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold font-bauhaus">Tabaski AC Covid-19</h3>
                    <p className="text-sm text-gray-dark">
                      Animação 2D para campanha de conscientização.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="pdf" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <PDFPreview
                  pdfUrl="/docs/portfolio/Relatorio-Anual-laboratorio-de-aceleração-undp-2022.pdf"
                  title="Relatório UNDP 2022"
                  description="Design do relatório anual do Laboratório de Aceleração UNDP."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/Relatorio-Anual-laboratorio-de-aceleração-undp-2020.pdf"
                  title="Relatório UNDP 2020"
                  description="Design do relatório anual do Laboratório de Aceleração UNDP."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/THE-TOURIST-INVESTMENT-GUIDE-Guine-Bissau-Ministerio-de-turismo.pdf"
                  title="Guia de Investimento Turístico"
                  description="Design do guia de investimento turístico para o Ministério do Turismo."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/brochura-INVESTING-IN-GUINEA-BISSSAU.pdf"
                  title="Investing in Guinea-Bissau"
                  description="Brochura de promoção de investimentos na Guiné-Bissau."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/catalogo-produtos-da-amae.pdf"
                  title="Catálogo AMAE"
                  description="Catálogo de produtos da Associação de Mulheres de Atividade Económica."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/covid-19-The-Building-Forward_report.pdf"
                  title="Building Forward"
                  description="Relatório sobre impactos e recuperação pós-COVID-19."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/flyer-kau.criar.pdf"
                  title="Flyer Kau Criar"
                  description="Material promocional para o programa de empreendedorismo."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/Rollup-dialogo-financeiro.pdf"
                  title="Roll-up Diálogo Financeiro"
                  description="Design de roll-up para evento de diálogo financeiro."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/Flyer_no-firmanta.pdf"
                  title="Flyer Nô Firmanta"
                  description="Material promocional para o projeto Nô Firmanta."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/forum-bissau-rising-guine-bissau-UNDP.pdf"
                  title="Fórum Bissau Rising"
                  description="Material gráfico para o fórum de investimentos Bissau Rising."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/6th-edition-newsletter-west-africa-competitive-programme-guinea-bissau-wacomp.pdf"
                  title="Newsletter WACOMP"
                  description="6ª edição da newsletter do Programa de Competitividade da África Ocidental - Guiné-Bissau."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/bloco-de-nota-dialogo-financeiro-undp.pdf"
                  title="Bloco de Notas UNDP"
                  description="Design de bloco de notas para o diálogo financeiro do UNDP."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/Pitch-Justiça-Movel-undp.pdf"
                  title="Pitch Justiça Móvel"
                  description="Apresentação do projeto Justiça Móvel do UNDP."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/Communication-Strategy-2022-2026-UNDP.pdf"
                  title="Estratégia de Comunicação UNDP"
                  description="Design do documento de estratégia de comunicação 2022-2026 do UNDP."
                />

                <PDFPreview
                  pdfUrl="/docs/portfolio/Capa-unicef.pdf"
                  title="Capa UNICEF"
                  description="Design de capa para documento da UNICEF."
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 md:py-24 bg-gray-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-bauhaus text-black">Clientes que confiam em nós</h2>
            <p className="max-w-[700px] text-gray-dark md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Trabalhamos com empresas e organizações de diversos setores.
            </p>
          </div>
          <ClientLogos />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow font-bauhaus">
              Vamos trabalhar juntos no seu próximo projeto?
            </h2>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Entre em contato conosco e descubra como podemos ajudar sua empresa a crescer.
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
