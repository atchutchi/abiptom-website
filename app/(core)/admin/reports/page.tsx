import { Header } from "@/core/components/layout/Header";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { getMonthlyProfitLoss, getQuarterlyProfitLoss } from "@/core/lib/reports/actions";
import { ReportsView } from "@/core/components/reports/ReportsView";
export const metadata = { title: "Relatórios" };
interface PageProps { searchParams: Promise<{ ano?: string; mes?: string; periodo?: string; trimestre?: string }> }
export default async function ReportsPage({ searchParams }: PageProps) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (!["ca", "dg"].includes(dbUser.role)) redirect("/admin/dashboard");
  const sp = await searchParams;
  const now = new Date();
  const periodo = sp.periodo === "trimestral" ? "trimestral" : "mensal";
  const ano = Number(sp.ano) || now.getFullYear();
  const mes = Number(sp.mes) || now.getMonth() + 1;
  const trimestre = Number(sp.trimestre) || Math.ceil((now.getMonth() + 1) / 3);
  const report = periodo === "trimestral" ? await getQuarterlyProfitLoss(ano, trimestre) : await getMonthlyProfitLoss(ano, mes);
  return <><Header title="Relatórios" /><ReportsView report={report} ano={ano} mes={mes} trimestre={trimestre} periodo={periodo} /></>;
}
