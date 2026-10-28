import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react-core";
import { Header } from "@/core/components/layout/Header";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { formatCurrency, formatDate } from "@/core/lib/utils/format";
import { getDividendPeriod } from "@/core/lib/dividends/actions";
import { getCurrentUser } from "@/core/lib/auth/actions";
import {
  ApproveDividendButton,
  CancelDividendButton,
  MarkDividendLinePaidButton,
} from "@/core/components/forms/DividendActions";

const STATE_LABELS: Record<string, string> = {
  proposto: "Proposto",
  aprovado: "Aprovado",
  pago: "Pago",
  anulado: "Anulado",
};

const STATE_COLORS: Record<string, string> = {
  proposto: "bg-gray-100 text-gray-700",
  aprovado: "bg-orange-100 text-orange-700",
  pago: "bg-green-100 text-green-700",
  anulado: "bg-red-100 text-red-700",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DividendPeriodDetailPage({ params }: PageProps) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");

  const { id } = await params;
  const period = await getDividendPeriod(id);
  if (!period) notFound();

  const isAdmin = ["ca", "dg"].includes(dbUser.role);
  const canApprove = isAdmin && period.estado === "proposto";
  const canMarkPaid = isAdmin && period.estado === "aprovado";
  const canCancel =
    isAdmin && (period.estado === "proposto" || period.estado === "aprovado");

  return (
    <>
      <Header title="Dividendos" />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <Link
              href="/admin/dividends"
              className="mb-3 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dividendos
            </Link>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {period.ano}
                  {period.trimestre ? ` · T${period.trimestre}` : " · Anual"}
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  Criado por {period.criadoPor?.nomeCurto ?? "-"}
                  {period.aprovadoPor && period.aprovadoEm && (
                    <>
                      {" · Aprovado por "}
                      {period.aprovadoPor.nomeCurto} em{" "}
                      {formatDate(period.aprovadoEm.toISOString().split("T")[0])}
                    </>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  className={
                    STATE_COLORS[period.estado] ?? "bg-gray-100 text-gray-700"
                  }
                >
                  {STATE_LABELS[period.estado] ?? period.estado}
                </Badge>
                {canApprove && <ApproveDividendButton periodId={period.id} />}
                {canCancel && <CancelDividendButton periodId={period.id} />}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Base Calculada", value: period.baseCalculada },
              { label: "Total Distribuído", value: period.totalDistribuido },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-lg border bg-white px-5 py-4"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {card.label}
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums">
                  {formatCurrency(card.value)}
                </p>
              </div>
            ))}
          </div>

          {period.notas && (
            <div className="rounded-lg border bg-gray-50 px-5 py-3 text-sm text-gray-700">
              <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                Notas
              </p>
              {period.notas}
            </div>
          )}

          <section className="overflow-x-auto rounded-lg border bg-white">
            <div className="border-b bg-gray-50 px-5 py-3">
              <h2 className="font-semibold text-gray-800">
                Distribuição por sócio
              </h2>
            </div>
            <table className="min-w-[720px] w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Sócio
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Quota
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Valor Bruto
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">
                    Pago
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {period.lines.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      Sem linhas.
                    </td>
                  </tr>
                )}
                {period.lines.map((line) => (
                  <tr key={line.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{line.user.nomeCurto}</p>
                      <p className="text-xs text-gray-400">
                        {line.user.nomeCompleto}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {Number(line.percentagemQuota).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums">
                      {formatCurrency(line.valorBruto)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {line.pago ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          {line.dataPagamento && (
                            <span className="text-xs text-gray-400">
                              {formatDate(line.dataPagamento)}
                            </span>
                          )}
                          {line.referenciaPagamento && (
                            <span className="text-xs text-gray-400">
                              {line.referenciaPagamento}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canMarkPaid && !line.pago && (
                        <MarkDividendLinePaidButton
                          lineId={line.id}
                          nomeCurto={line.user.nomeCurto}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div className="pt-2">
            <Button variant="outline" asChild>
              <Link href="/admin/dividends">Voltar à lista</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
