import { redirect } from "next/navigation";
import { eq, inArray, or } from "drizzle-orm";
import { Header } from "@/core/components/layout/Header";
import { withAuthenticatedDb } from "@/core/lib/db";
import { projectAssistants, projects } from "@/core/lib/db/schema";
import { formatCurrency, formatDate } from "@/core/lib/utils/format";
import { getCurrentUser } from "@/core/lib/auth/actions";

export const metadata = { title: "Meus projectos - ABIPTOM Core" };

const STATE_LABELS: Record<string, string> = {
  proposta: "Proposta",
  activo: "Activo",
  pausado: "Pausado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const STATE_COLOR: Record<string, string> = {
  proposta: "bg-gray-100 text-gray-700",
  activo: "bg-green-100 text-green-700",
  pausado: "bg-orange-100 text-orange-700",
  concluido: "bg-blue-100 text-blue-700",
  cancelado: "bg-red-100 text-red-700",
};

export default async function StaffProjectsPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user) redirect("/login");
  if (!dbUser) redirect("/login");

  const { ownProjects } = await withAuthenticatedDb(user, async (db) => {
    const assistantRows = await db
      .select({ projectId: projectAssistants.projectId })
      .from(projectAssistants)
      .where(eq(projectAssistants.userId, dbUser.id));

    const assistantProjectIds = assistantRows.map((row) => row.projectId);
    const where =
      assistantProjectIds.length > 0
        ? or(
            eq(projects.pontoFocalId, dbUser.id),
            inArray(projects.id, assistantProjectIds)
          )
        : eq(projects.pontoFocalId, dbUser.id);

    const ownProjects = await db.query.projects.findMany({
      where,
      with: {
        client: {
          columns: {
            id: true,
            nome: true,
          },
        },
        servico: {
          columns: {
            id: true,
            nome: true,
          },
        },
        assistants: {
          with: {
            user: {
              columns: {
                id: true,
                nomeCurto: true,
              },
            },
          },
        },
      },
      orderBy: (project, { desc, asc }) => [
        desc(project.dataInicio),
        asc(project.titulo),
      ],
    });

    return { ownProjects };
  });
  if (dbUser.role !== "staff" && dbUser.role !== "coord") {
    redirect("/staff/me/dashboard");
  }

  const activeProjects = ownProjects.filter((project) => project.estado === "activo").length;
  const totalPipeline = ownProjects.reduce(
    (sum, project) => sum + Number(project.valorPrevisto ?? 0),
    0
  );

  return (
    <>
      <Header title="Meus projectos" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <KpiCard label="Projectos atribuídos" value={String(ownProjects.length)} />
            <KpiCard label="Activos" value={String(activeProjects)} />
            <KpiCard label="Pipeline previsto" value={formatCurrency(totalPipeline)} />
          </div>

          <section className="overflow-x-auto rounded-lg border bg-white shadow-sm">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Projecto</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Cliente</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Serviço</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Papel</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Estado</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Início</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Valor</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Equipa</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ownProjects.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-gray-400">
                      Sem projectos atribuídos neste momento.
                    </td>
                  </tr>
                )}
                {ownProjects.map((project) => {
                  const isPf = project.pontoFocalId === dbUser.id;
                  const assistants = project.assistants
                    .map((assistant) => assistant.user?.nomeCurto)
                    .filter(Boolean);

                  return (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{project.titulo}</p>
                        {project.notas && (
                          <p className="mt-1 max-w-md truncate text-xs text-gray-500">
                            {project.notas}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {project.client?.nome ?? "Cliente removido"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{project.servico?.nome ?? "-"}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {isPf ? "Ponto focal" : "Auxiliar"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATE_COLOR[project.estado]}`}
                        >
                          {STATE_LABELS[project.estado] ?? project.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(project.dataInicio)}</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-gray-900">
                        {formatCurrency(project.valorPrevisto)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {assistants.length > 0 ? assistants.join(", ") : "Sem auxiliares"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <div className="text-right text-xs text-gray-500">
            Para gestão completa, abre o módulo administrativo de projectos.
          </div>
        </div>
      </main>
    </>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-gray-900 tabular-nums">{value}</p>
    </div>
  );
}
