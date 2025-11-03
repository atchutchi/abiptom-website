import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

// Lista de idiomas suportados
export const locales = ['pt', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pt'

export default getRequestConfig(async ({ locale }) => {
  // Validar que o locale recebido é válido
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  }
})

