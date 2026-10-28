import Link from "next/link";
import { Package, ShieldCheck, Users } from "lucide-react-core";
import type { ElementType } from "react";
import { Header } from "@/core/components/layout/Header";
import { getCurrentUser } from "@/core/lib/auth/actions";
import type { UserRole } from "@/core/lib/db/schema";

export const metadata = { title: "Definições - ABIPTOM Core" };

interface SettingsSection {
  title: string;
  description: string;
  href: string;
  icon: ElementType;
  roles: UserRole[];
}

const SECTIONS: SettingsSection[] = [
  {
    title: "Catálogo de Serviços",
    description: "Gerir os serviços oferecidos pela ABIPTOM, preços e periodicidades.",
    href: "/admin/settings/services",
    icon: Package,
    roles: ["ca", "dg", "coord"],
  },
  {
    title: "Utilizadores",
    description: "Criar, editar e desactivar utilizadores do sistema.",
    href: "/admin/users",
    icon: Users,
    roles: ["ca", "dg"],
  },
  {
    title: "Auditoria de segurança",
    description: "Consultar acessos, bloqueios e operações sensíveis do sistema.",
    href: "/admin/settings/audit",
    icon: ShieldCheck,
    roles: ["ca"],
  },
];

export default async function SettingsPage() {
  const { dbUser } = await getCurrentUser();
  const role = dbUser?.role ?? "staff";
  const sections = SECTIONS.filter((section) => section.roles.includes(role));

  return (
    <>
      <Header title="Definições" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <p className="text-sm text-muted-foreground">
            Configurações gerais do sistema.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="rounded-lg border border-border p-5 hover:border-primary/40 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{s.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{s.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
