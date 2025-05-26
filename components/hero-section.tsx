import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-black via-black to-black/95 overflow-hidden">
      {/* Círculo decorativo animado */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-yellow/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-yellow/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Conteúdo */}
          <div className="flex flex-col justify-center space-y-6 text-center md:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl font-bauhaus tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-yellow animate-fade-up">
                ABIPTOM
              </h1>
              <h2 className="text-2xl font-medium text-white md:text-3xl animate-fade-up delay-100">
                Guardião das Novas Tecnologias
              </h2>
              <p className="max-w-[600px] text-white/90 text-lg md:text-xl/relaxed lg:text-xl/relaxed xl:text-2xl/relaxed animate-fade-up delay-200">
                Transformamos ideias em realidade através de soluções digitais personalizadas e de alto calibre.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-up delay-300">
              <Button asChild size="lg" className="bg-yellow text-black hover:bg-yellow-hover transform transition-transform hover:scale-105">
                <Link href="/servicos" className="flex items-center">
                  Nossos Serviços <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="text-yellow border-yellow hover:bg-yellow hover:text-black transform transition-transform hover:scale-105"
              >
                <Link href="/contacto">Fale Conosco</Link>
              </Button>
            </div>
          </div>

          {/* Imagem */}
          <div className="relative mx-auto w-full max-w-[500px] md:max-w-none animate-fade-left">
            <div className="aspect-square md:aspect-video relative rounded-full md:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <img
                alt="ABIPTOM Hero Image"
                className="object-cover w-full h-full transform transition-transform hover:scale-105 duration-700"
                src="/images/abiptom.png"
              />
              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Adicione estes estilos ao seu arquivo globals.css
/*
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-left {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.5s ease-out forwards;
}

.animate-fade-left {
  animation: fade-left 0.5s ease-out forwards;
}
*/
