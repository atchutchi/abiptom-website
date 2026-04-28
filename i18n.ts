import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

// Lista de idiomas suportados
export const locales = ['pt', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pt'

export default getRequestConfig(async ({ locale }) => {
  const requestedLocale = locale ?? defaultLocale

  // Validar que o locale recebido é válido
  if (!locales.includes(requestedLocale as Locale)) {
    notFound()
  }

  return {
    locale: requestedLocale,
    messages: (await import(`./messages/${requestedLocale}.json`)).default
  }
})
