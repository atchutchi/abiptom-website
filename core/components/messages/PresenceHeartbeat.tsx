"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function PresenceHeartbeat() {
  const searchParams = useSearchParams();
  const currentConversationId = searchParams?.get("conversation") ?? null;

  useEffect(() => {
    let active = true;

    async function heartbeat(isOnline = true) {
      if (!active && isOnline) return;

      await fetch("/api/messages/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOnline, currentConversationId }),
        keepalive: true,
      }).catch(() => undefined);
    }

    void heartbeat(true);
    const interval = window.setInterval(() => {
      void heartbeat(true);
    }, 30_000);

    function markOffline() {
      active = false;
      const payload = JSON.stringify({
        isOnline: false,
        currentConversationId: null,
      });
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon?.("/api/messages/presence", blob);
    }

    window.addEventListener("beforeunload", markOffline);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("beforeunload", markOffline);
    };
  }, [currentConversationId]);

  return null;
}
