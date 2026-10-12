import type { BlogPost } from '@/lib/types/blog'
import { caseStudies } from '@/lib/case-studies'
import { calculateReadingTime } from '@/lib/utils/blog'

// Artigos publicados no código. A publicação não depende da disponibilidade do CMS.
export const projectBlogPosts: BlogPost[] = caseStudies.map(item => {
  const content = [item.problem, item.work, item.result].join('\n\n')
  return {
    id: `project-${item.slug}`, slug: item.slug, title: `${item.client}: ${item.title}`,
    excerpt: item.description, content, coverImage: item.image, date: '2026-10-12',
    author: { id: 'abiptom', name: 'Equipa ABIPTOM' },
    categories: [{ id: 'sites', name: 'Sites', slug: 'sites' }],
    tags: [{ id: item.access === 'restricted' ? 'software' : 'websites', name: item.access === 'restricted' ? 'Software' : 'Websites', slug: item.access === 'restricted' ? 'software' : 'websites' }],
    readingTime: calculateReadingTime(content),
  }
})
