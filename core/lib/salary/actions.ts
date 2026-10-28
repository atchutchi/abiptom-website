"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod-core";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { dbAdmin } from "@/core/lib/db";
import {
  expenses,
  invoicePayments,
  projectPayments as projectPaymentsTable,
  salaryLines,
  salaryPeriodParticipants,
  salaryPeriodProjects,
  salaryPeriods,
  salaryPolicies,
  users,
} from "@/core/lib/db/schema";
import { insertAuditLog } from "@/core/lib/db/audit";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { authorizeOperation } from "@/core/lib/auth/authorization";
import { calculateActual2024 } from "./engines/actual-2024";
import { calculateGuia2026 } from "./engines/guia-2026";
import { toXofInteger, toXofString } from "@/core/lib/utils/money";
import type {
  Actual2024PolicyConfig,
  Actual2024PolicyDefaults,
  CalculateActual2024Input,
  CalculateActual2024Output,
  ExpenseForSalary,
  Guia2026PolicyConfig,
  PolicyConfig,
  ProjectInput,
  ProjectWithAssignmentsInput,
  StaffInput,
  UserForSalary,
} from "./types";

const projectEntrySchema = z.object({
  projectId: z.string().uuid(),
  valorLiquido: z.number().positive("Valor liquido deve ser positivo"),
  pfPercentagemOverride: z.number().min(0).max(1).nullable().optional(),
  coordId: z.string().uuid().nullable().optional(),
});

const createPeriodSchema = z.object({
  ano: z.number().int().min(2020).max(2100),
  mes: z.number().int().min(1).max(12),
  policyId: z.string().uuid(),
  projectEntries: z
    .array(projectEntrySchema)
    .min(1, "Pelo menos um projecto e necessario"),
});

const updateParticipantSchema = z.object({
  isElegivelSubsidio: z.boolean(),
  recebeRubricaGestao: z.boolean(),
  salarioBaseOverride: z.number().min(0).nullable(),
});

const updateSalaryLineSchema = z.object({
  totalBrutoFinal: z.number().min(0),
  overrideMotivo: z.string().trim().optional(),
});

const paidInvoiceProjectEntriesSchema = z.object({
  ano: z.number().int().min(2020).max(2100),
  mes: z.number().int().min(1).max(12),
});

export type CreatePeriodInput = z.infer<typeof createPeriodSchema>;
export type CreatePeriodResult = { success: true; periodId: string } | { error: string };
export type CalculatePeriodResult =
  | { success: true; periodId: string; warnings: string[] }
  | { error: string };
export type PaidInvoiceProjectEntry = {
  projectId: string;
  projectTitle: string;
  valorRecebido: number;
  paymentCount: number;
  invoices: Array<{
    invoiceId: string;
    numero: number | null;
    paymentId: string;
    dataPagamento: string;
    valorRecebido: number;
  }>;
};
export type LoadPaidInvoiceProjectEntriesResult =
  | {
      success: true;
      entries: PaidInvoiceProjectEntry[];
      warnings: string[];
    }
  | { error: string };
export type RecalculateHistoricalPeriodsResult =
  | {
      success: true;
      periods: Array<{
        periodId: string;
        ano: number;
        mes: number;
        estado: string;
        totalLiquidoAntes: number;
        totalLiquidoDepois: number;
        totalFolhaAntes: number;
        totalFolhaDepois: number;
        warnings: string[];
      }>;
      skipped: Array<{
        periodId: string;
        ano: number;
        mes: number;
        reason: string;
      }>;
    }
  | { error: string };

type PayrollAdminResult =
  | {
      dbUser: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>["dbUser"]>;
    }
  | { error: string };

type LoadedProjectForSalary = {
  id: string;
  titulo: string;
  pontoFocalId: string | null;
  percentagemPf: string | null;
  percentagemAuxTotal: string | null;
  percentagemRubricaGestao: string | null;
  assistants: Array<{
    userId: string;
    percentagemOverride: string | null;
  }>;
};

type CalculatedPeriodPayload = {
  totalBruto: number;
  totalLiquido: number;
  totalFolha: number;
  lines: Array<Record<string, unknown>>;
  payments: Array<Record<string, unknown>>;
  warnings: string[];
};

type EnsureHistoricalPeriodSnapshotResult =
  | { success: true }
  | { error: string };

export async function listSalaryPolicies() {
  const authorization = await authorizeOperation("salaryRead");
  if (!authorization.success) throw new Error(authorization.error);

  return dbAdmin.query.salaryPolicies.findMany({
    where: eq(salaryPolicies.activo, true),
    orderBy: (table, { desc: orderDesc }) => [orderDesc(table.dataInicio)],
  });
}

export async function listSalaryPeriods() {
  const authorization = await authorizeOperation("salaryRead");
  if (!authorization.success) throw new Error(authorization.error);

  return dbAdmin.query.salaryPeriods.findMany({
    with: { policy: { columns: { nome: true, versao: true } } },
    orderBy: (table, { desc: orderDesc }) => [
      orderDesc(table.ano),
      orderDesc(table.mes),
    ],
  });
}

