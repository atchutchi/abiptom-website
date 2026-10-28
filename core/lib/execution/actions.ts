"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod-core";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { dbAdmin } from "@/core/lib/db";
import { insertAuditLog } from "@/core/lib/db/audit";
import {
  projectDeliverables,
  projectExecutionSnapshots,
  projects,
  salaryPeriods,
  staffPerformanceSnapshots,
  taskSubmissions,
  taskValidations,
  tasks,
  type TaskState,
  type TaskValidationDecision,
} from "@/core/lib/db/schema";
import { getCurrentUser } from "@/core/lib/auth/actions";

const MANAGER_ROLES = new Set(["ca", "dg", "coord"]);

const deliverableSchema = z.object({
  titulo: z.string().trim().min(3, "Título do entregável obrigatório"),
  descricao: z.string().trim().optional(),
  peso: z.coerce.number().min(0, "Peso inválido").max(1000, "Peso demasiado alto"),
  prazo: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Prazo inválido"),
  estado: z.enum(["planeado", "em_curso", "concluido", "cancelado"]).default("planeado"),
});

const submissionSchema = z.object({
  comentario: z.string().trim().min(3, "Indica o que foi entregue"),
  evidenciaUrl: z.string().trim().url("Link de evidência inválido").optional().or(z.literal("")),
});

const validationSchema = z.object({
  decision: z.enum(["aprovada", "precisa_correcao", "rejeitada"]),
  qualityScore: z.coerce.number().int().min(1).max(5).optional(),
  comentario: z.string().trim().optional(),
});

type ExecutionTask = {
  id: string;
  titulo: string;
  estado: TaskState;
  executionWeight: string;
  prazo: string | null;
  deliverableId: string | null;
  atribuidaA?: { id: string; nomeCurto: string } | string | null;
  submittedAt: Date | null;
  validatedAt: Date | null;
  qualityScore: number | null;
};

export type ProjectExecutionSummary = {
  plannedWeight: number;
  approvedWeight: number;
  executionPercent: number;
  assignedTasks: number;
  submittedTasks: number;
  approvedTasks: number;
  rejectedTasks: number;
  pendingValidationTasks: number;
  overdueTasks: number;
};

function isManager(role: string) {
  return MANAGER_ROLES.has(role);
}

async function requireExecutionManager() {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!isManager(dbUser.role)) throw new Error("Sem permissão");
  return { user, dbUser };
}

function numberValue(value: string | number | null | undefined) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function isApprovedState(state: TaskState) {
  return state === "aprovada" || state === "concluida";
}

function isRejectedState(state: TaskState) {
  return state === "rejeitada" || state === "precisa_correcao";
}

function isOpenState(state: TaskState) {
  return !["aprovada", "concluida", "cancelada"].includes(state);
}

function computeSummary(taskRows: ExecutionTask[]): ProjectExecutionSummary {
  const today = new Date().toISOString().slice(0, 10);
  const activeTasks = taskRows.filter((task) => task.estado !== "cancelada");
  const plannedWeight = activeTasks.reduce(
    (total, task) => total + numberValue(task.executionWeight),
    0
  );
  const approvedWeight = activeTasks
    .filter((task) => isApprovedState(task.estado))
    .reduce((total, task) => total + numberValue(task.executionWeight), 0);
  const assignedTasks = activeTasks.length;
  const submittedTasks = activeTasks.filter((task) =>
    ["submetida", "aprovada", "precisa_correcao", "rejeitada", "concluida"].includes(task.estado)
  ).length;
  const approvedTasks = activeTasks.filter((task) => isApprovedState(task.estado)).length;
  const rejectedTasks = activeTasks.filter((task) => isRejectedState(task.estado)).length;
  const pendingValidationTasks = activeTasks.filter((task) => task.estado === "submetida").length;
  const overdueTasks = activeTasks.filter(
    (task) => task.prazo && task.prazo < today && isOpenState(task.estado)
  ).length;

  return {
    plannedWeight,
    approvedWeight,
    executionPercent: plannedWeight > 0 ? (approvedWeight / plannedWeight) * 100 : 0,
    assignedTasks,
    submittedTasks,
    approvedTasks,
    rejectedTasks,
    pendingValidationTasks,
    overdueTasks,
  };
}

