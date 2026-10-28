"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";

type ActionResult = { error?: string; success?: boolean };

interface DeliverableFormProps {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
  deliverable?: {
    titulo: string;
    descricao: string | null;
    peso: string;
    prazo: string | null;
    estado: string;
  };
  compact?: boolean;
}

export function DeliverableForm({
  action,
  submitLabel,
  deliverable,
  compact = false,
}: DeliverableFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className={compact ? "space-y-3" : "grid gap-3 md:grid-cols-5"}>
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 md:col-span-5">
          {state.error}
        </div>
      )}

      <input
        name="titulo"
        required
        defaultValue={deliverable?.titulo ?? ""}
        placeholder="Entregável"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 md:col-span-2"
      />
      <input
        name="peso"
        type="number"
        min="0"
        step="0.01"
        defaultValue={deliverable?.peso ?? "0"}
        placeholder="Peso"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
      />
      <input
        name="prazo"
        type="date"
        defaultValue={deliverable?.prazo ?? ""}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
      />
      <select
        name="estado"
        defaultValue={deliverable?.estado ?? "planeado"}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
      >
        <option value="planeado">Planeado</option>
        <option value="em_curso">Em curso</option>
        <option value="concluido">Concluído</option>
        <option value="cancelado">Cancelado</option>
      </select>
      <textarea
        name="descricao"
        defaultValue={deliverable?.descricao ?? ""}
        placeholder="Descrição"
        rows={compact ? 2 : 3}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 md:col-span-4"
      />
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "A guardar..." : submitLabel}
      </Button>
    </form>
  );
}
