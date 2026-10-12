import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { getSiteOrigin } from "@/lib/site"
import { Barlow, Barlow_Condensed } from "next/font/google"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ChatBot } from "@/components/chat-bot/ChatBot"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"
import { PageNoize } from "@/components/page-noize"
import { Preloader } from "@/components/preloader"
import CSRFToken from "@/components/csrf-token"
import { BackToTop } from "@/components/back-to-top"
import { TrackingConsent } from "@/components/tracking-consent"
import { organizationSchema } from "@/lib/seo"

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
})

const barlow = Barlow({
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
  metadataBase: new URL(getSiteOrigin()),
  verification: { google: 'rc9CmD3fhwtfrIQKKjs4lqG5CtvkzWjGEkPL3i14vTI' },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: getSiteOrigin(),
    title: "ABIPTOM - Guardião das Novas Tecnologias",
    description:
      "Somos a ABIPTOM, SARL, especialistas em Marketing Digital, Design e Desenvolvimento.",
    siteName: "ABIPTOM",
    images: [
      {
        url: "/images/abiptom.png",
        width: 1772,
        height: 1181,
        alt: "ABIPTOM - Guardião das Novas Tecnologias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ABIPTOM - Guardião das Novas Tecnologias",
    description:
      "Somos a ABIPTOM, SARL, especialistas em Marketing Digital, Design e Desenvolvimento.",
    images: ["/images/abiptom.png"],
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
  // Ativar depois de desativar os eventos automáticos no data stream GA4.
  const gaId = process.env.NEXT_PUBLIC_GA_MANUAL_MEASUREMENT_READY === '1'
    ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    : undefined

  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-body antialiased bg-obys-near-black text-white",
          barlowCondensed.variable,
          barlow.variable
        )}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()).replace(/</g, '\\u003c') }} />
        <TrackingConsent gaId={gaId} />
        <Preloader />
        <CSRFToken />
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
            <BackToTop />
          </div>
        </SmoothScroll>
      </body>
    </html>
  )
}

export default RootLayout
