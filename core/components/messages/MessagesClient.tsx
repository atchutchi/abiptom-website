"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FolderKanban,
  MessageSquare,
  Plus,
  Search,
  Send,
  Users,
} from "lucide-react-core";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { Input } from "@/core/components/ui/input";
import { createClient } from "@/core/lib/supabase/client";
import {
  getConversationMessages,
  listConversations,
  markConversationRead,
  sendMessage,
  type ConversationMessage,
  type ConversationSummary,
  type MessageUser,
} from "@/core/lib/messages/actions";
import { cn } from "@/core/lib/utils";

interface MessagesClientProps {
  currentUserId: string;
  initialConversations: ConversationSummary[];
  initialConversationId?: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  direct: "Colega",
  group: "Grupo",
  project: "Projecto",
};

const NewConversationDialog = dynamic(
  () =>
    import("@/core/components/messages/NewConversationDialog").then(
      (mod) => mod.NewConversationDialog
    ),
  { ssr: false }
);

function formatMessageTime(value: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatLastSeen(value: string | null) {
  if (!value) return "Offline";

  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60_000));

  if (diffMinutes < 2) return "Visto agora";
  if (diffMinutes < 60) return `Visto há ${diffMinutes} min`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Visto há ${diffHours} h`;

  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

export function MessagesClient({
  currentUserId,
  initialConversations,
  initialConversationId,
}: MessagesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamString = searchParams?.toString() ?? "";
  const activeConversationParam = searchParams?.get("conversation") ?? null;
  const initialSelectedId =
    initialConversations.find((conversation) => conversation.id === initialConversationId)
      ?.id ?? initialConversations[0]?.id ?? null;
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [body, setBody] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const selectedIdRef = useRef(selectedId);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedId
  );

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return conversations;

    return conversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(term)
    );
  }, [conversations, search]);

  const refreshConversations = useCallback(async () => {
    const next = await listConversations().catch(() => null);
    if (next) setConversations(next);
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    const nextMessages = await getConversationMessages(conversationId);
    if (selectedIdRef.current === conversationId) {
      setMessages(nextMessages);
    }
    await markConversationRead(conversationId).catch(() => undefined);
    await refreshConversations();
  }, [refreshConversations]);

  const updateUrl = useCallback((conversationId: string) => {
    const nextParams = new URLSearchParams(searchParamString);
    nextParams.set("conversation", conversationId);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }, [pathname, router, searchParamString]);

  function selectConversation(conversationId: string) {
    setSelectedId(conversationId);
    setError(null);
    updateUrl(conversationId);
  }

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    let mounted = true;
    getConversationMessages(selectedId)
      .then((nextMessages) => {
        if (mounted) setMessages(nextMessages);
      })
      .then(() => markConversationRead(selectedId))
      .then(() => refreshConversations())
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, [refreshConversations, selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, selectedId]);

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      const fallbackId = conversations[0].id;
      setSelectedId(fallbackId);
      updateUrl(fallbackId);
      return;
    }

    if (
      selectedId &&
      conversations.length > 0 &&
      !conversations.some((conversation) => conversation.id === selectedId)
    ) {
      const fallbackId = conversations[0].id;
      setSelectedId(fallbackId);
      updateUrl(fallbackId);
    }
  }, [conversations, selectedId, updateUrl]);

  useEffect(() => {
    if (!activeConversationParam || !selectedId || conversations.length === 0) return;

    const hasUrlConversation = conversations.some(
      (conversation) => conversation.id === activeConversationParam
    );

    if (!hasUrlConversation) {
      updateUrl(selectedId);
    }
  }, [activeConversationParam, conversations, selectedId, updateUrl]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages-${selectedId ?? "none"}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: selectedId ? `conversation_id=eq.${selectedId}` : undefined,
        },
        () => {
          if (selectedId) {
            void loadMessages(selectedId);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_presence" },
        () => {
          void refreshConversations();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadMessages, refreshConversations, selectedId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (selectedId) {
        void loadMessages(selectedId).catch(() => undefined);
        return;
      }

      void refreshConversations();
    }, 12_000);

    return () => window.clearInterval(interval);
  }, [loadMessages, refreshConversations, selectedId]);

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    if (!selectedId || !body.trim() || isSending) return;

    const conversationId = selectedId;
    const nextBody = body.trim();
    setBody("");
    setError(null);
    setIsSending(true);

    try {
      const result = await sendMessage(conversationId, nextBody);
      if ("error" in result && result.error) {
        setError(result.error);
        setBody(nextBody);
        return;
      }

      if (result.message && selectedIdRef.current === conversationId) {
        setMessages((current) =>
          current.some((message) => message.id === result.message.id)
            ? current
            : [...current, result.message]
        );
      }

      if (selectedIdRef.current === conversationId) {
        await loadMessages(conversationId);
      } else {
        await refreshConversations();
      }
    } catch {
      setError("Não foi possível enviar a mensagem. Tenta novamente.");
      setBody(nextBody);
    } finally {
      setIsSending(false);
    }
  }

  async function handleConversationCreated(conversationId: string) {
    const nextConversations = await listConversations();
    setConversations(nextConversations);
    setSelectedId(conversationId);
    updateUrl(conversationId);
  }

  return (
    <main className="flex h-[calc(100dvh-4rem)] min-h-0 flex-1 overflow-hidden p-3 md:p-4">
      <div className="grid h-full min-h-0 w-full grid-cols-1 grid-rows-[minmax(11rem,35%)_minmax(0,1fr)] overflow-hidden rounded-lg border border-[color:var(--brand-line)] bg-[color:var(--brand-card)] shadow-sm lg:grid-cols-[20rem_1fr] lg:grid-rows-1">
        <aside className="flex min-h-0 flex-col border-b border-[color:var(--brand-line)] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3 border-b border-[color:var(--brand-line)] p-3">
            <div>
              <p className="text-sm font-semibold text-[color:var(--brand-ink)]">
                Conversas
              </p>
              <p className="text-xs text-[color:var(--brand-muted)]">
                {conversations.length} activas
              </p>
            </div>
            <Button
              type="button"
              size="icon-sm"
              aria-label="Nova conversa"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </Button>
            {dialogOpen && (
              <NewConversationDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onCreated={handleConversationCreated}
              />
            )}
          </div>

          <div className="border-b border-[color:var(--brand-line)] p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-2 h-4 w-4 text-[color:var(--brand-muted)]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar"
                className="pl-8"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {filteredConversations.length === 0 && (
              <div className="p-6 text-center text-sm text-[color:var(--brand-muted)]">
                Nenhuma conversa.
              </div>
            )}
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => selectConversation(conversation.id)}
                className={cn(
                  "flex w-full gap-3 border-b border-[rgb(234_223_189_/_65%)] px-3 py-3 text-left transition-colors hover:bg-[rgb(245_184_0_/_9%)]",
                  selectedId === conversation.id && "bg-[color:var(--brand-gold-soft)]"
                )}
              >
                <ConversationIcon type={conversation.type} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-[color:var(--brand-ink)]">
                      {conversation.title}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge>{conversation.unreadCount}</Badge>
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs text-[color:var(--brand-muted)]">
                    {conversation.lastMessage
                      ? `${conversation.lastMessage.senderName}: ${conversation.lastMessage.body}`
                      : `${TYPE_LABELS[conversation.type]} sem mensagens`}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <PresenceDots participants={conversation.participants} />
                    <span className="truncate text-[11px] text-[color:var(--brand-muted-light)]">
                      {conversation.participants.length} participantes
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              <div className="flex min-h-16 items-center justify-between gap-3 border-b border-[color:var(--brand-line)] px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-base font-semibold text-[color:var(--brand-ink)]">
                      {selectedConversation.title}
                    </h2>
                    <Badge variant="outline">{TYPE_LABELS[selectedConversation.type]}</Badge>
                  </div>
                  <p className="mt-1 truncate text-xs text-[color:var(--brand-muted)]">
                    {selectedConversation.participants
                      .map((participant) => participant.nomeCurto)
                      .join(", ")}
                  </p>
                </div>
                <div className="hidden shrink-0 items-center gap-3 md:flex">
                  {selectedConversation.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-1 text-xs text-[color:var(--brand-muted)]"
                      title={formatLastSeen(participant.lastSeenAt)}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          participant.isOnline ? "bg-green-600" : "bg-gray-300"
                        )}
                      />
                      <span>{participant.nomeCurto}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[rgb(255_250_240_/_75%)] p-4">
                {messages.length === 0 && (
                  <div className="flex h-full items-center justify-center text-sm text-[color:var(--brand-muted)]">
                    Ainda não há mensagens.
                  </div>
                )}
                {messages.map((message) => {
                  const mine = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={cn("flex", mine ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[min(40rem,85%)] rounded-lg px-3 py-2 shadow-sm",
                          mine
                            ? "bg-[color:var(--brand-ink)] text-[#fff8df]"
                            : "border border-[color:var(--brand-line)] bg-white text-[color:var(--brand-ink)]"
                        )}
                      >
                        {!mine && (
                          <p className="mb-1 text-xs font-semibold text-[color:var(--brand-gold-dark)]">
                            {message.senderName}
                          </p>
                        )}
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {message.body}
                        </p>
                        <p
                          className={cn(
                            "mt-1 text-right text-[10px]",
                            mine ? "text-[#fff3c2]" : "text-[color:var(--brand-muted)]"
                          )}
                        >
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="shrink-0 border-t border-[color:var(--brand-line)] bg-[color:var(--brand-card)] p-3"
              >
                {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
                <div className="flex items-end gap-2">
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder="Escrever mensagem"
                    rows={2}
                    className="min-h-10 min-w-0 flex-1 resize-none rounded-lg border border-input bg-[rgb(255_253_248_/_85%)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand-gold)] focus:ring-3 focus:ring-[rgb(245_184_0_/_25%)]"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    size="icon-lg"
                    disabled={!body.trim() || isSending}
                    className="shrink-0 md:w-auto md:px-3"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only md:not-sr-only md:ml-2">Enviar</span>
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-[color:var(--brand-muted)]">
              Cria ou selecciona uma conversa.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ConversationIcon({ type }: { type: string }) {
  const Icon =
    type === "project" ? FolderKanban : type === "group" ? Users : MessageSquare;

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--brand-gold-soft)] text-[color:var(--brand-ink)]">
      <Icon className="h-4 w-4" aria-hidden="true" />
    </span>
  );
}

function PresenceDots({ participants }: { participants: MessageUser[] }) {
  const onlineCount = participants.filter((participant) => participant.isOnline).length;

  return (
    <span className="flex items-center gap-1">
      <span className="h-2 w-2 rounded-full bg-green-600" />
      <span className="text-[11px] text-[color:var(--brand-muted-light)]">
        {onlineCount} online
      </span>
    </span>
  );
}
