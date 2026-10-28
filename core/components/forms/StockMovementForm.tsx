"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";

type ActionResult = { error?: string; success?: boolean };

interface Props {
  action: (prev: unknown, formData: FormData) => Promise<ActionResult>;
}

export default function StockMovementForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-900">Registar movimento</h3>

      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-600">Tipo *</label>
          <select
            name="tipo"
            required
            defaultValue="entrada"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="ajuste">Ajuste (define saldo)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-600">Quantidade *</label>
          <input
            name="quantidade"
            required
            type="number"
            step="0.001"
            min="0"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-600">Custo unitário (XOF)</label>
          <input
            name="custoUnitario"
            type="number"
            step="1"
            min="0"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-600">Referência</label>
          <input
            name="referencia"
            placeholder="Ex.: Compra Abril"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-600">Notas</label>
        <textarea
          name="notas"
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "A registar..." : "Registar"}
      </Button>
    </form>
  );
}
