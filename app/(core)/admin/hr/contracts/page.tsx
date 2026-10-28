import { redirect } from "next/navigation";
import { Header } from "@/core/components/layout/Header";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { dbAdmin } from "@/core/lib/db";
import { users } from "@/core/lib/db/schema";
import { formatCurrency, formatDate } from "@/core/lib/utils/format";
import { inArray } from "drizzle-orm";

export const metadata = { title: "RH / Contratos" };

type ContractBadge = {
  label: string;
  className: string;
};

function getContractBadge(dataSaida: string | null): ContractBadge {
  if (!dataSaida) {
    return {
      label: "Sem termo",
      className: "bg-green-100 text-green-700",
    };
  }

  const hoje = new Date().toISOString().slice(0, 10);
  if (dataSaida < hoje) {
    return {
      label: "Terminado",
      className: "bg-gray-200 text-gray-700",
    };
  }

  const limite = new Date();
  limite.setDate(limite.getDate() + 30);
  const limiteIso = limite.toISOString().slice(0, 10);

  if (dataSaida <= limiteIso) {
    return {
      label: "Expira em 30 dias",
      className: "bg-orange-100 text-orange-700",
    };
  }

  return {
    label: "Activo",
    className: "bg-blue-100 text-blue-700",
  };
}

export default async function HrContractsPage() {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");
  if (![
    "ca",
    "dg",
  ].includes(dbUser.role)) {
    redirect("/admin/dashboard");
  }

  const colaboradores = await dbAdmin.query.users.findMany({
    where: inArray(users.role, ["staff", "coord", "dg", "ca"]),
    orderBy: (u, { asc }) => [asc(u.nomeCurto)],
  });

  const activos = colaboradores.filter((c) => c.activo).length;
  const semTermo = colaboradores.filter((c) => !c.dataSaida).length;
  const folhaBase = colaboradores
    .filter((c) => c.activo)
    .reduce((sum, c) => sum + Number(c.salarioBaseMensal ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="RH / Contratos" />

      <main className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Colaboradores" value={String(colaboradores.length)} />
          <StatCard label="Activos" value={String(activos)} />
          <StatCard label="Folha base" value={formatCurrency(folhaBase)} />
        </div>

        <section className="rounded-lg border bg-white shadow-sm">
          <div className="border-b px-5 py-3">
            <h2 className="font-semibold text-gray-900">Gestão de contratos</h2>
            <p className="text-xs text-gray-500">
              {semTermo} contrato(s) sem termo · alertas automáticos para contratos a expirar
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Colaborador</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Cargo</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Entrada</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Saída</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600">Salário base</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {colaboradores.map((c) => {
                  const badge = getContractBadge(c.dataSaida);
                  return (
                    <tr key={c.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{c.nomeCurto}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{c.cargo ?? "-"}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(c.dataEntrada)}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(c.dataSaida)}</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-gray-900">
                        {formatCurrency(c.salarioBaseMensal)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-gray-900 tabular-nums">{value}</p>
    </div>
  );
}
