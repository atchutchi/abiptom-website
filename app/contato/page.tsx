import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone } from "lucide-react"

export default function ContatoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-yellow font-bauhaus">
              Entre em Contato
            </h1>
            <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Estamos aqui para ajudar a transformar suas ideias em realidade.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-black font-bauhaus mb-4">Envie sua mensagem</h2>
                <p className="text-gray-dark">
                  Preencha o formulário abaixo e entraremos em contato o mais breve possível.
                </p>
              </div>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-dark" htmlFor="name">
                      Nome
                    </label>
                    <input
                      className="w-full h-10 px-3 rounded-md border text-gray-dark"
                      id="name"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-dark" htmlFor="email">
                      E-mail
                    </label>
                    <input
                      className="w-full h-10 px-3 rounded-md border text-gray-dark"
                      id="email"
                      placeholder="seu@email.com"
                      required
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-dark" htmlFor="phone">
                      Telefone
                    </label>
                    <input
                      className="w-full h-10 px-3 rounded-md border text-gray-dark"
                      id="phone"
                      placeholder="Seu número de telefone"
                      type="tel"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-dark" htmlFor="message">
                      Mensagem
                    </label>
                    <textarea
                      className="w-full h-40 px-3 py-2 rounded-md border text-gray-dark"
                      id="message"
                      placeholder="Como podemos ajudar?"
                      required
                    />
                  </div>
                </div>
                <Button className="w-full bg-yellow text-black hover:bg-yellow-hover">
                  Enviar mensagem
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-black font-bauhaus mb-4">Informações de contato</h2>
                <p className="text-gray-dark">
                  Escolha a forma mais conveniente para entrar em contato conosco.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-yellow mt-1" />
                  <div>
                    <h3 className="font-bold text-black">Endereço</h3>
                    <p className="text-gray-dark mt-1">
                      Rua Principal, Nº 123<br />
                      Bissau, Guiné-Bissau
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-yellow mt-1" />
                  <div>
                    <h3 className="font-bold text-black">E-mail</h3>
                    <p className="text-gray-dark mt-1">
                      contato@abiptom.com<br />
                      comercial@abiptom.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-yellow mt-1" />
                  <div>
                    <h3 className="font-bold text-black">Telefone</h3>
                    <p className="text-gray-dark mt-1">
                      +245 955 555 555<br />
                      +245 966 666 666
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h3 className="font-bold text-black mb-4">Redes Sociais</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    className="text-gray-dark hover:text-yellow transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://instagram.com"
                    className="text-gray-dark hover:text-yellow transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://linkedin.com"
                    className="text-gray-dark hover:text-yellow transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 