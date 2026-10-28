"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";

interface Props {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  currentState: string;
  allowedStates?: string[];
}

const STATE_OPTIONS = [
  ["pendente", "Pendente"],
  ["em_curso", "Em curso"],
  ["submetida", "Submetida"],
  ["aprovada", "Aprovada"],
  ["precisa_correcao", "Precisa correcção"],
  ["rejeitada", "Rejeitada"],
  ["concluida", "Concluída"],
  ["cancelada", "Cancelada"],
] as const;

export default function TaskStateForm({ action, currentState, allowedStates }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-900">Actualizar estado</h3>

      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {state.error}
        </div>
      )}

      <select
        name="estado"
        defaultValue={currentState}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
      >
        {STATE_OPTIONS.filter(
          ([value]) =>
            !allowedStates ||
            allowedStates.includes(value) ||
            value === currentState
        ).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "A actualizar..." : "Guardar estado"}
      </Button>
    </form>
  );
}
