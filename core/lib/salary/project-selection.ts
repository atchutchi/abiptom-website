type ProjectRef = {
  id: string;
};

type ProjectWithState = ProjectRef & {
  estado: string;
};

type SalaryProjectAvailabilityMode = "paid-invoices" | "manual";

type ImportedProjectEntry = {
  projectId: string;
  valorRecebido: number;
};

type UnavailableProjectEntry = {
  projectId: string;
  projectTitle: string;
  invoices: Array<{
    invoiceId: string;
    numero: number | null;
  }>;
};

type BuildSalaryProjectEntriesInput = {
  projects: ProjectRef[];
  importedEntries: ImportedProjectEntry[];
  mode: "paid-invoices";
};

export type SalaryProjectEntry = {
  projectId: string;
  included: boolean;
  valorLiquido: string;
};

export function isSalaryProjectAvailable(
  project: ProjectWithState,
  mode: SalaryProjectAvailabilityMode,
): boolean {
  if (mode === "manual") {
    return project.estado === "activo" || project.estado === "proposta";
  }

  return project.estado !== "cancelado";
}

export function buildUnavailableProjectWarning(
  entry: UnavailableProjectEntry,
): string {
  const invoiceLabels = entry.invoices.map((invoice) =>
    invoice.numero === null ? invoice.invoiceId : String(invoice.numero),
  );
  const invoicesLabel = invoiceLabels.join(" e ");

  return `Projecto "${entry.projectTitle}" (${entry.projectId}), associado às facturas ${invoicesLabel}, tem pagamentos no mês, mas não está disponível para a folha salarial.`;
}

export function buildSalaryProjectEntries({
  projects,
  importedEntries,
}: BuildSalaryProjectEntriesInput): SalaryProjectEntry[] {
  const knownProjectIds = new Set(projects.map((project) => project.id));

  return importedEntries
    .filter((entry) => knownProjectIds.has(entry.projectId))
    .map((entry) => ({
      projectId: entry.projectId,
      included: true,
      valorLiquido: String(entry.valorRecebido),
    }));
}
