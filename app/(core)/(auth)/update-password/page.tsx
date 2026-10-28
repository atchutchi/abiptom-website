import Link from "next/link";
import { AuthShell } from "@/core/components/auth/AuthShell";
import { UpdatePasswordForm } from "@/core/components/forms/UpdatePasswordForm";
import { createClient } from "@/core/lib/supabase/server";
import { APP_NAME } from "@/core/lib/brand";

export const metadata = { title: `Definir palavra-passe - ${APP_NAME}` };

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <AuthShell
        title="Definir palavra-passe"
        description="Este link de recuperação é inválido, já expirou ou foi usado."
      >
        <div className="space-y-4 text-sm text-gray-600">
          <p>Pede um novo link para voltares a definir a tua palavra-passe.</p>
          <Link href="/forgot-password" className="font-medium text-gray-900 hover:underline">
            Pedir novo link
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Definir palavra-passe"
      description="Escolhe uma nova palavra-passe para continuar."
    >
      <UpdatePasswordForm email={user.email} />
    </AuthShell>
  );
}
