"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";

type ActionResult = { error?: string; success?: boolean; id?: string };

interface Props {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
}

export default function StockItemForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.id) {
      router.push(`/admin/stock/${state.id}`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Nome *</label>
          <input
            name="nome"
            required
            placeholder="Ex.: Papel A4 80g"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">SKU</label>
          <input
            name="sku"
            placeholder="PAP-A4-001"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Categoria</label>
          <input
            name="categoria"
            placeholder="Escritório"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Unidade *</label>
          <input
            name="unidade"
            defaultValue="unidade"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Localização</label>
          <input
            name="localizacao"
            placeholder="Armazém A"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Quantidade inicial</label>
          <input
            name="quantidadeAtual"
            type="number"
            defaultValue="0"
            step="0.001"
            min="0"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Quantidade mínima</label>
          <input
            name="quantidadeMinima"
            type="number"
            defaultValue="0"
            step="0.001"
            min="0"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Custo unitário (XOF)</label>
          <input
            name="custoUnitario"
            type="number"
            step="1"
            min="0"
            placeholder="0"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "A guardar..." : "Guardar item"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
