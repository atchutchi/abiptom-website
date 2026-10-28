import { assertCoreDataAccess } from "@/core/lib/environment";
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  assertCoreDataAccess();
  const url = process.env.NEXT_PUBLIC_CORE_SUPABASE_URL;
  const serviceRoleKey = process.env.CORE_SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_CORE_SUPABASE_URL não configurado.");
  }

  if (!serviceRoleKey) {
    throw new Error("CORE_SUPABASE_SERVICE_ROLE_KEY não configurado.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
