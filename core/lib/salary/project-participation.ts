/** Apply a payroll-period exception without changing the project's assignments. */
export function applyPeriodProjectExclusions<
  T extends { pontoFocalId: string | null; assistants: Array<{ userId: string }>; coordId?: string | null },
>(project: T, excludedUserIds: readonly string[]): T {
  if (excludedUserIds.length === 0) return project;
  const excluded = new Set(excludedUserIds);
  return {
    ...project,
    pontoFocalId: project.pontoFocalId && excluded.has(project.pontoFocalId)
      ? null : project.pontoFocalId,
    ...(project.coordId !== undefined ? {
      coordId: project.coordId && excluded.has(project.coordId) ? null : project.coordId,
    } : {}),
    assistants: project.assistants.filter(assistant => !excluded.has(assistant.userId)),
  };
}
