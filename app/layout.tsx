import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ChatBot } from "@/components/chat-bot/ChatBot"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"
import { PageNoize } from "@/components/page-noize"
import { Preloader } from "@/components/preloader"
import GoogleAnalytics from "./components/GoogleAnalytics"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ABIPTOM - Guardião das Novas Tecnologias",
  description:
    "Somos a ABIPTOM, SARL, um grupo de Consultores nacionais e internacionais especializados em Marketing, Design Gráfico e Web Design e Desenvolvimento de Software.",
  generator: "Next.js",
  keywords: [
    "marketing digital",
    "design gráfico",
    "web design",
    "desenvolvimento de software",
    "consultoria",
    "guiné-bissau",
  ],
  authors: [{ name: "ABIPTOM" }],
  metadataBase: new URL("https://abiptom.gw"),
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://abiptom.gw",
    title: "ABIPTOM - Guardião das Novas Tecnologias",
    description:
      "Somos a ABIPTOM, SARL, especialistas em Marketing Digital, Design e Desenvolvimento.",
    siteName: "ABIPTOM",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ABIPTOM - Guardião das Novas Tecnologias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ABIPTOM - Guardião das Novas Tecnologias",
    description:
      "Somos a ABIPTOM, SARL, especialistas em Marketing Digital, Design e Desenvolvimento.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-body antialiased bg-obys-near-black text-white",
          playfairDisplay.variable,
          inter.variable
        )}
      >
        {gaId && <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />}
        <Preloader />
        <CustomCursor />
        <PageNoize />
        <SmoothScroll>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <ChatBot />
          </div>
        </SmoothScroll>
      </body>
    </html>
  )
}

export default RootLayout
