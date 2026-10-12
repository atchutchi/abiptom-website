import type { MetadataRoute } from 'next'
import { getSiteOrigin } from '@/lib/site'
import { publicPages } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map(page => ({ url: new URL(page.path, getSiteOrigin()).href }))
}
