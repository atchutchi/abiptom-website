"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { markLinePaid } from "@/core/lib/salary/actions";
import { Banknote } from "lucide-react-core";

interface MarkLinePaidButtonProps {
  lineId: string;
  nomeCurto: string;
}

export function MarkLinePaidButton({
  lineId,
  nomeCurto,
}: MarkLinePaidButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    dataPagamento: new Date().toISOString().slice(0, 10),
    referenciaPagamento: "",
  });
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.dataPagamento) {
      setError("Data de pagamento obrigatória.");
      return;
    }
    startTransition(async () => {
      const result = await markLinePaid(lineId, data);
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  if (!open) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="text-green-700 border-green-300 hover:bg-green-50"
      >
        <Banknote className="h-3.5 w-3.5 mr-1" />
        Pagar
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 p-3 rounded-lg border bg-green-50 min-w-[220px]"
    >
      <p className="text-xs font-medium text-gray-700">Pagar - {nomeCurto}</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Input
        type="date"
        value={data.dataPagamento}
        onChange={(e) =>
          setData((d) => ({ ...d, dataPagamento: e.target.value }))
        }
        required
      />
      <Input
        type="text"
        placeholder="Referência (opcional)"
        value={data.referenciaPagamento}
        onChange={(e) =>
          setData((d) => ({ ...d, referenciaPagamento: e.target.value }))
        }
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "..." : "Confirmar"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setOpen(false)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
