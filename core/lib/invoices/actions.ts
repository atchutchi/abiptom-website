"use server";

import { z } from "zod-core";
import { dbAdmin } from "@/core/lib/db";
import {
  invoices,
  invoiceItems,
  invoicePayments,
  projects,
  type Currency,
  type InvoiceState,
  type InvoiceType,
} from "@/core/lib/db/schema";
import { eq, and, desc, gte, lte, inArray, type SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { isOperationAllowed } from "@/core/lib/auth/authorization";
import { insertAuditLog } from "@/core/lib/db/audit";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";
import { canTransition } from "./state";
import { toCurrencyStorageString, toFiniteNumber, toXofInteger } from "@/core/lib/utils/money";

// ─── Schemas ────────────────────────────────────────────────────────────────

const itemSchema = z.object({
  ordem: z.coerce.number().int().default(1),
  descricao: z.string().min(1, "Descrição obrigatória"),
  unidade: z.string().optional(),
  quantidade: z.coerce.number().positive("Quantidade inválida"),
  precoUnitario: z.coerce.number().nonnegative("Preço inválido"),
});

const invoiceSchema = z.object({
  clientId: z.string().uuid("Cliente obrigatório"),
  projectId: z.string().uuid().optional(),
  dataEmissao: z.string().min(1, "Data de emissão obrigatória"),
  dataVencimento: z.string().optional(),
  moeda: z.enum(["XOF", "EUR", "USD"]).default("XOF"),
  taxaCambio: z.coerce.number().positive().default(1),
  igvPercentagem: z.coerce.number().min(0).max(100).default(0),
  formaPagamento: z.string().optional(),
  contaBancaria: z.string().optional(),
  observacoes: z.string().optional(),
  items: z.array(itemSchema).min(1, "Pelo menos um item obrigatório"),
});

const paymentSchema = z.object({
  data: z.string().min(1, "Data obrigatória"),
  valor: z.coerce.number().positive("Valor inválido"),
  moeda: z.enum(["XOF", "EUR", "USD"]),
  taxaCambio: z.coerce.number().positive().default(1),
  referencia: z.string().optional(),
  metodo: z.string().optional(),
  notas: z.string().optional(),
});

const paymentUpdateSchema = z.object({
  data: z.string().min(1, "Data obrigatória"),
});

const invoiceProjectUpdateSchema = z.object({
  projectId: z.string().uuid().nullable(),
});

function canManageInvoices(role: Parameters<typeof isOperationAllowed>[1]) {
  return isOperationAllowed("invoicesWrite", role);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcTotals(
  items: { quantidade: number; precoUnitario: number }[],
  igvPct: number,
  currency = "XOF",
) {
  const roundMoney = (value: number) =>
    currency === "XOF" ? toXofInteger(value) : Math.round(value * 100) / 100;
  const subtotal = items.reduce((s, i) => {
    return s + roundMoney(i.quantidade * i.precoUnitario);
  }, 0);
  const igvValor = roundMoney(subtotal * (igvPct / 100));
  const total = roundMoney(subtotal + igvValor);
  return { subtotal, igvValor, total };
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function listInvoices(filters?: {
  estado?: InvoiceState[];
  clientId?: string;
  projectId?: string;
  numero?: number;
  tipo?: InvoiceType;
  moeda?: Currency;
  mesInicio?: string;
  mesFim?: string;
  dataInicio?: string;
  dataFim?: string;
  vencidas?: boolean;
  pagoInicio?: string;
  pagoFim?: string;
}) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageInvoices(dbUser.role)) throw new Error("Sem permissão");

  const conditions: SQL[] = [];
  if (filters?.estado?.length)
    conditions.push(inArray(invoices.estado, filters.estado));
  if (filters?.clientId)
    conditions.push(eq(invoices.clientId, filters.clientId));
  if (filters?.projectId)
    conditions.push(eq(invoices.projectId, filters.projectId));
  if (filters?.numero)
    conditions.push(eq(invoices.numero, filters.numero));
  if (filters?.tipo)
    conditions.push(eq(invoices.tipo, filters.tipo));
  if (filters?.moeda)
    conditions.push(eq(invoices.moeda, filters.moeda));
  if (filters?.mesInicio)
    conditions.push(gte(invoices.dataEmissao, filters.mesInicio));
  if (filters?.mesFim)
    conditions.push(lte(invoices.dataEmissao, filters.mesFim));
  if (filters?.dataInicio)
    conditions.push(gte(invoices.dataEmissao, filters.dataInicio));
  if (filters?.dataFim)
    conditions.push(lte(invoices.dataEmissao, filters.dataFim));
  if (filters?.pagoInicio || filters?.pagoFim) {
    const paymentConditions: SQL[] = [];
    if (filters.pagoInicio)
      paymentConditions.push(gte(invoicePayments.data, filters.pagoInicio));
    if (filters.pagoFim)
      paymentConditions.push(lte(invoicePayments.data, filters.pagoFim));

    const paidRows = await dbAdmin.query.invoicePayments.findMany({
      where: paymentConditions.length ? and(...paymentConditions) : undefined,
      columns: { invoiceId: true },
    });
    const paidInvoiceIds = [...new Set(paidRows.map((row) => row.invoiceId))];

    if (paidInvoiceIds.length === 0) return [];
    conditions.push(inArray(invoices.id, paidInvoiceIds));
  }
  if (filters?.vencidas) {
    const hoje = new Date().toISOString().split("T")[0];
    conditions.push(
      inArray(invoices.estado, ["definitiva", "paga_parcial"]),
      lte(invoices.dataVencimento, hoje)
    );
  }

  return dbAdmin.query.invoices.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    with: {
      client: true,
      project: { columns: { id: true, titulo: true } },
      createdBy: { columns: { nomeCurto: true } },
    },
    orderBy: [desc(invoices.createdAt)],
  });
}

