"use server";

import { z } from "zod-core";
import { dbAdmin } from "@/core/lib/db";
import { servicesCatalog } from "@/core/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/core/lib/auth/actions";
import {
  authorizeOperation,
  isOperationAllowed,
} from "@/core/lib/auth/authorization";
import { toXofString } from "@/core/lib/utils/money";

const serviceSchema = z.object({
  categoria: z.string().min(1, "Categoria obrigatória"),
  nome: z.string().min(2, "Nome obrigatório"),
  descricao: z.string().optional(),
  unidade: z.string().optional(),
  periodicidade: z.enum(["unica", "mensal", "anual", "bienal"]).default("unica"),
  prazoEntrega: z.string().optional(),
  precoXof: z.string().optional(),
});

function canManageServiceCatalog(role: Parameters<typeof isOperationAllowed>[1]) {
  return isOperationAllowed("servicesWrite", role);
}

export async function listServices(includeInactive = false) {
  const authorization = await authorizeOperation("servicesWrite");
  if (!authorization.success) throw new Error(authorization.error);

  return dbAdmin.query.servicesCatalog.findMany({
    where: includeInactive ? undefined : eq(servicesCatalog.activo, true),
    orderBy: (s, { asc }) => [asc(s.categoria), asc(s.nome)],
  });
}

export async function createService(_: unknown, formData: FormData) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageServiceCatalog(dbUser.role))
    return { error: "Sem permissão" };

  const parsed = serviceSchema.safeParse({
    categoria: formData.get("categoria"),
    nome: formData.get("nome"),
    descricao: formData.get("descricao") || undefined,
    unidade: formData.get("unidade") || undefined,
    periodicidade: formData.get("periodicidade") || "unica",
    prazoEntrega: formData.get("prazoEntrega") || undefined,
    precoXof: formData.get("precoXof") || undefined,
  });

  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  await dbAdmin.insert(servicesCatalog).values({
    ...parsed.data,
    precoXof: parsed.data.precoXof ? toXofString(parsed.data.precoXof) : null,
  });
  revalidatePath("/admin/settings/services");
  return { success: true };
}

export async function updateService(id: string, _: unknown, formData: FormData) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageServiceCatalog(dbUser.role))
    return { error: "Sem permissão" };

  const parsed = serviceSchema.safeParse({
    categoria: formData.get("categoria"),
    nome: formData.get("nome"),
    descricao: formData.get("descricao") || undefined,
    unidade: formData.get("unidade") || undefined,
    periodicidade: formData.get("periodicidade") || "unica",
    prazoEntrega: formData.get("prazoEntrega") || undefined,
    precoXof: formData.get("precoXof") || undefined,
  });

  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  await dbAdmin
    .update(servicesCatalog)
    .set({
      ...parsed.data,
      precoXof: parsed.data.precoXof ? toXofString(parsed.data.precoXof) : null,
    })
    .where(eq(servicesCatalog.id, id));

  revalidatePath("/admin/settings/services");
  return { success: true };
}

export async function toggleServiceActive(id: string, activo: boolean) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!isOperationAllowed("servicesToggle", dbUser.role)) {
    throw new Error("Sem permissão");
  }

  await dbAdmin
    .update(servicesCatalog)
    .set({ activo })
    .where(eq(servicesCatalog.id, id));

  revalidatePath("/admin/settings/services");
}
