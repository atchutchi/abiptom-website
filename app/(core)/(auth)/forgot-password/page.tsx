import { Suspense } from "react";
import { AuthShell } from "@/core/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/core/components/forms/ForgotPasswordForm";
import { APP_NAME } from "@/core/lib/brand";
import { isCoreReviewMode, isCoreConfigured } from '@/core/lib/environment';

export const metadata = { title: `Recuperar acesso - ${APP_NAME}` };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Recuperar acesso"
      description="Recebe um link seguro para redefinir a tua palavra-passe."
    >
      <Suspense fallback={null}>
        <ForgotPasswordForm disabled={isCoreReviewMode() || !isCoreConfigured()} />
      </Suspense>
    </AuthShell>
  );
}
