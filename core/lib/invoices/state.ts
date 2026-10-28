import type { InvoiceState } from "@/core/lib/db/schema";

export const ALLOWED_TRANSITIONS: Record<InvoiceState, InvoiceState[]> = {
  rascunho: ["proforma", "definitiva", "anulada"],
  proforma: ["definitiva", "anulada"],
  definitiva: ["paga_parcial", "paga", "anulada"],
  paga_parcial: ["paga", "anulada"],
  paga: [],
  anulada: [],
};

export function canTransition(from: InvoiceState, to: InvoiceState): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}
