import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/core/lib/cron/auth";
import { processPendingMessageEmailNotifications } from "@/core/lib/messages/actions";

export const runtime = "nodejs";

async function handleMessagesEmailCron(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await processPendingMessageEmailNotifications();
  return NextResponse.json({ ok: true, ...result });
}

export async function GET(req: NextRequest) {
  return handleMessagesEmailCron(req);
}

export async function POST(req: NextRequest) {
  return handleMessagesEmailCron(req);
}