function snapshotValues(summary: ProjectExecutionSummary, generatedBy: string) {
  return {
    plannedWeight: summary.plannedWeight.toFixed(2),
    approvedWeight: summary.approvedWeight.toFixed(2),
    executionPercent: summary.executionPercent.toFixed(2),
    assignedTasks: summary.assignedTasks,
    submittedTasks: summary.submittedTasks,
    approvedTasks: summary.approvedTasks,
    rejectedTasks: summary.rejectedTasks,
    pendingValidationTasks: summary.pendingValidationTasks,
    overdueTasks: summary.overdueTasks,
    generatedBy,
  };
}

export async function listProjectDeliverablesForTaskOptions(projectId?: string) {
  const { dbUser } = await requireExecutionManager();
  if (!isManager(dbUser.role)) return [];

  return dbAdmin.query.projectDeliverables.findMany({
    where: projectId ? eq(projectDeliverables.projectId, projectId) : undefined,
    orderBy: [asc(projectDeliverables.projectId), asc(projectDeliverables.ordem), asc(projectDeliverables.titulo)],
    columns: {
      id: true,
      projectId: true,
      titulo: true,
      peso: true,
      estado: true,
    },
    with: {
      project: {
        columns: {
          id: true,
          titulo: true,
        },
      },
    },
  });
}

export async function getProjectExecution(projectId: string) {
  await requireExecutionManager();

  const project = await dbAdmin.query.projects.findFirst({
    where: eq(projects.id, projectId),
    columns: {
      id: true,
      titulo: true,
      estado: true,
    },
    with: {
      client: { columns: { id: true, nome: true } },
      pontoFocal: { columns: { id: true, nomeCurto: true } },
      assistants: {
        with: {
          user: { columns: { id: true, nomeCurto: true } },
        },
      },
      deliverables: {
        orderBy: (table, { asc: orderAsc }) => [orderAsc(table.ordem), orderAsc(table.titulo)],
      },
      tasks: {
        orderBy: (table, { desc: orderDesc }) => [orderDesc(table.createdAt)],
        with: {
          atribuidaA: { columns: { id: true, nomeCurto: true } },
          deliverable: { columns: { id: true, titulo: true } },
          submissions: {
            orderBy: (table, { desc: orderDesc }) => [orderDesc(table.createdAt)],
            with: {
              submittedByUser: { columns: { id: true, nomeCurto: true } },
            },
          },
          validations: {
            orderBy: (table, { desc: orderDesc }) => [orderDesc(table.createdAt)],
            with: {
              validatedByUser: { columns: { id: true, nomeCurto: true } },
            },
          },
        },
      },
    },
  });

  if (!project) return null;

  const summary = computeSummary(project.tasks);
  const byDeliverable = new Map<string, ProjectExecutionSummary>();
  for (const deliverable of project.deliverables) {
    byDeliverable.set(
      deliverable.id,
      computeSummary(project.tasks.filter((task) => task.deliverableId === deliverable.id))
    );
  }

  return {
    project,
    summary,
    byDeliverable,
    unassignedSummary: computeSummary(project.tasks.filter((task) => !task.deliverableId)),
  };
}

