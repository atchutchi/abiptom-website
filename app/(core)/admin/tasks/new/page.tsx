import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";
import TaskForm from "@/core/components/forms/TaskForm";
import { getCurrentUser } from "@/core/lib/auth/actions";
import {
  createTask,
  listAssignableUsers,
  listTaskClientOptions,
  listTaskProjectOptions,
} from "@/core/lib/tasks/actions";
import { listProjectDeliverablesForTaskOptions } from "@/core/lib/execution/actions";

export const metadata = { title: "Nova tarefa" };

export default async function NewTaskPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (!["ca", "dg", "coord"].includes(dbUser.role)) {
    redirect("/admin/dashboard");
  }

  const [users, projects, clients, deliverables] = await Promise.all([
    listAssignableUsers(),
    listTaskProjectOptions(),
    listTaskClientOptions(),
    listProjectDeliverablesForTaskOptions(),
  ]);

  return (
    <>
      <Header title="Nova tarefa" />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <Link
            href="/admin/tasks"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Tarefas
          </Link>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <TaskForm
              action={createTask}
              submitLabel="Criar tarefa"
              users={users}
              projects={projects}
              clients={clients}
              deliverables={deliverables}
            />
          </div>
        </div>
      </main>
    </>
  );
}
