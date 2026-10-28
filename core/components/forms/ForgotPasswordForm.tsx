"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  requestPasswordResetAction,
  type AuthActionState,
} from "@/core/lib/auth/actions";

const INITIAL_STATE: AuthActionState = { error: "", success: "" };

function getQueryErrorMessage(errorCode: string | null) {
  if (errorCode === "invalid-link") {
    return "O link de recuperação é inválido ou já expirou. Pede um novo email.";
  }

  return "";
}

export function ForgotPasswordForm({ disabled = false }: { disabled?: boolean }) {
  const searchParams = useSearchParams();
  const [state, formAction, pending] = useActionState(
    requestPasswordResetAction,
    INITIAL_STATE,
  );

  const queryError = getQueryErrorMessage(searchParams?.get("error") ?? null);

  return (
    <form action={formAction} className="space-y-4">
      {disabled ? <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Versão de teste. O envio de emails está desactivado.</p> : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="utilizador@abiptom.gw"
          autoComplete="email"
          disabled={disabled}
          required
        />
      </div>

      {queryError ? <p className="text-sm text-red-600">{queryError}</p> : null}
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-emerald-700">{state.success}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending || disabled}>
        {pending ? "A enviar..." : "Enviar link de recuperação"}
      </Button>

      <div className="text-center text-sm text-gray-500">
        <Link href="/login" className="hover:underline">
          Voltar ao login
        </Link>
      </div>
    </form>
  );
}
