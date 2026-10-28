"use server";

import { revalidatePath } from "next/cache";
import { and, eq, gt, inArray, isNull, ne, or, sql } from "drizzle-orm";
import { z } from "zod-core";
import { buildAppUrl } from "@/core/lib/app-url";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { dbAdmin } from "@/core/lib/db";
import {
  chatConversations,
  chatEmailNotifications,
  chatMessageReads,
  chatMessages,
  chatParticipants,
  projectAssistants,
  projects,
  userPresence,
  users,
  type ChatConversationType,
} from "@/core/lib/db/schema";
import { FROM_EMAIL, resend } from "@/core/lib/email/resend";

const ONLINE_WINDOW_MS = 90_000;
const OFFLINE_EMAIL_DELAY_MS = 2 * 60_000;

export interface MessageUser {
  id: string;
  nomeCurto: string;
  nomeCompleto: string;
  email: string;
  cargo: string | null;
  fotografiaUrl: string | null;
  isOnline: boolean;
  lastSeenAt: string | null;
}

export interface MessageProject {
  id: string;
  titulo: string;
}

export interface NewConversationOptions {
  users: MessageUser[];
  projects: MessageProject[];
}

export interface ConversationSummary {
  id: string;
  type: ChatConversationType;
  title: string;
  projectId: string | null;
  updatedAt: string;
  unreadCount: number;
  participants: MessageUser[];
  lastMessage: {
    id: string;
    body: string;
    senderName: string;
    createdAt: string;
  } | null;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
}

function toIso(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function isPresenceOnline(
  presence?: { isOnline: boolean; lastSeenAt: Date | string | null } | null
) {
  if (!presence?.isOnline || !presence.lastSeenAt) return false;
  const lastSeenAt = new Date(presence.lastSeenAt).getTime();
  return Date.now() - lastSeenAt <= ONLINE_WINDOW_MS;
}

async function requireDbUser() {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado.");
  return { user, dbUser };
}

type CurrentDbUser = Awaited<ReturnType<typeof requireDbUser>>["dbUser"];

async function findParticipant(conversationId: string, userId: string) {
  return dbAdmin.query.chatParticipants.findFirst({
    where: and(
      eq(chatParticipants.conversationId, conversationId),
      eq(chatParticipants.userId, userId)
    ),
  });
}

async function assertParticipant(conversationId: string, userId: string) {
  const participant = await findParticipant(conversationId, userId);

  if (!participant) throw new Error("Sem acesso a esta conversa.");
  return participant;
}

function directKeyFor(userA: string, userB: string) {
  return [userA, userB].sort().join(":");
}

function resolveConversationTitle(
  type: ChatConversationType,
  title: string | null,
  projectTitle: string | null | undefined,
  participants: MessageUser[],
  currentUserId: string
) {
  if (type === "project") return projectTitle ? `Projecto: ${projectTitle}` : title ?? "Projecto";
  if (type === "group") return title ?? "Grupo";

  const other = participants.find((participant) => participant.id !== currentUserId);
  return other?.nomeCurto ?? "Conversa";
}

async function getUnreadMap(userId: string) {
  try {
    const rows = await dbAdmin
      .select({
        conversationId: chatParticipants.conversationId,
        count: sql<number>`count(${chatMessages.id})::int`,
      })
      .from(chatParticipants)
      .innerJoin(
        chatMessages,
        eq(chatMessages.conversationId, chatParticipants.conversationId)
      )
      .where(
        and(
          eq(chatParticipants.userId, userId),
          ne(chatMessages.senderId, userId),
          isNull(chatMessages.deletedAt),
          or(
            isNull(chatParticipants.lastReadAt),
            gt(chatMessages.createdAt, chatParticipants.lastReadAt)
          )
        )
      )
      .groupBy(chatParticipants.conversationId);

    return new Map(rows.map((row) => [row.conversationId, Number(row.count)]));
  } catch (error) {
    if (isMissingRelationError(error)) return new Map<string, number>();
    throw error;
  }
}

function isMissingRelationError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const maybeError = error as {
    code?: string;
    cause?: { code?: string };
  };

  return maybeError.code === "42P01" || maybeError.cause?.code === "42P01";
}

function revalidateMessagePaths() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin/chat");
  revalidatePath("/staff/me/messages");
  revalidatePath("/staff/me/chat");
}

export async function getUnreadMessageCount() {
  const { dbUser } = await requireDbUser();
  const unreadMap = await getUnreadMap(dbUser.id);

  return [...unreadMap.values()].reduce((total, count) => total + count, 0);
}

