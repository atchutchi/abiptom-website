import Link from "next/link";
import { ArrowLeft } from "lucide-react-core";
import { redirect } from "next/navigation";
import { dbAdmin } from "@/core/lib/db";
import { partnerShares, users } from "@/core/lib/db/schema";
import { eq, and, or, isNull, gte } from "drizzle-orm";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { createDividendPeriod } from "@/core/lib/dividends/actions";
import DividendPeriodForm from "@/core/components/forms/DividendPeriodForm";
import { Header } from "@/core/components/layout/Header";

export const metadata = { title: "Novo período de dividendos" };

export default async function NewDividendPeriodPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (!["ca", "dg"].includes(dbUser.role)) redirect("/admin/dashboard");

  const today = new Date().toISOString().split("T")[0];

  const rows = await dbAdmin
    .select({
      userId: partnerShares.userId,
      nomeCurto: users.nomeCurto,
      percentagemQuota: partnerShares.percentagemQuota,
    })
    .from(partnerShares)
    .innerJoin(users, eq(partnerShares.userId, users.id))
    .where(
      and(
        or(
          isNull(partnerShares.dataFim),
          gte(partnerShares.dataFim, today)
        )
      )
    );

  return (
    <>
      <Header title="Novo período de dividendos" />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <Link
              href="/admin/dividends"
              className="mb-3 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dividendos
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Novo período de dividendos
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              As linhas serão calculadas automaticamente a partir das quotas
              activas.
            </p>
          </div>

          <DividendPeriodForm
            action={createDividendPeriod}
            activeShares={rows}
          />
        </div>
      </main>
    </>
  );
}
