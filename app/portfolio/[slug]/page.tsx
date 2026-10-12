import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { caseStudies, caseStudyWhatsApp, getCaseStudy } from '@/lib/case-studies'
import { pageMetadata } from '@/lib/seo'
import { getSiteOrigin } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return caseStudies.map(item => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  if (!getCaseStudy(slug)) notFound()
  const metadata = pageMetadata(`/portfolio/${slug}`)
  const item = getCaseStudy(slug)!
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: item.image, width: 1440, height: 1000, alt: item.imageAlt }] }, twitter: { ...metadata.twitter, images: [item.image] } }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const item = getCaseStudy(slug)
  if (!item) notFound()
  const url = `${getSiteOrigin()}/portfolio/${item.slug}`
  const schema = {
    '@context': 'https://schema.org', '@type': 'CreativeWork', name: `${item.client}: ${item.title}`,
    description: item.description, url, inLanguage: 'pt-PT', image: `${getSiteOrigin()}${item.image}`,
    creator: { '@id': `${getSiteOrigin()}/#organization` }, about: { '@type': 'Organization', name: item.client },
    citation: item.sources.map(source => source.url),
  }
  return (
    <article className="pt-28 lg:pt-36 bg-obys-dark text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <header className="obys-container--wide mx-auto px-6 lg:px-10 pb-12">
        <Link href="/portfolio" className="font-body text-obys-text-secondary underline underline-offset-4">Voltar ao portfólio</Link>
        <p className="text-label text-obys-gold mt-10 mb-4">{item.client} · {item.category}</p>
        <h1 className="heading-section max-w-5xl mb-6">{item.title}</h1>
        <p className="font-body text-obys-text-secondary text-lg max-w-3xl mb-8">{item.description}</p>
        <Button asChild variant="outline-primary" size="lg"><a href={item.siteUrl} target="_blank" rel="noopener noreferrer">Visitar o website</a></Button>
      </header>
      <figure className="obys-container--wide mx-auto px-6 lg:px-10">
        <Image src={item.image} alt={item.imageAlt} width={1440} height={1000} priority sizes="(max-width: 1440px) 100vw, 1440px" className="w-full h-auto" />
        <figcaption className="font-body text-sm text-obys-text-secondary mt-4">Captura da página pública em 12 de outubro de 2026. O website pode apresentar alterações posteriores.</figcaption>
      </figure>
      <div className="obys-container mx-auto px-6 lg:px-10 py-16 lg:py-24">
        {[{ title: 'O desafio', text: item.problem }, { title: 'O trabalho da ABIPTOM', text: item.work }, { title: 'O resultado verificável', text: item.result }].map(section => (
          <section key={section.title} className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-5">{section.title}</h2>
            <p className="font-body text-lg leading-relaxed text-obys-text-secondary max-w-3xl">{section.text}</p>
          </section>
        ))}
        <section aria-labelledby="case-sources-heading" className="border-t border-obys-border-dark pt-8">
          <h2 id="case-sources-heading" className="font-display text-2xl mb-4">Fontes para consultar o projecto</h2>
          <p className="font-body text-obys-text-secondary mb-4">Fontes consultadas em 12 de outubro de 2026. O resultado descrito refere-se às funcionalidades apresentadas e à publicação do website.</p>
          <ul className="font-body space-y-3">{item.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-white">{source.label}</a></li>)}</ul>
        </section>
      </div>
      <section className="section-padding bg-obys-near-black border-t border-obys-border-dark">
        <div className="obys-container mx-auto px-6 lg:px-10">
          <h2 className="heading-section mb-6">Uma solução para a sua organização</h2>
          <p className="font-body text-lg text-obys-text-secondary max-w-3xl mb-8">{item.request}</p>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="obys-primary" size="lg"><Link href="/contacto">Pedir um orçamento</Link></Button>
            <Button asChild variant="outline-primary" size="lg"><a href={caseStudyWhatsApp(item.client)} target="_blank" rel="noopener noreferrer">Falar sobre uma solução semelhante</a></Button>
          </div>
        </div>
      </section>
    </article>
  )
}
