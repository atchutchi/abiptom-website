import { NextRequest, NextResponse } from "next/server";
import { updateMyPresence } from "@/core/lib/messages/actions";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const result = await updateMyPresence({
      isOnline: body.isOnline !== false,
      currentConversationId:
        typeof body.currentConversationId === "string"
          ? body.currentConversationId
          : null,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
}