export async function getInvoice(id: string) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageInvoices(dbUser.role)) throw new Error("Sem permissão");

  return dbAdmin.query.invoices.findFirst({
    where: eq(invoices.id, id),
    with: {
      client: { with: { contacts: true } },
      project: { columns: { id: true, titulo: true } },
      items: { orderBy: (i, { asc }) => [asc(i.ordem)] },
      payments: { orderBy: (p, { desc }) => [desc(p.data)] },
      createdBy: { columns: { nomeCurto: true, nomeCompleto: true } },
    },
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createInvoice(data: z.infer<typeof invoiceSchema>) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageInvoices(dbUser.role))
    return { error: "Sem permissão" };

  const parsed = invoiceSchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const { items, igvPercentagem, ...invoiceData } = parsed.data;
  if (invoiceData.projectId) {
    const project = await dbAdmin.query.projects.findFirst({
      where: eq(projects.id, invoiceData.projectId),
      columns: { id: true, clientId: true },
    });
    if (!project) return { error: "Projecto não encontrado" };
    if (project.clientId !== invoiceData.clientId) {
      return { error: "O projecto seleccionado não pertence a este cliente" };
    }
  }

  const { subtotal, igvValor, total } = calcTotals(
    items,
    igvPercentagem,
    invoiceData.moeda,
  );

  const [created] = await dbAdmin
    .insert(invoices)
    .values({
      ...invoiceData,
      igvPercentagem: String(igvPercentagem),
      igvValor: toCurrencyStorageString(igvValor, invoiceData.moeda),
      subtotal: toCurrencyStorageString(subtotal, invoiceData.moeda),
      total: toCurrencyStorageString(total, invoiceData.moeda),
      taxaCambio: String(invoiceData.taxaCambio),
      createdBy: dbUser.id,
    })
    .returning();

  await dbAdmin.insert(invoiceItems).values(
    items.map((item, i) => ({
      invoiceId: created.id,
      ordem: i + 1,
      descricao: item.descricao,
      unidade: item.unidade ?? "serviço",
      quantidade: String(item.quantidade),
      precoUnitario: toCurrencyStorageString(item.precoUnitario, invoiceData.moeda),
      total: toCurrencyStorageString(
        item.quantidade * item.precoUnitario,
        invoiceData.moeda,
      ),
    }))
  );

  const hdrs = await headers();
  await insertAuditLog({
    userId: dbUser.id,
    acao: "create",
    entidade: "invoices",
    entidadeId: created.id,
    dadosDepois: created,
    ip: hdrs.get("x-forwarded-for") ?? undefined,
    userAgent: hdrs.get("user-agent") ?? undefined,
  });

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${created.id}`);
  return { success: true, id: created.id };
}

// ─── Update items ─────────────────────────────────────────────────────────────

export async function updateInvoiceItems(
  invoiceId: string,
  items: z.infer<typeof itemSchema>[],
  igvPercentagem: number
) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageInvoices(dbUser.role))
    return { error: "Sem permissão" };

  const invoice = await dbAdmin.query.invoices.findFirst({
    where: eq(invoices.id, invoiceId),
  });
  if (!invoice) return { error: "Factura não encontrada" };
  if (invoice.estado !== "rascunho")
    return { error: "Só é possível editar rascunhos" };

  const { subtotal, igvValor, total } = calcTotals(
    items,
    igvPercentagem,
    invoice.moeda,
  );

  await dbAdmin.delete(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));
  await dbAdmin.insert(invoiceItems).values(
    items.map((item, i) => ({
      invoiceId,
      ordem: i + 1,
      descricao: item.descricao,
      unidade: item.unidade ?? "serviço",
      quantidade: String(item.quantidade),
      precoUnitario: toCurrencyStorageString(item.precoUnitario, invoice.moeda),
      total: toCurrencyStorageString(
        item.quantidade * item.precoUnitario,
        invoice.moeda,
      ),
    }))
  );

  await dbAdmin
    .update(invoices)
    .set({
      igvPercentagem: String(igvPercentagem),
      igvValor: toCurrencyStorageString(igvValor, invoice.moeda),
      subtotal: toCurrencyStorageString(subtotal, invoice.moeda),
      total: toCurrencyStorageString(total, invoice.moeda),
    })
    .where(eq(invoices.id, invoiceId));

  revalidatePath(`/admin/invoices/${invoiceId}`);
  return { success: true };
}

// ─── State transition ─────────────────────────────────────────────────────────

export async function transitionInvoice(
  invoiceId: string,
  to: InvoiceState,
  tipo?: "proforma" | "definitiva"
) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageInvoices(dbUser.role))
    return { error: "Sem permissão" };

  const invoice = await dbAdmin.query.invoices.findFirst({
    where: eq(invoices.id, invoiceId),
  });
  if (!invoice) return { error: "Factura não encontrada" };
  if (!canTransition(invoice.estado, to))
    return { error: `Transição ${invoice.estado} → ${to} não permitida` };

  const updates: Partial<typeof invoices.$inferInsert> = { estado: to };

  // Atribui número ao sair do rascunho
  if (
    invoice.estado === "rascunho" &&
    (to === "proforma" || to === "definitiva")
  ) {
    const [{ nextval }] = await dbAdmin.execute<{ nextval: string }>(
      sql`SELECT nextval('invoice_number_seq')`
    );
    updates.numero = Number(nextval);
    updates.tipo = tipo ?? (to === "proforma" ? "proforma" : "definitiva");
  }

  if (to === "definitiva" && invoice.tipo === "proforma") {
    updates.tipo = "definitiva";
  }

  const [updated] = await dbAdmin
    .update(invoices)
    .set(updates)
    .where(eq(invoices.id, invoiceId))
    .returning();

  const hdrs = await headers();
  await insertAuditLog({
    userId: dbUser.id,
    acao: `transition_${to}`,
    entidade: "invoices",
    entidadeId: invoiceId,
    dadosAntes: { estado: invoice.estado },
    dadosDepois: { estado: to, numero: updated.numero },
    ip: hdrs.get("x-forwarded-for") ?? undefined,
    userAgent: hdrs.get("user-agent") ?? undefined,
  });

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${invoiceId}`);
  return { success: true, invoice: updated };
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function registerPayment(
  invoiceId: string,
  data: z.infer<typeof paymentSchema>
) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageInvoices(dbUser.role))
    return { error: "Sem permissão" };

  const parsed = paymentSchema.safeParse(data);
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const invoice = await dbAdmin.query.invoices.findFirst({
    where: eq(invoices.id, invoiceId),
    with: { payments: true },
  });
  if (!invoice) return { error: "Factura não encontrada" };
  if (!["definitiva", "paga_parcial"].includes(invoice.estado))
    return { error: "Factura não está em estado pagável" };

  const paymentValue =
    parsed.data.moeda === "XOF"
      ? toXofInteger(parsed.data.valor)
      : toFiniteNumber(parsed.data.valor);

  await dbAdmin.insert(invoicePayments).values({
    invoiceId,
    data: parsed.data.data,
    valor: toCurrencyStorageString(paymentValue, parsed.data.moeda),
    moeda: parsed.data.moeda,
    taxaCambio: String(parsed.data.taxaCambio),
    referencia: parsed.data.referencia,
    metodo: parsed.data.metodo,
    notas: parsed.data.notas,
    registadoPor: dbUser.id,
  });

  // Determina novo estado
  const totalPago =
    (invoice.payments ?? []).reduce(
      (s, p) =>
        s + (p.moeda === "XOF" ? toXofInteger(p.valor) : toFiniteNumber(p.valor)),
      0
    ) + paymentValue;
  const newState: InvoiceState =
    totalPago >=
    (invoice.moeda === "XOF"
      ? toXofInteger(invoice.total)
      : toFiniteNumber(invoice.total))
      ? "paga"
      : "paga_parcial";

  await dbAdmin
    .update(invoices)
    .set({ estado: newState })
    .where(eq(invoices.id, invoiceId));

  revalidatePath(`/admin/invoices/${invoiceId}`);
  revalidatePath("/admin/invoices");
  return { success: true };
}

