"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { createClient } from "@/core/lib/supabase/client";

type UpdatePasswordFormProps = {
  email?: string | null;
};

export function UpdatePasswordForm({ email }: UpdatePasswordFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(
          "Não foi possível actualizar a palavra-passe. Pede um novo link se este tiver expirado."
        );
        return;
      }

      await supabase.auth.signOut();
      router.push("/login?notice=password-reset-success");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {email ? (
        <p className="text-sm text-gray-500">Conta: {email}</p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="password">Nova palavra-passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar palavra-passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "A actualizar..." : "Actualizar palavra-passe"}
      </Button>
    </form>
  );
}
