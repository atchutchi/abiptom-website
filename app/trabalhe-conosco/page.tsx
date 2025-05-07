"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"
import CSRFToken from "@/components/csrf-token"
import emailjs from '@emailjs/browser' // Importar o SDK do EmailJS

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  position: z.string().min(3, "Por favor, especifique a área de interesse"),
  message: z.string().min(50, "Por favor, forneça mais detalhes sobre sua experiência (mínimo 50 caracteres)")
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

export default function CareersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { toast } = useToast()

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
    setSubmitSuccess(false)

    try {
      // 1. Primeiro, validar dados no servidor e obter token
      console.log("Validando dados no servidor...");
      const validationResponse = await fetch('/api/careers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // O header X-CSRF-Token será adicionado automaticamente pelo componente CSRFToken
        },
        body: JSON.stringify(data),
      });

      const validationResult = await validationResponse.json();

      if (!validationResponse.ok) {
        throw new Error(validationResult.error || 'Erro desconhecido ao validar candidatura');
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
        title: "Candidatura enviada!",
        description: "Agradecemos seu interesse. Nossa equipe solicite que envies o currículo via email info@abiptom.gw e entrará em contacto em breve.",
        duration: 5000,
      })
      reset()

    } catch (error: any) {
      console.error("Erro no onSubmit (careers):", error);
      setSubmitError(error.message || "Ocorreu um erro ao enviar sua candidatura. Por favor, tente novamente.")
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar sua candidatura. Tente novamente.",
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow-400 font-bauhaus">Trabalhe Conosco</h1>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Junte-se à nossa equipe e faça parte de projetos inovadores.
            </p>
           </div>
         </div>
      </section>

      {/* Careers Content */}
      <section className="py-16 md:py-24 bg-white">
         <div className="container px-4 md:px-6">
           <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-8">
               <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4 font-bauhaus">Por que trabalhar na ABIPTOM?</h2>
                <p className="text-gray-700">
                  Na ABIPTOM, acreditamos que nosso maior ativo são as pessoas. Buscamos profissionais talentosos e
                  apaixonados que queiram fazer a diferença no mercado digital da Guiné-Bissau e além.
                </p>
               </div>
               <div className="space-y-4">
                 <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-yellow-400">
                   <h3 className="text-xl font-bold mb-2 font-bauhaus">Ambiente Inovador</h3>
                   <p className="text-gray-700">
                     Trabalhamos com as mais recentes tecnologias e metodologias, proporcionando um ambiente de constante
                     aprendizado e inovação.
                   </p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-yellow-400">
                   <h3 className="text-xl font-bold mb-2 font-bauhaus">Crescimento Profissional</h3>
                   <p className="text-gray-700">
                     Oferecemos oportunidades de desenvolvimento e crescimento dentro da empresa, com projetos
                     desafiadores e diversificados.
                   </p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-yellow-400">
                   <h3 className="text-xl font-bold mb-2 font-bauhaus">Equipe Colaborativa</h3>
                   <p className="text-gray-700">
                     Valorizamos o trabalho em equipe e a colaboração, criando um ambiente de trabalho positivo e
                     produtivo.
                   </p>
                 </div>
               </div>
               <div>
                 <h3 className="text-xl font-bold mb-4 font-bauhaus">Áreas de Atuação</h3>
                 <ul className="list-disc list-inside space-y-2 text-gray-700">
                   <li>Design Gráfico</li>
                   <li>Desenvolvimento Web</li>
                   <li>Marketing Digital</li>
                   <li>Gestão de Redes Sociais</li>
                   <li>Produção de Vídeo</li>
                   <li>Fotografia</li>
                   <li>Animação 2D</li>
                 </ul>
               </div>
            </div>
            <div>
              <Card className="border-yellow-400 border-2">
                <CardHeader className="bg-yellow-400 text-white">
                  <CardTitle className="font-bauhaus text-black">Candidate-se</CardTitle>
                  <CardDescription className="text-black">
                    Preencha o formulário abaixo e envie seu currículo para se candidatar a uma vaga na ABIPTOM.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {submitSuccess && (
                    <Alert className="mb-4 bg-green-50 text-green-900 border-green-200">
                      <AlertTitle>Candidatura enviada com sucesso!</AlertTitle>
                      <AlertDescription>
                        Agradecemos seu interesse. Nossa equipe solicite que envies o currículo via email info@abiptom.gw e entrará em contacto em breve.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {submitError && (
                    <Alert className="mb-4 bg-red-50 text-red-900 border-red-200">
                      <AlertTitle>Erro ao enviar candidatura</AlertTitle>
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
                      <Label htmlFor="position">Área de Interesse</Label>
                      <Input
                        id="position"
                        placeholder="Ex: Design Gráfico, Desenvolvimento Web, etc."
                        {...register("position")}
                        className={errors.position ? "border-red-500" : ""}
                      />
                      {errors.position && (
                        <p className="text-red-500 text-sm">{errors.position.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea
                        className={`min-h-[120px] ${errors.message ? "border-red-500" : ""}`}
                        id="message"
                        placeholder="Conte-nos um pouco sobre você e sua experiência"
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
                        "Enviar Candidatura"
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
