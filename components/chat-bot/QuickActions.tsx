"use client"

import type { QuickAction } from "@/lib/chat/chatbot-types"

type QuickActionsProps = {
  actions: QuickAction[]
  onAction: (value: string) => void
  disabled?: boolean
}

export const QuickActions = ({ actions, onAction, disabled }: QuickActionsProps) => {
  if (!actions.length) return null

  return (
    <div className="flex flex-wrap gap-2 px-1 mb-3">
      {actions.map((action) => (
        <button
          key={action.value}
          type="button"
          onClick={() => onAction(action.value)}
          disabled={disabled}
          className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#F5B800] text-[#F5B800] bg-transparent hover:bg-[#F5B800] hover:text-black transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
