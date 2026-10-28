"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ReloadIcon } from "@radix-ui/react-icons"
import CSRFToken from "@/components/csrf-token"
import { AnimatedSection } from "@/components/animated-section"
import { TextSplitter } from "@/components/text-splitter"
import { PageTransition } from "@/components/page-transition"

const formSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  position: z.string().min(3, "Especifique a área de interesse"),
  message: z.string().min(50, "Mínimo 50 caracteres"),
  captcha: z.string().refine(() => true, { message: "Resposta incorreta." }),
})

type FormData = z.infer<typeof formSchema>

const reasons = [
  { title: "Ambiente Inovador", description: "Trabalhamos com as mais recentes tecnologias e metodologias, proporcionando constante aprendizado." },
  { title: "Crescimento Profissional", description: "Oferecemos oportunidades de desenvolvimento com projectos desafiadores e diversificados." },
  { title: "Equipa Colaborativa", description: "Valorizamos o trabalho em equipa e a colaboração, criando um ambiente positivo e produtivo." },
]

const areas = [
  "Design Gráfico",
  "Desenvolvimento Web",
  "Marketing Digital",
  "Gestão de Redes Sociais",
  "Produção de Vídeo",
  "Fotografia",
  "Animação 2D",
]

const CareersPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { toast } = useToast()

  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operator, setOperator] = useState("+")
  const [captchaResult, setCaptchaResult] = useState(0)

  useEffect(() => { generateMathProblem() }, [])

  const generateMathProblem = () => {
    const n1 = Math.floor(Math.random() * 20) + 1
    const n2 = Math.floor(Math.random() * 10) + 1
    const ops = ["+", "-", "x"]
    const op = ops[Math.floor(Math.random() * ops.length)]

    let a = n1, b = n2, result: number
    switch (op) {
      case "+": result = a + b; break
      case "-":
        if (a < b) [a, b] = [b, a]
        result = a - b; break
      case "x": result = a * b; break
      default: result = a + b
    }
    setNum1(a); setNum2(b); setOperator(op); setCaptchaResult(result)
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const onSubmit = async (data: FormData) => {
    if (parseInt(data.captcha) !== captchaResult) {
      toast({ title: "Erro", description: "Resposta do cálculo incorreta.", variant: "destructive" })
      return
    }
    setIsSubmitting(true); setSubmitError(null); setSubmitSuccess(false)

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Erro ao enviar candidatura")

      setSubmitSuccess(true)
      toast({ title: "Candidatura enviada!", description: "Envie também o currículo para info@abiptom.gw." })
      reset()
      generateMathProblem()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao enviar candidatura."
      setSubmitError(message)
      toast({ title: "Erro", description: message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Hero */}
        <section className="section-padding bg-obys-near-black">
          <div className="obys-container">
            <AnimatedSection animation="fade-up">
              <span className="text-label text-obys-gold mb-6 block">Carreiras</span>
            </AnimatedSection>
            <TextSplitter
              text="Trabalhe conosco"
              as="h1"
              className="heading-hero text-white mb-8"
              splitBy="word"
              delay={0.2}
            />
            <AnimatedSection animation="fade-up" delay={400}>
              <p className="body-large text-obys-text-secondary max-w-2xl">
                Junte-se à nossa equipa e faça parte de projectos inovadores.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding bg-obys-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-2">
              {/* Info */}
              <AnimatedSection animation="fade-right">
                <div className="space-y-10">
                  <div>
                    <h2 className="heading-subsection text-white mb-6">
                      Por que trabalhar na ABIPTOM?
                    </h2>
                    <p className="body-base text-obys-text-secondary">
                      Acreditamos que nosso maior ativo são as pessoas. Buscamos profissionais talentosos e apaixonados que queiram fazer a diferença.
                    </p>
                  </div>

                  <div className="space-y-1">
                    {reasons.map((reason, i) => (
                      <AnimatedSection key={reason.title} animation="fade-up" delay={i * 100}>
                        <div className="border border-obys-border-dark p-6 border-l-2 border-l-obys-gold hover:bg-obys-near-black/50 transition-colors duration-obys">
                          <h3 className="font-display text-lg text-white mb-2">{reason.title}</h3>
                          <p className="font-body text-sm text-obys-text-secondary">{reason.description}</p>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>

                  <div>
                    <h3 className="heading-subsection text-white mb-6">Áreas de Actuação</h3>
                    <ul className="space-y-3">
                      {areas.map((area) => (
                        <li key={area} className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-obys-gold flex-shrink-0" />
                          <span className="font-body text-obys-text-secondary">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>

              {/* Form */}
              <AnimatedSection animation="fade-left" delay={200}>
                <div className="border border-obys-border-dark">
                  <div className="bg-obys-gold p-6">
                    <h3 className="font-display text-xl text-black">Candidate-se</h3>
                    <p className="font-body text-sm text-black/70 mt-1">
                      Envie também o currículo para info@abiptom.gw
                    </p>
                  </div>
                  <div className="p-8 lg:p-10">
                    {submitSuccess && (
                      <div className="mb-6 p-4 border border-green-600/30 bg-green-900/20">
                        <p className="font-body text-green-400 text-sm">Candidatura enviada! Envie o currículo para info@abiptom.gw.</p>
                      </div>
                    )}
                    {submitError && (
                      <div className="mb-6 p-4 border border-red-600/30 bg-red-900/20">
                        <p className="font-body text-red-400 text-sm">{submitError}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <CSRFToken />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="firstName" className="form-label-dark">Nome</label>
                          <input id="firstName" placeholder="Seu nome" {...register("firstName")} className={`form-input-dark ${errors.firstName ? "border-red-500" : ""}`} />
                          {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div>
                          <label htmlFor="lastName" className="form-label-dark">Sobrenome</label>
                          <input id="lastName" placeholder="Seu sobrenome" {...register("lastName")} className={`form-input-dark ${errors.lastName ? "border-red-500" : ""}`} />
                          {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="form-label-dark">Email</label>
                        <input id="email" type="email" placeholder="Seu email" {...register("email")} className={`form-input-dark ${errors.email ? "border-red-500" : ""}`} />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="phone" className="form-label-dark">Telefone</label>
                        <input id="phone" type="tel" placeholder="Seu telefone" {...register("phone")} className={`form-input-dark ${errors.phone ? "border-red-500" : ""}`} />
                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="position" className="form-label-dark">Área de Interesse</label>
                        <input id="position" placeholder="Ex: Design Gráfico, Desenvolvimento Web" {...register("position")} className={`form-input-dark ${errors.position ? "border-red-500" : ""}`} />
                        {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="message" className="form-label-dark">Sobre Você</label>
                        <textarea id="message" rows={5} placeholder="Conte-nos sobre a sua experiência" {...register("message")} className={`form-input-dark resize-none ${errors.message ? "border-red-500" : ""}`} />
                        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="captcha" className="form-label-dark">Quanto é {num1} {operator} {num2}?</label>
                        <input id="captcha" placeholder="Resposta" {...register("captcha")} className={`form-input-dark ${errors.captcha ? "border-red-500" : ""}`} />
                      </div>
                      <Button type="submit" variant="obys-primary" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <span className="flex items-center gap-2"><ReloadIcon className="w-4 h-4 animate-spin" /> Enviando...</span>
                        ) : (
                          "Enviar Candidatura"
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default CareersPage
