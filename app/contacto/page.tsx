"use client"

import { Mail, MapPin, Phone, MessageCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"
import emailjs from "@emailjs/browser"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ReloadIcon } from "@radix-ui/react-icons"
import CSRFToken from "@/components/csrf-token"
import MapEmbed from "@/components/MapEmbed"
import { AnimatedSection } from "@/components/animated-section"
import { TextSplitter } from "@/components/text-splitter"
import { PageTransition } from "@/components/page-transition"

const formSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
  captcha: z.string().refine(() => true, {
    message: "Resposta incorreta.",
  }),
})

type FormData = z.infer<typeof formSchema>

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { toast } = useToast()

  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operator, setOperator] = useState("+")
  const [captchaResult, setCaptchaResult] = useState(0)

  useEffect(() => {
    generateMathProblem()
  }, [])

  const generateMathProblem = () => {
    const randomNum1 = Math.floor(Math.random() * 20) + 1
    const randomNum2 = Math.floor(Math.random() * 10) + 1
    const operators = ["+", "-", "x"]
    const randomOp = operators[Math.floor(Math.random() * operators.length)]

    let n1 = randomNum1
    let n2 = randomNum2
    let result: number

    switch (randomOp) {
      case "+":
        result = n1 + n2
        break
      case "-":
        if (n1 < n2) [n1, n2] = [n2, n1]
        result = n1 - n2
        break
      case "x":
        result = n1 * n2
        break
      default:
        result = n1 + n2
    }

    setNum1(n1)
    setNum2(n2)
    setOperator(randomOp)
    setCaptchaResult(result)
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const onSubmit = async (data: FormData) => {
    if (parseInt(data.captcha) !== captchaResult) {
      toast({ title: "Erro", description: "Resposta do cálculo incorreta.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const validationResponse = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const validationResult = await validationResponse.json()
      if (!validationResponse.ok) throw new Error(validationResult.error || "Erro ao validar formulário")

      const { serviceId, templateId, publicKey, templateParams } = validationResult.emailjs
      if (!serviceId || !templateId || !publicKey) throw new Error("Configuração do EmailJS ausente")

      emailjs.init(publicKey)
      const emailResponse = await emailjs.send(serviceId, templateId, templateParams, publicKey)
      if (emailResponse.status !== 200) throw new Error("Falha ao enviar email.")

      setSubmitSuccess(true)
      toast({ title: "Mensagem enviada!", description: "Entraremos em contacto em breve." })
      reset()
      generateMathProblem()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao enviar mensagem."
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
              <span className="text-label text-obys-gold mb-6 block">Contacto</span>
            </AnimatedSection>
            <TextSplitter
              text="Vamos conversar"
              as="h1"
              className="heading-hero text-white mb-8"
              splitBy="word"
              delay={0.2}
            />
            <AnimatedSection animation="fade-up" delay={400}>
              <p className="body-large text-obys-text-secondary max-w-2xl">
                Entre em contacto e descubra como podemos ajudar a sua empresa a crescer.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Contact Info + Form */}
        <section className="section-padding bg-obys-dark">
          <div className="obys-container--wide mx-auto px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-2">
              {/* Info */}
              <AnimatedSection animation="fade-right">
                <div className="space-y-10">
                  <div>
                    <h2 className="heading-subsection text-white mb-6">Fale Conosco</h2>
                    <p className="body-base text-obys-text-secondary">
                      Preencha o formulário ou contacte-nos directamente. Estamos ansiosos para ouvir sobre o seu projecto.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center border border-obys-border-dark text-obys-gold flex-shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-label text-obys-text-muted mb-1">Endereço</p>
                        <p className="font-body text-obys-text-light text-sm">Bairro Ajuda IA Fase, Bissau, Guiné-Bissau</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center border border-obys-border-dark text-obys-gold flex-shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-label text-obys-text-muted mb-1">Telefone</p>
                        <a href="tel:+245966865331" className="font-body text-obys-text-light text-sm hover:text-obys-gold transition-colors">
                          +245 966 865 331
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center border border-obys-border-dark text-obys-gold flex-shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-label text-obys-text-muted mb-1">Email</p>
                        <a href="mailto:info@abiptom.gw" className="font-body text-obys-text-light text-sm hover:text-obys-gold transition-colors">
                          info@abiptom.gw
                        </a>
                      </div>
                    </div>
                  </div>

                  <Button asChild variant="obys-primary" size="lg" className="w-full sm:w-auto">
                    <a href="https://wa.me/245966865331" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </Button>

                  <div className="aspect-video overflow-hidden border border-obys-border-dark">
                    <MapEmbed
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4804.5253440792085!2d-15.615970524152907!3d11.861143638248679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xee6db9c9b22242b%3A0x3057dcd4ec174242!2sAbiptom%20Sarl!5e1!3m2!1spt-PT!2s!4v1746612533199!5m2!1spt-PT!2s"
                      title="Mapa da localização da ABIPTOM"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </AnimatedSection>

              {/* Form */}
              <AnimatedSection animation="fade-left" delay={200}>
                <div className="border border-obys-border-dark p-8 lg:p-10">
                  <h3 className="heading-subsection text-white mb-2">Envie-nos uma mensagem</h3>
                  <p className="body-base text-obys-text-muted mb-8">Responderemos o mais breve possível.</p>

                  {submitSuccess && (
                    <div className="mb-6 p-4 border border-green-600/30 bg-green-900/20">
                      <p className="font-body text-green-400 text-sm">Mensagem enviada com sucesso! Entraremos em contacto em breve.</p>
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
                      <label htmlFor="subject" className="form-label-dark">Assunto</label>
                      <input id="subject" placeholder="Assunto da mensagem" {...register("subject")} className={`form-input-dark ${errors.subject ? "border-red-500" : ""}`} />
                      {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="message" className="form-label-dark">Mensagem</label>
                      <textarea id="message" rows={5} placeholder="A sua mensagem" {...register("message")} className={`form-input-dark resize-none ${errors.message ? "border-red-500" : ""}`} />
                      {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="captcha" className="form-label-dark">
                        Quanto é {num1} {operator} {num2}?
                      </label>
                      <input id="captcha" placeholder="Resposta" {...register("captcha")} className={`form-input-dark ${errors.captcha ? "border-red-500" : ""}`} />
                      {errors.captcha && <p className="text-red-400 text-xs mt-1">{errors.captcha.message}</p>}
                    </div>
                    <Button type="submit" variant="obys-primary" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <ReloadIcon className="w-4 h-4 animate-spin" />
                          Enviando...
                        </span>
                      ) : (
                        "Enviar Mensagem"
                      )}
                    </Button>
                  </form>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default ContactPage
