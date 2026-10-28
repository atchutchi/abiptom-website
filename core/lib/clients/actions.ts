"use server";

import { z } from "zod-core";
import { dbAdmin } from "@/core/lib/db";
import { clients, contacts } from "@/core/lib/db/schema";
import { eq, and, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { insertAuditLog } from "@/core/lib/db/audit";
import { headers } from "next/headers";

const clientSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  nif: z.string().optional(),
  endereco: z.string().optional(),
  contacto: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  pais: z.string().optional(),
  notas: z.string().optional(),
});

const contactSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  cargo: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefone: z.string().optional(),
  principal: z.boolean().default(false),
});

function canManageClients(role: string) {
  return ["ca", "dg", "coord"].includes(role);
}

export async function listClients(search?: string) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");

  const where = search
    ? or(
        ilike(clients.nome, `%${search}%`),
        ilike(clients.nif, `%${search}%`),
        ilike(clients.email, `%${search}%`)
      )
    : undefined;

  return dbAdmin.query.clients.findMany({
    where,
    with: { contacts: { limit: 1, where: eq(contacts.principal, true) } },
    orderBy: (c, { asc }) => [asc(c.nome)],
  });
}

export async function getClient(id: string) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");

  return dbAdmin.query.clients.findFirst({
    where: eq(clients.id, id),
    with: { contacts: true, invoices: { limit: 10, orderBy: (i, { desc }) => [desc(i.createdAt)] } },
  });
}

export async function createClient(_: unknown, formData: FormData) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) return {
    authRequired: true,
    error: "Não foi possível validar a tua sessão. Os dados continuam no formulário. Inicia sessão novamente e volta a guardar.",
  };
  if (!canManageClients(dbUser.role))
    return { error: "Sem permissão" };

  const parsed = clientSchema.safeParse({
    nome: formData.get("nome"),
    nif: formData.get("nif") || undefined,
    endereco: formData.get("endereco") || undefined,
    contacto: formData.get("contacto") || undefined,
    email: formData.get("email") || undefined,
    pais: formData.get("pais") || undefined,
    notas: formData.get("notas") || undefined,
  });

  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const [created] = await dbAdmin
    .insert(clients)
    .values(parsed.data)
    .returning();

  const hdrs = await headers();
  await insertAuditLog({
    userId: dbUser.id,
    acao: "create",
    entidade: "clients",
    entidadeId: created.id,
    dadosDepois: created,
    ip: hdrs.get("x-forwarded-for") ?? undefined,
    userAgent: hdrs.get("user-agent") ?? undefined,
  });

  revalidatePath("/admin/clients");
  return { success: true, id: created.id };
}

export async function updateClient(id: string, _: unknown, formData: FormData) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) return {
    authRequired: true,
    error: "Não foi possível validar a tua sessão. Os dados continuam no formulário. Inicia sessão novamente e volta a guardar.",
  };
  if (!canManageClients(dbUser.role))
    return { error: "Sem permissão" };

  const parsed = clientSchema.safeParse({
    nome: formData.get("nome"),
    nif: formData.get("nif") || undefined,
    endereco: formData.get("endereco") || undefined,
    contacto: formData.get("contacto") || undefined,
    email: formData.get("email") || undefined,
    pais: formData.get("pais") || undefined,
    notas: formData.get("notas") || undefined,
  });

  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const before = await dbAdmin.query.clients.findFirst({
    where: eq(clients.id, id),
  });

  const [updated] = await dbAdmin
    .update(clients)
    .set(parsed.data)
    .where(eq(clients.id, id))
    .returning();

  const hdrs = await headers();
  await insertAuditLog({
    userId: dbUser.id,
    acao: "update",
    entidade: "clients",
    entidadeId: id,
    dadosAntes: before,
    dadosDepois: updated,
    ip: hdrs.get("x-forwarded-for") ?? undefined,
    userAgent: hdrs.get("user-agent") ?? undefined,
  });

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id}`);
  return { success: true };
}

export async function toggleClientActive(id: string, activo: boolean) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageClients(dbUser.role))
    throw new Error("Sem permissão");

  await dbAdmin.update(clients).set({ activo }).where(eq(clients.id, id));

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id}`);
}

export async function upsertContact(
  clientId: string,
  contactId: string | null,
  data: z.infer<typeof contactSchema>
) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageClients(dbUser.role))
    throw new Error("Sem permissão");

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);

  if (parsed.data.principal) {
    await dbAdmin
      .update(contacts)
      .set({ principal: false })
      .where(eq(contacts.clientId, clientId));
  }

  if (contactId) {
    await dbAdmin
      .update(contacts)
      .set({ ...parsed.data, clientId })
      .where(and(eq(contacts.id, contactId), eq(contacts.clientId, clientId)));
  } else {
    await dbAdmin.insert(contacts).values({ ...parsed.data, clientId });
  }

  revalidatePath(`/admin/clients/${clientId}`);
}

export async function deleteContact(clientId: string, contactId: string) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!canManageClients(dbUser.role))
    throw new Error("Sem permissão");

  await dbAdmin
    .delete(contacts)
    .where(and(eq(contacts.id, contactId), eq(contacts.clientId, clientId)));

  revalidatePath(`/admin/clients/${clientId}`);
}
