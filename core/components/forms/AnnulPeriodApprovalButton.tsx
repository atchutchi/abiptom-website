"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react-core";
import { Button } from "@/core/components/ui/button";
import { annulPeriodApproval } from "@/core/lib/salary/actions";

interface AnnulPeriodApprovalButtonProps {
  periodId: string;
}

export function AnnulPeriodApprovalButton({
  periodId,
}: AnnulPeriodApprovalButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleAnnul() {
    if (
      !confirm(
        "Anular aprovação deste período? O período volta ao estado calculado e pode ser recalculado.",
      )
    ) {
      return;
    }

    setError("");
    startTransition(async () => {
      const result = await annulPeriodApproval(periodId);
      if ("error" in result) {
        setError(result.error ?? "Erro ao anular aprovação");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleAnnul}
        disabled={isPending}
        variant="outline"
        className="border-amber-200 text-amber-700 hover:bg-amber-50"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        {isPending ? "A anular..." : "Anular aprovação"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
