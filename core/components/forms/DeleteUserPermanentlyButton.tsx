"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";

interface Props {
  userId: string;
  onDelete: (id: string) => Promise<{
    error?: string;
    success?: boolean;
    warning?: string;
  }>;
}

export function DeleteUserPermanentlyButton({ userId, onDelete }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  async function handle() {
    if (!confirm("Eliminar definitivamente este utilizador? Esta acção é irreversível.")) {
      return;
    }

    setLoading(true);
    setError("");
    setWarning("");

    try {
      const result = await onDelete(userId);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.warning) {
        setWarning(result.warning);
      }
      router.push("/admin/users");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">
        Eliminar definitivamente só é permitido quando este utilizador não tem histórico contabilístico nem registos dependentes.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {warning && <p className="text-sm text-amber-700">{warning}</p>}
      <Button variant="destructive" size="sm" onClick={handle} disabled={loading}>
        {loading ? "A eliminar..." : "Eliminar definitivamente"}
      </Button>
    </div>
  );
}
