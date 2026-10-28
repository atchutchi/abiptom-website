import { notFound } from "next/navigation";
import { getExpense, updateExpense } from "@/core/lib/expenses/actions";
import { dbAdmin } from "@/core/lib/db";
import { users } from "@/core/lib/db/schema";
import {
  EXPENSE_CATEGORY_LABEL,
  EXPENSE_STATE_LABEL,
  EXPENSE_STATE_COLOR,
} from "@/core/lib/expenses/labels";
import ExpenseForm from "@/core/components/forms/ExpenseForm";
import ExpenseActions from "@/core/components/forms/ExpenseActions";
import { Header } from "@/core/components/layout/Header";
import { formatCurrency, formatDate } from "@/core/lib/utils/format";
import { cn } from "@/core/lib/utils";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react-core";

export const metadata = { title: "Despesa - ABIPTOM Core" };

export default async function ExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expense = await getExpense(id);
  if (!expense) notFound();

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

  const action = updateExpense.bind(null, id);
  const readOnly = expense.estado === "anulada";

  return (
    <>
      <Header title="Despesa" />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <Link
              href="/admin/expenses"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" /> Despesas
            </Link>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{expense.descricao}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {EXPENSE_CATEGORY_LABEL[expense.categoria]} · {formatDate(expense.data)}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    EXPENSE_STATE_COLOR[expense.estado]
                  )}
                >
                  {EXPENSE_STATE_LABEL[expense.estado]}
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs uppercase text-muted-foreground">Valor</p>
              <p className="font-mono text-2xl font-semibold">
                {formatCurrency(expense.valorXof)}
              </p>
              {expense.moeda !== "XOF" && (
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(expense.valor, expense.moeda)} @ {expense.taxaCambio}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-border p-5">
            <h2 className="font-medium">Acções</h2>
            <ExpenseActions expense={expense} />
          </div>

          {!readOnly && (
            <div className="space-y-4 rounded-lg border border-border p-5">
              <h2 className="font-medium">Editar detalhes</h2>
              <ExpenseForm
                expense={expense}
                action={action}
                activeUsers={activeUsers}
                activeProjects={activeProjects}
                submitLabel="Actualizar"
              />
            </div>
          )}

          <div className="space-y-3 rounded-lg border border-border p-5">
            <h2 className="font-medium">Detalhes</h2>
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              {expense.fornecedor && (
                <>
                  <dt className="text-muted-foreground">Fornecedor</dt>
                  <dd>{expense.fornecedor}</dd>
                </>
              )}
              {expense.project && (
                <>
                  <dt className="text-muted-foreground">Projecto</dt>
                  <dd>{expense.project.titulo}</dd>
                </>
              )}
              {expense.referencia && (
                <>
                  <dt className="text-muted-foreground">Referência</dt>
                  <dd className="font-mono">{expense.referencia}</dd>
                </>
              )}
              {expense.metodoPagamento && (
                <>
                  <dt className="text-muted-foreground">Método</dt>
                  <dd>{expense.metodoPagamento}</dd>
                </>
              )}
              {expense.beneficiario && (
                <>
                  <dt className="text-muted-foreground">Beneficiário</dt>
                  <dd>
                    {expense.beneficiario.nomeCurto} · {expense.beneficiario.role}
                  </dd>
                </>
              )}
              {expense.dataPagamento && (
                <>
                  <dt className="text-muted-foreground">Data de pagamento</dt>
                  <dd>{formatDate(expense.dataPagamento)}</dd>
                </>
              )}
              {expense.notas && (
                <>
                  <dt className="text-muted-foreground sm:col-span-2">Notas</dt>
                  <dd className="whitespace-pre-wrap sm:col-span-2">{expense.notas}</dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </main>
    </>
  );
}