export async function loadPaidInvoiceProjectEntries(input: {
  ano: number;
  mes: number;
}): Promise<LoadPaidInvoiceProjectEntriesResult> {
  const actor = await requirePayrollAdmin();
  if ("error" in actor) return { error: actor.error };

  const parsed = paidInvoiceProjectEntriesSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos" };
  }

  const { start, end } = getMonthBounds(parsed.data.ano, parsed.data.mes);
  const payments = await dbAdmin.query.invoicePayments.findMany({
    where: and(gte(invoicePayments.data, start), lte(invoicePayments.data, end)),
    with: {
      invoice: {
        columns: {
          id: true,
          numero: true,
          estado: true,
          projectId: true,
        },
        with: {
          project: {
            columns: {
              id: true,
              titulo: true,
            },
          },
        },
      },
    },
    orderBy: [desc(invoicePayments.data)],
  });

  const warnings: string[] = [];
  const entriesByProject = new Map<string, PaidInvoiceProjectEntry>();

  for (const payment of payments) {
    const invoice = payment.invoice;
    if (!invoice || invoice.estado === "anulada") {
      continue;
    }

    const invoiceLabel = invoice.numero ? `Factura ${invoice.numero}` : invoice.id;
    if (!invoice.projectId || !invoice.project) {
      warnings.push(
        `${invoiceLabel} tem pagamento em ${payment.data}, mas nao esta ligada a projecto.`,
      );
      continue;
    }

    const valorRecebido = Math.round(
      Number(payment.valor) * Number(payment.taxaCambio ?? 1),
    );
    const current = entriesByProject.get(invoice.projectId) ?? {
      projectId: invoice.projectId,
      projectTitle: invoice.project.titulo,
      valorRecebido: 0,
      paymentCount: 0,
      invoices: [],
    };

    current.valorRecebido += valorRecebido;
    current.paymentCount += 1;
    current.invoices.push({
      invoiceId: invoice.id,
      numero: invoice.numero,
      paymentId: payment.id,
      dataPagamento: payment.data,
      valorRecebido,
    });
    entriesByProject.set(invoice.projectId, current);
  }

  return {
    success: true,
    entries: Array.from(entriesByProject.values()).sort(
      (left, right) => right.valorRecebido - left.valorRecebido,
    ),
    warnings,
  };
}

export async function getSalaryPeriod(id: string) {
  const authorization = await authorizeOperation("salaryRead");
  if (!authorization.success) throw new Error(authorization.error);

  const period = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, id),
    with: {
      policy: true,
      participants: {
        with: {
          user: {
            columns: {
              id: true,
              nomeCurto: true,
              nomeCompleto: true,
              role: true,
              salarioBaseMensal: true,
              percentagemDescontoFolha: true,
            },
          },
        },
      },
      periodProjects: {
        with: {
          project: {
            columns: {
              id: true,
              titulo: true,
              pontoFocalId: true,
              percentagemPf: true,
              percentagemAuxTotal: true,
              percentagemRubricaGestao: true,
            },
            with: {
              client: { columns: { id: true, nome: true } },
              assistants: {
                with: {
                  user: { columns: { id: true, nomeCurto: true } },
                },
              },
            },
          },
          coord: { columns: { id: true, nomeCurto: true } },
        },
      },
      lines: {
        with: {
          user: {
            columns: {
              id: true,
              nomeCurto: true,
              nomeCompleto: true,
              role: true,
              percentagemDescontoFolha: true,
            },
          },
        },
        orderBy: (table, { desc: orderDesc }) => [orderDesc(table.totalLiquidoFinal)],
      },
      projectPayments: {
        with: {
          project: { columns: { id: true, titulo: true } },
          user: { columns: { id: true, nomeCurto: true } },
        },
        orderBy: (table, { asc }) => [asc(table.projectId)],
      },
    },
  });

  if (!period) {
    return null;
  }

  const policyConfig = period.policy.configuracaoJson as PolicyConfig;
  let calculationPreview: CalculateActual2024Output | null = null;
  let calculationError: string | null = null;

  if (policyConfig.tipo === "actual_2024") {
    try {
      calculationPreview = await buildActual2024Preview(period.id, policyConfig);
    } catch (error) {
      calculationError =
        error instanceof Error ? error.message : "Erro ao gerar preview do calculo";
    }
  }

  return {
    ...period,
    calculationPreview,
    calculationError,
  };
}

export async function createPeriod(
  input: CreatePeriodInput,
): Promise<CreatePeriodResult> {
  const actor = await requirePayrollAdmin();
  if ("error" in actor) return { error: actor.error };

  const parsed = createPeriodSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos" };
  }

  const { ano, mes, policyId } = parsed.data;
  const projectEntries = parsed.data.projectEntries.map((entry) => ({
    ...entry,
    valorLiquido: toXofInteger(entry.valorLiquido),
  }));

  const existing = await dbAdmin.query.salaryPeriods.findFirst({
    where: and(
      eq(salaryPeriods.ano, ano),
      eq(salaryPeriods.mes, mes),
      eq(salaryPeriods.policyId, policyId),
    ),
  });
  if (existing) {
    return {
      error: `Ja existe um periodo para ${mes}/${ano} com esta politica`,
    };
  }

  const policy = await dbAdmin.query.salaryPolicies.findFirst({
    where: eq(salaryPolicies.id, policyId),
    columns: { id: true },
  });
  if (!policy) {
    return { error: "Politica salarial nao encontrada" };
  }

  const activeUsers = await dbAdmin.query.users.findMany({
    where: eq(users.activo, true),
    columns: {
      id: true,
      role: true,
      elegivelSubsidioDinamicoDefault: true,
    },
  });

  const dgUsers = activeUsers.filter((entry) => entry.role === "dg");
  const rubricaUserId = dgUsers.length === 1 ? dgUsers[0].id : null;

  try {
    const periodId = await dbAdmin.transaction(async (tx) => {
      const [period] = await tx
        .insert(salaryPeriods)
        .values({
          ano,
          mes,
          policyId,
          estado: "aberto",
          totalBruto: "0",
          totalLiquido: "0",
          totalFolha: "0",
          criadoPor: actor.dbUser.id,
        })
        .returning({ id: salaryPeriods.id });

      if (activeUsers.length > 0) {
        await tx.insert(salaryPeriodParticipants).values(
          activeUsers.map((entry) => ({
            periodId: period.id,
            userId: entry.id,
            isElegivelSubsidio: entry.elegivelSubsidioDinamicoDefault,
            recebeRubricaGestao: entry.id === rubricaUserId,
            salarioBaseOverride: null,
          })),
        );
      }

      await tx.insert(salaryPeriodProjects).values(
        projectEntries.map((entry) => ({
          periodId: period.id,
          projectId: entry.projectId,
          valorLiquido: toXofString(entry.valorLiquido),
          pfPercentagemOverride:
            entry.pfPercentagemOverride !== undefined &&
            entry.pfPercentagemOverride !== null
              ? String(entry.pfPercentagemOverride)
              : null,
          coordId: entry.coordId ?? null,
        })),
      );

      return period.id;
    });

    await insertAuditLog({
      userId: actor.dbUser.id,
      acao: "create",
      entidade: "salary_periods",
      entidadeId: periodId,
      dadosDepois: { ano, mes, policyId, projectEntries },
    });

    revalidatePath("/admin/salary");
    revalidatePath("/admin/salary/new");
    return { success: true, periodId };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Erro ao criar periodo salarial",
    };
  }
}

