"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    quote:
      "A ABIPTOM transformou completamente nossa presença online. O design do nosso website e a estratégia de marketing digital superaram todas as nossas expectativas.",
    author: "Hotel Uaque",
    position: "Administração",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "Trabalhar com a equipe da ABIPTOM foi uma experiência incrível. Profissionais talentosos e dedicados que entregam resultados excepcionais.",
    author: "Chef Aladje",
    position: "Gerente",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "A qualidade do trabalho e o compromisso com prazos fazem da ABIPTOM um parceiro confiável para qualquer projeto digital.",
    author: "Ana Djú",
    position: "Acclab PNUD",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((current + 1) % testimonials.length)

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="flex justify-center">
          <Card className="w-full max-w-3xl bg-white">
            <CardContent className="p-6 md:p-10">
              <div className="flex flex-col items-center text-center">
                <Quote className="h-12 w-12 text-blue-600 mb-6" />
                <p className="text-lg md:text-xl mb-6">{testimonials[current].quote}</p>
                <div className="flex flex-col items-center">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <img
                      alt={testimonials[current].author}
                      className="object-cover"
                      src={testimonials[current].image || "/placeholder.svg"}
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-bold">{testimonials[current].author}</h3>
                    <p className="text-sm text-gray-500">{testimonials[current].position}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        <Button variant="outline" size="icon" onClick={prev} className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Anterior</span>
        </Button>
        <Button variant="outline" size="icon" onClick={next} className="rounded-full">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Próximo</span>
        </Button>
      </div>
    </div>
  )
}
