export type ChatRole = "user" | "assistant" | "system"

export type ConversationStage =
  | "greeting"
  | "exploring"
  | "interested"
  | "collecting_info"
  | "closing"

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  timestamp: number
  quickActions?: QuickAction[]
  showLeadForm?: boolean
}

export type LeadInfo = {
  name?: string
  email?: string
  phone?: string
  company?: string
  interest?: string
}

export type QuickAction = {
  label: string
  value: string
}

export type ConversationState = {
  messages: ChatMessage[]
  leadInfo: LeadInfo
  stage: ConversationStage
}

export type ChatApiRequest = {
  message: string
  history: { role: ChatRole; content: string }[]
}

export type ChatApiResponse = {
  content: string
  quickActions?: QuickAction[]
  showLeadForm?: boolean
}