export async function calculatePeriod(
  periodId: string,
): Promise<CalculatePeriodResult> {
  const actor = await requirePayrollAdmin();
  if ("error" in actor) return { error: actor.error };

  const period = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, periodId),
    with: {
      policy: true,
      participants: true,
      periodProjects: true,
    },
  });

  if (!period) {
    return { error: "Periodo nao encontrado" };
  }
  if (!["aberto", "calculado"].includes(period.estado)) {
    return {
      error: "Apenas periodos em estado aberto ou calculado podem ser recalculados",
    };
  }
  if (period.periodProjects.length === 0) {
    return { error: "O periodo nao tem projectos associados" };
  }

  const policyConfig = period.policy.configuracaoJson as PolicyConfig;
  try {
    if (policyConfig.tipo === "actual_2024") {
      return await calculateActual2024Period({
        periodId,
        policyConfig,
        actorId: actor.dbUser.id,
      });
    }

    return await calculateGuia2026Period({
      periodId,
      policyConfig,
      actorId: actor.dbUser.id,
    });
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Erro no calculo salarial",
    };
  }
}

export async function recalculateHistoricalPeriods(): Promise<RecalculateHistoricalPeriodsResult> {
  const actor = await requirePayrollAdmin();
  if ("error" in actor) return { error: actor.error };

  const periods = await dbAdmin.query.salaryPeriods.findMany({
    where: and(
      gte(salaryPeriods.ano, 2020),
      lte(salaryPeriods.ano, 2100),
    ),
    with: {
      policy: true,
      participants: true,
      periodProjects: true,
      lines: true,
      projectPayments: true,
    },
    orderBy: (table, { asc: orderAsc }) => [orderAsc(table.ano), orderAsc(table.mes)],
  });

  const eligiblePeriods = periods.filter((period) =>
    ["aberto", "calculado", "confirmado", "pago"].includes(period.estado),
  );

  const summary: RecalculateHistoricalPeriodsResult = {
    success: true,
    periods: [],
    skipped: [],
  };

  for (const period of eligiblePeriods) {
    try {
      const prepared = await ensureHistoricalPeriodSnapshot(period.id);
      if ("error" in prepared) {
        summary.skipped.push({
          periodId: period.id,
          ano: period.ano,
          mes: period.mes,
          reason: prepared.error,
        });
        continue;
      }

      const policyConfig = period.policy.configuracaoJson as PolicyConfig;
      const beforeSnapshot = {
        estado: period.estado,
        totals: {
          totalBruto: toXofInteger(period.totalBruto ?? 0),
          totalLiquido: toXofInteger(period.totalLiquido ?? 0),
          totalFolha: toXofInteger(period.totalFolha ?? 0),
        },
        lines: period.lines,
        projectPayments: period.projectPayments,
        participants: period.participants,
        periodProjects: period.periodProjects,
      };

      const payload =
        policyConfig.tipo === "actual_2024"
          ? await buildActual2024CalculatedPayload({
              periodId: period.id,
              policyConfig,
            })
          : await buildGuia2026CalculatedPayload({
              periodId: period.id,
              policyConfig,
            });

      await persistCalculatedPeriod({
        periodId: period.id,
        totalBruto: payload.totalBruto,
        totalLiquido: payload.totalLiquido,
        totalFolha: payload.totalFolha,
        lines: payload.lines,
        payments: payload.payments,
        estado: period.estado,
      });

      await insertAuditLog({
        userId: actor.dbUser.id,
        acao: "historical_recalculate",
        entidade: "salary_periods",
        entidadeId: period.id,
        dadosAntes: beforeSnapshot,
        dadosDepois: {
          estado: period.estado,
          totals: {
            totalBruto: payload.totalBruto,
            totalLiquido: payload.totalLiquido,
            totalFolha: payload.totalFolha,
          },
          lineCount: payload.lines.length,
          paymentCount: payload.payments.length,
          warnings: payload.warnings,
        },
      });

      summary.periods.push({
        periodId: period.id,
        ano: period.ano,
        mes: period.mes,
        estado: period.estado,
        totalLiquidoAntes: toXofInteger(period.totalLiquido ?? 0),
        totalLiquidoDepois: payload.totalLiquido,
        totalFolhaAntes: toXofInteger(period.totalFolha ?? 0),
        totalFolhaDepois: payload.totalFolha,
        warnings: payload.warnings,
      });
    } catch (error) {
      summary.skipped.push({
        periodId: period.id,
        ano: period.ano,
        mes: period.mes,
        reason:
          error instanceof Error
            ? error.message
            : "Erro ao recalcular período histórico",
      });
    }
  }

  revalidatePath("/admin/salary");
  return summary;
}

