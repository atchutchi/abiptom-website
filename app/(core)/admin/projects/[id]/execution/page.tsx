import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ClipboardCheck } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";
import { DeliverableForm } from "@/core/components/forms/DeliverableForm";
import { Button } from "@/core/components/ui/button";
import {
  createDeliverable,
  getProjectExecution,
  updateDeliverable,
  type ProjectExecutionSummary,
} from "@/core/lib/execution/actions";
import { getCurrentUser } from "@/core/lib/auth/actions";
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

export default async function ProjectExecutionPage({ params }: PageProps) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (!["ca", "dg", "coord"].includes(dbUser.role)) redirect("/admin/dashboard");

  const { id } = await params;
  const data = await getProjectExecution(id);
  if (!data) notFound();

  const createAction = createDeliverable.bind(null, id);

  return (
    <>
      <Header title="Execução do projecto" />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link
                href={`/admin/projects/${id}`}
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Projecto
              </Link>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">{data.project.titulo}</h1>
              <p className="text-sm text-gray-500">
                {data.project.client?.nome ?? "Sem cliente"} · PF{" "}
                {data.project.pontoFocal?.nomeCurto ?? "-"}
              </p>
            </div>
            <Button asChild>
              <Link href={`/admin/tasks/new`}>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Nova tarefa
              </Link>
            </Button>
          </div>

          <SummaryCards summary={data.summary} />

          <section className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-900">Novo entregável</h2>
              <p className="text-sm text-gray-500">
                O progresso é calculado pelo peso das tarefas aprovadas dentro dos entregáveis.
              </p>
            </div>
            <DeliverableForm action={createAction} submitLabel="Criar entregável" />
          </section>

          <section className="space-y-4">
            {data.project.deliverables.length === 0 && (
              <div className="rounded-lg border border-dashed bg-white p-8 text-center text-sm text-gray-500">
                Ainda não existem entregáveis neste projecto.
              </div>
            )}

            {data.project.deliverables.map((deliverable) => {
              const updateAction = updateDeliverable.bind(null, deliverable.id);
              const summary = data.byDeliverable.get(deliverable.id) ?? emptySummary();
              const deliverableTasks = data.project.tasks.filter(
                (task) => task.deliverableId === deliverable.id
              );

              return (
                <article key={deliverable.id} className="rounded-lg border bg-white shadow-sm">
                  <div className="border-b bg-gray-50 px-5 py-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h2 className="font-semibold text-gray-900">{deliverable.titulo}</h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Peso planeado {Number(deliverable.peso).toFixed(2)} · Prazo{" "}
                          {formatDate(deliverable.prazo)}
                        </p>
                      </div>
                      <ProgressPill summary={summary} />
                    </div>
                  </div>
                  <div className="space-y-5 p-5">
                    <DeliverableForm
                      action={updateAction}
                      submitLabel="Actualizar"
                      deliverable={deliverable}
                      compact
                    />

                    <TaskTable tasks={deliverableTasks} />
                  </div>
                </article>
              );
            })}

            {data.project.tasks.some((task) => !task.deliverableId) && (
              <article className="rounded-lg border bg-white shadow-sm">
                <div className="border-b bg-gray-50 px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="font-semibold text-gray-900">Tarefas sem entregável</h2>
                    <ProgressPill summary={data.unassignedSummary} />
                  </div>
                </div>
                <div className="p-5">
                  <TaskTable tasks={data.project.tasks.filter((task) => !task.deliverableId)} />
                </div>
              </article>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function SummaryCards({ summary }: { summary: ProjectExecutionSummary }) {
  const cards = [
    { label: "Execução validada", value: `${summary.executionPercent.toFixed(2)}%` },
    { label: "Peso aprovado", value: `${summary.approvedWeight.toFixed(2)} / ${summary.plannedWeight.toFixed(2)}` },
    { label: "Tarefas aprovadas", value: String(summary.approvedTasks) },
    { label: "Pendentes validação", value: String(summary.pendingValidationTasks) },
    { label: "Em correcção/rejeitadas", value: String(summary.rejectedTasks) },
    { label: "Em atraso", value: String(summary.overdueTasks) },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {card.label}
          </p>
          <p className="mt-1 text-xl font-bold tabular-nums text-gray-900">{card.value}</p>
        </div>
      ))}
    </section>
  );
}

function ProgressPill({ summary }: { summary: ProjectExecutionSummary }) {
  return (
    <div className="min-w-[220px]">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{summary.executionPercent.toFixed(2)}%</span>
        <span>
          {summary.approvedWeight.toFixed(2)} / {summary.plannedWeight.toFixed(2)}
        </span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-green-600"
          style={{ width: `${Math.min(summary.executionPercent, 100)}%` }}
        />
      </div>
    </div>
  );
}

function TaskTable({
  tasks,
}: {
  tasks: Array<{
    id: string;
    titulo: string;
    estado: string;
    executionWeight: string;
    prazo: string | null;
    atribuidaA: { nomeCurto: string } | null;
    submittedAt: Date | null;
    qualityScore: number | null;
  }>;
}) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-gray-50 p-5 text-center text-sm text-gray-500">
        Sem tarefas neste entregável.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[820px] text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Tarefa</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Responsável</th>
            <th className="px-4 py-2 text-right font-medium text-gray-600">Peso</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Estado</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Prazo</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Qualidade</th>
            <th className="px-4 py-2 text-right font-medium text-gray-600">Acções</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="px-4 py-3 font-medium text-gray-900">{task.titulo}</td>
              <td className="px-4 py-3 text-gray-600">{task.atribuidaA?.nomeCurto ?? "-"}</td>
              <td className="px-4 py-3 text-right tabular-nums">
                {Number(task.executionWeight).toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATE_COLOR[task.estado]}`}>
                  {STATE_LABEL[task.estado] ?? task.estado}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{formatDate(task.prazo)}</td>
              <td className="px-4 py-3 text-gray-600">
                {task.qualityScore ? `${task.qualityScore}/5` : "-"}
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/admin/tasks/${task.id}`} className="text-blue-600 hover:underline">
                  Validar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function emptySummary(): ProjectExecutionSummary {
  return {
    plannedWeight: 0,
    approvedWeight: 0,
    executionPercent: 0,
    assignedTasks: 0,
    submittedTasks: 0,
    approvedTasks: 0,
    rejectedTasks: 0,
    pendingValidationTasks: 0,
    overdueTasks: 0,
  };
}
