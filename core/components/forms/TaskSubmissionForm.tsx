"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";

interface TaskSubmissionFormProps {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  disabled?: boolean;
}

export function TaskSubmissionForm({ action, disabled = false }: TaskSubmissionFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Submeter conclusão</h3>
        <p className="mt-1 text-xs text-gray-500">
          A coordenação valida antes de contar para a execução.
        </p>
      </div>

      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {state.error}
        </div>
      )}

      <textarea
        name="comentario"
        rows={4}
        required
        disabled={disabled}
        placeholder="O que foi entregue?"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:bg-gray-50"
      />
      <input
        name="evidenciaUrl"
        type="url"
        disabled={disabled}
        placeholder="Link de evidência, opcional"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:bg-gray-50"
      />
      <Button type="submit" size="sm" disabled={pending || disabled}>
        {pending ? "A submeter..." : "Submeter para validação"}
      </Button>
    </form>
  );
}
