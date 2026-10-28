import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { barlow as body, barlowCondensed as heading } from '@/lib/brand-fonts'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { default: 'ABIPTOM Core', template: '%s | ABIPTOM Core' },
  description: 'Área interna da equipa ABIPTOM.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.ico' },
}

export default function CoreRootLayout({ children }: { children: ReactNode }) {
  return <html lang="pt-PT"><head><link rel="stylesheet" href="/core-assets/core.css" /></head><body className={`${body.variable} ${heading.variable} min-h-screen antialiased`}>{children}</body></html>
}
