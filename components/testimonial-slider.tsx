"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const testimonials = [
  {
    quote:
      "A ABIPTOM transformou completamente nossa presença online. O design do nosso website e a estratégia de marketing digital superaram todas as nossas expectativas.",
    author: "Hotel Uaque",
    position: "Administração",
  },
  {
    quote:
      "Trabalhar com a equipe da ABIPTOM foi uma experiência incrível. Profissionais talentosos e dedicados que entregam resultados excepcionais.",
    author: "Chef Aladje",
    position: "Gerente",
  },
  {
    quote:
      "A qualidade do trabalho e o compromisso com prazos fazem da ABIPTOM um parceiro confiável para qualquer projeto digital.",
    author: "Ana Djú",
    position: "Acclab PNUD",
  },
]

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const handlePrev = () => {
    setDirection(-1)
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setDirection(1)
    setCurrent((current + 1) % testimonials.length)
  }

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="border border-obys-border-dark p-8 md:p-16 bg-obys-dark/30 min-h-[300px] flex flex-col justify-center">
        <div className="mb-8">
          <span className="font-display text-6xl md:text-8xl text-obys-gold/20 leading-none select-none">
            &ldquo;
          </span>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.3, 0.86, 0.36, 0.95] }}
          >
            <blockquote className="body-large text-obys-text-light mb-10 italic">
              {testimonials[current].quote}
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-10 h-[1px] bg-obys-gold" />
              <div>
                <p className="font-display text-white text-lg">
                  {testimonials[current].author}
                </p>
                <p className="font-body text-obys-text-muted text-sm">
                  {testimonials[current].position}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1)
                setCurrent(i)
              }}
              className={`w-2 h-2 rounded-full transition-all duration-obys ${
                i === current ? "bg-obys-gold w-8" : "bg-obys-border-dark"
              }`}
              aria-label={`Depoimento ${i + 1}`}
              type="button"
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center border border-obys-border-dark text-obys-text-secondary hover:border-obys-gold hover:text-obys-gold transition-colors duration-obys ease-obys-default"
            aria-label="Depoimento anterior"
            type="button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center border border-obys-border-dark text-obys-text-secondary hover:border-obys-gold hover:text-obys-gold transition-colors duration-obys ease-obys-default"
            aria-label="Próximo depoimento"
            type="button"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
