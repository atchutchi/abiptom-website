import { NextResponse } from "next/server"
import {
  SYSTEM_PROMPT,
  INITIAL_MESSAGE,
  QUICK_ACTIONS_INITIAL,
  WHATSAPP_LINK,
  EMAIL_ADDRESS,
  GEMINI_MODELS,
} from "@/lib/chat/chatbot-config"

export async function GET() {
  try {
    return NextResponse.json({
      initialMessage: INITIAL_MESSAGE,
      quickActions: QUICK_ACTIONS_INITIAL,
      whatsappLink: WHATSAPP_LINK,
      email: EMAIL_ADDRESS,
      models: GEMINI_MODELS,
      systemPromptLength: SYSTEM_PROMPT.length,
    })
  } catch (error) {
    console.error("Error fetching chat config:", error)
    return NextResponse.json(
      { error: "Failed to fetch chat config" },
      { status: 500 }
    )
  }
}
