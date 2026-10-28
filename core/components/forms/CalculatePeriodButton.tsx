"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react-core";
import { Button } from "@/core/components/ui/button";
import { calculatePeriod } from "@/core/lib/salary/actions";

interface CalculatePeriodButtonProps {
  periodId: string;
  label?: string;
}

export function CalculatePeriodButton({
  periodId,
  label = "Recalcular",
}: CalculatePeriodButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleClick() {
    setError("");
    startTransition(async () => {
      const result = await calculatePeriod(periodId);
      if ("error" in result) {
        setError(result.error ?? "Erro ao calcular folha");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button onClick={handleClick} disabled={isPending} variant="outline">
        <RefreshCcw className="mr-2 h-4 w-4" />
        {isPending ? "A calcular..." : label}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
