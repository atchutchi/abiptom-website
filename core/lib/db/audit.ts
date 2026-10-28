import { dbAdmin } from "./index";
import { auditLog, type NewAuditLog } from "./schema";
import { sanitizeAuditDetails } from "@/core/lib/security/audit-sanitization";

interface AuditParams {
  userId?: string;
  acao: string;
  entidade: string;
  entidadeId?: string;
  resultado?: string;
  severidade?: string;
  requestId?: string;
  dadosAntes?: unknown;
  dadosDepois?: unknown;
  ip?: string;
  userAgent?: string;
}

export async function insertAuditLog(params: AuditParams) {
  await dbAdmin.insert(auditLog).values({
    userId: params.userId,
    acao: params.acao,
    entidade: params.entidade,
    entidadeId: params.entidadeId,
    resultado: params.resultado ?? "success",
    severidade: params.severidade ?? "info",
    requestId: params.requestId,
    dadosAntes: sanitizeAuditDetails(
      params.dadosAntes,
    ) as NewAuditLog["dadosAntes"],
    dadosDepois: sanitizeAuditDetails(
      params.dadosDepois,
    ) as NewAuditLog["dadosDepois"],
    ip: params.ip,
    userAgent: params.userAgent,
  });
}
