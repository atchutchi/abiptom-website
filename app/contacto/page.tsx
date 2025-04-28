"use client"

import { Mail, MapPin, Phone } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect, useRef } from "react"
import Script from 'next/script'
import emailjs from '@emailjs/browser'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
})

type FormData = z.infer<typeof formSchema>

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      // Verificar se as variáveis de ambiente estão carregadas
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT || 'template_1hp9d3k';
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !publicKey) {
        throw new Error('Variáveis de ambiente do EmailJS não configuradas corretamente.');
      }

      await emailjs.send(
        serviceId,
        templateId,
        data,
        publicKey
      )
      setSubmitSuccess(true)
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contacto em breve.",
        duration: 5000,
      })
      reset()
    } catch (error: any) {
      setSubmitError("Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.")
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    // Load reCAPTCHA when component mounts
    window.grecaptcha?.ready(() => {
      console.log('reCAPTCHA is ready');
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />

      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow-400 font-bauhaus">Contacto</h1>
            <p className="max-w-[700px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Entre em contacto conosco e descubra como podemos ajudar sua empresa a crescer.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">Fale Conosco</h2>
                <p className="text-gray-500">
                  Preencha o formulário abaixo e entraremos em contacto o mais breve possível. Estamos ansiosos para
                  ouvir sobre seu projeto.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-yellow-400" />
                  <div>
                    <h3 className="font-bold">Endereço</h3>
                    <p className="text-gray-500">Bairro Ajuda IA Fase, Bissau, Guiné-Bissau</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-yellow-400" />
                  <div>
                    <h3 className="font-bold">Telefone</h3>
                    <p className="text-gray-500">+245 955 949 429 | +245 966 865 331</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 mt-0.5 text-yellow-400" />
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-gray-500">info@abiptom.gw</p>
                  </div>
                </div>
              </div>
              <div className="aspect-video overflow-hidden rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31098.35874649034!2d-15.6142!3d11.8636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xee9b7c2f8f7c4d%3A0x6f4b8c7e7d2d8b0!2sBissau%2C%20Guinea-Bissau!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa da localização da ABIPTOM"
                ></iframe>
              </div>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Envie-nos uma mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e entraremos em contacto o mais breve possível.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitSuccess && (
                    <Alert className="mb-4 bg-green-50 text-green-900 border-green-200">
                      <AlertTitle>Mensagem enviada com sucesso!</AlertTitle>
                      <AlertDescription>
                        Agradecemos seu contacto. Nossa equipe responderá em breve.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {submitError && (
                    <Alert className="mb-4 bg-red-50 text-red-900 border-red-200">
                      <AlertTitle>Erro ao enviar mensagem</AlertTitle>
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" ref={formRef}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nome</Label>
                        <Input
                          id="firstName"
                          placeholder="Seu nome"
                          {...register("firstName")}
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Sobrenome</Label>
                        <Input
                          id="lastName"
                          placeholder="Seu sobrenome"
                          {...register("lastName")}
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="Seu email"
                        type="email"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="Seu telefone"
                        type="tel"
                        {...register("phone")}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto</Label>
                      <Input
                        id="subject"
                        placeholder="Assunto da mensagem"
                        {...register("subject")}
                        className={errors.subject ? "border-red-500" : ""}
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm">{errors.subject.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea
                        className={`min-h-[120px] ${errors.message ? "border-red-500" : ""}`}
                        id="message"
                        placeholder="Digite sua mensagem aqui"
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm">{errors.message.message}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-black text-yellow-400 hover:bg-gray-900 font-bauhaus"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar Mensagem"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
