import type { LeadInfo } from './chatbot-types'

export async function submitChatLead(info: LeadInfo): Promise<boolean> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: info.name, email: info.email, phone: info.phone || '',
        subject: 'Pedido de Cotação via Chatbot',
        message: info.interest || 'Pedido de cotação via chatbot',
      }),
    })
    return response.ok
  } catch {
    return false
  }
}
