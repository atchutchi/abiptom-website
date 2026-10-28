import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { APP_NAME, APP_SLOGAN } from "@/core/lib/brand";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  showLogo?: boolean;
};

export function AuthShell({
  title,
  description,
  children,
  showLogo = true,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#12100b_0%,#2a2113_42%,#fff3c2_100%)] px-4 py-10">
      <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-[rgb(245_184_0_/_25%)] blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-6rem] h-80 w-80 rounded-full bg-white/20 blur-3xl" />
      <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-[rgb(245_184_0_/_25%)] bg-[#fffdf8] p-8 shadow-[0_30px_90px_rgb(18_16_11_/_24%)]">
        <div className="text-center">
          {showLogo ? (
            <Image
              src="/brand/abiptom-logo.png"
              alt={APP_NAME}
              width={180}
              height={48}
              className="mx-auto mb-3 h-11 w-auto"
              priority
            />
          ) : null}
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--brand-gold)]">
            {APP_NAME}
          </p>
          <p className="mt-1 text-[11px] text-[color:var(--brand-muted)]">
            {APP_SLOGAN}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[color:var(--brand-ink)]">
            {title}
          </h1>
          {description ? <p className="mt-2 text-sm text-[color:var(--brand-muted)]">{description}</p> : null}
        </div>
        {children}
        <div className="border-t border-[color:var(--brand-line)] pt-4 text-center text-sm"><Link href="/" prefetch={false} className="text-[color:var(--brand-muted)] underline-offset-4 hover:underline">Voltar ao site ABIPTOM</Link></div>
      </div>
    </div>
  );
}
