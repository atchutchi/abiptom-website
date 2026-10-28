"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react-core";
import { createClient } from "@/core/lib/supabase/client";
import { Button } from "@/core/components/ui/button";
import { APP_NAME, APP_SLOGAN } from "@/core/lib/brand";
import { MessagesHeaderButton } from "@/core/components/messages/MessagesHeaderButton";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const homeHref = pathname?.startsWith("/staff")
    ? "/staff/me/dashboard"
    : "/admin/dashboard";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-16 border-b border-[rgb(245_184_0_/_30%)] bg-[linear-gradient(90deg,#fffdf8_0%,#fff8df_55%,#fff3c2_100%)] flex items-center justify-between px-6 shadow-[0_1px_0_rgb(245_184_0_/_12%)]">
      <div className="flex min-w-0 items-center gap-4">
        <Link href={homeHref} aria-label={APP_NAME} className="flex min-w-0 items-center gap-3">
          <Image
            src="/brand/abiptom-logo.png"
            alt={APP_NAME}
            width={126}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <div className="hidden lg:block min-w-0">
            <p className="truncate text-sm font-semibold text-[color:var(--brand-ink)]">
              {APP_NAME}
            </p>
            <p className="truncate text-[10px] uppercase tracking-[0.18em] text-[color:var(--brand-gold)]">
              {APP_SLOGAN}
            </p>
          </div>
        </Link>
        {title && <div className="hidden md:block h-8 w-px bg-[rgb(245_184_0_/_35%)]" />}
        {title && (
          <h1 className="truncate text-lg font-semibold tracking-tight text-[color:var(--brand-ink)]">{title}</h1>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <MessagesHeaderButton />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
          Sair
        </Button>
      </div>
    </header>
  );
}
