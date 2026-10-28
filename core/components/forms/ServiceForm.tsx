"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/core/components/ui/button";
import { useRouter } from "next/navigation";
import type { ServiceCatalog } from "@/core/lib/db/schema";

type ActionResult = { error?: string; success?: boolean };

interface Props {
  service?: ServiceCatalog;
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
  submitLabel?: string;
}

const PERIODICIDADES = [
  { value: "unica", label: "Única" },
  { value: "mensal", label: "Mensal" },
  { value: "anual", label: "Anual" },
  { value: "bienal", label: "Bienal" },
] as const;

export default function ServiceForm({ service, action, submitLabel = "Guardar" }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.push("/admin/settings/services");
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5 max-w-xl">
      {state?.error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Categoria *</label>
          <input
            name="categoria"
            required
            defaultValue={service?.categoria ?? ""}
            placeholder="ex.: Consultoria, Licenciamento, Formação…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Unidade</label>
          <input
            name="unidade"
            defaultValue={service?.unidade ?? "serviço"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Nome do serviço *</label>
        <input
          name="nome"
          required
          defaultValue={service?.nome ?? ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Descrição</label>
        <textarea
          name="descricao"
          rows={3}
          defaultValue={service?.descricao ?? ""}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 resize-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Periodicidade</label>
          <select
            name="periodicidade"
            defaultValue={service?.periodicidade ?? "unica"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            {PERIODICIDADES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Prazo de entrega</label>
          <input
            name="prazoEntrega"
            defaultValue={service?.prazoEntrega ?? ""}
            placeholder="ex.: 2 semanas"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Preço (XOF)</label>
          <input
            name="precoXof"
            type="number"
            min="0"
            step="1"
            defaultValue={service?.precoXof ?? ""}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "A guardar…" : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