async function listMessageUsersFor(dbUser: CurrentDbUser): Promise<MessageUser[]> {
  const [allUsers, presences] = await Promise.all([
    dbAdmin.query.users.findMany({
      where: and(eq(users.activo, true), ne(users.id, dbUser.id)),
      columns: {
        id: true,
        nomeCurto: true,
        nomeCompleto: true,
        email: true,
        cargo: true,
        fotografiaUrl: true,
      },
      orderBy: (u, { asc }) => [asc(u.nomeCurto)],
    }),
    dbAdmin.query.userPresence.findMany(),
  ]);

  const presenceByUser = new Map(presences.map((presence) => [presence.userId, presence]));

  return allUsers.map((user) => {
    const presence = presenceByUser.get(user.id);
    return {
      ...user,
      isOnline: isPresenceOnline(presence),
      lastSeenAt: toIso(presence?.lastSeenAt) ?? null,
    };
  });
}

async function listMessageProjectsFor(dbUser: CurrentDbUser): Promise<MessageProject[]> {
  if (["ca", "dg", "coord"].includes(dbUser.role)) {
    const rows = await dbAdmin.query.projects.findMany({
      columns: { id: true, titulo: true },
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    });
    return rows;
  }

  const assistantRows = await dbAdmin.query.projectAssistants.findMany({
    where: eq(projectAssistants.userId, dbUser.id),
    columns: { projectId: true },
  });
  const ids = [...new Set(assistantRows.map((row) => row.projectId))];

  const where = ids.length > 0
    ? or(eq(projects.pontoFocalId, dbUser.id), inArray(projects.id, ids))
    : eq(projects.pontoFocalId, dbUser.id);

  return dbAdmin.query.projects.findMany({
    where,
    columns: { id: true, titulo: true },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });
}

export async function listMessageUsers(): Promise<MessageUser[]> {
  const { dbUser } = await requireDbUser();
  return listMessageUsersFor(dbUser);
}

export async function listMessageProjects(): Promise<MessageProject[]> {
  const { dbUser } = await requireDbUser();
  return listMessageProjectsFor(dbUser);
}

export async function listNewConversationOptions(): Promise<NewConversationOptions> {
  const { dbUser } = await requireDbUser();
  const [users, projects] = await Promise.all([
    listMessageUsersFor(dbUser),
    listMessageProjectsFor(dbUser),
  ]);

  return { users, projects };
}

