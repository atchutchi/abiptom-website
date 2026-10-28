import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";
import TaskStateForm from "@/core/components/forms/TaskStateForm";
import { TaskSubmissionForm } from "@/core/components/forms/TaskSubmissionForm";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { submitTaskCompletion } from "@/core/lib/execution/actions";
import { getTask, setTaskState } from "@/core/lib/tasks/actions";
import { formatDate } from "@/core/lib/utils/format";

export const metadata = { title: "Detalhe da tarefa" };

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

const PRIORITY_LABEL: Record<string, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const PRIORITY_COLOR: Record<string, string> = {
  baixa: "bg-gray-100 text-gray-700",
  media: "bg-yellow-100 text-yellow-700",
  alta: "bg-red-100 text-red-700",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StaffTaskDetailPage({ params }: PageProps) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (dbUser.role !== "staff" && dbUser.role !== "coord") {
    redirect("/staff/me/dashboard");
  }

  const { id } = await params;

  let task;
  try {
    task = await getTask(id);
  } catch {
    notFound();
  }

  if (!task) notFound();
  if (task.atribuidaA.id !== dbUser.id) notFound();

  const stateAction = setTaskState.bind(null, task.id);
  const submissionAction = submitTaskCompletion.bind(null, task.id);
  const canSubmit = !["submetida", "aprovada", "concluida", "cancelada"].includes(task.estado);

  return (
    <>
      <Header title="Detalhe da tarefa" />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <Link
            href="/staff/me/tasks"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Minhas tarefas
          </Link>

          <div className="grid gap-4 lg:grid-cols-3">
            <section className="rounded-lg border bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex flex-wrap items-start gap-2">
                <h1 className="min-w-0 flex-1 text-xl font-semibold text-gray-900">
                  {task.titulo}
                </h1>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATE_COLOR[task.estado]}`}>
                  {STATE_LABEL[task.estado]}
                </span>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${PRIORITY_COLOR[task.prioridade]}`}>
                  {PRIORITY_LABEL[task.prioridade]}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Descrição
                </p>
                <div className="mt-2 whitespace-pre-wrap rounded-lg border bg-gray-50 p-4 text-sm leading-6 text-gray-800">
                  {task.descricao || "Sem descrição detalhada."}
                </div>
              </div>

              <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2">
                <InfoItem label="Prazo" value={formatDate(task.prazo)} />
                <InfoItem label="Estado" value={STATE_LABEL[task.estado]} />
                <InfoItem label="Prioridade" value={PRIORITY_LABEL[task.prioridade]} />
                <InfoItem label="Atribuída a" value={task.atribuidaA.nomeCurto} />
                <InfoItem label="Criada por" value={task.atribuidaPor?.nomeCurto ?? "-"} />
                <InfoItem label="Criada em" value={formatDateTime(task.createdAt)} />
                <InfoItem label="Actualizada em" value={formatDateTime(task.updatedAt)} />
                <InfoItem label="Concluída em" value={formatDateTime(task.concluidaEm)} />
              </dl>
            </section>

            <aside className="space-y-4">
              <TaskStateForm
                action={stateAction}
                currentState={task.estado}
                allowedStates={["pendente", "em_curso", "cancelada"]}
              />
              <TaskSubmissionForm action={submissionAction} disabled={!canSubmit} />

              <section className="rounded-lg border bg-white p-4 text-sm shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Contexto
                </p>
                <dl className="mt-3 space-y-3">
                  <CompactItem label="Projecto" value={task.projecto?.titulo ?? "Sem projecto"} />
                  <CompactItem label="Cliente" value={task.cliente?.nome ?? "Sem cliente"} />
                  <CompactItem label="Entregável" value={task.deliverable?.titulo ?? "Sem entregável"} />
                  <CompactItem label="Peso" value={Number(task.executionWeight).toFixed(2)} />
                  <CompactItem label="Qualidade" value={task.qualityScore ? `${task.qualityScore}/5` : "-"} />
                </dl>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 break-words font-medium text-gray-900">{value}</dd>
    </div>
  );
}

function CompactItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-gray-900">{value}</dd>
    </div>
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
