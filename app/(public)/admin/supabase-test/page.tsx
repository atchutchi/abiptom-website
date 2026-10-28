import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { robots: { index: false, follow: false } }

// Diagnostics must not be exposed as a public page.
export default function DisabledDiagnosticsPage() {
  return notFound()
}