export async function createDeliverable(projectId: string, _: unknown, formData: FormData) {
  const { dbUser } = await requireExecutionManager();

  const parsed = deliverableSchema.safeParse({
    titulo: formData.get("titulo"),
    descricao: (formData.get("descricao") as string) || undefined,
    peso: formData.get("peso") || 0,
    prazo: (formData.get("prazo") as string) || undefined,
    estado: (formData.get("estado") as string) || "planeado",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existingProject = await dbAdmin.query.projects.findFirst({
    where: eq(projects.id, projectId),
    columns: { id: true },
  });
  if (!existingProject) return { error: "Projecto não encontrado" };

  const [created] = await dbAdmin
    .insert(projectDeliverables)
    .values({
      projectId,
      titulo: parsed.data.titulo,
      descricao: parsed.data.descricao || null,
      peso: parsed.data.peso.toFixed(2),
      prazo: parsed.data.prazo || null,
      estado: parsed.data.estado,
      createdBy: dbUser.id,
    })
    .returning();

  await audit("create", "project_deliverables", created.id, dbUser.id, null, created);
  revalidateProjectExecution(projectId);
  return { success: true };
}

export async function updateDeliverable(id: string, _: unknown, formData: FormData) {
  const { dbUser } = await requireExecutionManager();

  const existing = await dbAdmin.query.projectDeliverables.findFirst({
    where: eq(projectDeliverables.id, id),
  });
  if (!existing) return { error: "Entregável não encontrado" };

  const parsed = deliverableSchema.safeParse({
    titulo: formData.get("titulo"),
    descricao: (formData.get("descricao") as string) || undefined,
    peso: formData.get("peso") || 0,
    prazo: (formData.get("prazo") as string) || undefined,
    estado: (formData.get("estado") as string) || existing.estado,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const [updated] = await dbAdmin
    .update(projectDeliverables)
    .set({
      titulo: parsed.data.titulo,
      descricao: parsed.data.descricao || null,
      peso: parsed.data.peso.toFixed(2),
      prazo: parsed.data.prazo || null,
      estado: parsed.data.estado,
      updatedAt: new Date(),
    })
    .where(eq(projectDeliverables.id, id))
    .returning();

  await audit("update", "project_deliverables", id, dbUser.id, existing, updated);
  revalidateProjectExecution(existing.projectId);
  return { success: true };
}

export async function submitTaskCompletion(taskId: string, _: unknown, formData: FormData) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");

  const existing = await dbAdmin.query.tasks.findFirst({ where: eq(tasks.id, taskId) });
  if (!existing) return { error: "Tarefa não encontrada" };

  const canSubmit = existing.atribuidaA === dbUser.id || isManager(dbUser.role);
  if (!canSubmit) return { error: "Sem permissão" };
  if (existing.estado === "aprovada" || existing.estado === "concluida") {
    return { error: "Tarefa já validada" };
  }

  const parsed = submissionSchema.safeParse({
    comentario: formData.get("comentario"),
    evidenciaUrl: (formData.get("evidenciaUrl") as string) || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const now = new Date();
  const [submission] = await dbAdmin
    .insert(taskSubmissions)
    .values({
      taskId,
      submittedBy: dbUser.id,
      comentario: parsed.data.comentario,
      evidenciaUrl: parsed.data.evidenciaUrl || null,
    })
    .returning();

  const [updated] = await dbAdmin
    .update(tasks)
    .set({
      estado: "submetida",
      submissionNote: parsed.data.comentario,
      submittedAt: now,
      validatedAt: null,
      validatedBy: null,
      validationNote: null,
      qualityScore: null,
      concluidaEm: null,
      updatedAt: now,
    })
    .where(eq(tasks.id, taskId))
    .returning();

  await audit("submit", "tasks", taskId, dbUser.id, existing, { updated, submission });
  revalidateTaskPaths(taskId);
  if (existing.projectoId) revalidateProjectExecution(existing.projectoId);
  return { success: true };
}

export async function validateTaskSubmission(taskId: string, _: unknown, formData: FormData) {
  const { dbUser } = await requireExecutionManager();

  const existing = await dbAdmin.query.tasks.findFirst({ where: eq(tasks.id, taskId) });
  if (!existing) return { error: "Tarefa não encontrada" };

  const parsed = validationSchema.safeParse({
    decision: formData.get("decision"),
    qualityScore: formData.get("qualityScore") || undefined,
    comentario: (formData.get("comentario") as string) || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const latestSubmission = await dbAdmin.query.taskSubmissions.findFirst({
    where: eq(taskSubmissions.taskId, taskId),
    orderBy: [desc(taskSubmissions.createdAt)],
  });

  if (!latestSubmission && existing.estado !== "concluida") {
    return { error: "Ainda não existe submissão para validar" };
  }

  const now = new Date();
  const decision = parsed.data.decision as TaskValidationDecision;
  const nextState = decision;
  const qualityScore = parsed.data.qualityScore ?? null;

  const [validation] = await dbAdmin
    .insert(taskValidations)
    .values({
      taskId,
      submissionId: latestSubmission?.id ?? null,
      validatedBy: dbUser.id,
      decision,
      qualityScore,
      comentario: parsed.data.comentario || null,
    })
    .returning();

  const [updated] = await dbAdmin
    .update(tasks)
    .set({
      estado: nextState,
      validatedAt: now,
      validatedBy: dbUser.id,
      qualityScore,
      validationNote: parsed.data.comentario || null,
      concluidaEm: decision === "aprovada" ? now : null,
      updatedAt: now,
    })
    .where(eq(tasks.id, taskId))
    .returning();

  await audit("validate", "tasks", taskId, dbUser.id, existing, { updated, validation });
  revalidateTaskPaths(taskId);
  if (existing.projectoId) revalidateProjectExecution(existing.projectoId);
  return { success: true };
}

export async function getSalaryExecutionOverview(periodId: string) {
  const { dbUser } = await requireExecutionManager();
  if (!["ca", "dg"].includes(dbUser.role)) return [];

  const period = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, periodId),
    columns: { id: true, ano: true, mes: true },
    with: {
      periodProjects: {
        with: {
          project: { columns: { id: true, titulo: true } },
        },
      },
    },
  });
  if (!period) return [];

  const projectIds = period.periodProjects.map((entry) => entry.projectId);
  if (projectIds.length === 0) return [];

  const [taskRows, snapshots] = await Promise.all([
    dbAdmin.query.tasks.findMany({
      where: inArray(tasks.projectoId, projectIds),
      columns: {
        id: true,
        titulo: true,
        estado: true,
        executionWeight: true,
        prazo: true,
        deliverableId: true,
        projectoId: true,
        submittedAt: true,
        validatedAt: true,
        qualityScore: true,
      },
      with: {
        atribuidaA: { columns: { id: true, nomeCurto: true } },
      },
    }),
    dbAdmin.query.projectExecutionSnapshots.findMany({
      where: and(
        inArray(projectExecutionSnapshots.projectId, projectIds),
        eq(projectExecutionSnapshots.ano, period.ano),
        eq(projectExecutionSnapshots.mes, period.mes)
      ),
    }),
  ]);

  const snapshotByProject = new Map(snapshots.map((snapshot) => [snapshot.projectId, snapshot]));

  return period.periodProjects.map((entry) => {
    const projectTasks = taskRows.filter((task) => task.projectoId === entry.projectId);
    return {
      projectId: entry.projectId,
      titulo: entry.project.titulo,
      live: computeSummary(projectTasks),
      snapshot: snapshotByProject.get(entry.projectId) ?? null,
    };
  });
}

export async function generateExecutionSnapshotsForPeriod(periodId: string) {
  const { dbUser } = await requireExecutionManager();
  if (!["ca", "dg"].includes(dbUser.role)) {
    return { error: "Só CA/DG pode gravar snapshots para folha salarial" };
  }

  const period = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, periodId),
    columns: { id: true, ano: true, mes: true },
    with: { periodProjects: true },
  });
  if (!period) return { error: "Período não encontrado" };

  const projectIds = period.periodProjects.map((entry) => entry.projectId);
  if (projectIds.length === 0) return { error: "Período sem projectos" };

  const taskRows = await dbAdmin.query.tasks.findMany({
    where: inArray(tasks.projectoId, projectIds),
    columns: {
      id: true,
      titulo: true,
      estado: true,
      executionWeight: true,
      prazo: true,
      deliverableId: true,
      projectoId: true,
      atribuidaA: true,
      submittedAt: true,
      validatedAt: true,
      qualityScore: true,
    },
  });

  await dbAdmin.transaction(async (tx) => {
    for (const projectId of projectIds) {
      const summary = computeSummary(taskRows.filter((task) => task.projectoId === projectId));
      await tx
        .insert(projectExecutionSnapshots)
        .values({
          projectId,
          ano: period.ano,
          mes: period.mes,
          ...snapshotValues(summary, dbUser.id),
        })
        .onConflictDoUpdate({
          target: [
            projectExecutionSnapshots.projectId,
            projectExecutionSnapshots.ano,
            projectExecutionSnapshots.mes,
          ],
          set: snapshotValues(summary, dbUser.id),
        });
    }

    const taskGroups = new Map<string, typeof taskRows>();
    for (const task of taskRows) {
      if (!task.atribuidaA || !task.projectoId) continue;
      const key = `${task.atribuidaA}|${task.projectoId}`;
      const group = taskGroups.get(key) ?? [];
      group.push(task);
      taskGroups.set(key, group);
    }

    for (const [key, group] of taskGroups) {
      const [userId, projectId] = key.split("|");
      const activeTasks = group.filter((task) => task.estado !== "cancelada");
      const approvedTasks = activeTasks.filter((task) => isApprovedState(task.estado));
      const rejectedTasks = activeTasks.filter((task) => isRejectedState(task.estado));
      const qualityScores = approvedTasks
        .map((task) => task.qualityScore)
        .filter((score): score is number => typeof score === "number");
      const qualityAverage =
        qualityScores.length > 0
          ? qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length
          : null;
      const summary = computeSummary(group);

      const values = {
        assignedTasks: activeTasks.length,
        submittedTasks: summary.submittedTasks,
        approvedTasks: approvedTasks.length,
        rejectedTasks: rejectedTasks.length,
        overdueTasks: summary.overdueTasks,
        approvalRate:
          activeTasks.length > 0
            ? ((approvedTasks.length / activeTasks.length) * 100).toFixed(2)
            : "0.00",
        qualityAverage: qualityAverage === null ? null : qualityAverage.toFixed(2),
        generatedBy: dbUser.id,
      };

      await tx
        .insert(staffPerformanceSnapshots)
        .values({
          userId,
          projectId,
          ano: period.ano,
          mes: period.mes,
          ...values,
        })
        .onConflictDoUpdate({
          target: [
            staffPerformanceSnapshots.userId,
            staffPerformanceSnapshots.projectId,
            staffPerformanceSnapshots.ano,
            staffPerformanceSnapshots.mes,
          ],
          set: values,
        });
    }
  });

  await audit("generate_snapshots", "salary_periods", periodId, dbUser.id, null, {
    ano: period.ano,
    mes: period.mes,
    projectCount: projectIds.length,
  });

  revalidatePath(`/admin/salary/${periodId}`);
  return { success: true };
}

async function audit(
  acao: string,
  entidade: string,
  entidadeId: string,
  userId: string,
  dadosAntes: unknown,
  dadosDepois: unknown
) {
  const hdrs = await headers();
  await insertAuditLog({
    userId,
    acao,
    entidade,
    entidadeId,
    dadosAntes: dadosAntes ?? undefined,
    dadosDepois: dadosDepois ?? undefined,
    ip: hdrs.get("x-forwarded-for") ?? undefined,
    userAgent: hdrs.get("user-agent") ?? undefined,
  });
}

function revalidateTaskPaths(taskId: string) {
  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/tasks/${taskId}`);
  revalidatePath("/staff/me/tasks");
  revalidatePath(`/staff/me/tasks/${taskId}`);
  revalidatePath("/staff/me/dashboard");
}

function revalidateProjectExecution(projectId: string) {
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/admin/projects/${projectId}/execution`);
  revalidatePath("/admin/tasks");
}
