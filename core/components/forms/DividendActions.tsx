"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react-core";
import {
  approveDividendPeriod,
  cancelDividendPeriod,
  markDividendLinePaid,
} from "@/core/lib/dividends/actions";

interface ApproveProps {
  periodId: string;
}

export function ApproveDividendButton({ periodId }: ApproveProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleApprove() {
    if (
      !confirm(
        "Aprovar distribuição? Após aprovação, pode marcar linhas como pagas."
      )
    )
      return;

    startTransition(async () => {
      try {
        await approveDividendPeriod(periodId);
        router.refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button onClick={handleApprove} disabled={isPending}>
        <CheckCircle className="h-4 w-4 mr-2" />
        {isPending ? "A aprovar..." : "Aprovar"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface CancelProps {
  periodId: string;
}

export function CancelDividendButton({ periodId }: CancelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleCancel() {
    const motivo = prompt("Motivo da anulação:");
    if (!motivo) return;

    startTransition(async () => {
      try {
        await cancelDividendPeriod(periodId, motivo);
        router.refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleCancel}
        disabled={isPending}
        variant="outline"
        className="text-red-600 hover:bg-red-50"
      >
        <XCircle className="h-4 w-4 mr-2" />
        {isPending ? "A anular..." : "Anular"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface MarkLinePaidProps {
  lineId: string;
  nomeCurto: string;
}

export function MarkDividendLinePaidButton({
  lineId,
  nomeCurto,
}: MarkLinePaidProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleMarkPaid() {
    const hoje = new Date().toISOString().split("T")[0];
    const dataPagamento = prompt(
      `Data do pagamento para ${nomeCurto} (AAAA-MM-DD):`,
      hoje
    );
    if (!dataPagamento) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataPagamento)) {
      setError("Formato de data inválido");
      return;
    }
    const referencia = prompt("Referência bancária (opcional):") ?? undefined;

    startTransition(async () => {
      try {
        await markDividendLinePaid(lineId, dataPagamento, referencia);
        router.refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleMarkPaid}
        disabled={isPending}
        size="sm"
        variant="outline"
      >
        {isPending ? "A marcar..." : "Marcar pago"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
