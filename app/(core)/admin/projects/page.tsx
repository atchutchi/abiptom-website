import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";
import { Button } from "@/core/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { listProjects } from "@/core/lib/projects/actions";
import { getCurrentUser } from "@/core/lib/auth/actions";
import type { ProjectScope } from "@/core/lib/projects/archive";

export const metadata = { title: "Projectos - ABIPTOM Core" };

const ESTADO_LABELS: Record<string, string> = {
  proposta: "Proposta",
  activo: "Activo",
  pausado: "Pausado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const ESTADO_COLORS: Record<string, string> = {
  proposta: "bg-yellow-100 text-yellow-800",
  activo: "bg-green-100 text-green-800",
  pausado: "bg-orange-100 text-orange-800",
  concluido: "bg-blue-100 text-blue-800",
  cancelado: "bg-gray-100 text-gray-600",
};

const SCOPES: Array<{ value: ProjectScope; label: string }> = [
  { value: "activos", label: "Activos" },
  { value: "pausados", label: "Pausados" },
  { value: "arquivados", label: "Arquivados" },
  { value: "todos", label: "Todos" },
];

function fmt(val: string | null) {
  if (!val) return "Sem valor";
  return Number(val).toLocaleString("pt-PT");
}

function normalizeScope(scope?: string): ProjectScope {
  return SCOPES.some((item) => item.value === scope)
    ? (scope as ProjectScope)
    : "activos";
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string; q?: string }>;
}) {
  const { user, dbUser } = await getCurrentUser();
  if (!user) redirect("/login");

  if (!dbUser || !["ca", "dg", "coord"].includes(dbUser.role)) {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;
  const scope = normalizeScope(params.scope);
  const allProjects = await listProjects({ scope, search: params.q });

  return (
    <>
      <Header title="Projectos" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              {allProjects.length} projecto(s)
            </p>
            <Link href="/admin/projects/new">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Novo projecto
              </Button>
            </Link>
          </div>

          <form className="flex flex-wrap items-end gap-2 rounded-lg border bg-white p-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Vista</label>
              <select
                name="scope"
                defaultValue={scope}
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
              >
                {SCOPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Pesquisa</label>
              <input
                name="q"
                defaultValue={params.q ?? ""}
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
                placeholder="Título do projecto"
              />
            </div>
            <Button type="submit" size="sm" variant="secondary">
              Aplicar
            </Button>
            {(params.scope || params.q) && (
              <Link
                href="/admin/projects"
                className="pb-2 text-xs text-gray-500 hover:underline"
              >
                Limpar
              </Link>
            )}
          </form>

          <div className="overflow-hidden rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Ponto Focal</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead className="text-right">Valor previsto</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {allProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-gray-400">
                      Nenhum projecto encontrado nesta vista.
                    </TableCell>
                  </TableRow>
                )}
                {allProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.titulo}</TableCell>
                    <TableCell className="text-gray-600">
                      {project.client.nome}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {project.pontoFocal?.nomeCurto ?? "Sem PF"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${ESTADO_COLORS[project.estado]}`}
                      >
                        {ESTADO_LABELS[project.estado]}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {project.dataInicio}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {project.valorPrevisto
                        ? `${fmt(project.valorPrevisto)} ${project.moeda}`
                        : "Sem valor"}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Ver
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </>
  );
}
