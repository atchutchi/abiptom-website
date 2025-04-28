"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageLightbox } from "./image-lightbox"
import { PDFPreview } from "@/app/components/pdf-preview"

interface PortfolioItem {
  id: string
  title: string
  description: string
  image: string
  category: string[]
  tags: string[]
}

const portfolioItems: PortfolioItem[] = [
  // Websites
  {
    id: 'website-arn',
    title: 'Website ARN',
    description: 'Desenvolvimento de website institucional com sistema de gestão de conteúdo.',
    image: '/images/portfolio/websites/arn.png',
    category: ['websites'],
    tags: ['Next.js', 'React', 'CMS']
  },
  {
    id: 'website-apbef',
    title: 'Website APBEF',
    description: 'Portal institucional para Associação Profissional dos Bancos.',
    image: '/images/portfolio/websites/apbef.png',
    category: ['websites'],
    tags: ['WordPress', 'PHP', 'MySQL']
  },
  {
    id: 'website-ndjar',
    title: 'Website NDJAR',
    description: 'Site institucional com catálogo de produtos e serviços.',
    image: '/images/portfolio/websites/ndjar.png',
    category: ['websites'],
    tags: ['Next.js', 'React', 'E-commerce']
  },
  {
    id: 'website-abiptom',
    title: 'Website ABIPTOM',
    description: 'Desenvolvimento do nosso próprio website institucional.',
    image: '/images/portfolio/websites/abiptom.png',
    category: ['websites'],
    tags: ['Next.js', 'React', 'TypeScript']
  },
  {
    id: 'hotel-uque',
    title: 'Website Hotel Uque',
    description: 'Site com sistema de reservas e gestão hoteleira.',
    image: '/images/portfolio/websites/hotel-uque.png',
    category: ['websites'],
    tags: ['WordPress', 'PHP', 'Hotelaria']
  },
  {
    id: 'fundei',
    title: 'Website FUNDEI',
    description: 'Portal institucional com área de projetos e notícias.',
    image: '/images/portfolio/websites/fundei.png',
    category: ['websites'],
    tags: ['WordPress', 'PHP', 'CMS']
  },
  {
    id: 'magui',
    title: 'Website Magui',
    description: 'Site de comércio eletrônico com catálogo de produtos.',
    image: '/images/portfolio/websites/magui.png',
    category: ['websites'],
    tags: ['Next.js', 'React', 'E-commerce']
  },

  // Design Gráfico
  {
    id: 'bissau-rising',
    title: 'Bissau Rising',
    description: 'Design de banners e materiais para redes sociais do fórum de investimentos.',
    image: '/images/portfolio/graphicdesign/bissaurising-banner.png',
    category: ['design', 'social'],
    tags: ['Branding', 'Social Media', 'Design']
  },
  {
    id: 'mtn-boss',
    title: 'Campanha MTN Boss',
    description: 'Design para campanha publicitária da MTN Guiné-Bissau.',
    image: '/images/portfolio/graphicdesign/campanha-boss-mtn-guine-bissau.jpg',
    category: ['design'],
    tags: ['Publicidade', 'Design']
  },
  {
    id: 'caiiro-tour',
    title: 'Caiiro Tour',
    description: 'Material promocional para turnê musical em redes sociais.',
    image: '/images/portfolio/graphicdesign/Caiiro-tour-setembro-social-media.png',
    category: ['design', 'social'],
    tags: ['Design', 'Social Media', 'Eventos']
  },
  {
    id: 'ysb-agenda',
    title: 'YSB Agenda',
    description: 'Design de materiais para Yunus Social Business.',
    image: '/images/portfolio/graphicdesign/YSB_Agenda.png',
    category: ['design'],
    tags: ['Design', 'Branding']
  },
  {
    id: 'gw-domain',
    title: 'Campanha .GW',
    description: 'Banner para campanha do domínio nacional .GW.',
    image: '/images/portfolio/graphicdesign/.gw-banner.png',
    category: ['design'],
    tags: ['Design', 'Publicidade']
  },
  {
    id: 'afrochic',
    title: 'Ateliê Afrochic',
    description: 'Material promocional para salão de beleza.',
    image: '/images/portfolio/graphicdesign/atelie-afrochic-salao.png',
    category: ['design', 'social'],
    tags: ['Design', 'Social Media']
  },
  {
    id: 'bioguine',
    title: 'BioGuiné',
    description: 'Design de uniforme corporativo.',
    image: '/images/portfolio/graphicdesign/POLO-shirt_bioGuine.png',
    category: ['design'],
    tags: ['Design', 'Branding']
  },
  {
    id: 'undp-doc',
    title: 'UNDP',
    description: 'Design de capa para documento institucional.',
    image: '/images/portfolio/graphicdesign/capa-documento-UNDP.jpg',
    category: ['design'],
    tags: ['Design', 'Editorial']
  },
  {
    id: 'creative-industry',
    title: 'Creative Industry',
    description: 'Flyer para evento da indústria criativa.',
    image: '/images/portfolio/graphicdesign/flyer-evento-bissau-rising-criative-industry.png',
    category: ['design'],
    tags: ['Design', 'Eventos']
  },

  // Vídeos
  {
    id: 'bissau-rising-video',
    title: 'BISSAU RISING',
    description: 'Impact Investment & Trade Forum - Produção audiovisual do evento.',
    image: 'https://www.youtube.com/embed/N_Oq4NavzGA',
    category: ['video'],
    tags: ['Vídeo', 'Eventos', 'Cobertura']
  },
  {
    id: 'accelerator-lab-workshop',
    title: 'Accelerator Lab Guinea-Bissau',
    description: 'Stakeholder Workshop and Launch - Cobertura do evento.',
    image: 'https://www.youtube.com/embed/VIDEO_ID_1',
    category: ['video'],
    tags: ['Vídeo', 'Eventos', 'Cobertura']
  },
  {
    id: 'accelerator-lab-institucional',
    title: 'Accelerator Lab Guiné-Bissau',
    description: 'Vídeo institucional apresentando o Accelerator Lab.',
    image: 'https://www.youtube.com/embed/VIDEO_ID_2',
    category: ['video'],
    tags: ['Vídeo', 'Institucional']
  },
  {
    id: 'darling',
    title: 'DARLING Bissau',
    description: 'Produção audiovisual promocional.',
    image: 'https://www.youtube.com/embed/VIDEO_ID_3',
    category: ['video'],
    tags: ['Vídeo', 'Publicidade']
  },
  {
    id: 'gw-domain-video',
    title: 'Domínio .gw',
    description: 'Campanha de promoção do domínio nacional.',
    image: 'https://www.youtube.com/embed/VIDEO_ID_4',
    category: ['video'],
    tags: ['Vídeo', 'Publicidade', 'Animação']
  },
  {
    id: 'un-habitat',
    title: 'UN-HABITAT',
    description: 'Vídeo informativo em animação 2D para eventos.',
    image: 'https://www.youtube.com/embed/VIDEO_ID_5',
    category: ['video'],
    tags: ['Vídeo', 'Animação', 'Motion Graphics']
  },
  {
    id: 'aldeias-sos',
    title: 'Aldeias SOS',
    description: 'Animação 2D para campanha de regresso às aulas.',
    image: 'https://www.youtube.com/embed/VIDEO_ID_6',
    category: ['video'],
    tags: ['Vídeo', 'Animação', 'Motion Graphics']
  },
  {
    id: 'tabaski',
    title: 'Tabaski AC Covid-19',
    description: 'Animação 2D para campanha de conscientização.',
    image: 'https://www.youtube.com/embed/VIDEO_ID_7',
    category: ['video'],
    tags: ['Vídeo', 'Animação', 'Motion Graphics']
  },

  // Social Media
  {
    id: 'ysb-social',
    title: 'Yunus Social Business',
    description: 'Gestão de redes sociais e criação de conteúdo para organização social.',
    image: '/images/portfolio/graphicdesign/ysb-design-social-media-1.jpg',
    category: ['social', 'design'],
    tags: ['Social Media', 'Design', 'Gestão de Conteúdo']
  },
  {
    id: 'bissau-rising-social',
    title: 'Bissau Rising',
    description: 'Estratégia digital e gestão de redes sociais para evento de investimentos.',
    image: '/images/portfolio/graphicdesign/flyer-bissau_rising_novembro_2022-07.jpg',
    category: ['social', 'design'],
    tags: ['Social Media', 'Design', 'Estratégia Digital']
  }
]

