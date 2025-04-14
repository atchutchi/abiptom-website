"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bauhaus text-yellow">ABIPTOM</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium text-white transition-colors hover:text-yellow">
            Início
          </Link>
          <Link href="/quem-somos" className="text-sm font-medium text-white transition-colors hover:text-yellow">
            Quem Somos
          </Link>
          <Link href="/servicos" className="text-sm font-medium text-white transition-colors hover:text-yellow">
            Serviços
          </Link>
          <Link href="/portfolio" className="text-sm font-medium text-white transition-colors hover:text-yellow">
            Portfólio
          </Link>
          <Link href="/blog" className="text-sm font-medium text-white transition-colors hover:text-yellow">
            Blog
          </Link>
          <Link href="/contacto" className="text-sm font-medium text-white transition-colors hover:text-yellow">
            Contacto
          </Link>
          <Link href="/trabalhe-conosco" className="text-sm font-medium text-white transition-colors hover:text-yellow">
            Trabalhe Conosco
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild className="hidden md:flex bg-yellow text-black hover:bg-yellow-hover">
            <Link href="/contacto">Fale Conosco</Link>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden border-yellow">
                <Menu className="h-5 w-5 text-yellow" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black border-yellow">
              <div className="flex flex-col gap-6 mt-6">
                <Link
                  href="/"
                  className="text-sm font-medium text-white transition-colors hover:text-yellow"
                  onClick={() => setIsOpen(false)}
                >
                  Início
                </Link>
                <Link
                  href="/quem-somos"
                  className="text-sm font-medium text-white transition-colors hover:text-yellow"
                  onClick={() => setIsOpen(false)}
                >
                  Quem Somos
                </Link>
                <Link
                  href="/servicos"
                  className="text-sm font-medium text-white transition-colors hover:text-yellow"
                  onClick={() => setIsOpen(false)}
                >
                  Serviços
                </Link>
                <Link
                  href="/portfolio"
                  className="text-sm font-medium text-white transition-colors hover:text-yellow"
                  onClick={() => setIsOpen(false)}
                >
                  Portfólio
                </Link>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-white transition-colors hover:text-yellow"
                  onClick={() => setIsOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/contacto"
                  className="text-sm font-medium text-white transition-colors hover:text-yellow"
                  onClick={() => setIsOpen(false)}
                >
                  Contacto
                </Link>
                <Link
                  href="/trabalhe-conosco"
                  className="text-sm font-medium text-white transition-colors hover:text-yellow"
                  onClick={() => setIsOpen(false)}
                >
                  Trabalhe Conosco
                </Link>
                <Button asChild className="mt-4 bg-yellow text-black hover:bg-yellow-hover">
                  <Link href="/contacto" onClick={() => setIsOpen(false)}>
                    Fale Conosco
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
