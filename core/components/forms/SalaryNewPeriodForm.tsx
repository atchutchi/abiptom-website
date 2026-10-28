"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { NativeSelect } from "@/core/components/ui/native-select";
import { createPeriod, loadPaidInvoiceProjectEntries } from "@/core/lib/salary/actions";
import type {
  CreatePeriodInput,
  PaidInvoiceProjectEntry,
} from "@/core/lib/salary/actions";
import { toXofInteger } from "@/core/lib/utils/money";
import {
  buildUnavailableProjectWarning,
  buildSalaryProjectEntries,
  isSalaryProjectAvailable,
} from "@/core/lib/salary/project-selection";

interface PolicyOption {
  id: string;
  nome: string;
  versao: string;
  tipo: string;
}

interface ProjectOption {
  id: string;
  titulo: string;
  estado: string;
  clienteNome: string;
  pontoFocalId: string | null;
  pontoFocalNome: string | null;
  assistants: Array<{ userId: string; nomeCurto: string }>;
}

interface SalaryNewPeriodFormProps {
  policies: PolicyOption[];
  projects: ProjectOption[];
}

interface ProjectEntry {
  projectId: string;
  included: boolean;
  valorLiquido: string;
}

const MES_OPTIONS = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Marco" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, index) => CURRENT_YEAR - 1 + index);

