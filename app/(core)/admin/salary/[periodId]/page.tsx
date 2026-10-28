import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileDown, Info } from "lucide-react-core";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Header } from "@/core/components/layout/Header";
import { AnnulPeriodApprovalButton } from "@/core/components/forms/AnnulPeriodApprovalButton";
import { CalculatePeriodButton } from "@/core/components/forms/CalculatePeriodButton";
import { ConfirmPeriodButton } from "@/core/components/forms/ConfirmPeriodButton";
import { DeletePeriodButton } from "@/core/components/forms/DeletePeriodButton";
import { GenerateExecutionSnapshotsButton } from "@/core/components/forms/GenerateExecutionSnapshotsButton";
import { MarkLinePaidButton } from "@/core/components/forms/MarkLinePaidButton";
import { SalaryLineOverrideForm } from "@/core/components/forms/SalaryLineOverrideForm";
import { SalaryParticipantsEditor } from "@/core/components/forms/SalaryParticipantsEditor";
import { getCurrentUser } from "@/core/lib/auth/actions";
import { getSalaryExecutionOverview } from "@/core/lib/execution/actions";
import { getSalaryPeriod } from "@/core/lib/salary/actions";
import type { ProjectPaymentRecord } from "@/core/lib/salary/types";
import { formatCurrency, formatDate } from "@/core/lib/utils/format";

const PERIOD_STATE_LABELS: Record<string, string> = {
  aberto: "Aberto",
  calculado: "Calculado",
  confirmado: "Confirmado",
  pago: "Pago",
};

const PERIOD_STATE_COLORS: Record<string, string> = {
  aberto: "bg-gray-100 text-gray-700",
  calculado: "bg-blue-100 text-blue-700",
  confirmado: "bg-orange-100 text-orange-700",
  pago: "bg-green-100 text-green-700",
};

