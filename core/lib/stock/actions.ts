"use server";

import { z } from "zod-core";
import { eq, asc, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { authorizeOperation } from "@/core/lib/auth/authorization";
import { insertAuditLog } from "@/core/lib/db/audit";
import { withAuthenticatedDb } from "@/core/lib/db";
import { stockItems, stockMovements } from "@/core/lib/db/schema";
import { toXofString } from "@/core/lib/utils/money";

const stockItemSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  sku: z.string().trim().max(100).optional(),
  categoria: z.string().trim().max(100).optional(),
  unidade: z.string().trim().min(1, "Unidade obrigatória").max(30),
  quantidadeAtual: z
    .string()
    .regex(/^\d+(\.\d{1,3})?$/, "Quantidade inicial inválida"),
  quantidadeMinima: z
    .string()
    .regex(/^\d+(\.\d{1,3})?$/, "Quantidade mínima inválida"),
  custoUnitario: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\d+(\.\d{1,2})?$/.test(v), "Custo unitário inválido"),
  localizacao: z.string().trim().optional(),
});

const stockMovementSchema = z.object({
  tipo: z.enum(["entrada", "saida", "ajuste"]),
  quantidade: z
    .string()
    .regex(/^\d+(\.\d{1,3})?$/, "Quantidade inválida"),
  custoUnitario: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\d+(\.\d{1,2})?$/.test(v), "Custo unitário inválido"),
  referencia: z.string().trim().max(200).optional(),
  notas: z.string().trim().optional(),
});

async function requireStockAccess() {
  const authorization = await authorizeOperation("stockWrite");
  if (!authorization.success) throw new Error(authorization.error);
  return authorization;
}

export async function listStockItems() {
  const { user } = await requireStockAccess();

  return withAuthenticatedDb(user, async (db) =>
    db.query.stockItems.findMany({
      orderBy: [asc(stockItems.nome)],
      with: {
        movements: {
          columns: {
            id: true,
          },
        },
      },
    })
  );
}

export async function getStockItem(id: string) {
  const { user } = await requireStockAccess();

  return withAuthenticatedDb(user, async (db) =>
    db.query.stockItems.findFirst({
      where: eq(stockItems.id, id),
      with: {
        movements: {
          orderBy: [desc(stockMovements.createdAt)],
          with: {
            criadoPor: {
              columns: {
                id: true,
                nomeCurto: true,
              },
            },
          },
        },
        createdBy: {
          columns: {
            id: true,
            nomeCurto: true,
          },
        },
      },
    })
  );
}

export async function createStockItem(_: unknown, formData: FormData) {
  const { user, dbUser } = await requireStockAccess();

  const parsed = stockItemSchema.safeParse({
    nome: formData.get("nome"),
    sku: (formData.get("sku") as string) || undefined,
    categoria: (formData.get("categoria") as string) || undefined,
    unidade: formData.get("unidade") || "unidade",
    quantidadeAtual: formData.get("quantidadeAtual") || "0",
    quantidadeMinima: formData.get("quantidadeMinima") || "0",
    custoUnitario: (formData.get("custoUnitario") as string) || undefined,
    localizacao: (formData.get("localizacao") as string) || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = parsed.data;

  let created: typeof stockItems.$inferSelect;

  try {
    [created] = await withAuthenticatedDb(user, async (db) =>
      db
        .insert(stockItems)
        .values({
          nome: data.nome,
          sku: data.sku || null,
          categoria: data.categoria || null,
          unidade: data.unidade,
          quantidadeAtual: Number(data.quantidadeAtual).toFixed(3),
          quantidadeMinima: Number(data.quantidadeMinima).toFixed(3),
          custoUnitario: data.custoUnitario ? toXofString(data.custoUnitario) : null,
          localizacao: data.localizacao || null,
          createdBy: dbUser.id,
        })
        .returning()
    );
  } catch {
    return { error: "Não foi possível criar o item. Verifique se o SKU já existe." };
  }

  if (Number(data.quantidadeAtual) > 0) {
    await withAuthenticatedDb(user, async (db) =>
      db.insert(stockMovements).values({
        itemId: created.id,
        tipo: "entrada",
        quantidade: Number(data.quantidadeAtual).toFixed(3),
        custoUnitario: data.custoUnitario ? toXofString(data.custoUnitario) : null,
        referencia: "Saldo inicial",
        criadoPor: dbUser.id,
      })
    );
  }

  const hdrs = await headers();
  await insertAuditLog({
    userId: dbUser.id,
    acao: "create",
    entidade: "stock_items",
    entidadeId: created.id,
    dadosDepois: created,
    ip: hdrs.get("x-forwarded-for") ?? undefined,
    userAgent: hdrs.get("user-agent") ?? undefined,
  });

  revalidatePath("/admin/stock");
  return { success: true, id: created.id };
}

export async function registerStockMovement(itemId: string, _: unknown, formData: FormData) {
  const { user, dbUser } = await requireStockAccess();

  const parsed = stockMovementSchema.safeParse({
    tipo: formData.get("tipo"),
    quantidade: formData.get("quantidade"),
    custoUnitario: (formData.get("custoUnitario") as string) || undefined,
    referencia: (formData.get("referencia") as string) || undefined,
    notas: (formData.get("notas") as string) || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = parsed.data;
  const quantidade = Number(data.quantidade);

  if (quantidade <= 0) {
    return { error: "Quantidade deve ser maior que zero" };
  }

  try {
    await withAuthenticatedDb(user, async (db) => {
      const item = await db.query.stockItems.findFirst({
        where: eq(stockItems.id, itemId),
      });

      if (!item) throw new Error("Item de stock não encontrado");

      const actual = Number(item.quantidadeAtual);
      let proxima = actual;

      if (data.tipo === "entrada") {
        proxima = actual + quantidade;
      } else if (data.tipo === "saida") {
        proxima = actual - quantidade;
        if (proxima < 0) {
          throw new Error("Saída superior ao stock disponível");
        }
      } else {
        proxima = quantidade;
      }

      await db.insert(stockMovements).values({
        itemId,
        tipo: data.tipo,
        quantidade: quantidade.toFixed(3),
        custoUnitario: data.custoUnitario ? toXofString(data.custoUnitario) : null,
        referencia: data.referencia || null,
        notas: data.notas || null,
        criadoPor: dbUser.id,
      });

      await db
        .update(stockItems)
        .set({
          quantidadeAtual: proxima.toFixed(3),
          custoUnitario: data.custoUnitario
            ? toXofString(data.custoUnitario)
            : item.custoUnitario,
          updatedAt: new Date(),
        })
        .where(eq(stockItems.id, itemId));
    });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "Erro ao registar movimento" };
  }

  const hdrs = await headers();
  await insertAuditLog({
    userId: dbUser.id,
    acao: "create",
    entidade: "stock_movements",
    entidadeId: itemId,
    dadosDepois: {
      itemId,
      tipo: data.tipo,
      quantidade,
      referencia: data.referencia ?? null,
    },
    ip: hdrs.get("x-forwarded-for") ?? undefined,
    userAgent: hdrs.get("user-agent") ?? undefined,
  });

  revalidatePath("/admin/stock");
  revalidatePath(`/admin/stock/${itemId}`);
  return { success: true };
}
