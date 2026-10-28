"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod-core";
import { dbAdmin } from "@/core/lib/db";
import {
  dividendLines,
  partnerShares,
  projectPayments,
  salaryLines,
  salaryPeriodParticipants,
  tasks,
  users,
} from "@/core/lib/db/schema";
import { eq } from "drizzle-orm";
import { insertAuditLog } from "@/core/lib/db/audit";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { isOperationAllowed } from "@/core/lib/auth/authorization";
import { createAdminClient } from "@/core/lib/supabase/admin";
import {
  AVATAR_BUCKET,
  ensureAvatarBucket,
  getAvatarExtension,
} from "@/core/lib/users/avatar";
import { sql } from "drizzle-orm";
import { repairAuthLinkForInternalUser } from "@/core/lib/users/auth-link";
import { buildAuthAppMetadataUpdatePayload } from "@/core/lib/users/auth-link-policy";
import { toXofString } from "@/core/lib/utils/money";

const UserSchema = z.object({
  nomeCompleto: z.string().min(2, "Nome completo obrigatório"),
  nomeCurto: z.string().min(1, "Nome curto obrigatório").max(50),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  role: z.enum(["ca", "dg", "coord", "staff"]),
  cargo: z.string().optional(),
  salarioBaseMensal: z.string().optional(),
  dataEntrada: z.string().optional(),
  percentagemDescontoFolha: z.string().optional(),
  elegivelSubsidioDinamicoDefault: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof UserSchema>;

const ProfileSchema = z.object({
  nomeCompleto: z.string().min(2, "Nome completo obrigatório"),
  nomeCurto: z.string().min(1, "Nome curto obrigatório").max(50),
  telefone: z.string().max(30, "Telefone inválido").optional(),
});

export type ProfileFormData = z.infer<typeof ProfileSchema>;

function normaliseDiscountFraction(
  rawValue: string | undefined,
): { fraction: string; percentage: number } | { error: string } {
  const value = rawValue?.trim() || "0";
  const parsed = Number(value.replace(",", "."));

  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    return { error: "Desconto sobre folha deve estar entre 0 e 100%." };
  }

  return {
    fraction: (parsed / 100).toFixed(4),
    percentage: parsed,
  };
}

async function countRowsForUser(
  table:
    | typeof partnerShares
    | typeof salaryLines
    | typeof projectPayments
    | typeof salaryPeriodParticipants
    | typeof tasks
    | typeof dividendLines,
  predicate: ReturnType<typeof eq>,
) {
  const [result] = await dbAdmin
    .select({ count: sql<number>`count(*)::int` })
    .from(table)
    .where(predicate);

  return Number(result?.count ?? 0);
}

export async function createUser(formData: UserFormData) {
  const parsed = UserSchema.safeParse(formData);
  if (!parsed.success) {
    const issues = parsed.error.issues ?? [];
    return { error: issues[0]?.message ?? parsed.error.message };
  }

  const { dbUser: actor } = await getCurrentUser();
  if (!actor || !actor.activo || !isOperationAllowed("usersWrite", actor.role)) {
    return { error: "Sem permissão." };
  }

  const discount = normaliseDiscountFraction(parsed.data.percentagemDescontoFolha);
  if ("error" in discount) {
    return { error: discount.error };
  }
  if (!["ca", "dg"].includes(actor.role) && discount.percentage > 0) {
    return { error: "Só CA ou DG podem definir desconto sobre folha." };
  }

  const supabaseAdmin = createAdminClient();

  // Criar utilizador no Supabase Auth
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: parsed.data.email,
      password: crypto.randomUUID(), // password temporária - deve ser redefinida
      ...buildAuthAppMetadataUpdatePayload({
        role: parsed.data.role,
        active: true,
        mfaEnabled: false,
      }),
      email_confirm: true,
    });

  if (authError || !authData.user) {
    return { error: authError?.message ?? "Erro ao criar utilizador." };
  }

  // Inserir na tabela users
  const [newUser] = await dbAdmin
    .insert(users)
    .values({
      authUserId: authData.user.id,
      nomeCompleto: parsed.data.nomeCompleto,
      nomeCurto: parsed.data.nomeCurto,
      email: parsed.data.email,
      telefone: parsed.data.telefone ?? null,
      role: parsed.data.role,
      cargo: parsed.data.cargo ?? null,
      salarioBaseMensal: toXofString(parsed.data.salarioBaseMensal ?? "0"),
      percentagemDescontoFolha: discount.fraction,
      elegivelSubsidioDinamicoDefault: parsed.data.elegivelSubsidioDinamicoDefault,
      dataEntrada: parsed.data.dataEntrada ?? null,
    })
    .returning();

  await insertAuditLog({
    userId: actor.id,
    acao: "criar_utilizador",
    entidade: "users",
    entidadeId: newUser.id,
    dadosDepois: newUser,
  });

  revalidatePath("/admin/users");
  return { success: true, user: newUser };
}

