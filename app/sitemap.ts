import { MetadataRoute } from 'next'

/**
 * Gera um sitemap dinâmico para o site
 * Inclui todas as rotas estáticas principais, páginas de serviços e pode ser expandido para incluir blog posts e outros conteúdos dinâmicos
 * @returns MetadataRoute.Sitemap - Um array de objetos de URL para o sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abiptom.gw'
  const currentDate = new Date()
  
  // Definir datas de última modificação específicas
  // Em um ambiente de produção, essas datas poderiam vir de um CMS ou da data real de atualização do conteúdo
  const mainPageLastMod = new Date(currentDate)
  const servicesLastMod = new Date(currentDate)
  servicesLastMod.setDate(servicesLastMod.getDate() - 7) // Supondo que páginas de serviços foram atualizadas há uma semana
  
  const aboutLastMod = new Date(currentDate)
  aboutLastMod.setDate(aboutLastMod.getDate() - 14) // Supondo que a página Quem Somos foi atualizada há duas semanas
  
  const contactLastMod = new Date(currentDate)
  contactLastMod.setDate(contactLastMod.getDate() - 3) // Supondo que a página de contato foi atualizada há 3 dias

  // Mapeamento de rotas estáticas principais com datas específicas
  const routes = [
    { path: '', lastMod: mainPageLastMod, priority: 1.0 },
    { path: '/servicos', lastMod: servicesLastMod, priority: 0.9 },
    { path: '/portfolio', lastMod: servicesLastMod, priority: 0.8 },
    { path: '/quem-somos', lastMod: aboutLastMod, priority: 0.8 },
    { path: '/blog', lastMod: currentDate, priority: 0.8 }, // Blog costuma ser atualizado com frequência
    { path: '/contacto', lastMod: contactLastMod, priority: 0.7 },
    { path: '/trabalhe-conosco', lastMod: contactLastMod, priority: 0.7 },
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: route.lastMod,
    changeFrequency: route.path === '' ? 'daily' : 'weekly',
    priority: route.priority,
  }))

  // Páginas de serviços
  const serviceRoutes = [
    { path: '/servicos/marketing-digital', lastMod: servicesLastMod, priority: 0.9 },
    { path: '/servicos/design-grafico', lastMod: servicesLastMod, priority: 0.9 },
    { path: '/servicos/web-design', lastMod: servicesLastMod, priority: 0.9 },
    { path: '/servicos/desenvolvimento-software', lastMod: servicesLastMod, priority: 0.9 },
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: route.lastMod,
    changeFrequency: 'weekly',
    priority: route.priority,
  }))

  // AQUI VOCÊ PODE ADICIONAR CONTEÚDO DINÂMICO
  // Exemplo: Para adicionar posts de blog dinamicamente
  // 1. Obter lista de posts do CMS ou sistema de arquivos
  // 2. Mapear cada post para uma entrada no sitemap
  
  /* 
  // Exemplo para blog posts (comentado - implemente conforme necessário)
  const blogPosts = [
    { slug: 'primeiro-post', lastMod: new Date('2023-10-15') },
    { slug: 'segundo-post', lastMod: new Date('2023-11-02') },
  ].map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.lastMod,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
  
  return [...routes, ...serviceRoutes, ...blogPosts]
  */

  return [...routes, ...serviceRoutes]
} 