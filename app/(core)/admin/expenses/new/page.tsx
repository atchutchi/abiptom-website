import ExpenseForm from "@/core/components/forms/ExpenseForm";
import { createExpense } from "@/core/lib/expenses/actions";
import { dbAdmin } from "@/core/lib/db";
import { users } from "@/core/lib/db/schema";
import { Header } from "@/core/components/layout/Header";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react-core";

export const metadata = { title: "Nova Despesa - ABIPTOM Core" };

export default async function NewExpensePage() {
  const activeUsers = await dbAdmin.query.users.findMany({
    where: eq(users.activo, true),
    columns: {
      id: true,
      nomeCurto: true,
      role: true,
    },
    orderBy: (table, { asc }) => [asc(table.nomeCurto)],
  });

  const activeProjects = await dbAdmin.query.projects.findMany({
    columns: {
      id: true,
      titulo: true,
    },
    orderBy: (table, { asc }) => [asc(table.titulo)],
  });

  return (
    <>
      <Header title="Nova Despesa" />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <Link
              href="/admin/expenses"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> Despesas
            </Link>
            <h1 className="mt-2 text-2xl font-semibold">Nova Despesa</h1>
            <p className="text-sm text-muted-foreground">
              Registar uma despesa operacional, uma despesa directa de projecto ou um benefício directo a um colaborador.
            </p>
          </div>
          <ExpenseForm
            action={createExpense}
            activeUsers={activeUsers}
            activeProjects={activeProjects}
            submitLabel="Registar despesa"
          />
        </div>
      </main>
    </>
  );
}
