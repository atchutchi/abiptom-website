"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";
import { confirmPeriod } from "@/core/lib/salary/actions";
import { CheckCircle } from "lucide-react-core";

interface ConfirmPeriodButtonProps {
  periodId: string;
}

export function ConfirmPeriodButton({ periodId }: ConfirmPeriodButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleConfirm() {
    if (
      !confirm(
        "Confirmar período salarial? Esta acção bloqueia edições futuras."
      )
    )
      return;

    startTransition(async () => {
      const result = await confirmPeriod(periodId);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button onClick={handleConfirm} disabled={isPending}>
        <CheckCircle className="h-4 w-4 mr-2" />
        {isPending ? "A confirmar..." : "Confirmar período"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
