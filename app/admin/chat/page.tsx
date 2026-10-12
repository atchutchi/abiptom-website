import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { robots: { index: false, follow: false } }

// Re-enable only after server-side authentication and administrator authorization.
export default function DisabledAdminPage() {
  return notFound()
}
