"use server";

import { dbAdmin } from "@/core/lib/db";
import {
  invoices,
  projects,
  clients,
} from "@/core/lib/db/schema";
import { and, count, eq, inArray, lte, sql } from "drizzle-orm";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { toXofInteger } from "@/core/lib/utils/money";
import {
  getMonthlyProfitLossSystem,
  getQuarterlyProfitLossSystem,
} from "@/core/lib/reports/actions";

export interface DashboardStats {
  facturasAbertas: {
    count: number;
    totalXof: number;
  };
  facturasVencidas: {
    count: number;
    totalXof: number;
  };
  projectosActivos: number;
  clientesActivos: number;
  folhaMes: {
    ano: number;
    mes: number;
    totalLiquido: number;
    estado: string | null;
  };
  recebidoMes: number;
  despesasMes: number;
  facturadoMes: number;
  dividendosPagosMes: number;
  saldoGlobalMes: number;
  saldoAcumuladoTrimestre: number;
  trimestreActual: number;
  ultimasFacturas: Array<{
    id: string;
    numero: number | null;
    clientNome: string;
    total: string;
    estado: string;
    dataEmissao: string;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) throw new Error("Não autenticado");

  const now = new Date();
  const ano = now.getFullYear();
  const mes = now.getMonth() + 1;
  const trimestreActual = Math.ceil(mes / 3);
  const hoje = now.toISOString().split("T")[0];

  const [abertasRow] = await dbAdmin
    .select({
      count: count(),
      total: sql<string>`coalesce(sum(${invoices.total}), 0)`,
    })
    .from(invoices)
    .where(inArray(invoices.estado, ["definitiva", "paga_parcial"]));

  const [vencidasRow] = await dbAdmin
    .select({
      count: count(),
      total: sql<string>`coalesce(sum(${invoices.total}), 0)`,
    })
    .from(invoices)
    .where(
      and(
        inArray(invoices.estado, ["definitiva", "paga_parcial"]),
        lte(invoices.dataVencimento, hoje)
      )
    );

  const [projRow] = await dbAdmin
    .select({ count: count() })
    .from(projects)
    .where(eq(projects.estado, "activo"));

  const [cliRow] = await dbAdmin
    .select({ count: count() })
    .from(clients)
    .where(eq(clients.activo, true));

  const [relatorioMes, relatorioTrimestre] = await Promise.all([
    getMonthlyProfitLossSystem(ano, mes),
    getQuarterlyProfitLossSystem(ano, trimestreActual),
  ]);

  const ultimas = await dbAdmin
    .select({
      id: invoices.id,
      numero: invoices.numero,
      clientNome: clients.nome,
      total: invoices.total,
      estado: invoices.estado,
      dataEmissao: invoices.dataEmissao,
    })
    .from(invoices)
    .innerJoin(clients, eq(invoices.clientId, clients.id))
    .orderBy(sql`${invoices.createdAt} desc`)
    .limit(5);

  return {
    facturasAbertas: {
      count: Number(abertasRow?.count ?? 0),
      totalXof: toXofInteger(abertasRow?.total ?? 0),
    },
    facturasVencidas: {
      count: Number(vencidasRow?.count ?? 0),
      totalXof: toXofInteger(vencidasRow?.total ?? 0),
    },
    projectosActivos: Number(projRow?.count ?? 0),
    clientesActivos: Number(cliRow?.count ?? 0),
    folhaMes: {
      ano,
      mes,
      totalLiquido: relatorioMes.salarios.totalLiquido,
      estado: relatorioMes.salarios.estado,
    },
    recebidoMes: relatorioMes.receitas.recebido,
    despesasMes: relatorioMes.despesas.total,
    facturadoMes: relatorioMes.receitas.facturado,
    dividendosPagosMes: relatorioMes.dividendos.pagoNoMes,
    saldoGlobalMes: relatorioMes.resultado.saldoGlobal,
    saldoAcumuladoTrimestre: relatorioTrimestre.resultado.saldoGlobal,
    trimestreActual,
    ultimasFacturas: ultimas,
  };
}
