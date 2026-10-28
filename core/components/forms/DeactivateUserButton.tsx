"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";

interface Props {
  userId: string;
  isActive: boolean;
  onDeactivate: (id: string) => Promise<{ error?: string; success?: boolean }>;
}

export function DeactivateUserButton({ userId, isActive, onDeactivate }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handle() {
    if (!confirm(isActive ? "Desactivar este utilizador?" : "Confirmar acção?")) return;
    setLoading(true);
    setError("");
    try {
      const result = await onDeactivate(userId);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/users");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">
        {isActive
          ? "Desactivar impede este utilizador de aceder à plataforma."
          : "Este utilizador está inactivo."}
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button
        variant="destructive"
        size="sm"
        onClick={handle}
        disabled={loading || !isActive}
      >
        {loading ? "A processar..." : "Desactivar utilizador"}
      </Button>
    </div>
  );
}
