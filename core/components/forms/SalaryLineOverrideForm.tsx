"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { updateSalaryLine } from "@/core/lib/salary/actions";
import { toXofInteger } from "@/core/lib/utils/money";

interface SalaryLineOverrideFormProps {
  lineId: string;
  totalBrutoCalculado: number;
  totalBrutoFinal: number;
  overrideMotivo: string | null;
}

export function SalaryLineOverrideForm({
  lineId,
  totalBrutoCalculado,
  totalBrutoFinal,
  overrideMotivo,
}: SalaryLineOverrideFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    totalBrutoFinal: String(totalBrutoFinal),
    overrideMotivo: overrideMotivo ?? "",
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await updateSalaryLine(lineId, {
        totalBrutoFinal: toXofInteger(form.totalBrutoFinal),
        overrideMotivo: form.overrideMotivo,
      });

      if ("error" in result) {
        setError(result.error ?? "Erro ao actualizar linha salarial");
        return;
      }

      setOpen(false);
      router.refresh();
    });
  }

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Ajustar
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="min-w-[240px] space-y-2 rounded-lg border bg-gray-50 p-3">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Input
        type="number"
        min="0"
        step="1"
        value={form.totalBrutoFinal}
        onChange={(event) =>
          setForm((current) => ({ ...current, totalBrutoFinal: event.target.value }))
        }
      />
      <textarea
        value={form.overrideMotivo}
        onChange={(event) =>
          setForm((current) => ({ ...current, overrideMotivo: event.target.value }))
        }
        placeholder="Motivo do ajuste"
        className="min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
      />
      <p className="text-xs text-gray-500">
        Calculado: {totalBrutoCalculado.toLocaleString("pt-PT")} XOF
      </p>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "..." : "Guardar"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
