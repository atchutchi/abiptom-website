"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react-core";
import { Button } from "@/core/components/ui/button";
import { createClient } from "@/core/lib/supabase/client";
import { getUnreadMessageCount } from "@/core/lib/messages/actions";

export function MessagesHeaderButton() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const href = pathname?.startsWith("/staff")
    ? "/staff/me/messages"
    : "/admin/messages";

  useEffect(() => {
    let mounted = true;

    async function refreshCount() {
      const nextCount = await getUnreadMessageCount().catch(() => 0);
      if (mounted) setCount(nextCount);
    }

    void refreshCount();
    const supabase = createClient();
    const channel = supabase
      .channel("header-chat-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        () => {
          void refreshCount();
        }
      )
      .subscribe();

    const interval = window.setInterval(() => {
      void refreshCount();
    }, 60_000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Button asChild variant="ghost" size="sm" className="relative">
      <Link href={href} aria-label="Chat">
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Chat</span>
        {count > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--brand-gold)] px-1 text-[10px] font-bold text-[color:var(--brand-ink)] ring-1 ring-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}
