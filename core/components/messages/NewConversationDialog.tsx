"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  createDirectConversation,
  createGroupConversation,
  createProjectConversation,
  listNewConversationOptions,
  type MessageProject,
  type MessageUser,
} from "@/core/lib/messages/actions";
import { cn } from "@/core/lib/utils";

type NewConversationMode = "direct" | "group" | "project";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (conversationId: string) => Promise<void> | void;
}

const TYPE_LABELS: Record<NewConversationMode, string> = {
  direct: "Colega",
  group: "Grupo",
  project: "Projecto",
};

export function NewConversationDialog({
  open,
  onOpenChange,
  onCreated,
}: NewConversationDialogProps) {
  const [users, setUsers] = useState<MessageUser[]>([]);
  const [projects, setProjects] = useState<MessageProject[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [hasLoadedOptions, setHasLoadedOptions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [mode, setMode] = useState<NewConversationMode>("direct");
  const [directUserId, setDirectUserId] = useState("");
  const [groupTitle, setGroupTitle] = useState("");
  const [groupParticipantIds, setGroupParticipantIds] = useState<string[]>([]);
  const [projectId, setProjectId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const hasRequestedOptionsRef = useRef(false);

  useEffect(() => {
    if (!open || hasLoadedOptions || hasRequestedOptionsRef.current) return;

    hasRequestedOptionsRef.current = true;
    setIsLoadingOptions(true);
    setError(null);

    listNewConversationOptions()
      .then((options) => {
        setUsers(options.users);
        setProjects(options.projects);
        setDirectUserId((current) => current || options.users[0]?.id || "");
        setProjectId((current) => current || options.projects[0]?.id || "");
        setHasLoadedOptions(true);
      })
      .catch(() => {
        setError("Não foi possível carregar colegas e projectos.");
      })
      .finally(() => {
        setIsLoadingOptions(false);
      });
  }, [hasLoadedOptions, open]);

  useEffect(() => {
    if (!open && !hasLoadedOptions) {
      hasRequestedOptionsRef.current = false;
    }
  }, [hasLoadedOptions, open]);

  const canCreateConversation =
    !isLoadingOptions &&
    ((mode === "direct" && Boolean(directUserId)) ||
      (mode === "group" &&
        groupTitle.trim().length >= 2 &&
        groupParticipantIds.length >= 2) ||
      (mode === "project" && Boolean(projectId)));

  async function handleCreateConversation(event: FormEvent) {
    event.preventDefault();
    if (!canCreateConversation || isCreating) return;

    setError(null);
    setIsCreating(true);

    try {
      const result =
        mode === "direct"
          ? await createDirectConversation(directUserId)
          : mode === "group"
            ? await createGroupConversation({
                title: groupTitle,
                participantIds: groupParticipantIds,
              })
            : await createProjectConversation(projectId);

      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }

      if (result.conversationId) {
        await onCreated(result.conversationId);
      }

      onOpenChange(false);
      setGroupTitle("");
      setGroupParticipantIds([]);
    } catch {
      setError("Não foi possível criar a conversa.");
    } finally {
      setIsCreating(false);
    }
  }

  function toggleGroupParticipant(userId: string) {
    setGroupParticipantIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(44rem,calc(100vh-2rem))] w-[min(46rem,calc(100vw-2rem))] overflow-hidden p-0 sm:max-w-none">
        <form
          onSubmit={handleCreateConversation}
          className="flex max-h-[min(44rem,calc(100vh-2rem))] min-w-0 flex-col"
        >
          <DialogHeader className="border-b border-[color:var(--brand-line)] px-5 py-4">
            <DialogTitle>Nova conversa</DialogTitle>
          </DialogHeader>

          <div className="min-w-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-5 py-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(["direct", "group", "project"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setMode(item);
                    setError(null);
                  }}
                  className={cn(
                    "h-10 min-w-0 truncate rounded-lg border px-2 text-sm font-medium transition-colors",
                    mode === item
                      ? "border-[color:var(--brand-gold)] bg-[color:var(--brand-gold-soft)] text-[color:var(--brand-ink)]"
                      : "border-[color:var(--brand-line)] text-[color:var(--brand-muted)] hover:bg-[rgb(245_184_0_/_10%)]"
                  )}
                >
                  {TYPE_LABELS[item]}
                </button>
              ))}
            </div>

            {isLoadingOptions && (
              <div className="space-y-3 rounded-lg border border-[color:var(--brand-line)] p-3">
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                <div className="h-9 animate-pulse rounded bg-gray-100" />
                <div className="h-9 animate-pulse rounded bg-gray-100" />
              </div>
            )}

            {!isLoadingOptions && mode === "direct" && (
              <label className="block space-y-2 text-sm">
                <span className="font-medium">Colega</span>
                <select
                  value={directUserId}
                  onChange={(event) => {
                    setDirectUserId(event.target.value);
                    setError(null);
                  }}
                  className="h-9 w-full min-w-0 rounded-lg border border-input bg-[rgb(255_253_248_/_85%)] px-2 text-sm outline-none focus:border-[color:var(--brand-gold)]"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nomeCurto} · {user.cargo ?? user.email}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {!isLoadingOptions && mode === "group" && (
              <div className="space-y-3">
                <label className="block min-w-0 space-y-2 text-sm">
                  <span className="font-medium">Nome do grupo</span>
                  <Input
                    value={groupTitle}
                    onChange={(event) => {
                      setGroupTitle(event.target.value);
                      setError(null);
                    }}
                    placeholder="Ex.: Equipa comercial"
                    className="min-w-0"
                  />
                </label>
                <div className="max-h-56 space-y-1 overflow-y-auto overflow-x-hidden rounded-lg border border-[color:var(--brand-line)] p-2">
                  {users.map((user) => (
                    <label
                      key={user.id}
                      className="flex min-w-0 cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-[rgb(245_184_0_/_10%)]"
                    >
                      <input
                        type="checkbox"
                        checked={groupParticipantIds.includes(user.id)}
                        onChange={() => {
                          toggleGroupParticipant(user.id);
                          setError(null);
                        }}
                        className="h-4 w-4 shrink-0 accent-[color:var(--brand-gold)]"
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {user.nomeCurto} · {user.cargo ?? user.email}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {!isLoadingOptions && mode === "project" && (
              <label className="block min-w-0 space-y-2 text-sm">
                <span className="font-medium">Projecto</span>
                <select
                  value={projectId}
                  onChange={(event) => {
                    setProjectId(event.target.value);
                    setError(null);
                  }}
                  className="h-9 w-full min-w-0 rounded-lg border border-input bg-[rgb(255_253_248_/_85%)] px-2 text-sm outline-none focus:border-[color:var(--brand-gold)]"
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.titulo}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end border-t border-[color:var(--brand-line)] bg-[rgb(255_243_194_/_45%)] px-5 py-4">
            <Button type="submit" disabled={isCreating || !canCreateConversation}>
              {isCreating ? "A criar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
