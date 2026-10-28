import { randomUUID } from "node:crypto";
import { getRequestIp } from "@/core/lib/auth/request-security";
import {
  maskIpAddress,
  sanitizeAuditDetails,
  type AuditSafeValue,
} from "@/core/lib/security/audit-sanitization";

export { maskIpAddress, sanitizeAuditDetails };

export type SecurityEventResult =
  | "success"
  | "failure"
  | "denied"
  | "blocked";
export type SecurityEventSeverity = "info" | "warning" | "critical";

export type RecordSecurityEventInput = {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  result: SecurityEventResult;
  severity?: SecurityEventSeverity;
  requestHeaders?: Headers;
  before?: unknown;
  after?: unknown;
};

export async function recordSecurityEvent({
  actorId,
  action,
  entity,
  entityId,
  result,
  severity = "info",
  requestHeaders,
  before,
  after,
}: RecordSecurityEventInput): Promise<void> {
  try {
    const { insertAuditLog } = await import("@/core/lib/db/audit");
    const requestId =
      requestHeaders?.get("x-request-id") ??
      requestHeaders?.get("x-vercel-id") ??
      randomUUID();

    await insertAuditLog({
      userId: actorId ?? undefined,
      acao: action,
      entidade: entity,
      entidadeId: entityId ?? undefined,
      resultado: result,
      severidade: severity,
      requestId,
      dadosAntes: sanitizeAuditDetails(before) as AuditSafeValue,
      dadosDepois: sanitizeAuditDetails(after) as AuditSafeValue,
      ip: requestHeaders ? getRequestIp(requestHeaders) : undefined,
      userAgent: requestHeaders?.get("user-agent") ?? undefined,
    });
  } catch (error) {
    console.error("Falha ao registar evento de segurança", {
      action,
      entity,
      result,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}