export function SalaryNewPeriodForm({
  policies,
  projects,
}: SalaryNewPeriodFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ano, setAno] = useState(String(CURRENT_YEAR));
  const [mes, setMes] = useState(String(new Date().getMonth() + 1));
  const [policyId, setPolicyId] = useState(policies[0]?.id ?? "");
  const [isLoadingInvoices, startInvoiceLoadTransition] = useTransition();
  const [invoiceWarnings, setInvoiceWarnings] = useState<string[]>([]);
  const [invoiceEntries, setInvoiceEntries] = useState<
    Record<string, PaidInvoiceProjectEntry>
  >({});
  const [entries, setEntries] = useState<ProjectEntry[]>([]);
  const [manualProjectId, setManualProjectId] = useState("");

  const includedEntries = entries.filter((entry) => entry.included);
  const totalImported = Object.values(invoiceEntries).reduce(
    (sum, entry) => sum + entry.valorRecebido,
    0,
  );

  function toggleProject(projectId: string) {
    setEntries((previous) =>
      previous.map((entry) =>
        entry.projectId === projectId
          ? { ...entry, included: !entry.included }
          : entry,
      ),
    );
  }

  function setValorLiquido(projectId: string, value: string) {
    setEntries((previous) =>
      previous.map((entry) =>
        entry.projectId === projectId ? { ...entry, valorLiquido: value } : entry,
      ),
    );
  }

  function handleLoadPaidInvoices() {
    setError("");
    setInvoiceWarnings([]);

    if (
      includedEntries.length > 0 &&
      !confirm(
        "Carregar facturas pagas vai substituir a selecção actual de projectos. Continuar?",
      )
    ) {
      return;
    }

    startInvoiceLoadTransition(async () => {
      const result = await loadPaidInvoiceProjectEntries({
        ano: Number(ano),
        mes: Number(mes),
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      const knownProjectIds = new Set(projects.map((project) => project.id));
      const missingProjectWarnings = result.entries
        .filter((entry) => !knownProjectIds.has(entry.projectId))
        .map(buildUnavailableProjectWarning);

      setInvoiceEntries(
        Object.fromEntries(
          result.entries
            .filter((entry) => knownProjectIds.has(entry.projectId))
            .map((entry) => [entry.projectId, entry]),
        ),
      );
      setInvoiceWarnings([...result.warnings, ...missingProjectWarnings]);
      setEntries(
        buildSalaryProjectEntries({
          projects,
          importedEntries: result.entries,
          mode: "paid-invoices",
        }),
      );

      if (result.entries.length === 0) {
        setInvoiceWarnings((previous) => [
          ...previous,
          "Nao foram encontrados pagamentos de facturas ligadas a projectos neste mês.",
        ]);
      }
    });
  }

  function handleAddManualProject() {
    if (!manualProjectId) return;
    setEntries((previous) => {
      if (previous.some((entry) => entry.projectId === manualProjectId)) {
        return previous;
      }

      return [
        ...previous,
        { projectId: manualProjectId, included: true, valorLiquido: "" },
      ];
    });
    setManualProjectId("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!policyId) {
      setError("Selecciona uma politica salarial.");
      return;
    }

    if (includedEntries.length === 0) {
      setError("Selecciona pelo menos um projecto.");
      return;
    }

    for (const entry of includedEntries) {
      const valor = Number(entry.valorLiquido);
      if (!entry.valorLiquido || Number.isNaN(valor) || valor <= 0) {
        const project = projects.find((item) => item.id === entry.projectId);
        setError(
          `Introduz a base do projecto para "${project?.titulo ?? entry.projectId}".`,
        );
        return;
      }
    }

    const input: CreatePeriodInput = {
      ano: Number(ano),
      mes: Number(mes),
      policyId,
      projectEntries: includedEntries.map((entry) => ({
        projectId: entry.projectId,
        valorLiquido: toXofInteger(entry.valorLiquido),
      })),
    };

    startTransition(async () => {
      const result = await createPeriod(input);
      if ("error" in result) {
        setError(result.error);
        return;
      }

      router.push(`/admin/salary/${result.periodId}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-800">1. Periodo e Politica</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <Label>Mes *</Label>
            <NativeSelect
              value={mes}
              onChange={(event) => setMes(event.target.value)}
            >
              {MES_OPTIONS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-1">
            <Label>Ano *</Label>
            <NativeSelect
              value={ano}
              onChange={(event) => setAno(event.target.value)}
            >
              {YEAR_OPTIONS.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-1">
            <Label>Politica *</Label>
            <NativeSelect
              value={policyId}
              onChange={(event) => setPolicyId(event.target.value)}
              required
            >
              <option value="" disabled>
                Seleccionar politica
              </option>
              {policies.map((policy) => (
                <option key={policy.id} value={policy.id}>
                  {policy.nome} v{policy.versao}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          O periodo e criado em estado aberto. Depois ajustas participantes e so entao corres o calculo.
        </p>
      </section>

      <section className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">2. Projectos do periodo</h2>
            <p className="text-xs text-gray-500">
              Podes carregar automaticamente projectos a partir dos pagamentos de facturas do mês.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="text-sm text-gray-500">
              {includedEntries.length} seleccionado(s)
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={handleLoadPaidInvoices}
              disabled={isLoadingInvoices}
            >
              {isLoadingInvoices ? "A carregar..." : "Carregar facturas pagas"}
            </Button>
          </div>
        </div>

        {totalImported > 0 && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Importado de facturas pagas:{" "}
            <strong>{totalImported.toLocaleString("pt-PT")} XOF</strong>.
            Confirma os projectos antes de criar o período.
          </div>
        )}

        {invoiceWarnings.length > 0 && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-medium">Avisos da importação</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {invoiceWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="rounded-md border border-dashed px-4 py-6 text-sm text-gray-500">
            Carrega facturas pagas para listar apenas projectos com pagamentos no mês escolhido.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {entries.map((entry) => {
              const project = projects.find((item) => item.id === entry.projectId);
              if (!project) return null;

              return (
                <div
                  key={project.id}
                  className="flex flex-col gap-3 py-3 md:flex-row md:items-center"
                >
                  <div className="flex flex-1 items-start gap-3">
                    <input
                      type="checkbox"
                      id={`proj-${project.id}`}
                      checked={entry.included}
                      onChange={() => toggleProject(project.id)}
                      className="mt-1 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-blue-600"
                    />
                    <label htmlFor={`proj-${project.id}`} className="flex-1 cursor-pointer">
                      <p className="text-sm font-medium text-gray-800">{project.titulo}</p>
                      <p className="text-xs text-gray-400">
                        {project.clienteNome}
                        {project.pontoFocalNome ? ` · PF: ${project.pontoFocalNome}` : ""}
                        {project.assistants.length > 0
                          ? ` · Aux: ${project.assistants
                              .map((assistant) => assistant.nomeCurto)
                              .join(", ")}`
                          : ""}
                      </p>
                      {invoiceEntries[project.id] && (
                        <p className="mt-1 text-xs text-green-700">
                          {invoiceEntries[project.id].paymentCount} pagamento(s)
                          importado(s):{" "}
                          {invoiceEntries[project.id].valorRecebido.toLocaleString("pt-PT")} XOF
                        </p>
                      )}
                    </label>
                  </div>

                  {entry.included && (
                    <div className="w-full md:w-44 md:flex-shrink-0">
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Valor recebido antes despesas"
                        value={entry.valorLiquido}
                        onChange={(event) => setValorLiquido(project.id, event.target.value)}
                        className="text-right"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-2 rounded-md border bg-gray-50 p-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <Label>Adicionar projecto manualmente</Label>
            <NativeSelect
              value={manualProjectId}
              onChange={(event) => setManualProjectId(event.target.value)}
            >
              <option value="">Seleccionar projecto activo ou proposta</option>
              {projects
                .filter(
                  (project) =>
                    isSalaryProjectAvailable(project, "manual") &&
                    !entries.some((entry) => entry.projectId === project.id),
                )
                .map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.titulo} · {project.clienteNome}
                  </option>
                ))}
            </NativeSelect>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddManualProject}
            disabled={!manualProjectId}
          >
            Adicionar
          </Button>
        </div>
      </section>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <p className="text-xs text-gray-500 sm:max-w-md">
          Introduz a base do projecto antes de abater despesas ligadas directamente ao próprio projecto.
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button type="submit" disabled={isPending}>
          {isPending ? "A criar..." : "Criar periodo"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/salary")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
