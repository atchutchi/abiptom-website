"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

type ChatBotButtonProps = {
  onClick: () => void
  hasUnread?: boolean
}

export function ChatBotButton({ onClick, hasUnread = false }: ChatBotButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 5000)
    const hide = setTimeout(() => setShowTooltip(false), 12000)
    return () => {
      clearTimeout(timer)
      clearTimeout(hide)
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2">
      {showTooltip && (
        <div className="bg-[#151515] text-[#e6e6e6] text-xs font-medium px-3 py-2 rounded-lg shadow-lg shadow-black/30 border border-[#3e3e3e]/50 animate-fade-up whitespace-nowrap">
          Precisa de ajuda?
          <div className="absolute -bottom-1 right-5 w-2 h-2 bg-[#151515] border-b border-r border-[#3e3e3e]/50 rotate-45" />
        </div>
      )}

      <button
        type="button"
        onClick={onClick}
        className="group relative w-14 h-14 rounded-full bg-[#F5B800] text-black shadow-lg shadow-[#F5B800]/20 hover:bg-[#FFD040] hover:shadow-xl hover:shadow-[#F5B800]/30 transition-all duration-300 flex items-center justify-center"
        aria-label="Abrir chat"
      >
        <span className="absolute inset-0 rounded-full bg-[#F5B800] animate-ping opacity-20" />
        <MessageCircle className="w-6 h-6 relative z-10" />

        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#080808]">
            1
          </span>
        )}
      </button>
    </div>
  )
}