const categories = [
  { id: 'todos', name: 'Todos', count: portfolioItems.length },
  { 
    id: 'websites', 
    name: 'Websites',
    count: portfolioItems.filter(item => item.category.includes('websites')).length 
  },
  { 
    id: 'design', 
    name: 'Design Gráfico',
    count: portfolioItems.filter(item => item.category.includes('design')).length 
  },
  { 
    id: 'social', 
    name: 'Social Media',
    count: portfolioItems.filter(item => item.category.includes('social')).length 
  },
  { 
    id: 'video', 
    name: 'Vídeo',
    count: portfolioItems.filter(item => item.category.includes('video')).length 
  }
]

export function PortfolioGallery() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['todos'])
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  
  const handleCategoryClick = (category: string) => {
    if (category === 'todos') {
      setSelectedCategories(['todos'])
    } else {
      const newCategories = selectedCategories.includes('todos') 
        ? [category]
        : selectedCategories.includes(category)
          ? selectedCategories.filter(c => c !== category)
          : [...selectedCategories, category]
      
      setSelectedCategories(newCategories.length ? newCategories : ['todos'])
    }
  }

  const filteredItems = selectedCategories.includes('todos')
    ? portfolioItems
    : portfolioItems.filter(item => 
        item.category.some(cat => selectedCategories.includes(cat))
      )

  const lightboxImages = filteredItems.map(item => ({
    src: item.image,
    alt: item.title,
    title: item.title,
    description: item.description
  }))

  return (
    <div className="space-y-8">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategories.includes(category.id) ? "default" : "outline"}
            onClick={() => handleCategoryClick(category.id)}
            className="transition-all"
          >
            {category.name}
            <Badge variant="secondary" className="ml-2">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-lg border cursor-pointer hover:border-yellow-400 transition-colors"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative aspect-video overflow-hidden">
              {item.category.includes('video') ? (
                <iframe
                  className="w-full h-full"
                  src={item.image}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  alt={item.title}
                  src={item.image}
                  className="object-cover w-full h-full transition-all group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold font-bauhaus">{item.title}</h3>
              <p className="text-sm text-gray-dark">{item.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {item.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        initialIndex={selectedItem ? filteredItems.findIndex(item => item.id === selectedItem.id) : 0}
      />

      {/* PDFs */}
      <PDFPreview
        pdfUrl="/docs/portfolio/Relatorio-Anual-laboratorio-de-aceleração-undp-2022.pdf"
        title="Relatório UNDP 2022"
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
        pdfUrl="/docs/portfolio/Flyer_Nô Firmanta.pdf"
        title="Flyer Nô Firmanta"
        description="Material promocional para o projeto Nô Firmanta."
      />
    </div>
  )
} 