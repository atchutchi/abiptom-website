import Link from "next/link";
import { redirect } from "next/navigation";
import { and, desc, eq, gte, ilike, lte, or, sql, type SQL } from "drizzle-orm";
import { Header } from "@/core/components/layout/Header";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { authorizeRoles } from "@/core/lib/auth/authorization";
import { dbAdmin } from "@/core/lib/db";
import { auditLog, users } from "@/core/lib/db/schema";
import { maskIpAddress } from "@/core/lib/security/events";

export const metadata = { title: "Auditoria de segurança | ABIPTOM Core" };

const PAGE_SIZE = 50;

type AuditSearchParams = {
  utilizador?: string;
  accao?: string;
  entidade?: string;
  resultado?: string;
  severidade?: string;
  inicio?: string;
  fim?: string;
  pagina?: string;
};

function parseDate(value: string | undefined, endOfDay = false): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00"}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildPageHref(params: AuditSearchParams, page: number): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "pagina") query.set(key, value);
  }
  query.set("pagina", String(page));
  return `/admin/settings/audit?${query.toString()}`;
}

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<AuditSearchParams>;
}) {
  const authorization = await authorizeRoles(["ca"]);
  if (!authorization.success) {
    redirect(
      authorization.error === "Não autenticado" ? "/login" : "/admin/dashboard",
    );
  }

  const params = await searchParams;
  const requestedPage = Number(params.pagina ?? "1");
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const conditions: SQL[] = [];

  if (params.utilizador?.trim()) {
    const value = `%${params.utilizador.trim()}%`;
    conditions.push(
      or(ilike(users.nomeCompleto, value), ilike(users.email, value))!,
    );
  }
  if (params.accao?.trim()) {
    conditions.push(ilike(auditLog.acao, `%${params.accao.trim()}%`));
  }
  if (params.entidade?.trim()) {
    conditions.push(ilike(auditLog.entidade, `%${params.entidade.trim()}%`));
  }
  if (params.resultado?.trim()) {
    conditions.push(eq(auditLog.resultado, params.resultado.trim()));
  }
  if (params.severidade?.trim()) {
    conditions.push(eq(auditLog.severidade, params.severidade.trim()));
  }

  const startDate = parseDate(params.inicio);
  const endDate = parseDate(params.fim, true);
  if (startDate) conditions.push(gte(auditLog.createdAt, startDate));
  if (endDate) conditions.push(lte(auditLog.createdAt, endDate));

  const where = conditions.length ? and(...conditions) : undefined;
  const [rows, countRows] = await Promise.all([
    dbAdmin
      .select({
        id: auditLog.id,
        actorName: users.nomeCompleto,
        actorEmail: users.email,
        action: auditLog.acao,
        entity: auditLog.entidade,
        entityId: auditLog.entidadeId,
        result: auditLog.resultado,
        severity: auditLog.severidade,
        requestId: auditLog.requestId,
        ip: auditLog.ip,
        createdAt: auditLog.createdAt,
      })
      .from(auditLog)
      .leftJoin(users, eq(auditLog.userId, users.id))
      .where(where)
      .orderBy(desc(auditLog.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    dbAdmin
      .select({ total: sql<number>`count(*)::int` })
      .from(auditLog)
      .leftJoin(users, eq(auditLog.userId, users.id))
      .where(where),
  ]);

  const total = countRows[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <Header title="Auditoria de segurança" />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <form className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-4">
            <input
              name="utilizador"
              defaultValue={params.utilizador}
              placeholder="Utilizador ou email"
              className="h-10 rounded-md border px-3 text-sm"
            />
            <input
              name="accao"
              defaultValue={params.accao}
              placeholder="Acção"
              className="h-10 rounded-md border px-3 text-sm"
            />
            <input
              name="entidade"
              defaultValue={params.entidade}
              placeholder="Entidade"
              className="h-10 rounded-md border px-3 text-sm"
            />
            <select
              name="resultado"
              defaultValue={params.resultado ?? ""}
              className="h-10 rounded-md border px-3 text-sm"
            >
              <option value="">Todos os resultados</option>
              <option value="success">Sucesso</option>
              <option value="failure">Falha</option>
              <option value="denied">Negado</option>
              <option value="blocked">Bloqueado</option>
            </select>
            <select
              name="severidade"
              defaultValue={params.severidade ?? ""}
              className="h-10 rounded-md border px-3 text-sm"
            >
              <option value="">Todas as severidades</option>
              <option value="info">Informação</option>
              <option value="warning">Aviso</option>
              <option value="critical">Crítica</option>
            </select>
            <input
              name="inicio"
              type="date"
              defaultValue={params.inicio}
              className="h-10 rounded-md border px-3 text-sm"
            />
            <input
              name="fim"
              type="date"
              defaultValue={params.fim}
              className="h-10 rounded-md border px-3 text-sm"
            />
            <div className="flex gap-2">
              <Button type="submit">Filtrar</Button>
              <Button asChild type="button" variant="outline">
                <Link href="/admin/settings/audit">Limpar</Link>
              </Button>
            </div>
          </form>

          <div className="overflow-hidden rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Acção e alvo</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Pedido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      Não existem eventos para os filtros seleccionados.
                    </TableCell>
                  </TableRow>
                ) : null}
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {row.createdAt.toLocaleString("pt-PT", {
                        timeZone: "Africa/Bissau",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{row.actorName ?? "Sistema"}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.actorEmail ?? "Sem utilizador associado"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{row.action}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.entity}
                        {row.entityId ? ` · ${row.entityId}` : ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.result}</Badge>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {row.severity}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {maskIpAddress(row.ip)}
                    </TableCell>
                    <TableCell className="max-w-40 truncate font-mono text-xs">
                      {row.requestId ?? "Sem ID"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {total} eventos, página {Math.min(page, totalPages)} de {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={buildPageHref(params, page - 1)}>Anterior</Link>
                </Button>
              ) : null}
              {page < totalPages ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={buildPageHref(params, page + 1)}>Seguinte</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
