"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";

interface TaskValidationFormProps {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  disabled?: boolean;
}

export function TaskValidationForm({ action, disabled = false }: TaskValidationFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Validação da coordenação</h3>
        <p className="mt-1 text-xs text-gray-500">
          Só tarefas aprovadas entram na taxa de execução.
        </p>
      </div>

      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {state.error}
        </div>
      )}

      <select
        name="decision"
        defaultValue="aprovada"
        disabled={disabled}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:bg-gray-50"
      >
        <option value="aprovada">Aprovar</option>
        <option value="precisa_correcao">Pedir correcção</option>
        <option value="rejeitada">Rejeitar</option>
      </select>

      <select
        name="qualityScore"
        defaultValue="4"
        disabled={disabled}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:bg-gray-50"
      >
        <option value="5">Qualidade 5</option>
        <option value="4">Qualidade 4</option>
        <option value="3">Qualidade 3</option>
        <option value="2">Qualidade 2</option>
        <option value="1">Qualidade 1</option>
      </select>

      <textarea
        name="comentario"
        rows={3}
        disabled={disabled}
        placeholder="Comentário de validação"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:bg-gray-50"
      />
      <Button type="submit" size="sm" disabled={pending || disabled}>
        {pending ? "A validar..." : "Guardar validação"}
      </Button>
    </form>
  );
}
