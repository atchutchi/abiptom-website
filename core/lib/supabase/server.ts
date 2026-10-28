import { coreCookieOptions } from "./options";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_CORE_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_CORE_SUPABASE_ANON_KEY!,
    {
      cookieOptions: coreCookieOptions,
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll chamado de Server Component; ignorado
          }
        },
      },
    }
  );
}
