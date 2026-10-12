import Image from 'next/image'
import Link from 'next/link'
import { caseStudies } from '@/lib/case-studies'

export function CaseStudyList() {
  return (
    <section className="section-padding bg-obys-dark" aria-labelledby="case-studies-heading">
      <div className="obys-container--wide mx-auto px-6 lg:px-10">
        <span className="text-label text-obys-gold block mb-4">Websites em funcionamento</span>
        <h2 id="case-studies-heading" className="heading-section text-white mb-6">Do projecto ao resultado</h2>
        <p className="font-body text-obys-text-secondary max-w-2xl mb-12">Conheça o desafio, o trabalho da ABIPTOM e o resultado que pode consultar em cada website.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map(item => (
            <article key={item.slug}>
              <Link href={`/portfolio/${item.slug}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-obys-gold">
                <Image src={item.image} alt={item.imageAlt} width={1440} height={1000} sizes="(max-width: 768px) 100vw, 33vw" className="w-full h-auto mb-6" />
                <span className="text-label text-obys-gold">{item.category}</span>
                <h3 className="font-display text-3xl text-white mt-3 mb-3">{item.client}</h3>
                <p className="font-body text-obys-text-secondary mb-4">{item.description}</p>
                <span className="font-body text-white underline underline-offset-4">Conhecer o projecto</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
