import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import localFont from "next/font/local"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ChatBot } from "@/components/chat-bot/ChatBot"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

// Load Bauhaus 93 as a local font
const bauhaus = localFont({
  src: "../public/fonts/Bauhaus 93 Regular.ttf",
  variable: "--font-bauhaus",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ABIPTOM - Guardião das Novas Tecnologias",
  description:
    "Somos a ABIPTOM, SARL, um grupo de Consultores nacionais e internacionais especializados em Marketing, Design Gráfico e Web Design e Desenvolvimento de Software.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans antialiased", poppins.variable, bauhaus.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <ChatBot />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'