export async function updateParticipant(
  participantId: string,
  input: z.infer<typeof updateParticipantSchema>,
) {
  const actor = await requirePayrollAdmin();
  if ("error" in actor) return { error: actor.error };

  const parsed = updateParticipantSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos" };
  }

  const participant = await dbAdmin.query.salaryPeriodParticipants.findFirst({
    where: eq(salaryPeriodParticipants.id, participantId),
    with: {
      period: { columns: { id: true, estado: true } },
    },
  });

  if (!participant) {
    return { error: "Participante nao encontrado" };
  }
  if (!["aberto", "calculado"].includes(participant.period.estado)) {
    return { error: "Este periodo ja nao pode ser alterado" };
  }

  try {
    await dbAdmin.transaction(async (tx) => {
      if (parsed.data.recebeRubricaGestao) {
        await tx
          .update(salaryPeriodParticipants)
          .set({ recebeRubricaGestao: false })
          .where(eq(salaryPeriodParticipants.periodId, participant.period.id));
      }

      await tx
        .update(salaryPeriodParticipants)
        .set({
          isElegivelSubsidio: parsed.data.isElegivelSubsidio,
          recebeRubricaGestao: parsed.data.recebeRubricaGestao,
          salarioBaseOverride:
            parsed.data.salarioBaseOverride === null
              ? null
              : toXofString(parsed.data.salarioBaseOverride),
          updatedAt: new Date(),
        })
        .where(eq(salaryPeriodParticipants.id, participantId));

      await tx.delete(salaryLines).where(eq(salaryLines.periodId, participant.period.id));
      await tx
        .delete(projectPaymentsTable)
        .where(eq(projectPaymentsTable.periodId, participant.period.id));
      await tx
        .update(salaryPeriods)
        .set({
          estado: "aberto",
          totalBruto: "0",
          totalLiquido: "0",
          totalFolha: "0",
        })
        .where(eq(salaryPeriods.id, participant.period.id));
    });

    await insertAuditLog({
      userId: actor.dbUser.id,
      acao: "update_participant",
      entidade: "salary_period_participants",
      entidadeId: participantId,
      dadosAntes: {
        isElegivelSubsidio: participant.isElegivelSubsidio,
        recebeRubricaGestao: participant.recebeRubricaGestao,
        salarioBaseOverride: participant.salarioBaseOverride,
      },
      dadosDepois: parsed.data,
    });

    revalidatePath(`/admin/salary/${participant.period.id}`);
    revalidatePath("/admin/salary");
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Erro ao actualizar participante",
    };
  }
}

export async function updateSalaryLine(
  lineId: string,
  input: z.infer<typeof updateSalaryLineSchema>,
) {
  const actor = await requirePayrollAdmin();
  if ("error" in actor) return { error: actor.error };

  const parsed = updateSalaryLineSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos" };
  }

  const line = await dbAdmin.query.salaryLines.findFirst({
    where: eq(salaryLines.id, lineId),
    with: {
      period: { columns: { id: true, estado: true } },
      user: { columns: { percentagemDescontoFolha: true } },
    },
  });

  if (!line) {
    return { error: "Linha salarial nao encontrada" };
  }
  if (line.period.estado !== "calculado") {
    return { error: "Apenas linhas de periodos calculados podem ser ajustadas" };
  }

  const totalBrutoCalculado = toXofInteger(line.totalBrutoCalculado ?? 0);
  const totalBrutoFinal = toXofInteger(parsed.data.totalBrutoFinal);
  const changed = Math.abs(totalBrutoFinal - totalBrutoCalculado) > 0.0001;
  const overrideMotivo = parsed.data.overrideMotivo?.trim() ?? "";

  if (changed && !overrideMotivo) {
    return { error: "Motivo obrigatorio quando alteras o total bruto final" };
  }

  const descontoPercentagem = Number(line.user.percentagemDescontoFolha ?? 0);
  const descontoValor = Math.round(totalBrutoFinal * descontoPercentagem);
  const totalLiquidoFinal = totalBrutoFinal - descontoValor;

  const before = {
    totalBrutoFinal: toXofInteger(line.totalBrutoFinal),
    totalLiquidoFinal: toXofInteger(line.totalLiquidoFinal),
    descontos: toXofInteger(line.descontos),
    overrideMotivo: line.overrideMotivo,
  };

  await dbAdmin
    .update(salaryLines)
    .set({
      descontos: String(descontoValor),
      totalBrutoFinal: String(totalBrutoFinal),
      totalLiquidoFinal: String(totalLiquidoFinal),
      overrideMotivo: changed ? overrideMotivo : null,
    })
    .where(eq(salaryLines.id, lineId));

  await refreshPeriodTotals(line.period.id);

  await insertAuditLog({
    userId: actor.dbUser.id,
    acao: "update_line",
    entidade: "salary_lines",
    entidadeId: lineId,
    dadosAntes: before,
    dadosDepois: {
      totalBrutoFinal,
      totalLiquidoFinal,
      descontos: descontoValor,
      overrideMotivo: changed ? overrideMotivo : null,
    },
  });

  revalidatePath(`/admin/salary/${line.period.id}`);
  revalidatePath("/admin/salary");
  return { success: true };
}

export async function deletePeriod(periodId: string) {
  const actor = await requirePayrollAdmin();
  if ("error" in actor) return { error: actor.error };

  const period = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, periodId),
    with: {
      participants: true,
      periodProjects: true,
      lines: true,
      projectPayments: true,
    },
  });

  if (!period) {
    return { error: "Periodo nao encontrado" };
  }
  if (!["aberto", "calculado"].includes(period.estado)) {
    return {
      error: "So e permitido eliminar periodos em estado aberto ou calculado",
    };
  }

  await dbAdmin.delete(salaryPeriods).where(eq(salaryPeriods.id, periodId));

  await insertAuditLog({
    userId: actor.dbUser.id,
    acao: "delete",
    entidade: "salary_periods",
    entidadeId: periodId,
    dadosAntes: {
      period: {
        id: period.id,
        ano: period.ano,
        mes: period.mes,
        estado: period.estado,
      },
      participants: period.participants,
      periodProjects: period.periodProjects,
      lines: period.lines,
      projectPayments: period.projectPayments,
    },
  });

  revalidatePath("/admin/salary");
  return { success: true };
}

