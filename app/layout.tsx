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
import GoogleAnalytics from "./components/GoogleAnalytics"

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
  generator: 'Next.js',
  keywords: ['marketing digital', 'design gráfico', 'web design', 'desenvolvimento de software', 'consultoria', 'moçambique'],
  authors: [{ name: 'ABIPTOM' }],
  metadataBase: new URL('https://abiptom.gw'),
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: 'https://abiptom.gw',
    title: 'ABIPTOM - Guardião das Novas Tecnologias',
    description: 'Somos a ABIPTOM, SARL, especialistas em Marketing Digital, Design e Desenvolvimento.',
    siteName: 'ABIPTOM',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ABIPTOM - Guardião das Novas Tecnologias',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABIPTOM - Guardião das Novas Tecnologias',
    description: 'Somos a ABIPTOM, SARL, especialistas em Marketing Digital, Design e Desenvolvimento.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans antialiased", poppins.variable, bauhaus.variable)}>
        {gaId && <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />}
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