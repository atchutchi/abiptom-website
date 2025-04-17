import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bauhaus tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-yellow">
                ABIPTOM
              </h1>
              <h2 className="text-xl font-medium text-white md:text-2xl">Guardião das Novas Tecnologias</h2>
              <p className="max-w-[600px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Transformamos ideias em realidade através de soluções digitais personalizadas e de alto calibre.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild className="bg-yellow text-black hover:bg-yellow-hover">
                <Link href="/servicos">
                  Nossos Serviços <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="text-yellow border-yellow hover:bg-yellow hover:text-black">
                <Link href="/contacto">Fale Conosco</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover">
            <img
              alt="ABIPTOM Hero Image"
              className="aspect-video object-cover w-full"
              src="/images/abiptom.png"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
