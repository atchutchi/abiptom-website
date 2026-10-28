"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";
import { updateInvoicePayment } from "@/core/lib/invoices/actions";

interface InvoicePaymentDateEditorProps {
  paymentId: string;
  initialDate: string;
}

export function InvoicePaymentDateEditor({
  paymentId,
  initialDate,
}: InvoicePaymentDateEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialDate);
  const [error, setError] = useState("");

  function handleSave() {
    setError("");
    startTransition(async () => {
      const result = await updateInvoicePayment(paymentId, { data: value });
      if (result?.error) {
        setError(result.error);
        return;
      }

      setIsEditing(false);
      router.refresh();
    });
  }

  if (!isEditing) {
    return (
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
      >
        Corrigir data
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <input
        type="date"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-40 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
      />
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={handleSave} disabled={isPending}>
          {isPending ? "A guardar..." : "Guardar"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setValue(initialDate);
            setError("");
            setIsEditing(false);
          }}
          disabled={isPending}
        >
          Cancelar
        </Button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
