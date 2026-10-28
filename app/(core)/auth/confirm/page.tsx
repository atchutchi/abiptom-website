"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type EmailOtpType } from "@supabase/supabase-js";
import { AuthShell } from "@/core/components/auth/AuthShell";
import { getSafeRedirectPath } from "@/core/lib/auth/redirects";
import { createClient } from "@/core/lib/supabase/client";

const EMAIL_OTP_TYPES: EmailOtpType[] = [
  "email",
  "recovery",
  "invite",
  "email_change",
  "magiclink",
  "signup",
];

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return value !== null && EMAIL_OTP_TYPES.includes(value as EmailOtpType);
}

function getFallbackPath(type: EmailOtpType | null) {
  return type === "recovery" || type === "invite"
    ? "/update-password"
    : "/login";
}

function getErrorPath(type: EmailOtpType | null) {
  if (type === "recovery" || type === "invite") {
    return "/forgot-password?error=invalid-link";
  }

  return "/login?error=auth-confirm";
}

function getHashSession() {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null, type: null };
  }

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  return {
    accessToken: hashParams.get("access_token"),
    refreshToken: hashParams.get("refresh_token"),
    type: hashParams.get("type"),
  };
}

function AuthConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient({ manualConfirmation: true }), []);
  const pending = useRef<{ key: string; result: Promise<Error | null> } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolveAuth() {
      const queryType = searchParams?.get("type") ?? null;
      const { accessToken, refreshToken, type: hashType } = getHashSession();
      const rawType = queryType ?? hashType;
      const type = isEmailOtpType(rawType) ? rawType : null;
      const nextPath = getSafeRedirectPath(
        searchParams?.get("next") ?? null,
        getFallbackPath(type)
      );
      const tokenHash = searchParams?.get("token_hash") ?? null;
      const code = searchParams?.get("code") ?? null;

      const key = JSON.stringify([accessToken, refreshToken, tokenHash, type, code]);
      if (!pending.current || pending.current.key !== key) {
        // Replayed effects share the result instead of spending the code twice.
        pending.current = { key, result: (async () => {
          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
            return error;
          }
          if (tokenHash && type) {
            const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
            return error;
          }
          if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            return error;
          }
          return new Error("Link de autenticação sem dados válidos.");
        })() };
      }
      const authError = await pending.current.result;

      if (cancelled) {
        return;
      }

      if (authError) {
        router.replace(getErrorPath(type));
        return;
      }

      router.replace(nextPath);
      router.refresh();
    }

    void resolveAuth();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams, supabase]);

  return (
    <AuthShell
      title="A validar acesso"
      description="Estamos a confirmar o link e a preparar a tua sessão."
    >
      <p className="text-sm text-gray-500">Se este passo demorar, volta a pedir um novo link.</p>
    </AuthShell>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <AuthShell
          title="A validar acesso"
          description="Estamos a confirmar o link e a preparar a tua sessão."
        >
          <p className="text-sm text-gray-500">
            Se este passo demorar, volta a pedir um novo link.
          </p>
        </AuthShell>
      }
    >
      <AuthConfirmContent />
    </Suspense>
  );
}
