import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";
import StockItemForm from "@/core/components/forms/StockItemForm";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { createStockItem } from "@/core/lib/stock/actions";

export const metadata = { title: "Novo item de stock" };

export default async function NewStockItemPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (!["ca", "dg", "coord"].includes(dbUser.role)) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Novo item de stock" />

      <main className="space-y-6 p-6">
        <Link
          href="/admin/stock"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar ao stock
        </Link>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <StockItemForm action={createStockItem} />
        </div>
      </main>
    </div>
  );
}
