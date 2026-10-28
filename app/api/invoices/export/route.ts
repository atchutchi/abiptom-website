import { NextRequest, NextResponse } from "next/server";
import { and, eq, gte, inArray, lte, type SQL } from "drizzle-orm";
import { withAuthenticatedDb } from "@/core/lib/db";
import { authorizeRoles } from "@/core/lib/auth/authorization";
import { getRequestIp } from "@/core/lib/auth/request-security";
import { invoices, invoicePayments } from "@/core/lib/db/schema";
import {
  buildInvoiceExportRows,
  createInvoiceExportWorkbook,
} from "@/core/lib/invoices/export";
import { normalizeInvoiceFilters } from "@/core/lib/invoices/filters";
import { consumeRateLimit } from "@/core/lib/security/rate-limit-db";
import { recordSecurityEvent } from "@/core/lib/security/events";

export async function GET(req: NextRequest) {
  const authorization = await authorizeRoles(["ca", "dg"]);
  if (!authorization.success) {
    const status = authorization.error === "Não autenticado" ? 401 : 403;
    return new NextResponse(authorization.error, { status });
  }

  const { user, dbUser } = authorization;
  const rateLimit = await consumeRateLimit({
    action: "invoice-export",
    subject: `${dbUser.id}:${getRequestIp(req.headers)}`,
    limit: 10,
    windowMs: 5 * 60_000,
    blockMs: 10 * 60_000,
  });

  if (!rateLimit.allowed) {
    await recordSecurityEvent({
      actorId: dbUser.id,
      action: "invoice.export",
      entity: "invoice",
      result: "blocked",
      severity: "warning",
      requestHeaders: req.headers,
    });
    return NextResponse.json(
      { error: "Demasiados pedidos. Tenta novamente mais tarde." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const { searchParams } = req.nextUrl;
  const mes = searchParams.get("mes") ?? new Date().toISOString().slice(0, 7);
  const filters = normalizeInvoiceFilters({
    estado: searchParams.get("estado") ?? undefined,
    clientId: searchParams.get("clientId") ?? undefined,
    projectId: searchParams.get("projectId") ?? undefined,
    numero: searchParams.get("numero") ?? undefined,
    tipo: searchParams.get("tipo") ?? undefined,
    moeda: searchParams.get("moeda") ?? undefined,
    mes,
    dataInicio: searchParams.get("dataInicio") ?? undefined,
    dataFim: searchParams.get("dataFim") ?? undefined,
    vencidas: searchParams.get("vencidas") ?? undefined,
    pagoNoMes: searchParams.get("pagoNoMes") ?? undefined,
  });

  const rows = await withAuthenticatedDb(user, async (db) => {
    const conditions: SQL[] = [];

    if (filters.estado?.length) conditions.push(inArray(invoices.estado, filters.estado));
    if (filters.clientId) conditions.push(eq(invoices.clientId, filters.clientId));
    if (filters.projectId) conditions.push(eq(invoices.projectId, filters.projectId));
    if (filters.numero) conditions.push(eq(invoices.numero, filters.numero));
    if (filters.tipo) conditions.push(eq(invoices.tipo, filters.tipo));
    if (filters.moeda) conditions.push(eq(invoices.moeda, filters.moeda));
    if (filters.mesInicio) conditions.push(gte(invoices.dataEmissao, filters.mesInicio));
    if (filters.mesFim) conditions.push(lte(invoices.dataEmissao, filters.mesFim));
    if (filters.dataInicio) conditions.push(gte(invoices.dataEmissao, filters.dataInicio));
    if (filters.dataFim) conditions.push(lte(invoices.dataEmissao, filters.dataFim));
    if (filters.vencidas) {
      const hoje = new Date().toISOString().split("T")[0];
      conditions.push(
        inArray(invoices.estado, ["definitiva", "paga_parcial"]),
        lte(invoices.dataVencimento, hoje),
      );
    }
    if (filters.pagoInicio || filters.pagoFim) {
      const paymentConditions: SQL[] = [];
      if (filters.pagoInicio) {
        paymentConditions.push(gte(invoicePayments.data, filters.pagoInicio));
      }
      if (filters.pagoFim) {
        paymentConditions.push(lte(invoicePayments.data, filters.pagoFim));
      }

      const paidRows = await db.query.invoicePayments.findMany({
        where: paymentConditions.length ? and(...paymentConditions) : undefined,
        columns: { invoiceId: true },
      });
      const invoiceIds = [...new Set(paidRows.map((row) => row.invoiceId))];
      if (invoiceIds.length === 0) return [];
      conditions.push(inArray(invoices.id, invoiceIds));
    }

    return db.query.invoices.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      with: { client: true },
      orderBy: (invoice, { asc }) => [asc(invoice.dataEmissao)],
    });
  });

  const buf = await createInvoiceExportWorkbook(buildInvoiceExportRows(rows), mes);

  await recordSecurityEvent({
    actorId: dbUser.id,
    action: "invoice.export",
    entity: "invoice",
    result: "success",
    requestHeaders: req.headers,
    after: { filters, rowCount: rows.length },
  });

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="facturas-${mes}.xlsx"`,
    },
  });
}
