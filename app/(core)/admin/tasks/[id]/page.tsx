import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";
import TaskForm from "@/core/components/forms/TaskForm";
import TaskStateForm from "@/core/components/forms/TaskStateForm";
import { TaskValidationForm } from "@/core/components/forms/TaskValidationForm";
import { getCurrentUser } from "@/core/lib/auth/actions";
import {
  listProjectDeliverablesForTaskOptions,
  validateTaskSubmission,
} from "@/core/lib/execution/actions";
import {
  getTask,
  listAssignableUsers,
  listTaskClientOptions,
  listTaskProjectOptions,
  setTaskState,
  updateTask,
} from "@/core/lib/tasks/actions";
import { formatDate } from "@/core/lib/utils/format";

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");

  const { id } = await params;

  let task;
  try {
    task = await getTask(id);
  } catch {
    redirect("/admin/tasks");
  }

  if (!task) notFound();

  const canManage = ["ca", "dg", "coord"].includes(dbUser.role);
  if (!canManage) {
    redirect("/admin/dashboard");
  }

  const [users, projects, clients, deliverables] = await Promise.all([
    listAssignableUsers(),
    listTaskProjectOptions(),
    listTaskClientOptions(),
    listProjectDeliverablesForTaskOptions(),
  ]);

  const updateAction = updateTask.bind(null, task.id);
  const stateAction = setTaskState.bind(null, task.id);
  const validationAction = validateTaskSubmission.bind(null, task.id);
  const latestSubmission = task.submissions[0] ?? null;
  const latestValidation = task.validations[0] ?? null;

  return (
    <>
      <Header title={task.titulo} />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <Link
            href="/admin/tasks"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Tarefas
          </Link>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border bg-white p-4 shadow-sm lg:col-span-2">
              <h2 className="text-sm font-semibold text-gray-900">Editar tarefa</h2>
              <div className="mt-4">
                <TaskForm
                  action={updateAction}
                  submitLabel="Actualizar"
                  task={task}
                  users={users}
                  projects={projects}
                  clients={clients}
                  deliverables={deliverables}
                />
              </div>
            </div>

            <div className="space-y-4">
              <TaskStateForm action={stateAction} currentState={task.estado} />
              <TaskValidationForm
                action={validationAction}
                disabled={task.estado !== "submetida"}
              />

              <div className="rounded-lg border bg-white p-4 text-sm shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-500">Resumo</p>
                <dl className="mt-3 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Estado</dt>
                    <dd>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATE_COLOR[task.estado]}`}>
                        {STATE_LABEL[task.estado]}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Prazo</dt>
                    <dd className="font-medium text-gray-900">{formatDate(task.prazo)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Atribuída a</dt>
                    <dd className="font-medium text-gray-900">{task.atribuidaA.nomeCurto}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Entregável</dt>
                    <dd className="text-right font-medium text-gray-900">
                      {task.deliverable?.titulo ?? "-"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Peso execução</dt>
                    <dd className="font-medium text-gray-900">{Number(task.executionWeight).toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Criada por</dt>
                    <dd className="font-medium text-gray-900">{task.atribuidaPor?.nomeCurto ?? "-"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Submissão</dt>
                    <dd className="text-right font-medium text-gray-900">
                      {latestSubmission
                        ? `${latestSubmission.submittedByUser.nomeCurto} · ${formatDateTime(latestSubmission.createdAt)}`
                        : "-"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Validação</dt>
                    <dd className="text-right font-medium text-gray-900">
                      {latestValidation
                        ? `${STATE_LABEL[latestValidation.decision]} · ${latestValidation.validatedByUser.nomeCurto}`
                        : "-"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function formatDateTime(value: Date | string | null): string {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
