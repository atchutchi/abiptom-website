"use client"

import { Mail, MapPin, Phone } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect, useRef } from "react"
import emailjs from '@emailjs/browser' // Importar o SDK do EmailJS

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"
import CSRFToken from "@/components/csrf-token"
import MapEmbed from "@/components/MapEmbed"

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
  captcha: z.string().refine((val) => {
    // A validação real será feita dinamicamente baseada no valor esperado do state
    return true;
  }, {
    message: "Resposta incorreta. Por favor resolva a operação matemática."
  })
})

type FormData = z.infer<typeof formSchema>

// Remover declaração global do grecaptcha
// declare global {
//   interface Window {
//     grecaptcha: {
//       ready: (callback: () => void) => void;
//       execute: (siteKey: string, options: { action: string }) => Promise<string>;
//     };
//   }
// }

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { toast } = useToast()
  
  // Estados para o CAPTCHA
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [operator, setOperator] = useState('+')
  const [captchaResult, setCaptchaResult] = useState(0)
  
  // Gerar nova operação matemática
  useEffect(() => {
    generateMathProblem()
  }, [])
  
  // Função para gerar um novo problema matemático
  const generateMathProblem = () => {
    // Gerar números aleatórios entre 1 e 20
    const randomNum1 = Math.floor(Math.random() * 20) + 1
    const randomNum2 = Math.floor(Math.random() * 10) + 1
    
    // Escolher um operador aleatório (+ ou -)
    const operators = ['+', '-', 'x']
    const randomOp = operators[Math.floor(Math.random() * operators.length)]
    
    setNum1(randomNum1)
    setNum2(randomNum2)
    setOperator(randomOp)
    
    // Calcular resultado com base no operador
    let result
    switch (randomOp) {
      case '+':
        result = randomNum1 + randomNum2
        break
      case '-':
        // Garantir que o resultado seja positivo
        if (randomNum1 >= randomNum2) {
          result = randomNum1 - randomNum2
        } else {
          // Trocar os números para evitar resultado negativo
          setNum1(randomNum2)
          setNum2(randomNum1)
          result = randomNum2 - randomNum1
        }
        break
      case 'x':
        result = randomNum1 * randomNum2
        break
      default:
        result = randomNum1 + randomNum2
    }
    
    setCaptchaResult(result)
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    // Verificar o CAPTCHA manualmente
    if (parseInt(data.captcha) !== captchaResult) {
      toast({
        title: "Erro",
        description: "A resposta do cálculo está incorreta. Por favor, tente novamente.",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      // 1. Primeiro, validar dados no servidor e obter token
      console.log("Validando dados no servidor...");
      const validationResponse = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // O header X-CSRF-Token será adicionado automaticamente pelo componente CSRFToken
        },
        body: JSON.stringify(data),
      });

      const validationResult = await validationResponse.json();

      if (!validationResponse.ok) {
        throw new Error(validationResult.error || 'Erro desconhecido ao validar formulário');
      }

      // 2. Agora, enviar o email diretamente via EmailJS SDK do cliente
      console.log("Enviando email via EmailJS (cliente)...");
      
      // Obter os dados do EmailJS da resposta do servidor
      const { serviceId, templateId, publicKey, templateParams } = validationResult.emailjs;
      
      if (!serviceId || !templateId || !publicKey) {
        throw new Error("Configuração do EmailJS ausente na resposta do servidor");
      }

      // Inicializar EmailJS com a chave pública
      emailjs.init(publicKey);
      
      // Enviar email usando EmailJS do lado do cliente
      const emailResponse = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey // User ID (chave pública)
      );

      if (emailResponse.status !== 200) {
        console.error("Erro ao enviar email via EmailJS cliente:", emailResponse);
        throw new Error("Falha ao enviar email. Por favor, tente novamente.");
      }

      // Sucesso
      setSubmitSuccess(true)
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contacto em breve.",
        duration: 5000,
      })
      reset()
      
      // Gerar novo CAPTCHA após envio bem-sucedido
      generateMathProblem()

    } catch (error: any) {
      console.error("Erro no onSubmit:", error);
      setSubmitError(error.message || "Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.")
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Remover useEffect do grecaptcha
  // useEffect(() => {
  //   window.grecaptcha?.ready(() => {
  //   });
  // }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Remover Script tag do reCAPTCHA */}
      {/* <Script src={...} /> */}

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
                 <MapEmbed
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4804.5253440792085!2d-15.615970524152907!3d11.861143638248679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xee6db9c9b22242b%3A0x3057dcd4ec174242!2sAbiptom%20Sarl!5e1!3m2!1spt-PT!2s!4v1746612533199!5m2!1spt-PT!2s"
                   title="Mapa da localização da ABIPTOM"
                   className="w-full h-full"
                 />
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

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Adicionar o componente CSRF Token para proteção contra ataques CSRF */}
                    <CSRFToken />
                    
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
                    
                    {/* CAPTCHA */}
                    <div className="space-y-2">
                      <Label htmlFor="captcha">Proteção anti-spam: Quanto é {num1} {operator} {num2}?</Label>
                      <Input
                        id="captcha"
                        placeholder="Digite a resposta"
                        {...register("captcha")}
                        className={errors.captcha ? "border-red-500" : ""}
                      />
                      {errors.captcha && (
                        <p className="text-red-500 text-sm">{errors.captcha.message}</p>
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