export async function updateUser(id: string, formData: Partial<UserFormData>) {
  const { dbUser: actor } = await getCurrentUser();
  if (!actor || !actor.activo || !isOperationAllowed("usersWrite", actor.role)) {
    return { error: "Sem permissão." };
  }

  const existing = await dbAdmin.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!existing) return { error: "Utilizador não encontrado." };
  const syncedExisting = await repairAuthLinkForInternalUser(existing);
  if (!syncedExisting) {
    return { error: "Conta Auth não encontrada para este utilizador." };
  }

  const mergedInput: UserFormData = {
    nomeCompleto: formData.nomeCompleto ?? syncedExisting.nomeCompleto,
    nomeCurto: formData.nomeCurto ?? syncedExisting.nomeCurto,
    email: formData.email ?? syncedExisting.email,
    telefone: formData.telefone ?? syncedExisting.telefone ?? undefined,
    role: formData.role ?? syncedExisting.role,
    cargo: formData.cargo ?? syncedExisting.cargo ?? undefined,
    salarioBaseMensal:
      formData.salarioBaseMensal ?? syncedExisting.salarioBaseMensal?.toString() ?? "0",
    dataEntrada: formData.dataEntrada ?? syncedExisting.dataEntrada ?? undefined,
    percentagemDescontoFolha:
      formData.percentagemDescontoFolha ??
      (Number(syncedExisting.percentagemDescontoFolha ?? 0) * 100).toFixed(2),
    elegivelSubsidioDinamicoDefault:
      formData.elegivelSubsidioDinamicoDefault ??
      syncedExisting.elegivelSubsidioDinamicoDefault,
  };

  const parsed = UserSchema.safeParse(mergedInput);
  if (!parsed.success) {
    const issues = parsed.error.issues ?? [];
    return { error: issues[0]?.message ?? parsed.error.message };
  }

  const discount = normaliseDiscountFraction(parsed.data.percentagemDescontoFolha);
  if ("error" in discount) {
    return { error: discount.error };
  }
  const existingDiscountPercentage = Number(syncedExisting.percentagemDescontoFolha ?? 0) * 100;
  if (
    !["ca", "dg"].includes(actor.role) &&
    Math.abs(discount.percentage - existingDiscountPercentage) > 0.0001
  ) {
    return { error: "Só CA ou DG podem alterar desconto sobre folha." };
  }

  const supabaseAdmin = createAdminClient();
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    syncedExisting.authUserId,
    {
      ...(parsed.data.email ? { email: parsed.data.email } : {}),
      ...buildAuthAppMetadataUpdatePayload({
        role: parsed.data.role,
        active: syncedExisting.activo,
        mfaEnabled: syncedExisting.mfaEnabled,
      }),
    }
  );

  if (authError) {
    return {
      error: authError.message ?? "Erro ao sincronizar utilizador no Supabase.",
    };
  }

  const [updated] = await dbAdmin
    .update(users)
    .set({
      nomeCompleto: parsed.data.nomeCompleto,
      nomeCurto: parsed.data.nomeCurto,
      email: parsed.data.email,
      telefone: parsed.data.telefone ?? null,
      role: parsed.data.role,
      cargo: parsed.data.cargo ?? null,
      salarioBaseMensal: toXofString(parsed.data.salarioBaseMensal ?? "0"),
      percentagemDescontoFolha: discount.fraction,
      elegivelSubsidioDinamicoDefault: parsed.data.elegivelSubsidioDinamicoDefault,
      dataEntrada: parsed.data.dataEntrada ?? null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  await insertAuditLog({
    userId: actor.id,
    acao: "editar_utilizador",
    entidade: "users",
    entidadeId: id,
    dadosAntes: syncedExisting,
    dadosDepois: updated,
  });

  revalidatePath("/admin/users");
  return { success: true, user: updated };
}

export async function deactivateUser(id: string) {
  const { dbUser: actor } = await getCurrentUser();
  if (!actor || !actor.activo || !isOperationAllowed("usersWrite", actor.role)) {
    return { error: "Sem permissão." };
  }

  if (actor.id === id) return { error: "Não podes desactivar a tua própria conta." };

  const existing = await dbAdmin.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!existing) return { error: "Utilizador não encontrado." };
  const syncedExisting = await repairAuthLinkForInternalUser(existing);
  if (!syncedExisting) {
    return { error: "Conta Auth não encontrada para este utilizador." };
  }

  const supabaseAdmin = createAdminClient();
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    syncedExisting.authUserId,
    buildAuthAppMetadataUpdatePayload({
      role: syncedExisting.role,
      active: false,
      mfaEnabled: syncedExisting.mfaEnabled,
    })
  );

  if (authError) {
    return {
      error: authError.message ?? "Erro ao desactivar utilizador no Supabase.",
    };
  }

  const [updated] = await dbAdmin
    .update(users)
    .set({ activo: false, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();

  await insertAuditLog({
    userId: actor.id,
    acao: "desactivar_utilizador",
    entidade: "users",
    entidadeId: id,
    dadosAntes: syncedExisting,
    dadosDepois: updated,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUserPermanently(id: string) {
  const { dbUser: actor } = await getCurrentUser();
  if (!actor || !actor.activo || !isOperationAllowed("usersWrite", actor.role)) {
    return { error: "Sem permissão." };
  }

  if (actor.id === id) {
    return { error: "Não podes eliminar a tua própria conta." };
  }

  const existing = await dbAdmin.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!existing) return { error: "Utilizador não encontrado." };
  const syncedExisting = await repairAuthLinkForInternalUser(existing);

  const blockers = [
    {
      label: "quotas societárias",
      count: await countRowsForUser(partnerShares, eq(partnerShares.userId, id)),
    },
    {
      label: "linhas de folha salarial",
      count: await countRowsForUser(salaryLines, eq(salaryLines.userId, id)),
    },
    {
      label: "pagamentos de projectos",
      count: await countRowsForUser(projectPayments, eq(projectPayments.userId, id)),
    },
    {
      label: "participações em períodos salariais",
      count: await countRowsForUser(
        salaryPeriodParticipants,
        eq(salaryPeriodParticipants.userId, id),
      ),
    },
    {
      label: "tarefas atribuídas",
      count: await countRowsForUser(tasks, eq(tasks.atribuidaA, id)),
    },
    {
      label: "linhas de dividendos",
      count: await countRowsForUser(dividendLines, eq(dividendLines.userId, id)),
    },
  ].filter((entry) => entry.count > 0);

  if (blockers.length > 0) {
    return {
      error: `Não é possível eliminar definitivamente este utilizador porque ainda tem registos em ${blockers
        .map((entry) => entry.label)
        .join(", ")}. Usa desactivação nesses casos.`,
    };
  }

  const avatarPath = syncedExisting?.fotografiaUrl ?? existing.fotografiaUrl;
  const supabaseAdmin = createAdminClient();

  await dbAdmin.delete(users).where(eq(users.id, id));

  if (avatarPath) {
    await supabaseAdmin.storage.from(AVATAR_BUCKET).remove([avatarPath]);
  }

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
    syncedExisting?.authUserId ?? existing.authUserId,
  );

  await insertAuditLog({
    userId: actor.id,
    acao: "eliminar_utilizador",
    entidade: "users",
    entidadeId: id,
    dadosAntes: syncedExisting ?? existing,
    dadosDepois: { eliminado: true },
  });

  revalidatePath("/admin/users");

  if (authError) {
    return {
      success: true,
      warning:
        authError.message ??
        "O registo interno foi eliminado, mas a conta Auth ficou pendente de limpeza manual.",
    };
  }

  return { success: true };
}

export async function listUsers() {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");
  if (!isOperationAllowed("usersWrite", dbUser.role)) {
    throw new Error("Sem permissão");
  }

  return dbAdmin.query.users.findMany({
    orderBy: (u, { asc }) => [asc(u.nomeCompleto)],
  });
}

export async function updateMyProfile(formData: ProfileFormData) {
  const parsed = ProfileSchema.safeParse(formData);
  if (!parsed.success) {
    const issues = parsed.error.issues ?? [];
    return { error: issues[0]?.message ?? parsed.error.message };
  }

  const { dbUser } = await getCurrentUser();
  if (!dbUser) {
    return { error: "Sessão inválida. Inicia sessão novamente." };
  }

  const [updated] = await dbAdmin
    .update(users)
    .set({
      nomeCompleto: parsed.data.nomeCompleto,
      nomeCurto: parsed.data.nomeCurto,
      telefone: parsed.data.telefone?.trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, dbUser.id))
    .returning();

  await insertAuditLog({
    userId: dbUser.id,
    acao: "actualizar_perfil",
    entidade: "users",
    entidadeId: dbUser.id,
    dadosAntes: {
      nomeCompleto: dbUser.nomeCompleto,
      nomeCurto: dbUser.nomeCurto,
      telefone: dbUser.telefone,
    },
    dadosDepois: {
      nomeCompleto: updated.nomeCompleto,
      nomeCurto: updated.nomeCurto,
      telefone: updated.telefone,
    },
  });

  revalidatePath("/admin/profile");
  revalidatePath("/staff/me/profile");
  revalidatePath("/staff/me/dashboard");
  revalidatePath("/admin", "layout");
  revalidatePath("/staff", "layout");

  return { success: true, user: updated };
}

export async function uploadMyAvatar(formData: FormData) {
  const { dbUser } = await getCurrentUser();
  if (!dbUser) {
    return { error: "Sessão inválida. Inicia sessão novamente." };
  }

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona uma imagem para continuar." };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { error: "A imagem deve ter no máximo 2 MB." };
  }

  const extension = getAvatarExtension(file.type);
  if (!extension) {
    return { error: "Formato não suportado. Usa JPG, PNG ou WebP." };
  }

  await ensureAvatarBucket();

  const admin = createAdminClient();
  const nextPath = `${dbUser.id}/${Date.now()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from(AVATAR_BUCKET)
    .upload(nextPath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message ?? "Falha ao carregar o avatar." };
  }

  const oldPath = dbUser.fotografiaUrl;

  const [updated] = await dbAdmin
    .update(users)
    .set({
      fotografiaUrl: nextPath,
      updatedAt: new Date(),
    })
    .where(eq(users.id, dbUser.id))
    .returning();

  if (oldPath) {
    await admin.storage.from(AVATAR_BUCKET).remove([oldPath]);
  }

  await insertAuditLog({
    userId: dbUser.id,
    acao: "actualizar_avatar",
    entidade: "users",
    entidadeId: dbUser.id,
    dadosAntes: { fotografiaUrl: oldPath },
    dadosDepois: { fotografiaUrl: updated.fotografiaUrl },
  });

  revalidatePath("/admin/profile");
  revalidatePath("/staff/me/profile");
  revalidatePath("/admin", "layout");
  revalidatePath("/staff", "layout");

  return { success: true, user: updated };
}

export async function removeMyAvatar() {
  const { dbUser } = await getCurrentUser();
  if (!dbUser) {
    return { error: "Sessão inválida. Inicia sessão novamente." };
  }

  if (!dbUser.fotografiaUrl) {
    return { error: "Não existe avatar configurado." };
  }

  const oldPath = dbUser.fotografiaUrl;
  const admin = createAdminClient();

  await admin.storage.from(AVATAR_BUCKET).remove([oldPath]);

  const [updated] = await dbAdmin
    .update(users)
    .set({
      fotografiaUrl: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, dbUser.id))
    .returning();

  await insertAuditLog({
    userId: dbUser.id,
    acao: "remover_avatar",
    entidade: "users",
    entidadeId: dbUser.id,
    dadosAntes: { fotografiaUrl: oldPath },
    dadosDepois: { fotografiaUrl: null },
  });

  revalidatePath("/admin/profile");
  revalidatePath("/staff/me/profile");
  revalidatePath("/admin", "layout");
  revalidatePath("/staff", "layout");

  return { success: true, user: updated };
}
