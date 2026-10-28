"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react-core";
import { Button } from "@/core/components/ui/button";
import { deletePeriod } from "@/core/lib/salary/actions";

interface DeletePeriodButtonProps {
  periodId: string;
}

export function DeletePeriodButton({ periodId }: DeletePeriodButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (!confirm("Eliminar este periodo salarial? Esta accao remove o snapshot, linhas e pagamentos gerados.")) {
      return;
    }

    setError("");
    startTransition(async () => {
      const result = await deletePeriod(periodId);
      if ("error" in result) {
        setError(result.error ?? "Erro ao eliminar periodo");
        return;
      }
      router.push("/admin/salary");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleDelete}
        disabled={isPending}
        variant="outline"
        className="border-red-200 text-red-700 hover:bg-red-50"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {isPending ? "A eliminar..." : "Eliminar periodo"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
