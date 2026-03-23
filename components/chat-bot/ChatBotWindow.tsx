"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, Send, MessageSquare, RotateCcw } from "lucide-react"
import Image from "next/image"
import type { ChatMessage, LeadInfo, QuickAction } from "@/lib/chat/chatbot-types"
import {
  createInitialState,
  generateId,
  getMessagesForApi,
  saveToStorage,
  loadFromStorage,
  clearStorage,
  detectQuotationIntent,
  buildQuickActionsFromResponse,
} from "@/lib/chat/conversation-manager"
import { WHATSAPP_LINK, EMAIL_ADDRESS } from "@/lib/chat/chatbot-config"
import { ChatMessageBubble } from "./ChatMessage"
import { QuickActions } from "./QuickActions"
import { LeadForm } from "./LeadForm"

type ChatBotWindowProps = {
  isOpen: boolean
  onClose: () => void
}

export function ChatBotWindow({ isOpen, onClose }: ChatBotWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [stage, setStage] = useState<string>("greeting")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!isOpen || initialized.current) return
    initialized.current = true

    const stored = loadFromStorage()
    if (stored) {
      setMessages(stored.messages)
      setStage(stored.stage)
    } else {
      const initial = createInitialState()
      setMessages(initial.messages)
    }
  }, [isOpen])

  useEffect(() => {
    if (messages.length > 0 && initialized.current) {
      saveToStorage({ messages, leadInfo: {}, stage: stage as "greeting" })
    }
  }, [messages, stage])

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, showLeadForm, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)
    setStage("exploring")

    if (detectQuotationIntent(content)) {
      setShowLeadForm(true)
    }

    try {
      const allMessages = [...messages, userMsg]
      const history = getMessagesForApi(allMessages)

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim(), history }),
      })

      const data = await res.json()
      const quickActions = buildQuickActionsFromResponse(data.content, stage)

      const botMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.content,
        timestamp: Date.now(),
        quickActions: quickActions.length > 0 ? quickActions : undefined,
      }

      setMessages((prev) => [...prev, botMsg])

      if (detectQuotationIntent(data.content)) {
        setShowLeadForm(true)
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content:
          "Peço desculpa, ocorreu um erro. Podes tentar novamente ou contactar-nos pelo WhatsApp (+245 966 865 331).",
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleQuickAction = (value: string) => {
    sendMessage(value)
  }

  const handleLeadSubmit = async (info: LeadInfo) => {
    setShowLeadForm(false)

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: info.name,
          email: info.email,
          phone: info.phone || "",
          subject: "Pedido de Cotação via Chatbot",
          message: info.interest || "Pedido de cotação via chatbot",
        }),
      })
    } catch {
      // silently fail — bot will still confirm
    }

    const confirmMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: `Obrigado, ${info.name}! Recebemos o teu pedido. A nossa equipa vai contactar-te em breve via ${info.email}. Se preferires, podes também falar connosco directamente:`,
      timestamp: Date.now(),
      quickActions: [
        { label: "WhatsApp", value: "Quero falar pelo WhatsApp" },
        { label: "Enviar Email", value: "Quero enviar um email" },
      ],
    }

    setMessages((prev) => [...prev, confirmMsg])
    setStage("closing")
  }

  const handleReset = () => {
    clearStorage()
    initialized.current = false
    const initial = createInitialState()
    setMessages(initial.messages)
    setStage("greeting")
    setShowLeadForm(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose()
  }

  const lastMessage = messages[messages.length - 1]
  const lastQuickActions: QuickAction[] =
    lastMessage?.role === "assistant" ? lastMessage.quickActions || [] : []

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] sm:inset-auto sm:bottom-24 sm:right-4"
      role="dialog"
      aria-label="Chat com assistente ABIPTOM"
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute inset-0 bg-black/40 sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative h-full sm:h-[600px] w-full sm:w-[400px] sm:ml-auto flex flex-col bg-white sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Image
              src="/images/abiptom.png"
              alt="ABIPTOM"
              width={32}
              height={32}
              className="h-8 w-auto rounded-full"
            />
            <div>
              <p className="text-white text-sm font-semibold leading-tight">
                Assistente ABIPTOM
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-gray-400">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="Nova conversa"
              title="Nova conversa"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="Fechar chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-white">
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}

          {isTyping && (
            <div className="flex justify-start mb-3">
              <div className="bg-[#F3F4F6] rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          {showLeadForm && (
            <LeadForm onSubmit={handleLeadSubmit} disabled={isTyping} />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {lastQuickActions.length > 0 && !showLeadForm && (
          <div className="px-3 py-2 bg-white border-t border-gray-100">
            <QuickActions
              actions={lastQuickActions}
              onAction={handleQuickAction}
              disabled={isTyping}
            />
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-white flex-shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escreve a tua mensagem..."
            disabled={isTyping}
            className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent outline-none"
            aria-label="Mensagem"
          />
          <button
            type="submit"
            disabled={isTyping || !inputValue.trim()}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-[#F5B800] text-black hover:bg-[#FFD040] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-4 px-4 py-2 bg-gray-50 border-t border-gray-100 text-[10px] flex-shrink-0">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-500 hover:text-[#25D366] transition-colors"
          >
            <MessageSquare className="w-3 h-3" />
            WhatsApp
          </a>
          <span className="text-gray-300">|</span>
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            className="text-gray-500 hover:text-[#F5B800] transition-colors"
          >
            {EMAIL_ADDRESS}
          </a>
        </div>
      </div>
    </div>
  )
}
