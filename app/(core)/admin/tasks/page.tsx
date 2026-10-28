import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusSquare } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";
import { Button } from "@/core/components/ui/button";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { listAssignableUsers, listTasks } from "@/core/lib/tasks/actions";
import { formatDate } from "@/core/lib/utils/format";

export const metadata = { title: "Tarefas" };

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
  media: "bg-orange-100 text-orange-700",
  alta: "bg-red-100 text-red-700",
};

interface PageProps {
  searchParams: Promise<{
    estado?: string;
    prioridade?: string;
    atribuidaA?: string;
    q?: string;
  }>;
}

export default async function TasksPage({ searchParams }: PageProps) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (!["ca", "dg", "coord"].includes(dbUser.role)) {
    redirect("/admin/dashboard");
  }

  const sp = await searchParams;

  const tarefas = await listTasks({
    estado: sp.estado,
    prioridade: sp.prioridade,
    atribuidaA: sp.atribuidaA,
    q: sp.q,
  });
  const colaboradores = await listAssignableUsers();

  const abertas = tarefas.filter(
    (t) => !["aprovada", "concluida", "cancelada"].includes(t.estado)
  ).length;
  const atrasadas = tarefas.filter((t) => {
    if (!t.prazo) return false;
    return (
      t.prazo < new Date().toISOString().slice(0, 10) &&
      !["aprovada", "concluida", "cancelada"].includes(t.estado)
    );
  }).length;

  return (
    <>
      <Header title="Tarefas" />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">
                {tarefas.length} tarefa(s) · {abertas} em aberto · {atrasadas} em atraso
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/tasks/new" className="inline-flex items-center gap-2">
                <PlusSquare className="h-4 w-4" />
                Nova tarefa
              </Link>
            </Button>
          </div>

          <form className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-5">
            <input
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="Pesquisar por título"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 md:col-span-2"
            />
            <select
              name="estado"
              defaultValue={sp.estado ?? ""}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="">Todos estados</option>
              <option value="pendente">Pendente</option>
              <option value="em_curso">Em curso</option>
              <option value="submetida">Submetida</option>
              <option value="aprovada">Aprovada</option>
              <option value="precisa_correcao">Precisa correcção</option>
              <option value="rejeitada">Rejeitada</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
            <select
              name="prioridade"
              defaultValue={sp.prioridade ?? ""}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="">Todas prioridades</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            <select
              name="atribuidaA"
              defaultValue={sp.atribuidaA ?? ""}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
            >
              <option value="">Todos colaboradores</option>
              {colaboradores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nomeCurto}
                </option>
              ))}
            </select>
            <div className="md:col-span-5">
              <Button type="submit" variant="secondary" size="sm">
                Filtrar
              </Button>
            </div>
          </form>

          <section className="overflow-x-auto rounded-lg border bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Tarefa</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Atribuída a</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Contexto</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Prioridade</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Estado</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Prazo</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 w-20">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tarefas.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-gray-400">
                      Sem tarefas para os filtros selecionados.
                    </td>
                  </tr>
                )}
                {tarefas.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{t.titulo}</p>
                      <p className="text-xs text-gray-500">
                        Criada por {t.atribuidaPor?.nomeCurto ?? "-"}
                        {t.deliverable ? ` · ${t.deliverable.titulo}` : ""}
                        {" · "}Peso {Number(t.executionWeight).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{t.atribuidaA.nomeCurto}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {t.projecto?.titulo ?? t.cliente?.nome ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${PRIORITY_COLOR[t.prioridade]}`}>
                        {PRIORITY_LABEL[t.prioridade]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATE_COLOR[t.estado]}`}>
                        {STATE_LABEL[t.estado]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatDate(t.prazo)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/tasks/${t.id}`} className="text-blue-600 hover:underline">
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </>
  );
}