const MES_LABELS = [
  "",
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface PageProps {
  params: Promise<{ periodId: string }>;
}

type SalaryPeriodData = NonNullable<Awaited<ReturnType<typeof getSalaryPeriod>>>;

type Actual2024DisplayRow = {
  userId: string;
  nomeCurto: string;
  role: string;
  pagamentosProjectos: number;
  pagamentoGestaoPessoa: number;
  subsidioDinamico: number;
  salarioBase: number;
  outrosBeneficios: number;
  totalBrutoCalculado: number;
  totalBrutoFinal: number;
  totalLiquidoFinal: number;
  descontoPercentagem: number;
  pago: boolean;
  dataPagamento: string | null;
  overrideMotivo: string | null;
  persistedLineId: string | null;
};

export default async function SalaryPeriodPage({ params }: PageProps) {
  const { user, dbUser } = await getCurrentUser();
  if (!user || !dbUser) redirect("/login");

  const { periodId } = await params;
  const period = await getSalaryPeriod(periodId);
  if (!period) notFound();
  const executionOverview = await getSalaryExecutionOverview(period.id);

  const policyType = (period.policy.configuracaoJson as { tipo?: string }).tipo;
  const isActual2024 = policyType === "actual_2024";
  const canManagePeriod = ["ca", "dg"].includes(dbUser.role);
  const canEditPeriod = canManagePeriod && ["aberto", "calculado"].includes(period.estado);
  const canDeletePeriod = canManagePeriod && ["aberto", "calculado"].includes(period.estado);
  const canConfirm = canManagePeriod && period.estado === "calculado";
  const canAnnulApproval = canManagePeriod && period.estado === "confirmado";
  const canAdjustLines = canManagePeriod && period.estado === "calculado";
  const canMarkPaid = canManagePeriod && period.estado === "confirmado";

  const aggregateCards = isActual2024 && period.calculationPreview
    ? [
        { label: "Resto ABIPTOM", value: period.calculationPreview.aggregates.totalRestoAbiptom },
        { label: "Rubrica gestao", value: period.calculationPreview.aggregates.totalPagamentoGestao },
        { label: "Despesas", value: period.calculationPreview.aggregates.totalDespesasOperacionais },
        { label: "Saldo base", value: period.calculationPreview.aggregates.saldoBaseSubsidios },
        { label: "Bolo subsidios", value: period.calculationPreview.aggregates.boloSubsidios },
        { label: "Subsidio / pessoa", value: period.calculationPreview.aggregates.subsidioPorPessoa },
        { label: "Folha bruta", value: period.calculationPreview.aggregates.totalFolhaBruto },
        { label: "Folha liquida", value: period.calculationPreview.aggregates.totalFolhaLiquido },
      ]
    : [
        { label: "Total bruto", value: Number(period.totalBruto ?? 0) },
        { label: "Total liquido", value: Number(period.totalLiquido ?? 0) },
        { label: "Total folha", value: Number(period.totalFolha ?? 0) },
      ];

  const actual2024Rows = isActual2024 ? buildActual2024Rows(period) : [];
  const paymentsByProject = buildPaymentsByProject(period);

  return (
    <>
      <Header title="Folha Salarial" />

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <Link
              href="/admin/salary"
              className="mb-3 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Folha salarial
            </Link>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {MES_LABELS[period.mes]} {period.ano}
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  {period.policy.nome} v{period.policy.versao}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  className={
                    PERIOD_STATE_COLORS[period.estado] ?? "bg-gray-100 text-gray-700"
                  }
                >
                  {PERIOD_STATE_LABELS[period.estado] ?? period.estado}
                </Badge>
                {canEditPeriod && (
                  <CalculatePeriodButton
                    periodId={period.id}
                    label={period.estado === "aberto" ? "Calcular folha" : "Recalcular folha"}
                  />
                )}
                {canDeletePeriod && <DeletePeriodButton periodId={period.id} />}
                {canConfirm && <ConfirmPeriodButton periodId={period.id} />}
                {canAnnulApproval && <AnnulPeriodApprovalButton periodId={period.id} />}
              </div>
            </div>
          </div>

          {period.calculationError && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {period.calculationError}
            </div>
          )}

          {period.calculationPreview && period.calculationPreview.warnings.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p className="font-medium">Avisos do calculo</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {period.calculationPreview.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {aggregateCards.map((card) => (
              <div key={card.label} className="rounded-lg border bg-white px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {card.label}
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums">
                  {formatCurrency(card.value)}
                </p>
              </div>
            ))}
          </div>

          <section className="rounded-lg border bg-white">
            <div className="border-b bg-gray-50 px-5 py-3">
              <h2 className="font-semibold text-gray-800">Projectos do periodo</h2>
              <p className="text-sm text-gray-500">
                Snapshot gravado no momento da criacao do periodo.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Projecto</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Cliente</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">PF</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Auxiliares</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Coord</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Valor recebido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {period.periodProjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                        Nenhum projecto associado a este periodo.
                      </td>
                    </tr>
                  ) : (
                    period.periodProjects.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{entry.project.titulo}</p>
                          {entry.pfPercentagemOverride !== null && (
                            <p className="text-xs text-gray-400">
                              Override PF: {Number(entry.pfPercentagemOverride) * 100}%
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{entry.project.client.nome}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {entry.project.pontoFocalId
                            ? period.participants.find((participant) => participant.userId === entry.project.pontoFocalId)?.user.nomeCurto ?? "PF removido"
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {entry.project.assistants.length > 0
                            ? entry.project.assistants.map((assistant) => assistant.user.nomeCurto).join(", ")
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {entry.coord?.nomeCurto ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatCurrency(entry.valorLiquido)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border bg-white">
            <div className="flex flex-col gap-3 border-b bg-gray-50 px-5 py-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-semibold text-gray-800">Execução validada dos projectos</h2>
                <p className="text-sm text-gray-500">
                  Informativo nesta fase. Depois pode entrar como factor financeiro da folha.
                </p>
              </div>
              {canManagePeriod && <GenerateExecutionSnapshotsButton periodId={period.id} />}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Projecto</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Live</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Snapshot</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Aprovadas</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Submetidas</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Pend. validação</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Rejeitadas/correcção</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Atraso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {executionOverview.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                        Sem projectos para medir execução neste período.
                      </td>
                    </tr>
                  ) : (
                    executionOverview.map((entry) => (
                      <tr key={entry.projectId}>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/projects/${entry.projectId}/execution`}
                            className="font-medium text-blue-700 hover:underline"
                          >
                            {entry.titulo}
                          </Link>
                          <p className="text-xs text-gray-400">
                            Peso {entry.live.approvedWeight.toFixed(2)} / {entry.live.plannedWeight.toFixed(2)}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums">
                          {entry.live.executionPercent.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-gray-600">
                          {entry.snapshot
                            ? `${Number(entry.snapshot.executionPercent).toFixed(2)}%`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {entry.live.approvedTasks}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {entry.live.submittedTasks}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {entry.live.pendingValidationTasks}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {entry.live.rejectedTasks}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {entry.live.overdueTasks}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4 rounded-lg border bg-white p-5">
            <div>
              <h2 className="font-semibold text-gray-800">Participantes do periodo</h2>
              <p className="text-sm text-gray-500">
                Define quem recebe subsidio dinamico, quem recebe a rubrica de gestao e o salário base aplicável nesse período.
              </p>
            </div>
            <SalaryParticipantsEditor
              periodId={period.id}
              participants={period.participants.map((participant) => ({
                id: participant.id,
                userId: participant.userId,
                isElegivelSubsidio: participant.isElegivelSubsidio,
                recebeRubricaGestao: participant.recebeRubricaGestao,
                salarioBaseOverride: participant.salarioBaseOverride,
                user: {
                  nomeCurto: participant.user.nomeCurto,
                  nomeCompleto: participant.user.nomeCompleto,
                  role: participant.user.role,
                  salarioBaseMensal: participant.user.salarioBaseMensal,
                },
              }))}
              editable={canEditPeriod}
            />
          </section>

          {isActual2024 && period.calculationPreview ? (
            <section className="rounded-lg border bg-white">
              <div className="border-b bg-gray-50 px-5 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-gray-800">Calculo da folha</h2>
                    <p className="text-sm text-gray-500">
                      Outros beneficios vêm de despesas com beneficiário e somam ao total. O ajuste do bruto final exige motivo.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-800">
                    <Info className="h-3.5 w-3.5" />
                    Preview baseado no snapshot do periodo
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[1540px] w-full text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Nome</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Pag. projectos</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Rubrica gestao</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Subsidio dinamico</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Salario base</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Outros beneficios</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Bruto calculado</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Bruto final</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Desconto %</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Liquido final</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">Pago</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Accoes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {actual2024Rows.map((row) => (
                      <tr key={row.userId} className="align-top">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{row.nomeCurto}</p>
                          <p className="text-xs uppercase text-gray-400">{row.role}</p>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatCurrency(row.pagamentosProjectos)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {row.pagamentoGestaoPessoa > 0 ? formatCurrency(row.pagamentoGestaoPessoa) : "-"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {row.subsidioDinamico > 0 ? formatCurrency(row.subsidioDinamico) : "-"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatCurrency(row.salarioBase)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {row.outrosBeneficios > 0 ? formatCurrency(row.outrosBeneficios) : "-"}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatCurrency(row.totalBrutoCalculado)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(row.totalBrutoFinal)}
                            </p>
                            {row.overrideMotivo && (
                              <span
                                className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800"
                                title={row.overrideMotivo}
                              >
                                Ajustado
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-gray-600">
                          {(row.descontoPercentagem * 100).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-right font-semibold tabular-nums">
                          {formatCurrency(row.totalLiquidoFinal)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {row.pago ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              {row.dataPagamento && (
                                <span className="text-xs text-gray-400">
                                  {formatDate(row.dataPagamento)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            {canAdjustLines && row.persistedLineId && (
                              <SalaryLineOverrideForm
                                lineId={row.persistedLineId}
                                totalBrutoCalculado={row.totalBrutoCalculado}
                                totalBrutoFinal={row.totalBrutoFinal}
                                overrideMotivo={row.overrideMotivo}
                              />
                            )}
                            {canMarkPaid && row.persistedLineId && !row.pago && (
                              <MarkLinePaidButton
                                lineId={row.persistedLineId}
                                nomeCurto={row.nomeCurto}
                              />
                            )}
                            {row.persistedLineId && period.estado !== "aberto" && (
                              <a
                                href={`/api/salary/receipt/${row.persistedLineId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              >
                                <FileDown className="h-3.5 w-3.5" />
                                Recibo
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            <LegacySalaryLinesSection
              period={period}
              canMarkPaid={canMarkPaid}
            />
          )}

          {paymentsByProject.length > 0 && (
            <section className="overflow-x-auto rounded-lg border bg-white">
              <div className="border-b bg-gray-50 px-5 py-3">
                <h2 className="font-semibold text-gray-800">Distribuicao por projecto</h2>
              </div>
              {paymentsByProject.map((group) => (
                <div key={group.projectId} className="border-b last:border-0">
                  <div className="bg-gray-50/50 px-5 py-2">
                    <p className="text-sm font-medium text-gray-700">{group.titulo}</p>
                  </div>
                  <table className="min-w-[720px] w-full text-sm">
                    <tbody className="divide-y divide-gray-50">
                      {group.payments.map((payment) => (
                        <tr key={`${group.projectId}-${payment.userId}-${payment.papel}`}>
                          <td className="px-6 py-2 text-gray-700">{payment.userName}</td>
                          <td className="px-4 py-2 text-xs uppercase text-gray-500">
                            {payment.papel}
                          </td>
                          <td className="px-4 py-2 text-gray-500 tabular-nums">
                            {(payment.percentagemAplicada * 100).toFixed(2)}%
                          </td>
                          <td className="px-4 py-2 text-right font-medium tabular-nums">
                            {formatCurrency(payment.valorRecebido)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </section>
          )}

          <div className="pt-2">
            <Button variant="outline" asChild>
              <Link href="/admin/salary">Voltar a lista</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

function buildActual2024Rows(period: SalaryPeriodData): Actual2024DisplayRow[] {
  if (!period.calculationPreview) {
    return [];
  }

  const persistedByUserId = new Map(
    period.lines.map((line) => [line.userId, line]),
  );
  const participantNames = new Map(
    period.participants.map((participant) => [participant.userId, participant.user]),
  );

  return period.calculationPreview.salaryLines
    .map((line) => {
      const participantUser = participantNames.get(line.userId);
      const persisted = persistedByUserId.get(line.userId) ?? null;

      return {
        userId: line.userId,
        nomeCurto: participantUser?.nomeCurto ?? line.userId,
        role: participantUser?.role ?? "staff",
        pagamentosProjectos: line.pagamentosProjectos,
        pagamentoGestaoPessoa: line.pagamentoGestaoPessoa,
        subsidioDinamico: line.subsidioDinamico,
        salarioBase: line.salarioBase,
        outrosBeneficios: line.outrosBeneficios,
        totalBrutoCalculado: line.totalBrutoCalculado,
        totalBrutoFinal: persisted ? Number(persisted.totalBrutoFinal) : line.totalBrutoCalculado,
        totalLiquidoFinal: persisted ? Number(persisted.totalLiquidoFinal) : line.totalLiquidoCalculado,
        descontoPercentagem: line.descontoPercentagem,
        pago: persisted?.pago ?? false,
        dataPagamento: persisted?.dataPagamento ?? null,
        overrideMotivo: persisted?.overrideMotivo ?? null,
        persistedLineId: persisted?.id ?? null,
      };
    })
    .sort((left, right) => right.totalLiquidoFinal - left.totalLiquidoFinal);
}

function buildPaymentsByProject(period: SalaryPeriodData) {
  const titlesByProjectId = new Map(
    period.periodProjects.map((entry) => [entry.projectId, entry.project.titulo]),
  );
  const userNamesById = new Map(
    period.participants.map((participant) => [participant.userId, participant.user.nomeCurto]),
  );

  const rawPayments = period.calculationPreview
    ? period.calculationPreview.projectPayments.map((payment) => ({
        projectId: payment.projectId,
        titulo: titlesByProjectId.get(payment.projectId) ?? payment.projectId,
        userId: payment.userId,
        userName: userNamesById.get(payment.userId) ?? payment.userId,
        papel: payment.papel,
        percentagemAplicada: payment.percentagemAplicada,
        valorRecebido: payment.valorRecebido,
      }))
    : period.projectPayments.map((payment) => ({
        projectId: payment.projectId,
        titulo: payment.project.titulo,
        userId: payment.userId,
        userName: payment.user.nomeCurto,
        papel: payment.papel,
        percentagemAplicada: Number(payment.percentagemAplicada),
        valorRecebido: Number(payment.valorRecebido),
      }));

  const grouped = rawPayments.reduce<
    Map<
      string,
      {
        projectId: string;
        titulo: string;
        payments: Array<{
          userId: string;
          userName: string;
          papel: string;
          percentagemAplicada: number;
          valorRecebido: number;
        }>;
      }
    >
  >((acc, payment) => {
    if (!acc.has(payment.projectId)) {
      acc.set(payment.projectId, {
        projectId: payment.projectId,
        titulo: payment.titulo,
        payments: [],
      });
    }
    acc.get(payment.projectId)?.payments.push({
      userId: payment.userId,
      userName: payment.userName,
      papel: payment.papel,
      percentagemAplicada: payment.percentagemAplicada,
      valorRecebido: payment.valorRecebido,
    });
    return acc;
  }, new Map());

  return Array.from(grouped.values());
}

function LegacySalaryLinesSection({
  period,
  canMarkPaid,
}: {
  period: SalaryPeriodData;
  canMarkPaid: boolean;
}) {
  return (
    <section className="overflow-x-auto rounded-lg border bg-white">
      <div className="border-b bg-gray-50 px-5 py-3">
        <h2 className="font-semibold text-gray-800">Linhas salariais</h2>
      </div>
      <table className="min-w-[980px] w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Colaborador</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Sal. base</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Componente</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Subsidio</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Outros</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Descontos</th>
            <th className="px-4 py-3 text-right font-bold text-gray-600">Total liq.</th>
            <th className="px-4 py-3 text-center font-medium text-gray-600">Pago</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {period.lines.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">
                Ainda nao existem linhas calculadas para este periodo.
              </td>
            </tr>
          ) : (
            period.lines.map((line) => {
              const componenteTotal = (
                line.componenteDinamica as ProjectPaymentRecord[]
              ).reduce((sum, component) => sum + component.valorRecebido, 0);

              const subsidioTotal = Object.values(
                (line.subsidios as Record<string, number>) ?? {},
              ).reduce((sum, value) => sum + value, 0);

              return (
                <tr key={line.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{line.user.nomeCurto}</p>
                    <p className="text-xs uppercase text-gray-400">{line.user.role}</p>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(line.salarioBase)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(componenteTotal)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {subsidioTotal > 0 ? formatCurrency(subsidioTotal) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {Number(line.outrosBeneficios) > 0 ? formatCurrency(line.outrosBeneficios) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-red-600">
                    {Number(line.descontos) > 0 ? `-${formatCurrency(line.descontos)}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-bold tabular-nums">
                    {formatCurrency(line.totalLiquidoFinal)}
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
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {canMarkPaid && !line.pago && (
                        <MarkLinePaidButton lineId={line.id} nomeCurto={line.user.nomeCurto} />
                      )}
                      {period.estado !== "aberto" && (
                        <a
                          href={`/api/salary/receipt/${line.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          Recibo
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </section>
  );
}
