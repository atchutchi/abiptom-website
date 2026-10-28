"use server";

import { z } from "zod-core";
import { dbAdmin } from "@/core/lib/db";
import {
  dividendPeriods,
  dividendLines,
  partnerShares,
} from "@/core/lib/db/schema";
import { eq, and, desc, isNull, or, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { isOperationAllowed } from "@/core/lib/auth/authorization";
import { insertAuditLog } from "@/core/lib/db/audit";
import { headers } from "next/headers";
import { toXofInteger, toXofString } from "@/core/lib/utils/money";

const createPeriodSchema = z.object({
  ano: z.coerce.number().int().min(2020).max(2100),
  trimestre: z.coerce.number().int().min(1).max(4).optional().nullable(),
  baseCalculada: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Valor base inválido"),
  notas: z.string().optional(),
});

function parseCreate(formData: FormData) {
  const trimestreRaw = formData.get("trimestre");
  return createPeriodSchema.safeParse({
    ano: formData.get("ano"),
    trimestre:
      trimestreRaw && trimestreRaw !== "" ? trimestreRaw : undefined,
    baseCalculada: formData.get("baseCalculada"),
    notas: formData.get("notas") || undefined,
  });
}

function assertAdmin(role: Parameters<typeof isOperationAllowed>[1]) {
  if (!isOperationAllowed("dividendsWrite", role)) {
    throw new Error("Sem permissão");
  }
}

export async function listDividendPeriods() {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  assertAdmin(dbUser.role);

  return dbAdmin.query.dividendPeriods.findMany({
    orderBy: [desc(dividendPeriods.ano), desc(dividendPeriods.createdAt)],
  });
}

export async function getDividendPeriod(id: string) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  assertAdmin(dbUser.role);

  return dbAdmin.query.dividendPeriods.findFirst({
    where: eq(dividendPeriods.id, id),
    with: {
      criadoPor: { columns: { nomeCurto: true } },
      aprovadoPor: { columns: { nomeCurto: true } },
      lines: {
        with: {
          user: {
            columns: { id: true, nomeCurto: true, nomeCompleto: true },
          },
        },
      },
    },
  });
}

export async function createDividendPeriod(_: unknown, formData: FormData) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!isOperationAllowed("dividendsWrite", dbUser.role)) {
    return { error: "Sem permissão" };
  }

  const parsed = parseCreate(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { ano, trimestre, baseCalculada, notas } = parsed.data;

  const today = new Date().toISOString().split("T")[0];
  const activeShares = await dbAdmin
    .select()
    .from(partnerShares)
    .where(
      and(
        or(
          isNull(partnerShares.dataFim),
          gte(partnerShares.dataFim, today)
        )
      )
    );

  if (activeShares.length === 0) {
    return { error: "Não há quotas de sócios activas" };
  }

  const totalPct = activeShares.reduce(
    (sum, s) => sum + Number(s.percentagemQuota),
    0
  );
  if (totalPct > 100.01) {
    return { error: `Quotas somam ${totalPct}% (máximo 100%)` };
  }

  const base = toXofInteger(baseCalculada);

  const [period] = await dbAdmin
    .insert(dividendPeriods)
    .values({
      ano,
      trimestre: trimestre ?? null,
      baseCalculada: toXofString(base),
      totalDistribuido: "0",
      notas,
      criadoPor: dbUser.id,
    })
    .returning();

  let totalDistribuido = 0;
  const linesToInsert = activeShares.map((share) => {
    const pct = Number(share.percentagemQuota);
    const valorBruto = toXofInteger((base * pct) / 100);
    totalDistribuido += valorBruto;
    return {
      periodId: period.id,
      userId: share.userId,
      percentagemQuota: share.percentagemQuota,
      valorBruto: toXofString(valorBruto),
    };
  });

  await dbAdmin.insert(dividendLines).values(linesToInsert);

  await dbAdmin
    .update(dividendPeriods)
    .set({ totalDistribuido: toXofString(totalDistribuido) })
    .where(eq(dividendPeriods.id, period.id));

  const hdrs = await headers();
  await insertAuditLog({
    userId: dbUser.id,
    acao: "create",
    entidade: "dividend_periods",
    entidadeId: period.id,
    dadosDepois: { ano, trimestre, baseCalculada, linhas: linesToInsert.length },
    ip: hdrs.get("x-forwarded-for") ?? undefined,
    userAgent: hdrs.get("user-agent") ?? undefined,
  });

  revalidatePath("/admin/dividends");
  return { success: true, id: period.id };
}

export async function approveDividendPeriod(id: string) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  assertAdmin(dbUser.role);

  const before = await dbAdmin.query.dividendPeriods.findFirst({
    where: eq(dividendPeriods.id, id),
  });
  if (!before) throw new Error("Período não encontrado");
  if (before.estado !== "proposto") {
    throw new Error("Apenas propostos podem ser aprovados");
  }

  await dbAdmin
    .update(dividendPeriods)
    .set({
      estado: "aprovado",
      aprovadoPor: dbUser.id,
      aprovadoEm: new Date(),
    })
    .where(eq(dividendPeriods.id, id));

  await insertAuditLog({
    userId: dbUser.id,
    acao: "approve",
    entidade: "dividend_periods",
    entidadeId: id,
  });

  revalidatePath("/admin/dividends");
  revalidatePath(`/admin/dividends/${id}`);
}

export async function markDividendLinePaid(
  lineId: string,
  dataPagamento: string,
  referencia?: string
) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  assertAdmin(dbUser.role);

  const line = await dbAdmin.query.dividendLines.findFirst({
    where: eq(dividendLines.id, lineId),
    with: { period: true },
  });
  if (!line) throw new Error("Linha não encontrada");
  if (line.period.estado !== "aprovado" && line.period.estado !== "pago") {
    throw new Error("Período tem de estar aprovado");
  }

  await dbAdmin
    .update(dividendLines)
    .set({
      pago: true,
      dataPagamento,
      referenciaPagamento: referencia ?? null,
    })
    .where(eq(dividendLines.id, lineId));

  const remainingUnpaid = await dbAdmin.query.dividendLines.findMany({
    where: and(
      eq(dividendLines.periodId, line.periodId),
      eq(dividendLines.pago, false)
    ),
  });
  if (remainingUnpaid.length === 0) {
    await dbAdmin
      .update(dividendPeriods)
      .set({ estado: "pago" })
      .where(eq(dividendPeriods.id, line.periodId));
  }

  await insertAuditLog({
    userId: dbUser.id,
    acao: "mark_paid",
    entidade: "dividend_lines",
    entidadeId: lineId,
    dadosDepois: { dataPagamento, referencia },
  });

  revalidatePath("/admin/dividends");
  revalidatePath(`/admin/dividends/${line.periodId}`);
}

export async function cancelDividendPeriod(id: string, motivo: string) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  assertAdmin(dbUser.role);

  const before = await dbAdmin.query.dividendPeriods.findFirst({
    where: eq(dividendPeriods.id, id),
  });
  if (!before) throw new Error("Período não encontrado");
  if (before.estado === "pago") {
    throw new Error("Não é possível anular um período já pago");
  }

  await dbAdmin
    .update(dividendPeriods)
    .set({ estado: "anulado", notas: motivo })
    .where(eq(dividendPeriods.id, id));

  await insertAuditLog({
    userId: dbUser.id,
    acao: "cancel",
    entidade: "dividend_periods",
    entidadeId: id,
    dadosDepois: { motivo },
  });

  revalidatePath("/admin/dividends");
  revalidatePath(`/admin/dividends/${id}`);
}
