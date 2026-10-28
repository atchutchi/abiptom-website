"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  DollarSign,
  Receipt,
  ClipboardList,
  BarChart3,
  Settings,
  IdCard,
  Package,
  CheckSquare,
  Wallet,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react-core";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { cn } from "@/core/lib/utils";
import type { UserRole } from "@/core/lib/db/schema";
import { getDefaultRoute } from "@/core/lib/auth/rbac";
import { getUserInitials } from "@/core/lib/users/avatar";
import { APP_NAME, APP_SHORT_NAME, APP_SLOGAN } from "@/core/lib/brand";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Painel",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["ca", "dg", "coord"],
  },
  {
    label: "Utilizadores",
    href: "/admin/users",
    icon: Users,
    roles: ["ca", "dg"],
  },
  {
    label: "Clientes",
    href: "/admin/clients",
    icon: Briefcase,
    roles: ["ca", "dg", "coord"],
  },
  {
    label: "Facturas",
    href: "/admin/invoices",
    icon: FileText,
    roles: ["ca", "dg", "coord"],
  },
  {
    label: "Projectos",
    href: "/admin/projects",
    icon: ClipboardList,
    roles: ["ca", "dg", "coord"],
  },
  {
    label: "Folha Salarial",
    href: "/admin/salary",
    icon: DollarSign,
    roles: ["ca", "dg"],
  },
  {
    label: "RH / Contratos",
    href: "/admin/hr/contracts",
    icon: IdCard,
    roles: ["ca", "dg"],
  },
  {
    label: "Despesas",
    href: "/admin/expenses",
    icon: Receipt,
    roles: ["ca", "dg", "coord"],
  },
  {
    label: "Stock",
    href: "/admin/stock",
    icon: Package,
    roles: ["ca", "dg", "coord"],
  },
  {
    label: "Tarefas",
    href: "/admin/tasks",
    icon: CheckSquare,
    roles: ["ca", "dg", "coord"],
  },
  {
    label: "Chat",
    href: "/admin/messages",
    icon: MessageSquare,
    roles: ["ca", "dg", "coord"],
  },
  {
    label: "Dividendos",
    href: "/admin/dividends",
    icon: DollarSign,
    roles: ["ca"],
  },
  {
    label: "Relatórios",
    href: "/admin/reports",
    icon: BarChart3,
    roles: ["ca", "dg"],
  },
  {
    label: "Definições",
    href: "/admin/settings",
    icon: Settings,
    roles: ["ca", "dg", "coord"],
  },
];

const STAFF_NAV_ITEMS: NavItem[] = [
  {
    label: "O meu painel",
    href: "/staff/me/dashboard",
    icon: LayoutDashboard,
    roles: ["staff", "coord"],
  },
  {
    label: "Meus projectos",
    href: "/staff/me/projects",
    icon: ClipboardList,
    roles: ["staff", "coord"],
  },
  {
    label: "Histórico salarial",
    href: "/staff/me/salary-history",
    icon: Wallet,
    roles: ["staff", "coord"],
  },
  {
    label: "Minhas tarefas",
    href: "/staff/me/tasks",
    icon: CheckSquare,
    roles: ["staff", "coord"],
  },
  {
    label: "Chat",
    href: "/staff/me/messages",
    icon: MessageSquare,
    roles: ["staff", "coord"],
  },
];

interface SidebarProps {
  role: UserRole;
  userName: string;
  userAvatarUrl?: string | null;
}

const SIDEBAR_COLLAPSED_KEY = "abiptom_sidebar_collapsed";