export async function listConversations(): Promise<ConversationSummary[]> {
  const { dbUser } = await requireDbUser();

  const [memberships, unreadMap, presences] = await Promise.all([
    dbAdmin.query.chatParticipants.findMany({
      where: eq(chatParticipants.userId, dbUser.id),
      with: {
        conversation: {
          with: {
            project: { columns: { id: true, titulo: true } },
            participants: {
              with: {
                user: {
                  columns: {
                    id: true,
                    nomeCurto: true,
                    nomeCompleto: true,
                    email: true,
                    cargo: true,
                    fotografiaUrl: true,
                  },
                },
              },
            },
            messages: {
              limit: 1,
              orderBy: (message, { desc }) => [desc(message.createdAt)],
              with: {
                sender: { columns: { nomeCurto: true } },
              },
            },
          },
        },
      },
    }),
    getUnreadMap(dbUser.id),
    dbAdmin.query.userPresence.findMany(),
  ]);

  const presenceByUser = new Map(presences.map((presence) => [presence.userId, presence]));

  return memberships
    .map((membership) => {
      const conversation = membership.conversation;
      const participants = conversation.participants.map(({ user }) => {
        const presence = presenceByUser.get(user.id);
        return {
          ...user,
          isOnline: isPresenceOnline(presence),
          lastSeenAt: toIso(presence?.lastSeenAt) ?? null,
        };
      });
      const lastMessage = conversation.messages[0] ?? null;

      return {
        id: conversation.id,
        type: conversation.type,
        title: resolveConversationTitle(
          conversation.type,
          conversation.title,
          conversation.project?.titulo,
          participants,
          dbUser.id
        ),
        projectId: conversation.projectId,
        updatedAt: toIso(conversation.updatedAt) ?? new Date().toISOString(),
        unreadCount: unreadMap.get(conversation.id) ?? 0,
        participants,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              body: lastMessage.body,
              senderName: lastMessage.sender?.nomeCurto ?? "Colega",
              createdAt: toIso(lastMessage.createdAt) ?? new Date().toISOString(),
            }
          : null,
      };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getConversationMessages(
  conversationId: string
): Promise<ConversationMessage[]> {
  const { dbUser } = await requireDbUser();
  await assertParticipant(conversationId, dbUser.id);

  const messages = await dbAdmin.query.chatMessages.findMany({
    where: and(
      eq(chatMessages.conversationId, conversationId),
      isNull(chatMessages.deletedAt)
    ),
    orderBy: (message, { desc }) => [desc(message.createdAt)],
    with: {
      sender: { columns: { id: true, nomeCurto: true } },
    },
    limit: 200,
  });

  return messages.reverse().map((message) => ({
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    senderName: message.sender?.nomeCurto ?? "Colega",
    body: message.body,
    createdAt: toIso(message.createdAt) ?? new Date().toISOString(),
  }));
}

export async function markConversationRead(conversationId: string) {
  const { dbUser } = await requireDbUser();
  await assertParticipant(conversationId, dbUser.id);

  const now = new Date();
  await dbAdmin
    .update(chatParticipants)
    .set({ lastReadAt: now })
    .where(
      and(
        eq(chatParticipants.conversationId, conversationId),
        eq(chatParticipants.userId, dbUser.id)
      )
    );

  const unreadMessages = await dbAdmin.query.chatMessages.findMany({
    where: and(
      eq(chatMessages.conversationId, conversationId),
      ne(chatMessages.senderId, dbUser.id),
      isNull(chatMessages.deletedAt)
    ),
    columns: { id: true },
  });

  if (unreadMessages.length > 0) {
    await dbAdmin
      .insert(chatMessageReads)
      .values(
        unreadMessages.map((message) => ({
          messageId: message.id,
          userId: dbUser.id,
          readAt: now,
        }))
      )
      .onConflictDoNothing();
  }

  revalidateMessagePaths();
  return { success: true };
}

export async function createDirectConversation(recipientId: string) {
  const { dbUser } = await requireDbUser();
  const parsed = z.string().uuid().safeParse(recipientId);
  if (!parsed.success || parsed.data === dbUser.id) {
    return { error: "Destinatário inválido." };
  }

  const recipient = await dbAdmin.query.users.findFirst({
    where: and(eq(users.id, parsed.data), eq(users.activo, true)),
    columns: { id: true },
  });
  if (!recipient) return { error: "Utilizador não encontrado." };

  const directKey = directKeyFor(dbUser.id, recipient.id);
  const existing = await dbAdmin.query.chatConversations.findFirst({
    where: eq(chatConversations.directKey, directKey),
  });

  if (existing) return { success: true, conversationId: existing.id };

  const [conversation] = await dbAdmin
    .insert(chatConversations)
    .values({
      type: "direct",
      directKey,
      createdBy: dbUser.id,
    })
    .returning();

  await dbAdmin.insert(chatParticipants).values([
    { conversationId: conversation.id, userId: dbUser.id, lastReadAt: new Date() },
    { conversationId: conversation.id, userId: recipient.id },
  ]);

  revalidateMessagePaths();
  return { success: true, conversationId: conversation.id };
}

export async function createGroupConversation(input: {
  title: string;
  participantIds: string[];
}) {
  const { dbUser } = await requireDbUser();
  const parsed = z
    .object({
      title: z.string().trim().min(2, "Nome do grupo obrigatório.").max(120),
      participantIds: z.array(z.string().uuid()).min(1),
    })
    .safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const participantIds = [...new Set([dbUser.id, ...parsed.data.participantIds])];
  if (participantIds.length < 3) {
    return { error: "Um grupo precisa de pelo menos três participantes." };
  }

  const activeUsers = await dbAdmin.query.users.findMany({
    where: and(inArray(users.id, participantIds), eq(users.activo, true)),
    columns: { id: true },
  });

  if (activeUsers.length !== participantIds.length) {
    return { error: "Há participantes inválidos ou inactivos." };
  }

  const [conversation] = await dbAdmin
    .insert(chatConversations)
    .values({
      type: "group",
      title: parsed.data.title,
      createdBy: dbUser.id,
    })
    .returning();

  await dbAdmin.insert(chatParticipants).values(
    participantIds.map((userId) => ({
      conversationId: conversation.id,
      userId,
      lastReadAt: userId === dbUser.id ? new Date() : null,
    }))
  );

  revalidateMessagePaths();
  return { success: true, conversationId: conversation.id };
}

export async function createProjectConversation(projectId: string) {
  const { dbUser } = await requireDbUser();
  const parsed = z.string().uuid().safeParse(projectId);
  if (!parsed.success) return { error: "Projecto inválido." };

  const project = await dbAdmin.query.projects.findFirst({
    where: eq(projects.id, parsed.data),
    with: {
      assistants: { columns: { userId: true } },
    },
  });
  if (!project) return { error: "Projecto não encontrado." };

  const isProjectMember =
    project.pontoFocalId === dbUser.id ||
    project.assistants.some((assistant) => assistant.userId === dbUser.id);
  if (!["ca", "dg", "coord"].includes(dbUser.role) && !isProjectMember) {
    return { error: "Sem permissão para criar conversa deste projecto." };
  }

  const participantIds = [
    dbUser.id,
    project.pontoFocalId,
    ...project.assistants.map((assistant) => assistant.userId),
  ].filter((id): id is string => Boolean(id));

  const uniqueParticipants = [...new Set(participantIds)];
  if (uniqueParticipants.length < 2) {
    return { error: "O projecto precisa de pelo menos dois participantes." };
  }

  const existing = await dbAdmin.query.chatConversations.findFirst({
    where: and(
      eq(chatConversations.type, "project"),
      eq(chatConversations.projectId, project.id)
    ),
  });
  if (existing) {
    await dbAdmin
      .insert(chatParticipants)
      .values(
        uniqueParticipants.map((userId) => ({
          conversationId: existing.id,
          userId,
          lastReadAt: userId === dbUser.id ? new Date() : null,
        }))
      )
      .onConflictDoNothing();

    revalidateMessagePaths();
    return { success: true, conversationId: existing.id };
  }

  const [conversation] = await dbAdmin
    .insert(chatConversations)
    .values({
      type: "project",
      title: `Projecto: ${project.titulo}`,
      projectId: project.id,
      createdBy: dbUser.id,
    })
    .returning();

  await dbAdmin.insert(chatParticipants).values(
    uniqueParticipants.map((userId) => ({
      conversationId: conversation.id,
      userId,
      lastReadAt: userId === dbUser.id ? new Date() : null,
    }))
  );

  revalidateMessagePaths();
  return { success: true, conversationId: conversation.id };
}

export async function sendMessage(conversationId: string, rawBody: string) {
  const { dbUser } = await requireDbUser();
  const parsed = z
    .object({
      conversationId: z.string().uuid(),
      body: z.string().trim().min(1, "Mensagem vazia.").max(4000),
    })
    .safeParse({ conversationId, body: rawBody });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Mensagem inválida." };
  }

  await assertParticipant(parsed.data.conversationId, dbUser.id);

  const [message] = await dbAdmin
    .insert(chatMessages)
    .values({
      conversationId: parsed.data.conversationId,
      senderId: dbUser.id,
      body: parsed.data.body,
    })
    .returning();

  await dbAdmin
    .update(chatConversations)
    .set({ updatedAt: new Date() })
    .where(eq(chatConversations.id, parsed.data.conversationId));

  await dbAdmin
    .update(chatParticipants)
    .set({ lastReadAt: new Date() })
    .where(
      and(
        eq(chatParticipants.conversationId, parsed.data.conversationId),
        eq(chatParticipants.userId, dbUser.id)
      )
    );

  try {
    await queueOfflineEmailNotifications(message.id, parsed.data.conversationId, dbUser.id);
  } catch (error) {
    console.error("Falha ao enfileirar notificação de mensagem offline", error);
  }

  revalidateMessagePaths();
  return {
    success: true,
    message: {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: dbUser.nomeCurto,
      body: message.body,
      createdAt: toIso(message.createdAt) ?? new Date().toISOString(),
    },
  };
}

async function queueOfflineEmailNotifications(
  messageId: string,
  conversationId: string,
  senderId: string
) {
  const participants = await dbAdmin.query.chatParticipants.findMany({
    where: and(
      eq(chatParticipants.conversationId, conversationId),
      ne(chatParticipants.userId, senderId)
    ),
    with: {
      user: { columns: { id: true, activo: true } },
    },
  });
  if (participants.length === 0) return;

  const recipientIds = participants
    .filter((participant) => participant.user.activo)
    .map((participant) => participant.userId);
  if (recipientIds.length === 0) return;

  const presences = await dbAdmin.query.userPresence.findMany({
    where: inArray(userPresence.userId, recipientIds),
  });
  const presenceByUser = new Map(presences.map((presence) => [presence.userId, presence]));
  const offlineRecipientIds = recipientIds.filter(
    (recipientId) => !isPresenceOnline(presenceByUser.get(recipientId))
  );

  if (offlineRecipientIds.length === 0) return;

  const recipientsWithoutPendingDigest: string[] = [];
  for (const recipientId of offlineRecipientIds) {
    const [existingPending] = await dbAdmin
      .select({ id: chatEmailNotifications.id })
      .from(chatEmailNotifications)
      .innerJoin(
        chatMessages,
        eq(chatMessages.id, chatEmailNotifications.messageId)
      )
      .where(
        and(
          eq(chatEmailNotifications.recipientId, recipientId),
          eq(chatEmailNotifications.state, "pending"),
          eq(chatMessages.conversationId, conversationId)
        )
      )
      .limit(1);

    if (!existingPending) recipientsWithoutPendingDigest.push(recipientId);
  }

  if (recipientsWithoutPendingDigest.length === 0) return;

  const availableAt = new Date(Date.now() + OFFLINE_EMAIL_DELAY_MS);
  await dbAdmin
    .insert(chatEmailNotifications)
    .values(
      recipientsWithoutPendingDigest.map((recipientId) => ({
        messageId,
        recipientId,
        availableAt,
      }))
    )
    .onConflictDoNothing();
}

export async function updateMyPresence(input?: {
  isOnline?: boolean;
  currentConversationId?: string | null;
}) {
  const { dbUser } = await requireDbUser();
  const now = new Date();
  let currentConversationId = input?.currentConversationId ?? null;

  if (currentConversationId) {
    const participant = await findParticipant(currentConversationId, dbUser.id);
    if (!participant) currentConversationId = null;
  }

  await dbAdmin
    .insert(userPresence)
    .values({
      userId: dbUser.id,
      isOnline: input?.isOnline ?? true,
      currentConversationId,
      lastSeenAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: userPresence.userId,
      set: {
        isOnline: input?.isOnline ?? true,
        currentConversationId,
        lastSeenAt: now,
        updatedAt: now,
      },
    });

  return { success: true };
}

export async function processPendingMessageEmailNotifications(limit = 30) {
  const rows = await dbAdmin.query.chatEmailNotifications.findMany({
    where: and(
      eq(chatEmailNotifications.state, "pending"),
      sql`${chatEmailNotifications.availableAt} <= now()`
    ),
    with: {
      recipient: {
        columns: { id: true, email: true, nomeCurto: true, role: true },
      },
      message: {
        with: {
          sender: { columns: { nomeCurto: true } },
          conversation: {
            with: {
              project: { columns: { titulo: true } },
            },
          },
        },
      },
    },
    orderBy: (notification, { asc }) => [asc(notification.createdAt)],
    limit,
  });

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const notification of rows) {
    const presence = await dbAdmin.query.userPresence.findFirst({
      where: eq(userPresence.userId, notification.recipientId),
    });

    if (isPresenceOnline(presence)) {
      await dbAdmin
        .update(chatEmailNotifications)
        .set({ state: "skipped" })
        .where(eq(chatEmailNotifications.id, notification.id));
      skipped += 1;
      continue;
    }

    const message = notification.message;
    const conversation = message.conversation;
    const conversationTitle =
      conversation.type === "project"
        ? `Projecto: ${conversation.project?.titulo ?? conversation.title ?? "Projecto"}`
        : conversation.title ?? "Conversa";
    const path = ["ca", "dg", "coord"].includes(notification.recipient.role)
      ? `/admin/messages?conversation=${conversation.id}`
      : `/staff/me/messages?conversation=${conversation.id}`;
    const url = buildAppUrl(path);
    const excerpt =
      message.body.length > 180 ? `${message.body.slice(0, 177)}...` : message.body;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: notification.recipient.email,
      subject: `Nova mensagem de ${message.sender?.nomeCurto ?? "um colega"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#12100b;margin:0 0 8px">Nova mensagem</h2>
          <p style="color:#5d5546;margin:0 0 18px">${conversationTitle}</p>
          <p><strong>${message.sender?.nomeCurto ?? "Colega"}</strong> enviou uma mensagem:</p>
          <blockquote style="border-left:4px solid #f5b800;margin:16px 0;padding:8px 12px;color:#12100b;background:#fff8df">
            ${escapeHtml(excerpt)}
          </blockquote>
          <p>
            <a href="${url}" style="display:inline-block;background:#12100b;color:#fff8df;text-decoration:none;padding:10px 14px;border-radius:8px">
              Abrir conversa
            </a>
          </p>
        </div>
      `,
    });

    if (error) {
      await dbAdmin
        .update(chatEmailNotifications)
        .set({ state: "error", error: error.message })
        .where(eq(chatEmailNotifications.id, notification.id));
      failed += 1;
      continue;
    }

    await dbAdmin
      .update(chatEmailNotifications)
      .set({ state: "sent", sentAt: new Date() })
      .where(eq(chatEmailNotifications.id, notification.id));
    sent += 1;
  }

  return { processed: rows.length, sent, skipped, failed };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