export async function confirmPeriod(periodId: string) {
  const actor = await requirePayrollAdmin();
  if ("error" in actor) return { error: actor.error };

  const period = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, periodId),
  });
  if (!period) return { error: "Periodo nao encontrado" };
  if (period.estado !== "calculado") {
    return { error: "Apenas periodos calculados podem ser confirmados" };
  }

  await dbAdmin
    .update(salaryPeriods)
    .set({
      estado: "confirmado",
      confirmadoEm: new Date(),
      confirmadoPor: actor.dbUser.id,
    })
    .where(eq(salaryPeriods.id, periodId));

  await insertAuditLog({
    userId: actor.dbUser.id,
    acao: "confirm",
    entidade: "salary_periods",
    entidadeId: periodId,
  });

  revalidatePath(`/admin/salary/${periodId}`);
  revalidatePath("/admin/salary");
  return { success: true };
}

export async function annulPeriodApproval(periodId: string) {
  const actor = await requirePayrollAdmin();
  if ("error" in actor) return { error: actor.error };

  const period = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, periodId),
    with: {
      lines: true,
      projectPayments: true,
    },
  });

  if (!period) return { error: "Periodo nao encontrado" };
  if (period.estado !== "confirmado") {
    return {
      error: "So e permitido anular a aprovacao de periodos confirmados",
    };
  }

  await dbAdmin
    .update(salaryPeriods)
    .set({
      estado: "calculado",
      confirmadoEm: null,
      confirmadoPor: null,
    })
    .where(eq(salaryPeriods.id, periodId));

  await insertAuditLog({
    userId: actor.dbUser.id,
    acao: "annul_approval",
    entidade: "salary_periods",
    entidadeId: periodId,
    dadosAntes: {
      estado: period.estado,
      confirmadoEm: period.confirmadoEm,
      confirmadoPor: period.confirmadoPor,
      lineCount: period.lines.length,
      paymentCount: period.projectPayments.length,
    },
    dadosDepois: {
      estado: "calculado",
      confirmadoEm: null,
      confirmadoPor: null,
    },
  });

  revalidatePath(`/admin/salary/${periodId}`);
  revalidatePath("/admin/salary");
  return { success: true };
}

export async function markLinePaid(
  lineId: string,
  data: { dataPagamento: string; referenciaPagamento?: string },
) {
  const actor = await requirePayrollAdmin();
  if ("error" in actor) return { error: actor.error };

  await dbAdmin
    .update(salaryLines)
    .set({
      pago: true,
      dataPagamento: data.dataPagamento,
      referenciaPagamento: data.referenciaPagamento ?? null,
    })
    .where(eq(salaryLines.id, lineId));

  const line = await dbAdmin.query.salaryLines.findFirst({
    where: eq(salaryLines.id, lineId),
    columns: { periodId: true },
  });

  if (line) {
    const unpaid = await dbAdmin.query.salaryLines.findMany({
      where: and(eq(salaryLines.periodId, line.periodId), eq(salaryLines.pago, false)),
      columns: { id: true },
    });

    if (unpaid.length === 0) {
      await dbAdmin
        .update(salaryPeriods)
        .set({ estado: "pago" })
        .where(eq(salaryPeriods.id, line.periodId));
      revalidatePath("/admin/salary");
    }

    revalidatePath(`/admin/salary/${line.periodId}`);
  }

  return { success: true };
}

async function calculateActual2024Period(args: {
  periodId: string;
  policyConfig: Actual2024PolicyConfig;
  actorId: string;
}): Promise<CalculatePeriodResult> {
  const period = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, args.periodId),
    columns: { id: true },
  });

  if (!period) {
    return { error: "Periodo nao encontrado" };
  }

  const payload = await buildActual2024CalculatedPayload({
    periodId: args.periodId,
    policyConfig: args.policyConfig,
  });

  await persistCalculatedPeriod({
    periodId: period.id,
    totalBruto: payload.totalBruto,
    totalLiquido: payload.totalLiquido,
    totalFolha: payload.totalFolha,
    lines: payload.lines,
    payments: payload.payments,
  });

  await insertAuditLog({
    userId: args.actorId,
    acao: "calculate",
    entidade: "salary_periods",
    entidadeId: period.id,
    dadosDepois: {
      totalBruto: payload.totalBruto,
      totalLiquido: payload.totalLiquido,
      totalFolha: payload.totalFolha,
      warnings: payload.warnings,
    },
  });

  revalidatePath(`/admin/salary/${period.id}`);
  revalidatePath("/admin/salary");
  return { success: true, periodId: period.id, warnings: payload.warnings };
}

async function calculateGuia2026Period(args: {
  periodId: string;
  policyConfig: Guia2026PolicyConfig;
  actorId: string;
}): Promise<CalculatePeriodResult> {
  const period = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, args.periodId),
    with: {
      periodProjects: true,
    },
  });

  if (!period) {
    return { error: "Periodo nao encontrado" };
  }

  const payload = await buildGuia2026CalculatedPayload({
    periodId: args.periodId,
    policyConfig: args.policyConfig,
  });

  await persistCalculatedPeriod({
    periodId: period.id,
    totalBruto: payload.totalBruto,
    totalLiquido: payload.totalLiquido,
    totalFolha: payload.totalFolha,
    lines: payload.lines,
    payments: payload.payments,
  });

  await insertAuditLog({
    userId: args.actorId,
    acao: "calculate",
    entidade: "salary_periods",
    entidadeId: period.id,
    dadosDepois: {
      totalBruto: payload.totalBruto,
      totalLiquido: payload.totalLiquido,
      totalFolha: payload.totalFolha,
    },
  });

  revalidatePath(`/admin/salary/${period.id}`);
  revalidatePath("/admin/salary");
  return { success: true, periodId: period.id, warnings: payload.warnings };
}

async function persistCalculatedPeriod(args: {
  periodId: string;
  totalBruto: number;
  totalLiquido: number;
  totalFolha: number;
  lines: Array<Record<string, unknown>>;
  payments: Array<Record<string, unknown>>;
  estado?: "aberto" | "calculado" | "confirmado" | "pago";
}) {
  await dbAdmin.transaction(async (tx) => {
    await tx.delete(salaryLines).where(eq(salaryLines.periodId, args.periodId));
    await tx.delete(projectPaymentsTable).where(eq(projectPaymentsTable.periodId, args.periodId));

    if (args.lines.length > 0) {
      await tx.insert(salaryLines).values(args.lines as never);
    }
    if (args.payments.length > 0) {
      await tx.insert(projectPaymentsTable).values(args.payments as never);
    }

    await tx
      .update(salaryPeriods)
      .set({
        estado: args.estado ?? "calculado",
        totalBruto: toXofString(args.totalBruto),
        totalLiquido: toXofString(args.totalLiquido),
        totalFolha: toXofString(args.totalFolha),
      })
      .where(eq(salaryPeriods.id, args.periodId));
  });
}

