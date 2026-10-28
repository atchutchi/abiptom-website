import type {
  PolicyConfig,
  ProjectInput,
  StaffInput,
  SalaryOverride,
  SalaryCalculationResult,
} from "./types";
import { calculateActual2024 } from "./engines/actual-2024";
import { calculateGuia2026 } from "./engines/guia-2026";

export function calculateSalary(
  policy: PolicyConfig,
  projects: ProjectInput[],
  staff: StaffInput[],
  operationalExpenses: number,
  overrides: SalaryOverride[] = []
): SalaryCalculationResult {
  if (policy.tipo === "actual_2024") {
    return calculateActual2024(
      policy,
      projects,
      staff,
      operationalExpenses,
      overrides
    );
  }
  return calculateGuia2026(policy, projects, staff, overrides);
}
