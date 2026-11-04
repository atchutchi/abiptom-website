"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";

interface Props {
  userId: string;
  onActivate: (id: string) => Promise<{ error?: string; success?: boolean }>;
}

export function ActivateUserButton({ userId, onActivate }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handle() {
    if (!confirm("Activar este utilizador? Voltará a poder aceder à plataforma.")) return;
    setLoading(true);
    setError("");
    try {
      const result = await onActivate(userId);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        router.refresh();
      } else {
        setError("Não foi possível activar o utilizador. Tenta novamente.");
      }
    } catch {
      setError("Não foi possível activar o utilizador. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Este utilizador está inactivo.</p>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <Button size="sm" onClick={handle} disabled={loading}>
        {loading ? "A activar..." : "Activar utilizador"}
      </Button>
    </div>
  );
}
