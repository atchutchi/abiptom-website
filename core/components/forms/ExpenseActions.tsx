"use client";

import { useState, useTransition } from "react";
import { Button } from "@/core/components/ui/button";
import { approveExpense, markExpensePaid, cancelExpense } from "@/core/lib/expenses/actions";
import type { Expense } from "@/core/lib/db/schema";

interface Props {
  expense: Expense;
}

export default function ExpenseActions({ expense }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [dataPagamento, setDataPagamento] = useState(
    expense.dataPagamento ?? new Date().toISOString().split("T")[0]
  );
  const [motivoAnulacao, setMotivoAnulacao] = useState("");

  const run = (fn: () => Promise<void>) => {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
        setShowPayment(false);
        setShowCancel(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro");
      }
    });
  };

  if (expense.estado === "anulada") {
    return <p className="text-sm text-muted-foreground">Despesa anulada.</p>;
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {expense.estado === "rascunho" && (
          <Button
            size="sm"
            onClick={() => run(() => approveExpense(expense.id))}
            disabled={isPending}
          >
            Aprovar
          </Button>
        )}
        {(expense.estado === "rascunho" || expense.estado === "aprovada") && (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setShowPayment(!showPayment);
                setShowCancel(false);
              }}
              disabled={isPending}
            >
              Marcar como paga
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowCancel(!showCancel);
                setShowPayment(false);
              }}
              disabled={isPending}
            >
              Anular
            </Button>
          </>
        )}
        {expense.estado === "paga" && (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setShowPayment(!showPayment);
                setShowCancel(false);
              }}
              disabled={isPending}
            >
              Corrigir data de pagamento
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowCancel(!showCancel);
                setShowPayment(false);
              }}
              disabled={isPending}
            >
              Anular
            </Button>
          </>
        )}
      </div>

      {expense.estado === "paga" && expense.dataPagamento && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Despesa paga a {expense.dataPagamento}.
        </p>
      )}

      {showPayment && (
        <div className="rounded-lg border border-border p-4 space-y-3">
          <label className="text-sm font-medium">Data de pagamento</label>
          <input
            type="date"
            value={dataPagamento}
            onChange={(e) => setDataPagamento(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <Button
            size="sm"
            onClick={() => run(() => markExpensePaid(expense.id, dataPagamento))}
            disabled={isPending}
          >
            {expense.estado === "paga" ? "Guardar nova data" : "Confirmar pagamento"}
          </Button>
        </div>
      )}

      {showCancel && (
        <div className="rounded-lg border border-border p-4 space-y-3">
          <label className="text-sm font-medium">Motivo da anulação</label>
          <textarea
            rows={2}
            value={motivoAnulacao}
            onChange={(e) => setMotivoAnulacao(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none"
          />
          <Button
            size="sm"
            variant="destructive"
            onClick={() => run(() => cancelExpense(expense.id, motivoAnulacao))}
            disabled={isPending || !motivoAnulacao.trim()}
          >
            Confirmar anulação
          </Button>
        </div>
      )}
    </div>
  );
}
