"use client"

import { useState } from "react"
import { ChatBotButton } from "./ChatBotButton"
import { ChatBotWindow } from "./ChatBotWindow"

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)

  const handleOpen = () => {
    setIsOpen(true)
    setHasUnread(false)
  }

  return (
    <>
      {!isOpen && (
        <ChatBotButton onClick={handleOpen} hasUnread={hasUnread} />
      )}
      <ChatBotWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
