import { Suspense } from "react";
import { AuthShell } from "@/core/components/auth/AuthShell";
import { LoginForm } from "@/core/components/forms/LoginForm";
import { APP_NAME } from "@/core/lib/brand";
import { isCoreReviewMode, isCoreConfigured } from '@/core/lib/environment';

export const metadata = { title: `Iniciar sessão - ${APP_NAME}` };

export default function LoginPage() {
  return (
    <AuthShell
      title="Área de acesso restrito"
      description=""
    >
      <Suspense fallback={null}>
        <LoginForm disabled={isCoreReviewMode() || !isCoreConfigured()} />
      </Suspense>
    </AuthShell>
  );
}
