"use server";

import { z } from "zod-core";
import { and, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { dbAdmin } from "@/core/lib/db";
import {
  projects,
  projectAssistants,
  type ProjectState,
} from "@/core/lib/db/schema";
import { getCurrentUser } from "@/core/lib/auth/actions";
import {
  authorizeOperation,
  isOperationAllowed,
} from "@/core/lib/auth/authorization";
import { insertAuditLog } from "@/core/lib/db/audit";
import { toCurrencyStorageString } from "@/core/lib/utils/money";
import {
  getProjectArchiveUpdates,
  getProjectStatesForScope,
  type ProjectScope,
} from "@/core/lib/projects/archive";

const projectSchema = z.object({
  clientId: z.string().uuid("Cliente inválido"),
  servicoId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal(""))
    .transform((value) => value || null),
  titulo: z.string().min(2, "Título obrigatório"),
  descricao: z.string().optional(),
  dataInicio: z.string().min(1, "Data de início obrigatória"),
  dataFimEstimada: z
    .string()
    .optional()
    .transform((value) => value || null),
  estado: z
    .enum(["proposta", "activo", "pausado", "concluido", "cancelado"])
    .default("proposta"),
  pontoFocalId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal(""))
    .transform((value) => value || null),
  valorPrevisto: z
    .string()
    .optional()
    .transform((value) => value || null),
  moeda: z.enum(["XOF", "EUR", "USD"]).default("XOF"),
  notas: z.string().optional(),
  assistants: z.array(z.string().uuid()).default([]),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export async function listProjects(
  filters: string | { search?: string; scope?: ProjectScope } = {},
) {
  const authorization = await authorizeOperation("projectsRead");
  if (!authorization.success) throw new Error(authorization.error);

  const search = typeof filters === "string" ? filters : filters.search;
  const scope = typeof filters === "string" ? "todos" : filters.scope ?? "activos";
  const conditions: SQL[] = [];

  if (search) {
    const searchCondition = or(ilike(projects.titulo, `%${search}%`));
    if (searchCondition) conditions.push(searchCondition);
  }
  if (scope !== "todos") {
    conditions.push(inArray(projects.estado, getProjectStatesForScope(scope)));
  }

  return dbAdmin.query.projects.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    with: {
      client: true,
      pontoFocal: { columns: { id: true, nomeCurto: true } },
      assistants: { with: { user: { columns: { id: true, nomeCurto: true } } } },
    },
    orderBy: (project, { desc }) => [desc(project.createdAt)],
  });
}

export async function getProject(id: string) {
  const authorization = await authorizeOperation("projectsRead");
  if (!authorization.success) throw new Error(authorization.error);

  return dbAdmin.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      client: true,
      servico: true,
      pontoFocal: { columns: { id: true, nomeCurto: true, nomeCompleto: true } },
      assistants: {
        with: { user: { columns: { id: true, nomeCurto: true, nomeCompleto: true } } },
      },
      invoices: {
        columns: { id: true, numero: true, estado: true, total: true, moeda: true },
        limit: 10,
      },
    },
  });
}

export async function createProject(_: unknown, formData: FormData) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!isOperationAllowed("projectsWrite", dbUser.role)) {
    return { error: "Sem permissão" };
  }

  const assistantsRaw = formData.getAll("assistants[]").map(String);
  const parsed = projectSchema.safeParse({
    clientId: formData.get("clientId"),
    servicoId: formData.get("servicoId") || undefined,
    titulo: formData.get("titulo"),
    descricao: formData.get("descricao") || undefined,
    dataInicio: formData.get("dataInicio"),
    dataFimEstimada: formData.get("dataFimEstimada") || undefined,
    estado: formData.get("estado") || "proposta",
    pontoFocalId: formData.get("pontoFocalId") || undefined,
    valorPrevisto: formData.get("valorPrevisto") || undefined,
    moeda: formData.get("moeda") || "XOF",
    notas: formData.get("notas") || undefined,
    assistants: assistantsRaw,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { assistants, ...projectData } = parsed.data;
  const valorPrevisto = projectData.valorPrevisto
    ? toCurrencyStorageString(projectData.valorPrevisto, projectData.moeda)
    : null;

  const [created] = await dbAdmin
    .insert(projects)
    .values({
      ...projectData,
      ...getProjectArchiveUpdates(projectData.estado),
      valorPrevisto,
      createdBy: dbUser.id,
    })
    .returning();

  if (assistants.length > 0) {
    await dbAdmin.insert(projectAssistants).values(
      assistants.map((userId) => ({ projectId: created.id, userId })),
    );
  }

  await insertAuditLog({
    userId: dbUser.id,
    acao: "create",
    entidade: "projects",
    entidadeId: created.id,
    dadosDepois: created,
  });

  revalidatePath("/admin/projects");
  return { success: true, id: created.id };
}

export async function updateProject(id: string, _: unknown, formData: FormData) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!isOperationAllowed("projectsWrite", dbUser.role)) {
    return { error: "Sem permissão" };
  }

  const assistantsRaw = formData.getAll("assistants[]").map(String);
  const parsed = projectSchema.safeParse({
    clientId: formData.get("clientId"),
    servicoId: formData.get("servicoId") || undefined,
    titulo: formData.get("titulo"),
    descricao: formData.get("descricao") || undefined,
    dataInicio: formData.get("dataInicio"),
    dataFimEstimada: formData.get("dataFimEstimada") || undefined,
    estado: formData.get("estado") || "proposta",
    pontoFocalId: formData.get("pontoFocalId") || undefined,
    valorPrevisto: formData.get("valorPrevisto") || undefined,
    moeda: formData.get("moeda") || "XOF",
    notas: formData.get("notas") || undefined,
    assistants: assistantsRaw,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existing = await dbAdmin.query.projects.findFirst({
    where: eq(projects.id, id),
  });
  if (!existing) return { error: "Projecto não encontrado" };

  const { assistants, ...projectData } = parsed.data;
  const valorPrevisto = projectData.valorPrevisto
    ? toCurrencyStorageString(projectData.valorPrevisto, projectData.moeda)
    : null;

  const [updated] = await dbAdmin
    .update(projects)
    .set({
      ...projectData,
      ...getProjectArchiveUpdates(
        projectData.estado,
        new Date(),
        existing.arquivadoEm,
      ),
      valorPrevisto,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  await dbAdmin.delete(projectAssistants).where(eq(projectAssistants.projectId, id));
  if (assistants.length > 0) {
    await dbAdmin.insert(projectAssistants).values(
      assistants.map((userId) => ({ projectId: id, userId })),
    );
  }

  await insertAuditLog({
    userId: dbUser.id,
    acao: "update",
    entidade: "projects",
    entidadeId: id,
    dadosAntes: existing,
    dadosDepois: updated,
  });

  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function updateProjectEstado(id: string, estado: string) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!isOperationAllowed("projectsWrite", dbUser.role)) {
    return { error: "Sem permissão" };
  }

  const valid: ProjectState[] = [
    "proposta",
    "activo",
    "pausado",
    "concluido",
    "cancelado",
  ];
  if (!valid.includes(estado as ProjectState)) {
    return { error: "Estado inválido" };
  }

  const existing = await dbAdmin.query.projects.findFirst({
    where: eq(projects.id, id),
    columns: { arquivadoEm: true },
  });

  await dbAdmin
    .update(projects)
    .set({
      estado: estado as ProjectState,
      ...getProjectArchiveUpdates(
        estado as ProjectState,
        new Date(),
        existing?.arquivadoEm,
      ),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/admin/projects");
  return { success: true };
}
