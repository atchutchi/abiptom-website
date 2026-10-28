import { coreCookieOptions } from "./options";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_CORE_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_CORE_SUPABASE_ANON_KEY!,
    { cookieOptions: coreCookieOptions }
  );
}
