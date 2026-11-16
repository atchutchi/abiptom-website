import { Header } from "@/core/components/layout/Header";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { getDashboardStats } from "@/core/lib/dashboard/actions";
import { DashboardView } from "@/core/components/dashboard/DashboardView";

export const metadata = { title: "Painel - ABIPTOM Core" };

export default async function DashboardPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  const stats = await getDashboardStats();
  return <><Header title="Painel" /><DashboardView stats={stats} userName={dbUser.nomeCurto} /></>;
}
