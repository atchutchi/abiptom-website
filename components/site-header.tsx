"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/servicos", label: "Serviços" },
  { href: "/portfolio", label: "Portfólio" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
  { href: "/trabalhe-conosco", label: "Carreiras" },
]

const contactInfo = {
  email: "info@abiptom.gw",
  phone: "+245 966 865 331",
  address: "Bairro Ajuda IA Fase, Bissau",
}

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-obys-gold text-black px-4 py-2 z-[100] font-medium"
      >
        Pular para o conteúdo principal
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-obys ease-obys-default ${
          isScrolled
            ? "bg-obys-near-black/95 backdrop-blur-sm"
            : "bg-transparent"
        }`}
      >
        <div className="obys-container--wide mx-auto flex h-20 items-center justify-between px-6 lg:px-10">
          <Link href="/" className="relative z-[60]">
            <Image
              src="/images/abiptom.png"
              alt="ABIPTOM"
              width={72}
              height={48}
              className="h-12 w-auto"
              style={{ width: "auto" }}
              priority
            />
          </Link>

          <button
            onClick={toggleMenu}
            className="relative z-[60] flex flex-col items-center justify-center w-10 h-10 gap-[5px] group"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            type="button"
          >
            <span
              className={`block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center ${
                isMenuOpen ? "rotate-45 translate-y-[6.5px]" : ""
              }`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-white transition-all duration-300 ${
                isMenuOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center ${
                isMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[55] bg-obys-near-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0, 1] }}
          >
            <div className="h-full flex flex-col lg:flex-row pt-24 pb-12">
              <div className="flex-1 flex flex-col justify-center px-8 lg:px-20">
                <nav aria-label="Menu de navegação">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.08,
                        ease: [0.3, 0.86, 0.36, 0.95],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 font-display text-4xl md:text-5xl lg:text-6xl font-light text-white hover:text-obys-gold transition-colors duration-obys ease-obys-default"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              <motion.div
                className="lg:w-96 px-8 lg:px-12 flex flex-col justify-end lg:justify-center gap-8 mt-8 lg:mt-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div>
                  <p className="text-label text-obys-text-muted mb-3">Email</p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="font-body text-white hover:text-obys-gold transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
                <div>
                  <p className="text-label text-obys-text-muted mb-3">Telefone</p>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                    className="font-body text-white hover:text-obys-gold transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
                <div>
                  <p className="text-label text-obys-text-muted mb-3">Endereço</p>
                  <p className="font-body text-obys-text-secondary text-sm">
                    {contactInfo.address}
                  </p>
                </div>

                <div className="flex gap-6 pt-4">
                  {["Facebook", "Instagram", "LinkedIn", "YouTube"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-label text-obys-text-muted hover:text-obys-gold transition-colors"
                    >
                      {social.slice(0, 2).toUpperCase()}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