async function ensureHistoricalPeriodSnapshot(
  periodId: string,
): Promise<EnsureHistoricalPeriodSnapshotResult> {
  const period = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, periodId),
    with: {
      participants: true,
      periodProjects: true,
      lines: true,
      projectPayments: true,
    },
  });

  if (!period) {
    return { error: "Periodo nao encontrado" };
  }

  const candidateUserIds = Array.from(
    new Set([
      ...period.participants.map((entry) => entry.userId),
      ...period.lines.map((entry) => entry.userId),
      ...period.projectPayments.map((entry) => entry.userId),
    ]),
  );

  const referencedUsers =
    candidateUserIds.length > 0
      ? await dbAdmin.query.users.findMany({
          where: (table, { inArray }) => inArray(table.id, candidateUserIds),
          columns: {
            id: true,
            role: true,
            elegivelSubsidioDinamicoDefault: true,
          },
        })
      : [];

  const legacyRubricaCandidates = Array.from(
    new Set(
      period.projectPayments
        .filter((entry) => entry.papel === "dg" || entry.papel === "coord")
        .map((entry) => entry.userId),
    ),
  );

  let defaultRubricaUserId =
    legacyRubricaCandidates.length === 1 ? legacyRubricaCandidates[0] : null;

  if (!defaultRubricaUserId) {
    const activeDgs = await dbAdmin.query.users.findMany({
      where: and(eq(users.activo, true), eq(users.role, "dg")),
      columns: { id: true },
    });
    if (activeDgs.length === 1) {
      defaultRubricaUserId = activeDgs[0].id;
    }
  }

  await dbAdmin.transaction(async (tx) => {
    const existingParticipantIds = new Set(
      period.participants.map((entry) => entry.userId),
    );
    const participantsToInsert = referencedUsers
      .filter((entry) => !existingParticipantIds.has(entry.id))
      .map((entry) => ({
        periodId,
        userId: entry.id,
        isElegivelSubsidio: entry.elegivelSubsidioDinamicoDefault,
        recebeRubricaGestao: entry.id === defaultRubricaUserId,
        salarioBaseOverride: null,
      }));

    if (period.participants.length === 0 && participantsToInsert.length === 0) {
      return;
    }

    if (participantsToInsert.length > 0) {
      await tx
        .insert(salaryPeriodParticipants)
        .values(participantsToInsert)
        .onConflictDoNothing();
    }

    if (period.periodProjects.length === 0) {
      const projectSnapshotMap = new Map<
        string,
        { valorLiquido: number; pfPercentagemOverride: number | null; coordId: string | null }
      >();

      for (const payment of period.projectPayments) {
        const current = projectSnapshotMap.get(payment.projectId);
        const valorLiquidoProjecto = Number(payment.valorLiquidoProjecto ?? 0);
        const percentagemAplicada = Number(payment.percentagemAplicada ?? 0);

        if (!current) {
          projectSnapshotMap.set(payment.projectId, {
            valorLiquido: valorLiquidoProjecto,
            pfPercentagemOverride:
              payment.papel === "pf" ? percentagemAplicada : null,
            coordId: payment.papel === "coord" ? payment.userId : null,
          });
          continue;
        }

        current.valorLiquido = Math.max(current.valorLiquido, valorLiquidoProjecto);
        if (current.pfPercentagemOverride === null && payment.papel === "pf") {
          current.pfPercentagemOverride = percentagemAplicada;
        }
        if (current.coordId === null && payment.papel === "coord") {
          current.coordId = payment.userId;
        }
      }

      if (projectSnapshotMap.size === 0) {
        return;
      }

      await tx
        .insert(salaryPeriodProjects)
        .values(
          Array.from(projectSnapshotMap.entries()).map(([projectId, snapshot]) => ({
            periodId,
            projectId,
            valorLiquido: toXofString(snapshot.valorLiquido),
            pfPercentagemOverride:
              snapshot.pfPercentagemOverride === null
                ? null
                : String(snapshot.pfPercentagemOverride),
            coordId: snapshot.coordId,
          })),
        )
        .onConflictDoNothing();
    }
  });

  const refreshed = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, periodId),
    with: {
      participants: true,
      periodProjects: true,
    },
  });

  if (!refreshed) {
    return { error: "Periodo nao encontrado apos preparar snapshot" };
  }
  if (refreshed.participants.length === 0) {
    return { error: "Periodo sem participantes suficientes para recalcular" };
  }
  if (refreshed.periodProjects.length === 0) {
    return { error: "Periodo sem snapshot de projectos para recalcular" };
  }

  return { success: true };
}

