import type { ChatMessage, ConversationState, LeadInfo, QuickAction } from "./chatbot-types"
import { INITIAL_MESSAGE, QUICK_ACTIONS_INITIAL } from "./chatbot-config"

const STORAGE_KEY = "abiptom-chat-history"
const MAX_HISTORY_FOR_API = 10

export const createInitialState = (): ConversationState => ({
  messages: [
    {
      id: generateId(),
      role: "assistant",
      content: INITIAL_MESSAGE,
      timestamp: Date.now(),
      quickActions: QUICK_ACTIONS_INITIAL,
    },
  ],
  leadInfo: {},
  stage: "greeting",
})

export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const getMessagesForApi = (messages: ChatMessage[]) => {
  const relevant = messages
    .filter((m) => m.role !== "system")
    .slice(-MAX_HISTORY_FOR_API)

  return relevant.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }))
}

export const saveToStorage = (state: ConversationState): void => {
  try {
    const serialized = JSON.stringify({
      messages: state.messages.slice(-30),
      leadInfo: state.leadInfo,
      stage: state.stage,
    })
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch {
    // localStorage might be full or unavailable
  }
}

export const loadFromStorage = (): ConversationState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored) as ConversationState
    if (!parsed.messages?.length) return null

    return parsed
  } catch {
    return null
  }
}

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // noop
  }
}

export const detectQuotationIntent = (content: string): boolean => {
  const keywords = [
    "cotação",
    "cotacao",
    "orçamento",
    "orcamento",
    "proposta",
    "pedir cotação",
    "quero pedir",
    "quanto custa",
    "preço",
    "preco",
    "valor",
  ]
  const lower = content.toLowerCase()
  return keywords.some((k) => lower.includes(k))
}

export const detectContactIntent = (content: string): boolean => {
  const keywords = [
    "falar com",
    "contactar",
    "contatar",
    "equipa",
    "humano",
    "pessoa",
    "whatsapp",
    "telefone",
    "ligar",
  ]
  const lower = content.toLowerCase()
  return keywords.some((k) => lower.includes(k))
}

export const buildQuickActionsFromResponse = (
  content: string,
  stage: string
): QuickAction[] => {
  const lower = content.toLowerCase()

  if (
    lower.includes("cotação") ||
    lower.includes("proposta") ||
    lower.includes("orçamento")
  ) {
    return [
      { label: "Pedir Cotação", value: "Quero pedir uma cotação" },
      { label: "WhatsApp", value: "Quero falar pelo WhatsApp" },
      { label: "Ver outros serviços", value: "Que outros serviços oferecem?" },
    ]
  }

  if (lower.includes("redes sociais") || lower.includes("social media")) {
    return [
      { label: "Pacote Básico", value: "Quero saber sobre o pacote básico de redes sociais" },
      { label: "Pacote Gold", value: "Quero saber sobre o pacote gold" },
      { label: "Pedir Cotação", value: "Quero pedir uma cotação" },
    ]
  }

  if (lower.includes("website") || lower.includes("web")) {
    return [
      { label: "WordPress", value: "Quero um website WordPress" },
      { label: "E-commerce", value: "Preciso de uma loja online" },
      { label: "Pedir Cotação", value: "Quero pedir uma cotação" },
    ]
  }

  if (stage === "greeting") {
    return QUICK_ACTIONS_INITIAL
  }

  return []
}
