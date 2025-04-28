import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://abiptom.gw'

  // Add all your static routes
  const routes = [
    '',
    '/servicos',
    '/portfolio',
    '/quem-somos',
    '/blog',
    '/contacto',
    '/trabalhe-conosco',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Add service pages
  const serviceRoutes = [
    '/servicos/marketing-digital',
    '/servicos/design-grafico',
    '/servicos/web-design',
    '/servicos/desenvolvimento-software',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...routes, ...serviceRoutes]
} 