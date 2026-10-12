import { notFound, permanentRedirect } from 'next/navigation'
import { caseStudies, getCaseStudy } from '@/lib/case-studies'

export const dynamicParams = false

export function generateStaticParams() {
  return caseStudies.map(item => ({ slug: item.slug }))
}

export default async function LegacyProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getCaseStudy(slug)) notFound()
  permanentRedirect(`/blog/${slug}`)
}
