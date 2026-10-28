import { toXofInteger } from "./money";

export function formatDate(d: string | null | undefined): string {
  if (!d) return "-";
  const [year, month, day] = d.split("-");
  return `${day}.${month}.${year}`;
}

export function formatCurrency(amount: string | number | null | undefined, currency = "XOF"): string {
  if (amount === null || amount === undefined) return "-";
  const raw =
    typeof amount === "string"
      ? Number(amount.trim().replace(/\s/g, "").replace(",", "."))
      : Number(amount);
  if (!Number.isFinite(raw)) return "-";
  const n = currency === "XOF" ? toXofInteger(raw) : raw;
  const decimals = currency === "XOF" ? 0 : 2;
  return `${n.toLocaleString("pt-PT", { minimumFractionDigits: 0, maximumFractionDigits: decimals })} ${currency}`;
}

export function invoiceNumber(n: number | null | undefined): string {
  if (!n) return "-";
  return `#${String(n).padStart(5, "0")}`;
}

export const INVOICE_STATE_LABELS: Record<string, string> = {
  rascunho: "Rascunho",
  proforma: "Proforma",
  definitiva: "Definitiva",
  paga_parcial: "Paga parcialmente",
  paga: "Paga",
  anulada: "Anulada",
};

export const INVOICE_STATE_COLORS: Record<string, string> = {
  rascunho: "bg-muted text-muted-foreground",
  proforma: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  definitiva: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  paga_parcial: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  paga: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  anulada: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};
