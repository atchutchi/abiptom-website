import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { rateLimit } from "@/lib/rate-limit"
import { SYSTEM_PROMPT, FALLBACK_MESSAGE, GEMINI_MODELS } from "@/lib/chat/chatbot-config"
import type { ChatApiRequest, ChatApiResponse } from "@/lib/chat/chatbot-types"

const getGeminiClient = (): GoogleGenAI | null => {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    console.warn("[Chat] No GEMINI_API_KEY found in environment variables")
    return null
  }
  return new GoogleGenAI({ apiKey: key })
}

const sanitizeInput = (input: string): string =>
  input
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}\n]/gu, "")
    .trim()
    .slice(0, 1000)

const tryModel = async (
  client: GoogleGenAI,
  model: string,
  systemPrompt: string,
  conversationContents: { role: string; parts: { text: string }[] }[]
): Promise<string | null> => {
  try {
    const response = await client.models.generateContent({
      model,
      contents: conversationContents,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.9,
      },
    })

    const text = response.text
    return text?.trim() || null
  } catch (err) {
    console.error(
      `[Chat] Model ${model} failed:`,
      err instanceof Error ? err.message : err
    )
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { success: rateLimitOk } = await rateLimit("chat")
    if (!rateLimitOk) {
      return NextResponse.json(
        {
          content:
            "Muitas mensagens em pouco tempo. Por favor, aguarda um momento.",
        } satisfies ChatApiResponse,
        { status: 429 }
      )
    }

    const body: ChatApiRequest = await request.json()
    const { message, history = [] } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { content: "Mensagem inválida." } satisfies ChatApiResponse,
        { status: 400 }
      )
    }

    const sanitized = sanitizeInput(message)
    if (!sanitized) {
      return NextResponse.json(
        { content: "Mensagem inválida." } satisfies ChatApiResponse,
        { status: 400 }
      )
    }

    const ai = getGeminiClient()
    if (!ai) {
      console.error("[Chat] Gemini client not available — API key missing")
      return NextResponse.json(
        { content: FALLBACK_MESSAGE } satisfies ChatApiResponse
      )
    }

    const conversationContents: { role: string; parts: { text: string }[] }[] = []

    const recentHistory = history.slice(-10)
    for (const msg of recentHistory) {
      conversationContents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })
    }

    conversationContents.push({
      role: "user",
      parts: [{ text: sanitized }],
    })

    let responseText: string | null = null

    for (const model of GEMINI_MODELS) {
      console.log(`[Chat] Trying model: ${model}`)
      responseText = await tryModel(ai, model, SYSTEM_PROMPT, conversationContents)
      if (responseText) {
        console.log(`[Chat] Success with model: ${model}`)
        break
      }
    }

    if (!responseText) {
      console.error("[Chat] All Gemini models failed")
      return NextResponse.json(
        { content: FALLBACK_MESSAGE } satisfies ChatApiResponse
      )
    }

    const cleaned = responseText
      .replace(/^(Assistente|Bot|ABIPTOM):?\s*/i, "")
      .trim()

    return NextResponse.json({ content: cleaned } satisfies ChatApiResponse)
  } catch (error) {
    console.error(
      "[Chat] API error:",
      error instanceof Error ? error.message : error
    )
    return NextResponse.json(
      { content: FALLBACK_MESSAGE } satisfies ChatApiResponse,
      { status: 500 }
    )
  }
}
