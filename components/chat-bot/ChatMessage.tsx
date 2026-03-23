"use client"

import type { ChatMessage as ChatMessageType } from "@/lib/chat/chatbot-types"

type ChatMessageProps = {
  message: ChatMessageType
}

const formatContent = (content: string) => {
  const parts = content.split(/(\*\*[^*]+\*\*|\[([^\]]+)\]\(([^)]+)\))/g)

  return parts.map((part, i) => {
    if (!part) return null

    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/)
    if (boldMatch) {
      return (
        <strong key={i} className="font-semibold">
          {boldMatch[1]}
        </strong>
      )
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[#F5B800] hover:text-[#FFD040] transition-colors"
        >
          {linkMatch[1]}
        </a>
      )
    }

    return <span key={i}>{part}</span>
  })
}

export const ChatMessageBubble = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user"
  const time = new Date(message.timestamp).toLocaleTimeString("pt", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className="flex flex-col max-w-[85%] gap-1">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-[#F5B800] text-black rounded-br-sm"
              : "bg-[#F3F4F6] text-gray-800 rounded-bl-sm"
          }`}
        >
          {formatContent(message.content)}
        </div>
        <span
          className={`text-[10px] text-gray-400 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {time}
        </span>
      </div>
    </div>
  )
}
