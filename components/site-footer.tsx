import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bauhaus text-yellow">ABIPTOM</span>
            </Link>
            <p className="text-sm mb-4 text-white">
              Somos a ABIPTOM, SARL, um grupo de Consultores nacionais e internacionais especializados em Marketing,
              Design Gráfico e Web Design e Desenvolvimento de Software.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-yellow hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://instagram.com" className="text-yellow hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://twitter.com" className="text-yellow hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://linkedin.com" className="text-yellow hover:text-white">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bauhaus text-yellow mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white hover:text-yellow">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/quem-somos" className="text-white hover:text-yellow">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="text-white hover:text-yellow">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-white hover:text-yellow">
                  Portfólio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white hover:text-yellow">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-white hover:text-yellow">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/trabalhe-conosco" className="text-white hover:text-yellow">
                  Trabalhe Conosco
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bauhaus text-yellow mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/servicos/design-grafico" className="text-white hover:text-yellow">
                  Design Gráfico
                </Link>
              </li>
              <li>
                <Link href="/servicos/desenvolvimento-web" className="text-white hover:text-yellow">
                  Desenvolvimento Web
                </Link>
              </li>
              <li>
                <Link href="/servicos/social-media" className="text-white hover:text-yellow">
                  Social Media
                </Link>
              </li>
              <li>
                <Link href="/servicos/producao-video" className="text-white hover:text-yellow">
                  Produção de Vídeo
                </Link>
              </li>
              <li>
                <Link href="/servicos/fotografia" className="text-white hover:text-yellow">
                  Fotografia
                </Link>
              </li>
              <li>
                <Link href="/servicos/animacao-2d" className="text-white hover:text-yellow">
                  Animação 2D
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bauhaus text-yellow mb-4">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-yellow" />
                <span className="text-white">Bairro Ajuda IA Fase, Bissau, Guiné-Bissau</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-yellow" />
                <span className="text-white">+245 955 949 429 | +245 966 865 331</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-yellow" />
                <a href="mailto:info@abiptom.gw" className="text-white hover:text-yellow">
                  info@abiptom.gw
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p className="text-white">&copy; {new Date().getFullYear()} ABIPTOM, SARL. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
