import { redirect } from "next/navigation";
import { Header } from "@/core/components/layout/Header";
import { MessagesClient } from "@/core/components/messages/MessagesClient";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { listConversations } from "@/core/lib/messages/actions";

export const metadata = { title: "Chat - ABIPTOM Core" };

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string }>;
}) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (dbUser.role === "staff") redirect("/staff/me/messages");

  const params = await searchParams;
  const conversations = await listConversations();

  return (
    <>
      <Header title="Chat" />
      <MessagesClient
        currentUserId={dbUser.id}
        initialConversations={conversations}
        initialConversationId={params.conversation}
      />
    </>
  );
}
