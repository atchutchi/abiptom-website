"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { History, RefreshCcw } from "lucide-react-core";
import { Button } from "@/core/components/ui/button";
import {
  recalculateHistoricalPeriods,
  type RecalculateHistoricalPeriodsResult,
} from "@/core/lib/salary/actions";

export function RecalculateHistoricalPeriodsButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<
    Extract<RecalculateHistoricalPeriodsResult, { success: true }> | null
  >(null);

  function handleClick() {
    if (
      !confirm(
        "Recalcular todos os períodos existentes com o estado actual dos projectos? As linhas novas ficam por pagar para revisão manual, mesmo nos períodos pagos.",
      )
    ) {
      return;
    }

    setError("");
    startTransition(async () => {
      const result = await recalculateHistoricalPeriods();
      if ("error" in result) {
        setSummary(null);
        setError(result.error);
        return;
      }

      setSummary(result);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={handleClick}
        disabled={isPending}
        variant="outline"
        className="border-amber-300 text-amber-800 hover:bg-amber-50"
      >
        {isPending ? (
          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <History className="mr-2 h-4 w-4" />
        )}
        {isPending ? "A recalcular..." : "Recalcular históricos"}
      </Button>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {summary && (
        <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs text-amber-900">
          <p className="font-medium">
            {summary.periods.length} período(s) recalculado(s),{" "}
            {summary.skipped.length} ignorado(s).
          </p>
          {summary.periods.length > 0 && (
            <div className="mt-2 space-y-1">
              {summary.periods.slice(0, 5).map((period) => (
                <p key={period.periodId}>
                  {String(period.mes).padStart(2, "0")}/{period.ano}:{" "}
                  {period.totalFolhaAntes.toLocaleString("pt-PT")} XOF →{" "}
                  {period.totalFolhaDepois.toLocaleString("pt-PT")} XOF
                </p>
              ))}
            </div>
          )}
          {summary.skipped.length > 0 && (
            <div className="mt-2 space-y-1 text-red-700">
              {summary.skipped.slice(0, 3).map((period) => (
                <p key={period.periodId}>
                  {String(period.mes).padStart(2, "0")}/{period.ano}:{" "}
                  {period.reason}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
