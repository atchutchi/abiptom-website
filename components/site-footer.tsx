import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react"
import { TikTokIcon } from "./icons/tiktok"

const footerLinks = [
  { href: "/", label: "Início" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/servicos", label: "Serviços" },
  { href: "/portfolio", label: "Portfólio" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
  { href: "/trabalhe-conosco", label: "Carreiras" },
]

const socialLinks = [
  { href: "https://www.facebook.com/abiptomsarl", icon: Facebook, label: "Facebook" },
  { href: "https://www.instagram.com/abiptom_gb", icon: Instagram, label: "Instagram" },
  { href: "https://www.linkedin.com/company/abiptom-sarl", icon: Linkedin, label: "LinkedIn" },
  { href: "https://youtube.com/@abiptom", icon: Youtube, label: "YouTube" },
  { href: "https://www.tiktok.com/@abiptomsarl", icon: TikTokIcon, label: "TikTok" },
]

export function SiteFooter() {
  return (
    <footer id="footer" className="bg-obys-near-black border-t border-obys-border-dark">
      <div className="obys-container--wide mx-auto px-6 lg:px-10">
        <div className="section-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-4">
              <Link href="/" className="inline-block mb-8">
                <Image
                  src="/images/abiptom.png"
                  alt="ABIPTOM"
                  width={96}
                  height={64}
                  className="h-16 w-auto"
                  style={{ width: "auto" }}
                />
              </Link>
              <p className="body-base text-obys-text-secondary max-w-sm mb-8">
                Consultores especializados em Marketing, Design Gráfico, Web Design e Desenvolvimento de Software.
              </p>
              <div className="flex gap-5">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-obys-text-muted hover:text-obys-gold transition-colors duration-obys ease-obys-default"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 lg:col-start-6">
              <h3 className="text-label text-obys-text-muted mb-6">Navegação</h3>
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-obys-text-secondary hover:text-obys-gold transition-colors duration-obys ease-obys-default"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <h3 className="text-label text-obys-text-muted mb-6">Contacto</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 text-obys-gold flex-shrink-0" />
                  <span className="font-body text-obys-text-secondary text-sm">
                    Bairro Ajuda IA Fase, Bissau, Guiné-Bissau
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-obys-gold flex-shrink-0" />
                  <a
                    href="tel:+245966865331"
                    className="font-body text-obys-text-secondary text-sm hover:text-obys-gold transition-colors"
                  >
                    +245 966 865 331
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-obys-gold flex-shrink-0" />
                  <a
                    href="mailto:info@abiptom.gw"
                    className="font-body text-obys-text-secondary text-sm hover:text-obys-gold transition-colors"
                  >
                    info@abiptom.gw
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-obys-border-dark py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-obys-text-muted text-xs">
            &copy; {new Date().getFullYear()} ABIPTOM, SARL. Todos os direitos reservados.
          </p>
          <p className="font-body text-obys-text-muted text-xs">
            Bissau, Guiné-Bissau
          </p>
        </div>
      </div>
    </footer>
  )
}
