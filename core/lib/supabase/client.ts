import { coreCookieOptions } from "./options";
import { createBrowserClient } from "@supabase/ssr";

export function createClient({ manualConfirmation = false }: { manualConfirmation?: boolean } = {}) {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_CORE_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_CORE_SUPABASE_ANON_KEY!,
    {
      cookieOptions: coreCookieOptions,
      // The confirmation page explicitly consumes one-time codes. Automatic
      // URL detection would consume the same code before its handler runs.
      ...(manualConfirmation ? { isSingleton: false, auth: { detectSessionInUrl: false } } : {}),
    }
  );
}