export function Sidebar({ role, userName, userAvatarUrl }: SidebarProps) {
  const pathname = usePathname();
  const isStaffSurface = role === "staff";
  const [collapsed, setCollapsed] = useState(false);

  const items = isStaffSurface
    ? STAFF_NAV_ITEMS.filter((item) => item.roles.includes(role))
    : NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) =>
        resolveAdminNavItem(role, item)
      );
  const homeHref = getDefaultRoute(role);
  const footerHref = isStaffSurface ? "/staff/me/profile" : "/admin/profile";
  const initials = getUserInitials(userName);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored === "1") {
      setCollapsed(true);
      return;
    }

    if (stored === null && window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }, []);

  function toggleSidebar() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <aside
      className={cn(
        "flex min-h-screen flex-col border-r border-[rgb(245_184_0_/_20%)] bg-[linear-gradient(180deg,#12100b_0%,#1d170f_56%,#0d0b08_100%)] text-[#fff8df] shadow-[8px_0_30px_rgb(18_16_11_/_10%)] transition-[width] duration-200",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "border-b border-[rgb(245_184_0_/_20%)]",
          collapsed ? "flex h-16 items-center px-3" : "flex h-20 items-center px-4"
        )}
      >
        <Link
          href={homeHref}
          prefetch={false}
          className={cn(
            "min-w-0 text-[#fff8df]",
            collapsed ? "inline-flex items-center" : "inline-flex items-center px-2"
          )}
          title={APP_NAME}
        >
          {!collapsed && (
            <div className="flex min-w-0 items-center gap-3">
              <Image
                src="/brand/abiptom-logo.png"
                alt={APP_NAME}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full bg-[#fff8df] object-contain p-0.5 ring-1 ring-[rgb(245_184_0_/_40%)]"
                priority
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#fff8df]">
                  {APP_NAME}
                </p>
                <p className="truncate text-[10px] uppercase tracking-[0.14em] text-[color:var(--brand-gold)]">
                  {APP_SLOGAN}
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <Image
              src="/brand/abiptom-logo.png"
              alt={APP_NAME}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full bg-[#fff8df] object-contain p-0.5 ring-1 ring-[rgb(245_184_0_/_40%)]"
              priority
            />
          )}
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          className="ml-auto rounded-md p-2 text-[#fff3c2] transition-colors hover:bg-[rgb(245_184_0_/_15%)] hover:text-[color:var(--brand-gold)]"
          aria-label={collapsed ? "Expandir sidebar" : "Minimizar sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className={cn("space-y-0.5", collapsed ? "px-2" : "px-3")}>
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                item.href !== "/staff/me/dashboard" &&
                (pathname?.startsWith(item.href) ?? false));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={false}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center rounded-lg py-2 text-sm transition-colors",
                    collapsed ? "justify-center px-2" : "gap-3 px-3",
                    active
                      ? "bg-[color:var(--brand-gold)] text-[color:var(--brand-ink)] shadow-[inset_3px_0_0_#fff8df]"
                      : "text-[rgb(247_236_203_/_80%)] hover:bg-[rgb(245_184_0_/_12%)] hover:text-[#fff8df]"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  {collapsed ? <span className="sr-only">{item.label}</span> : item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div
        className={cn(
          "border-t border-[rgb(245_184_0_/_20%)] pb-4 pt-3",
          collapsed ? "px-2" : "px-3"
        )}
      >
        <Link
          href={footerHref}
          prefetch={false}
          title={collapsed ? `${userName} (${role.toUpperCase()})` : undefined}
          className={cn(
            "flex items-center rounded-lg py-2 text-sm text-[rgb(247_236_203_/_80%)] transition-colors hover:bg-[rgb(245_184_0_/_12%)] hover:text-[#fff8df]",
            collapsed ? "justify-center px-2" : "gap-3 px-3"
          )}
        >
          <Avatar size="sm" className="h-8 w-8">
            {userAvatarUrl ? (
              <AvatarImage src={userAvatarUrl} alt={userName} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {collapsed ? (
            <span className="sr-only">{userName}</span>
          ) : (
            <div className="min-w-0">
              <p className="truncate font-medium text-[#fff8df]">{userName}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--brand-gold)]">
                {role} · {APP_SHORT_NAME}
              </p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}

function resolveAdminNavItem(role: UserRole, item: NavItem): NavItem {
  if (role !== "coord") return item;

  if (item.href === "/admin/dashboard") {
    return { ...item, href: "/staff/me/dashboard" };
  }

  if (item.href === "/admin/settings") {
    return { ...item, label: "Serviços", href: "/admin/settings/services" };
  }

  return item;
}
