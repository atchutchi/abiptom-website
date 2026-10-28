import { createClient } from "@/core/lib/supabase/server";
import { repairInternalUserFromAuth } from "@/core/lib/users/auth-link";

export async function getCurrentUser() {
  const supabase = await createClient();
  let authResult = await supabase.auth.getUser();

  if (authResult.error?.status && authResult.error.status >= 500) {
    console.warn("auth.session.retry", { status: authResult.error.status });
    authResult = await supabase.auth.getUser();
  }

  const {
    data: { user },
    error,
  } = authResult;

  if (error || !user) {
    console.warn("auth.session.unavailable", {
      reason: error ? "auth_error" : "missing_auth_user",
      code: error?.code,
      status: error?.status,
    });
    return { user: null, dbUser: null };
  }

  const dbUser = await repairInternalUserFromAuth({
    authUserId: user.id,
    email: user.email,
  });

  if (!dbUser?.activo) {
    console.warn("auth.session.unavailable", {
      reason: dbUser ? "inactive_profile" : "missing_profile",
    });
  }

  return { user, dbUser: dbUser?.activo ? dbUser : null };
}
