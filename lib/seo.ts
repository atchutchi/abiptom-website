import type { Metadata } from 'next'
import { getSiteOrigin } from './site'
import { caseStudies } from './case-studies'

// Apenas páginas publicadas no código. Não inventar datas de atualização.
export const publicPages = [
  { path: '/', title: 'ABIPTOM | Marketing digital, websites e software em Bissau', description: 'A ABIPTOM, SARL presta serviços de marketing digital, design gráfico, desenvolvimento web e software em Bissau, Guiné-Bissau. Fale connosco sobre o seu projecto.' },
  { path: '/servicos', title: 'Serviços digitais em Bissau', description: 'Conheça os serviços da ABIPTOM na Guiné-Bissau: marketing digital, design, websites, software, redes sociais, fotografia, vídeo e infraestrutura técnica.' },
  { path: '/portfolio', title: 'Portfólio de projectos', description: 'Explore os projectos de websites, design gráfico, redes sociais e produção audiovisual apresentados pela ABIPTOM.' },
  ...caseStudies.map(item => ({ path: `/blog/${item.slug}`, title: `${item.client}: ${item.title}`, description: item.description })),
  { path: '/quem-somos', title: 'A nossa equipa em Bissau', description: 'Conheça a ABIPTOM, SARL e a sua equipa de consultores em marketing, design, desenvolvimento web e software na Guiné-Bissau.' },
  { path: '/blog', title: 'Blog sobre tecnologia e comunicação', description: 'Artigos e projectos da ABIPTOM sobre marketing digital, design, desenvolvimento web e tecnologia na Guiné-Bissau.' },
  { path: '/contacto', title: 'Contacto e pedidos de orçamento', description: 'Fale com a ABIPTOM sobre o seu projecto. Contacte-nos pelo formulário, WhatsApp +245 966 865 331 ou info@abiptom.gw. Estamos em Bissau, Guiné-Bissau.' },
  { path: '/trabalhe-conosco', title: 'Trabalhe connosco', description: 'Conheça as oportunidades de colaboração com a ABIPTOM e envie a sua candidatura à nossa equipa em Bissau.' },
  { path: '/servicos/marketing-digital', title: 'Marketing digital na Guiné-Bissau', description: 'Serviços de marketing digital da ABIPTOM em Bissau. Conheça as soluções de estratégia e comunicação digital e fale connosco sobre a sua empresa.' },
  { path: '/servicos/design-grafico', title: 'Design gráfico e identidade visual em Bissau', description: 'Identidades visuais, logotipos e materiais de comunicação para empresas e instituições. Conheça o serviço de design gráfico da ABIPTOM.' },
  { path: '/servicos/desenvolvimento-web', title: 'Criação de websites na Guiné-Bissau', description: 'Conheça os serviços de desenvolvimento web da ABIPTOM em Bissau. Websites para empresas e instituições com soluções adaptadas ao seu projecto.' },
  { path: '/servicos/desenvolvimento-software', title: 'Desenvolvimento de software em Bissau', description: 'Soluções de software adaptadas aos processos da sua organização. Conheça o serviço de desenvolvimento de software da ABIPTOM na Guiné-Bissau.' },
  { path: '/servicos/social-media', title: 'Gestão de redes sociais em Bissau', description: 'Conheça os serviços e pacotes de gestão de redes sociais da ABIPTOM para a comunicação digital da sua empresa na Guiné-Bissau.' },
  { path: '/servicos/fotografia', title: 'Fotografia profissional em Bissau', description: 'Conheça os serviços de fotografia da ABIPTOM para empresas, produtos e eventos na Guiné-Bissau. Fale connosco sobre a sua produção.' },
  { path: '/servicos/producao-video', title: 'Produção de vídeo na Guiné-Bissau', description: 'Produção audiovisual para comunicação empresarial e institucional. Conheça o serviço de vídeo da ABIPTOM em Bissau e peça um orçamento.' },
  { path: '/servicos/animacao-2d', title: 'Animação 2D para marcas e instituições', description: 'Conheça o serviço de animação 2D da ABIPTOM para apresentar ideias, produtos e serviços através de conteúdos visuais.' },
  { path: '/servicos/redes-cablagem-helpdesk', title: 'Redes, cablagem e suporte técnico em Bissau', description: 'Infraestrutura de redes, cablagem e helpdesk para organizações na Guiné-Bissau. Conheça os serviços técnicos da ABIPTOM.' },
  { path: '/blog/branding-unido-amae-guine-bissau', title: 'Branding para empreendedoras na Guiné-Bissau', description: 'Conheça o projecto de branding para 21 marcas de mulheres empreendedoras na Guiné-Bissau apresentado pela ABIPTOM.' },
  { path: '/blog/consultoria-digital-banco-bdu', title: 'Consultoria digital para o Banco BDU', description: 'Conheça o projecto de consultoria digital para o Banco BDU apresentado pela ABIPTOM e a sua abordagem à modernização de serviços.' },
] as const

export function pageMetadata(path: string): Metadata {
  const page = publicPages.find(page => page.path === path)
  if (!page) throw new Error(`Página SEO desconhecida: ${path}`)
  const url = new URL(path, getSiteOrigin()).href
  const title = path === '/' ? page.title : `${page.title} | ABIPTOM`
  return {
    title: { absolute: title }, description: page.description, alternates: { canonical: url },
    openGraph: { type: 'website', locale: 'pt_PT', siteName: 'ABIPTOM', url, title, description: page.description,
      images: [{ url: '/images/abiptom.png', width: 1772, height: 1181, alt: 'ABIPTOM' }] },
    twitter: { card: 'summary_large_image', title, description: page.description, images: ['/images/abiptom.png'] },
  }
}

export function organizationSchema() {
  const origin = getSiteOrigin()
  return {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': `${origin}/#organization`,
    name: 'ABIPTOM, SARL', url: origin, logo: `${origin}/images/abiptom.png`,
    email: 'info@abiptom.gw', telephone: '+245966865331',
    address: { '@type': 'PostalAddress', streetAddress: 'Bairro Ajuda IA Fase', addressLocality: 'Bissau', addressCountry: 'GW' },
    sameAs: ['https://www.facebook.com/abiptomsarl', 'https://www.instagram.com/abiptom_gb', 'https://www.linkedin.com/company/abiptom-sarl', 'https://youtube.com/@abiptom', 'https://www.tiktok.com/@abiptomsarl'],
  }
}