export async function updateInvoicePayment(
  paymentId: string,
  data: z.infer<typeof paymentUpdateSchema>,
) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageInvoices(dbUser.role))
    return { error: "Sem permissão" };

  const parsed = paymentUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const payment = await dbAdmin.query.invoicePayments.findFirst({
    where: eq(invoicePayments.id, paymentId),
  });
  if (!payment) return { error: "Pagamento não encontrado" };

  await dbAdmin
    .update(invoicePayments)
    .set({ data: parsed.data.data })
    .where(eq(invoicePayments.id, paymentId));

  const hdrs = await headers();
  await insertAuditLog({
    userId: dbUser.id,
    acao: "update_payment_date",
    entidade: "invoice_payments",
    entidadeId: paymentId,
    dadosAntes: { data: payment.data },
    dadosDepois: { data: parsed.data.data },
    ip: hdrs.get("x-forwarded-for") ?? undefined,
    userAgent: hdrs.get("user-agent") ?? undefined,
  });

  revalidatePath(`/admin/invoices/${payment.invoiceId}`);
  revalidatePath("/admin/invoices");
  return { success: true };
}

export async function updateInvoiceProject(
  invoiceId: string,
  data: z.infer<typeof invoiceProjectUpdateSchema>,
) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageInvoices(dbUser.role)) {
    return { error: "Sem permissão" };
  }

  const parsed = invoiceProjectUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const invoice = await dbAdmin.query.invoices.findFirst({
    where: eq(invoices.id, invoiceId),
  });
  if (!invoice) return { error: "Factura não encontrada" };
  if (invoice.estado === "anulada") {
    return { error: "Não é possível alterar projecto de factura anulada" };
  }

  if (parsed.data.projectId) {
    const project = await dbAdmin.query.projects.findFirst({
      where: eq(projects.id, parsed.data.projectId),
      columns: { id: true, clientId: true },
    });
    if (!project) return { error: "Projecto não encontrado" };
    if (project.clientId !== invoice.clientId) {
      return { error: "O projecto seleccionado não pertence a este cliente" };
    }
  }

  await dbAdmin
    .update(invoices)
    .set({ projectId: parsed.data.projectId })
    .where(eq(invoices.id, invoiceId));

  const hdrs = await headers();
  await insertAuditLog({
    userId: dbUser.id,
    acao: "update_project",
    entidade: "invoices",
    entidadeId: invoiceId,
    dadosAntes: { projectId: invoice.projectId },
    dadosDepois: { projectId: parsed.data.projectId },
    ip: hdrs.get("x-forwarded-for") ?? undefined,
    userAgent: hdrs.get("user-agent") ?? undefined,
  });

  revalidatePath(`/admin/invoices/${invoiceId}`);
  revalidatePath("/admin/invoices");
  return { success: true };
}

// ─── Delete draft ─────────────────────────────────────────────────────────────

export async function deleteInvoiceDraft(invoiceId: string) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageInvoices(dbUser.role))
    return { error: "Sem permissão" };

  const invoice = await dbAdmin.query.invoices.findFirst({
    where: eq(invoices.id, invoiceId),
  });
  if (!invoice) return { error: "Factura não encontrada" };
  if (invoice.estado !== "rascunho")
    return { error: "Só rascunhos podem ser eliminados" };

  await dbAdmin.delete(invoices).where(eq(invoices.id, invoiceId));
  revalidatePath("/admin/invoices");
  return { success: true };
}
