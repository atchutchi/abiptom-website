import { NextResponse } from "next/server"
import { HfInference } from "@huggingface/inference"
import { headers } from "next/headers"
import { rateLimit } from "@/lib/rate-limit"
import { SYSTEM_PROMPT, FALLBACK_MESSAGE, HF_MODELS } from "@/lib/chat/chatbot-config"
import type { ChatApiRequest, ChatApiResponse } from "@/lib/chat/chatbot-types"

const apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY
const hf = apiKey ? new HfInference(apiKey) : null

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SITE_URL || "https://abiptom.gw"
      : "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

const sanitizeInput = (input: string): string =>
  input
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}\n]/gu, "")
    .trim()
    .slice(0, 1000)

const tryModel = async (
  client: HfInference,
  model: string,
  messages: { role: string; content: string }[]
): Promise<string | null> => {
  try {
    const response = await client.chatCompletion({
      model,
      messages: messages as Array<{ role: "system" | "user" | "assistant"; content: string }>,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9,
    })

    const text = response.choices?.[0]?.message?.content
    return text?.trim() || null
  } catch (err) {
    console.error(`Model ${model} failed:`, err)
    return null
  }
}

export async function POST(request: Request) {
  const currentHeaders = await headers()

  try {
    const origin = currentHeaders.get("origin")
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abiptom.gw"
    const allowedOrigins = [siteUrl]

    if (process.env.NODE_ENV !== "production") {
      allowedOrigins.push("http://localhost:3000", "http://192.168.17.16:3000")
    }

    if (
      process.env.NODE_ENV === "production" &&
      origin &&
      !allowedOrigins.includes(origin)
    ) {
      return NextResponse.json(
        { content: "Acesso não autorizado" },
        { status: 403, headers: corsHeaders }
      )
    }

    const { success: rateLimitOk } = await rateLimit("chat")
    if (!rateLimitOk) {
      return NextResponse.json(
        {
          content:
            "Muitas mensagens em pouco tempo. Por favor, aguarda um momento.",
        },
        { status: 429, headers: corsHeaders }
      )
    }

    const body: ChatApiRequest = await request.json()
    const { message, history = [] } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { content: "Mensagem inválida." },
        { status: 400, headers: corsHeaders }
      )
    }

    const sanitized = sanitizeInput(message)
    if (!sanitized) {
      return NextResponse.json(
        { content: "Mensagem inválida." },
        { status: 400, headers: corsHeaders }
      )
    }

    if (!hf) {
      return NextResponse.json(
        { content: FALLBACK_MESSAGE } satisfies ChatApiResponse,
        { headers: corsHeaders }
      )
    }

    const conversationMessages: { role: string; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ]

    const recentHistory = history.slice(-10)
    for (const msg of recentHistory) {
      conversationMessages.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })
    }

    conversationMessages.push({ role: "user", content: sanitized })

    let responseText: string | null = null

    for (const model of HF_MODELS) {
      responseText = await tryModel(hf, model, conversationMessages)
      if (responseText) break
    }

    if (!responseText) {
      return NextResponse.json(
        { content: FALLBACK_MESSAGE } satisfies ChatApiResponse,
        { headers: corsHeaders }
      )
    }

    const cleaned = responseText
      .replace(/^(Assistente|Bot|ABIPTOM):?\s*/i, "")
      .trim()

    const response: ChatApiResponse = { content: cleaned }

    return NextResponse.json(response, { headers: corsHeaders })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { content: FALLBACK_MESSAGE } satisfies ChatApiResponse,
      { status: 500, headers: corsHeaders }
    )
  }
}
