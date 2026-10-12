// Conteúdo autorizado pelo utilizador. Fontes e capturas públicas verificadas em 12/10/2026.
export const caseStudies = [
  {
    slug: 'dacosta-music', client: 'Da Costa Music', title: 'Um website para apresentar artistas e receber pedidos de booking',
    category: 'Website para agência de artistas', image: '/images/case-studies/dacosta-music.webp',
    imageAlt: 'Página inicial do website Da Costa Music, com navegação e apresentação da agência',
    description: 'Presença digital para uma agência de artistas, com catálogo, perfis individuais e contacto para booking.',
    problem: 'Uma agência de booking precisa de apresentar os artistas que representa e dar aos promotores um caminho claro para consultar perfis e entrar em contacto. O projecto reuniu a apresentação da agência, o catálogo de artistas e os canais de contacto num website próprio.',
    work: 'A ABIPTOM desenvolveu o website Da Costa Music. A estrutura inclui a apresentação da agência, a lista de artistas, páginas de perfil e uma área de contacto. A navegação permite passar da descoberta de um artista ao pedido de informação sobre booking.',
    result: 'O website está publicado no domínio Da Costa Music. É possível consultar a lista de artistas, abrir os seus perfis e encontrar o formulário e o endereço de booking. O rodapé identifica a ABIPTOM como responsável pelo desenvolvimento.',
    siteUrl: 'https://www.dacosta-music.com/', verifiedOn: '2026-10-12',
    sources: [
      { label: 'Website público Da Costa Music', url: 'https://www.dacosta-music.com/' },
      { label: 'Documentação pública do projecto', url: 'https://github.com/atchutchi/dacosta-music/blob/main/README.md' },
    ],
    request: 'Precisa de apresentar um catálogo, os seus serviços ou uma equipa num website? Diga-nos o que pretende publicar e como quer receber os pedidos de contacto.',
  },
  {
    slug: 'apgb', client: 'APGB', title: 'Um portal para organizar informação e serviços portuários',
    category: 'Portal institucional', image: '/images/case-studies/apgb.webp',
    imageAlt: 'Portal APGB com o edifício do Porto de Bissau, navegação institucional e acesso aos serviços',
    description: 'Portal da Administração dos Portos da Guiné-Bissau, com serviços, notícias, documentos e navegação institucional.',
    problem: 'Um portal portuário precisa de servir públicos diferentes: operadores, instituições e cidadãos. O desafio do projecto foi organizar a informação da APGB e do Porto de Bissau, os serviços, os documentos e os projectos numa navegação coerente.',
    work: 'A ABIPTOM desenvolveu o portal segundo a estrutura institucional da APGB. O projecto reúne páginas institucionais, notícias, documentos e galeria. Inclui navegação em português, francês e inglês e um painel editorial para gerir conteúdos. A documentação técnica descreve a arquitectura e os perfis de administração e edição.',
    result: 'A versão pública está acessível no endereço Vercel do projecto. O visitante pode percorrer as áreas institucionais, consultar notícias e encontrar os acessos a serviços portuários e documentos. A gestão editorial está documentada no repositório do projecto.',
    siteUrl: 'https://apgb-one.vercel.app/pt', verifiedOn: '2026-10-12',
    sources: [
      { label: 'Portal público APGB', url: 'https://apgb-one.vercel.app/pt' },
      { label: 'Documentação pública do portal APGB', url: 'https://github.com/atchutchi/apgb/blob/main/README.md' },
    ],
    request: 'Precisa de um portal com notícias, documentos e conteúdos geridos pela sua equipa? Diga-nos quais são os públicos, as secções e os perfis de edição necessários.',
  },
  {
    slug: 'santos-global-group', client: 'Santos Global Group', title: 'Uma presença digital para apresentar várias áreas de negócio',
    category: 'Website empresarial', image: '/images/case-studies/santos-global-group.webp',
    imageAlt: 'Website Santos Global Group com apresentação dos serviços, idiomas e contacto por WhatsApp',
    description: 'Website empresarial que reúne logística, mobilidade, compras e outras áreas de actuação num único ponto de contacto.',
    problem: 'Um grupo com diferentes serviços precisa de explicar a sua oferta sem obrigar o visitante a procurar informação em vários canais. O projecto organizou as áreas de negócio, as marcas e a presença da Santos Global Group numa apresentação empresarial comum.',
    work: 'A ABIPTOM desenvolveu o website institucional da Santos Global Group. A página apresenta as áreas de actuação, as marcas e os canais de contacto. A navegação inclui opções de idioma e ligações para falar com a equipa por WhatsApp.',
    result: 'O website está publicado no domínio Santos Global Group. O visitante consegue identificar as áreas de actuação e aceder ao contacto comercial. O rodapé inclui uma ligação à ABIPTOM que identifica a autoria do website.',
    siteUrl: 'https://santosglobalgroup.gw/', verifiedOn: '2026-10-12',
    sources: [{ label: 'Website público Santos Global Group', url: 'https://santosglobalgroup.gw/' }],
    request: 'A sua empresa tem vários serviços ou marcas? Diga-nos como está organizada a oferta e que tipo de pedidos comerciais pretende receber pelo website.',
  },
] as const

export function getCaseStudy(slug: string) {
  return caseStudies.find(item => item.slug === slug)
}

export function caseStudyWhatsApp(client: string) {
  return `https://wa.me/245966865331?text=${encodeURIComponent(`Olá, ABIPTOM. Vi o projecto ${client} e gostaria de pedir uma solução semelhante para a minha organização.`)}`
}
