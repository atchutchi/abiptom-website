"use client";

import { useState, useTransition } from "react";
import { Button } from "@/core/components/ui/button";
import { registerPayment } from "@/core/lib/invoices/actions";
import { useRouter } from "next/navigation";
import type { Currency } from "@/core/lib/db/schema";
import { toXofInteger } from "@/core/lib/utils/money";

interface Props {
  invoiceId: string;
  moeda: Currency;
}

export default function PaymentForm({ invoiceId, moeda }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [valor, setValor] = useState("");
  const [metodo, setMetodo] = useState("Transferência bancária");
  const [referencia, setReferencia] = useState("");
  const [notas, setNotas] = useState("");

  function submit() {
    if (!valor || Number(valor) <= 0) return setError("Valor inválido.");
    setError(null);
    startTransition(async () => {
      const res = await registerPayment(invoiceId, {
        data,
        valor: moeda === "XOF" ? toXofInteger(valor) : Number(valor),
        moeda,
        taxaCambio: 1,
        metodo,
        referencia,
        notas,
      });
      if (res?.error) setError(res.error);
      else {
        setSuccess(true);
        router.refresh();
      }
    });
  }

  if (success) {
    return (
      <p className="text-sm text-green-600 dark:text-green-400">
        Pagamento registado com sucesso.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-border p-4 space-y-4 max-w-lg">
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">Data *</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Valor ({moeda}) *</label>
          <input
            type="number"
            min={0}
            step={moeda === "XOF" ? "1" : "any"}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none font-mono"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Método</label>
          <input
            value={metodo}
            onChange={(e) => setMetodo(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Referência</label>
          <input
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="col-span-2 space-y-1">
          <label className="text-xs font-medium">Notas</label>
          <textarea
            rows={2}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none resize-none"
          />
        </div>
      </div>
      <Button onClick={submit} disabled={pending}>
        {pending ? "A registar…" : "Registar pagamento"}
      </Button>
    </div>
  );
}
