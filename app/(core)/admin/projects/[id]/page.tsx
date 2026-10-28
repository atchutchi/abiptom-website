import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { dbAdmin } from "@/core/lib/db";
import { users, clients, servicesCatalog } from "@/core/lib/db/schema";
import { eq } from "drizzle-orm";
import { Header } from "@/core/components/layout/Header";
import ProjectForm from "@/core/components/forms/ProjectForm";
import { getProject } from "@/core/lib/projects/actions";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { formatCurrency } from "@/core/lib/utils/format";

export const metadata = { title: "Projecto - ABIPTOM Core" };

const ESTADO_LABELS: Record<string, string> = {
  proposta: "Proposta",
  activo: "Activo",
  pausado: "Pausado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { user, dbUser } = await getCurrentUser();
  if (!user) redirect("/login");
  if (!dbUser || !["ca", "dg", "coord"].includes(dbUser.role)) {
    redirect("/admin/dashboard");
  }

  const project = await getProject(id);
  if (!project) notFound();

  const [allClients, allUsers, allServices] = await Promise.all([
    dbAdmin.query.clients.findMany({ where: eq(clients.activo, true), orderBy: (c, { asc }) => [asc(c.nome)] }),
    dbAdmin.query.users.findMany({ where: eq(users.activo, true), orderBy: (u, { asc }) => [asc(u.nomeCurto)] }),
    dbAdmin.query.servicesCatalog.findMany({ where: eq(servicesCatalog.activo, true), orderBy: (s, { asc }) => [asc(s.nome)] }),
  ]);

  const assistantIds = project.assistants.map((a) => a.userId);

  return (
    <>
      <Header title={project.titulo} />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Summary badges */}
          <div className="flex gap-3 items-center">
            <span className="text-sm font-medium text-gray-500">Estado:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {ESTADO_LABELS[project.estado]}
            </span>
            {project.pontoFocal && (
              <>
                <span className="text-sm font-medium text-gray-500">PF:</span>
                <span className="text-sm">{project.pontoFocal.nomeCurto}</span>
              </>
            )}
            {project.assistants.length > 0 && (
              <>
                <span className="text-sm font-medium text-gray-500">Aux:</span>
                <span className="text-sm">
                  {project.assistants.map((a) => a.user.nomeCurto).join(", ")}
                </span>
              </>
            )}
            <Link
              href={`/admin/projects/${project.id}/execution`}
              className="ml-auto rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Execução validada
            </Link>
          </div>

          {/* Invoices linked to this project */}
          {project.invoices && project.invoices.length > 0 && (
            <div className="rounded-lg border bg-white p-4">
              <h3 className="text-sm font-semibold mb-3">Facturas associadas</h3>
              <ul className="space-y-1">
                {project.invoices.map((inv) => (
                  <li key={inv.id} className="flex justify-between text-sm">
                    <Link
                      href={`/admin/invoices/${inv.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {inv.numero ? `Nº ${String(inv.numero).padStart(5, "0")}` : "Rascunho"}
                    </Link>
                    <span className="text-gray-500">
                      {formatCurrency(inv.total, inv.moeda)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Edit form */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="text-sm font-semibold mb-4">Editar projecto</h3>
            <ProjectForm
              clients={allClients}
              staffUsers={allUsers}
              services={allServices}
              project={project}
              assistantIds={assistantIds}
            />
          </div>
        </div>
      </main>
    </>
  );
}
