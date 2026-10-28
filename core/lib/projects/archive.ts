import type { ProjectState } from "@/core/lib/db/schema";

export type ProjectScope = "activos" | "pausados" | "arquivados" | "todos";

export function getProjectArchiveUpdates(
  estado: ProjectState,
  now = new Date(),
  currentArchivedAt?: Date | null,
) {
  if (estado === "concluido") {
    return { arquivadoEm: currentArchivedAt ?? now };
  }

  if (estado === "proposta" || estado === "activo") {
    return { arquivadoEm: null };
  }

  return {};
}

export function getProjectStatesForScope(scope: ProjectScope): ProjectState[] {
  if (scope === "activos") return ["proposta", "activo"];
  if (scope === "pausados") return ["pausado"];
  if (scope === "arquivados") return ["concluido", "cancelado"];
  return ["proposta", "activo", "pausado", "concluido", "cancelado"];
}
