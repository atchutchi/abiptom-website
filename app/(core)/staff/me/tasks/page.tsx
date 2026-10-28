import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/core/components/layout/Header";
import TaskStateForm from "@/core/components/forms/TaskStateForm";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { listTasks, setTaskState } from "@/core/lib/tasks/actions";
import { formatDate } from "@/core/lib/utils/format";

export const metadata = { title: "Minhas tarefas" };

const STATE_LABEL: Record<string, string> = {
  pendente: "Pendente",
  em_curso: "Em curso",
  submetida: "Submetida",
  aprovada: "Aprovada",
  precisa_correcao: "Precisa correcção",
  rejeitada: "Rejeitada",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

const STATE_COLOR: Record<string, string> = {
  pendente: "bg-gray-100 text-gray-700",
  em_curso: "bg-blue-100 text-blue-700",
  submetida: "bg-amber-100 text-amber-800",
  aprovada: "bg-green-100 text-green-700",
  precisa_correcao: "bg-orange-100 text-orange-800",
  rejeitada: "bg-red-100 text-red-700",
  concluida: "bg-green-100 text-green-700",
  cancelada: "bg-red-100 text-red-700",
};

export default async function StaffTasksPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (dbUser.role !== "staff" && dbUser.role !== "coord") {
    redirect("/staff/me/dashboard");
  }

  const tarefas = await listTasks({ onlyMine: true });

  return (
    <>
      <Header title="Minhas tarefas" />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-5xl space-y-4">
          {tarefas.length === 0 && (
            <div className="rounded-lg border border-dashed bg-white p-8 text-center text-sm text-gray-500">
              Sem tarefas atribuídas neste momento.
            </div>
          )}

          {tarefas.map((t) => {
            const action = setTaskState.bind(null, t.id);

            return (
              <div key={t.id} className="grid gap-4 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-gray-900">{t.titulo}</p>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATE_COLOR[t.estado]}`}>
                      {STATE_LABEL[t.estado]}
                    </span>
                  </div>
                  {t.descricao && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{t.descricao}</p>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    Prazo: {formatDate(t.prazo)} · {t.projecto?.titulo ?? t.cliente?.nome ?? "Sem contexto"}
                  </div>
                  <div className="mt-2">
                    <Link href={`/staff/me/tasks/${t.id}`} className="text-xs text-blue-600 hover:underline">
                      Ver detalhe completo
                    </Link>
                  </div>
                </div>
                <TaskStateForm
                  action={action}
                  currentState={t.estado}
                  allowedStates={["pendente", "em_curso", "cancelada"]}
                />
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