async function buildActual2024CalculatedPayload(args: {
  periodId: string;
  policyConfig: Actual2024PolicyConfig;
}): Promise<CalculatedPeriodPayload> {
  const engineInput = await loadActual2024EngineInput(
    args.periodId,
    args.policyConfig,
  );
  const result = calculateActual2024(engineInput);

  return {
    totalBruto: toXofInteger(result.aggregates.totalFolhaBruto),
    totalLiquido: toXofInteger(result.aggregates.totalFolhaLiquido),
    totalFolha: toXofInteger(result.aggregates.totalFolhaBruto),
    lines: result.salaryLines.map((line) => ({
      periodId: args.periodId,
      userId: line.userId,
      salarioBase: toXofString(line.salarioBase),
      componenteDinamica: line.componenteDinamica,
      subsidios: line.subsidios,
      outrosBeneficios: toXofString(line.outrosBeneficios),
      descontos: toXofString(line.descontoValor),
      totalBrutoCalculado: toXofString(line.totalBrutoCalculado),
      totalBrutoFinal: toXofString(line.totalBrutoCalculado),
      totalLiquidoCalculado: toXofString(line.totalLiquidoCalculado),
      totalLiquidoFinal: toXofString(line.totalLiquidoCalculado),
      overrideMotivo: null,
      pago: false,
      dataPagamento: null,
      referenciaPagamento: null,
      reciboUrl: null,
    })),
    payments: result.projectPayments.map((payment) => ({
      periodId: args.periodId,
      projectId: payment.projectId,
      userId: payment.userId,
      papel: payment.papel,
      percentagemAplicada: String(payment.percentagemAplicada),
      valorLiquidoProjecto: toXofString(payment.valorLiquidoProjecto),
      valorRecebido: toXofString(payment.valorRecebido),
    })),
    warnings: result.warnings,
  };
}

async function buildGuia2026CalculatedPayload(args: {
  periodId: string;
  policyConfig: Guia2026PolicyConfig;
}): Promise<CalculatedPeriodPayload> {
  const period = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, args.periodId),
    with: {
      periodProjects: true,
      lines: { columns: { userId: true } },
      participants: { columns: { userId: true } },
      projectPayments: { columns: { userId: true } },
    },
  });

  if (!period) {
    throw new Error("Periodo nao encontrado");
  }

  const candidateUserIds = Array.from(
    new Set([
      ...period.participants.map((entry) => entry.userId),
      ...period.lines.map((entry) => entry.userId),
      ...period.projectPayments.map((entry) => entry.userId),
    ]),
  );

  const userRows =
    candidateUserIds.length > 0
      ? await dbAdmin.query.users.findMany({
          where: (table, { inArray }) => inArray(table.id, candidateUserIds),
          columns: {
            id: true,
            nomeCurto: true,
            role: true,
            salarioBaseMensal: true,
          },
        })
      : await dbAdmin.query.users.findMany({
          where: eq(users.activo, true),
          columns: {
            id: true,
            nomeCurto: true,
            role: true,
            salarioBaseMensal: true,
          },
        });

  const staffInput: StaffInput[] = userRows.map((user) => ({
    id: user.id,
    nomeCurto: user.nomeCurto,
    role: user.role,
    salarioBase: toXofInteger(user.salarioBaseMensal ?? 0),
  }));

  const projectsById = await loadProjectsForPeriod(period.periodProjects);
  const projectInputs: ProjectInput[] = period.periodProjects.map((entry) => {
    const project = projectsById.get(entry.projectId);
    if (!project) throw new Error(`Projecto ${entry.projectId} nao encontrado`);
    return {
      id: project.id,
      titulo: project.titulo,
      valorLiquido: toXofInteger(entry.valorLiquido),
      pontoFocalId: project.pontoFocalId,
      pfPercentagemOverride:
        entry.pfPercentagemOverride !== null
          ? Number(entry.pfPercentagemOverride)
          : null,
      coordId: entry.coordId,
      assistants: project.assistants.map((assistant) => ({
        userId: assistant.userId,
        percentagemOverride:
          assistant.percentagemOverride !== null
            ? Number(assistant.percentagemOverride)
            : null,
      })),
    };
  });

  const result = calculateGuia2026(args.policyConfig, projectInputs, staffInput, []);

  return {
    totalBruto: toXofInteger(result.summary.totalBruto),
    totalLiquido: toXofInteger(result.summary.totalLiquido),
    totalFolha: toXofInteger(result.summary.totalFolha),
    lines: result.lines.map((line) => ({
      periodId: args.periodId,
      userId: line.userId,
      salarioBase: toXofString(line.salarioBase),
      componenteDinamica: line.componenteDinamica,
      subsidios: line.subsidios,
      outrosBeneficios: toXofString(line.outrosBeneficios),
      descontos: toXofString(line.descontos),
      totalBrutoCalculado: toXofString(line.totalBruto),
      totalBrutoFinal: toXofString(line.totalBruto),
      totalLiquidoCalculado: toXofString(line.totalLiquido),
      totalLiquidoFinal: toXofString(line.totalLiquido),
      overrideMotivo: null,
      pago: false,
      dataPagamento: null,
      referenciaPagamento: null,
      reciboUrl: null,
    })),
    payments: result.projectPayments.map((payment) => ({
      periodId: args.periodId,
      projectId: payment.projectId,
      userId: payment.userId,
      papel: payment.papel,
      percentagemAplicada: String(payment.percentagemAplicada),
      valorLiquidoProjecto: toXofString(payment.valorLiquidoProjecto),
      valorRecebido: toXofString(payment.valorRecebido),
    })),
    warnings: [],
  };
}

async function buildActual2024Preview(
  periodId: string,
  policyConfig: Actual2024PolicyConfig,
): Promise<CalculateActual2024Output> {
  const engineInput = await loadActual2024EngineInput(periodId, policyConfig);
  return calculateActual2024(engineInput);
}

async function loadActual2024EngineInput(
  periodId: string,
  policyConfig: Actual2024PolicyConfig,
): Promise<CalculateActual2024Input> {
  const period = await dbAdmin.query.salaryPeriods.findFirst({
    where: eq(salaryPeriods.id, periodId),
    with: {
      periodProjects: true,
      participants: true,
    },
  });

  if (!period) {
    throw new Error("Periodo nao encontrado");
  }

  const usersInput = await loadUsersForParticipants(period.participants);
  const projectsById = await loadProjectsForPeriod(period.periodProjects);
  const monthExpenses = await loadExpensesForMonth(period.ano, period.mes);

  return {
    period: { year: period.ano, month: period.mes },
    projects: period.periodProjects.map((entry) => {
      const project = projectsById.get(entry.projectId);
      if (!project) throw new Error(`Projecto ${entry.projectId} nao encontrado`);
      return {
        id: project.id,
        titulo: project.titulo,
        valorLiquido: toXofInteger(entry.valorLiquido),
        pontoFocalId: project.pontoFocalId,
        percentagemPf:
          entry.pfPercentagemOverride !== null
            ? Number(entry.pfPercentagemOverride)
            : project.percentagemPf !== null
              ? Number(project.percentagemPf)
              : null,
        percentagemAuxTotal:
          project.percentagemAuxTotal !== null
            ? Number(project.percentagemAuxTotal)
            : null,
        percentagemRubricaGestao:
          project.percentagemRubricaGestao !== null
            ? Number(project.percentagemRubricaGestao)
            : null,
        assistants: project.assistants.map((assistant) => ({
          userId: assistant.userId,
          percentagemOverride:
            assistant.percentagemOverride !== null
              ? Number(assistant.percentagemOverride)
              : null,
        })),
      } satisfies ProjectWithAssignmentsInput;
    }),
    participants: period.participants.map((entry) => ({
      userId: entry.userId,
      isElegivelSubsidio: entry.isElegivelSubsidio,
      recebeRubricaGestao: entry.recebeRubricaGestao,
      salarioBaseOverride:
        entry.salarioBaseOverride !== null
          ? toXofInteger(entry.salarioBaseOverride)
          : null,
    })),
    expenses: monthExpenses.map((expense) => ({
      id: expense.id,
      valorXof: toXofInteger(expense.valorXof),
      moeda: expense.moeda,
      projectId: expense.projectId,
      beneficiarioUserId: expense.beneficiarioUserId,
    })) satisfies ExpenseForSalary[],
    users: usersInput,
    policyDefaults: extractActual2024Defaults(policyConfig),
  };
}

async function loadUsersForParticipants(
  participants: Array<{ userId: string }>,
): Promise<UserForSalary[]> {
  const userIds = participants.map((entry) => entry.userId);
  if (userIds.length === 0) {
    return [];
  }

  const rows = await dbAdmin.query.users.findMany({
    where: (table, { inArray }) => inArray(table.id, userIds),
    columns: {
      id: true,
      nomeCurto: true,
      role: true,
      salarioBaseMensal: true,
      percentagemDescontoFolha: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    nomeCurto: row.nomeCurto,
    role: row.role,
    salarioBaseMensal: toXofInteger(row.salarioBaseMensal ?? 0),
    percentagemDescontoFolha: Number(row.percentagemDescontoFolha ?? 0),
  }));
}

async function loadProjectsForPeriod(
  periodProjects: Array<{ projectId: string }>,
): Promise<Map<string, LoadedProjectForSalary>> {
  const projectIds = periodProjects.map((entry) => entry.projectId);
  if (projectIds.length === 0) {
    return new Map();
  }

  const rows = await dbAdmin.query.projects.findMany({
    where: (table, { inArray }) => inArray(table.id, projectIds),
    with: {
      assistants: { columns: { userId: true, percentagemOverride: true } },
    },
    columns: {
      id: true,
      titulo: true,
      pontoFocalId: true,
      percentagemPf: true,
      percentagemAuxTotal: true,
      percentagemRubricaGestao: true,
    },
  });

  return new Map(rows.map((row) => [row.id, row]));
}

async function loadExpensesForMonth(ano: number, mes: number) {
  const { start, end } = getMonthBounds(ano, mes);
  const rows = await dbAdmin.query.expenses.findMany({
    where: and(gte(expenses.data, start), lte(expenses.data, end)),
    columns: {
      id: true,
      valorXof: true,
      moeda: true,
      projectId: true,
      beneficiarioUserId: true,
      estado: true,
    },
    orderBy: [desc(expenses.data)],
  });

  return rows.filter((entry) => entry.estado !== "anulada");
}

function extractActual2024Defaults(
  policy: Actual2024PolicyConfig,
): Actual2024PolicyDefaults {
  return {
    percentagem_pf: policy.percentagens.pf_0aux ?? 0.3,
    percentagem_aux_total: policy.percentagens.aux_1aux ?? 0.15,
    percentagem_rubrica_gestao: policy.percentagens.dg ?? 0.05,
    percentagem_subsidio: policy.subsidio.percentagem ?? 0.22,
    percentagem_pf_0aux: policy.percentagens.pf_0aux ?? 0.3,
    percentagem_pf_1aux: policy.percentagens.pf_1aux ?? 0.3,
    percentagem_pf_2aux: policy.percentagens.pf_2aux ?? 0.25,
    percentagem_aux_1aux: policy.percentagens.aux_1aux ?? 0.15,
    percentagem_aux_2aux: policy.percentagens.aux_2aux ?? 0.1,
  };
}

function getMonthBounds(ano: number, mes: number) {
  const start = `${ano}-${String(mes).padStart(2, "0")}-01`;
  const endDate = new Date(ano, mes, 0);
  const end = `${ano}-${String(mes).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
  return { start, end };
}

async function refreshPeriodTotals(periodId: string) {
  const lines = await dbAdmin.query.salaryLines.findMany({
    where: eq(salaryLines.periodId, periodId),
    columns: {
      totalBrutoFinal: true,
      totalLiquidoFinal: true,
    },
  });

  const totalBruto = toXofInteger(lines.reduce(
    (sum, line) => sum + toXofInteger(line.totalBrutoFinal ?? 0),
    0,
  ));
  const totalLiquido = toXofInteger(lines.reduce(
    (sum, line) => sum + toXofInteger(line.totalLiquidoFinal ?? 0),
    0,
  ));

  await dbAdmin
    .update(salaryPeriods)
    .set({
      totalBruto: toXofString(totalBruto),
      totalLiquido: toXofString(totalLiquido),
      totalFolha: toXofString(totalBruto),
    })
    .where(eq(salaryPeriods.id, periodId));
}

async function requirePayrollAdmin(): Promise<PayrollAdminResult> {
  const authorization = await authorizeOperation("salaryWrite");
  if (!authorization.success) return { error: authorization.error };
  return { dbUser: authorization.dbUser };
}
