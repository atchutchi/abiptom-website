import type { Currency, InvoiceState, InvoiceType } from "@/core/lib/db/schema";
import { getMonthRangeFromInput } from "@/core/lib/utils/date-range";

const VALID_STATES: InvoiceState[] = [
  "rascunho",
  "proforma",
  "definitiva",
  "paga_parcial",
  "paga",
  "anulada",
];
const VALID_TYPES: InvoiceType[] = ["proforma", "definitiva"];
const VALID_CURRENCIES: Currency[] = ["XOF", "EUR", "USD"];

export type RawInvoiceFilters = {
  estado?: string;
  clientId?: string;
  projectId?: string;
  numero?: string;
  tipo?: string;
  moeda?: string;
  mes?: string;
  dataInicio?: string;
  dataFim?: string;
  vencidas?: string;
  pagoNoMes?: string;
};

export type NormalizedInvoiceFilters = {
  estado?: InvoiceState[];
  clientId?: string;
  projectId?: string;
  numero?: number;
  tipo?: InvoiceType;
  moeda?: Currency;
  mesInicio?: string;
  mesFim?: string;
  dataInicio?: string;
  dataFim?: string;
  vencidas?: boolean;
  pagoInicio?: string;
  pagoFim?: string;
  hasActiveFilters: boolean;
};

function validDate(value?: string) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}

export function normalizeInvoiceFilters(
  raw: RawInvoiceFilters,
): NormalizedInvoiceFilters {
  const isVencidas = raw.vencidas === "1";
  const monthRange = getMonthRangeFromInput(raw.mes);
  const paidMonthRange = getMonthRangeFromInput(raw.pagoNoMes);
  const estado =
    !isVencidas && raw.estado && VALID_STATES.includes(raw.estado as InvoiceState)
      ? ([raw.estado] as InvoiceState[])
      : undefined;
  const numero = raw.numero?.trim() ? Number(raw.numero) : undefined;

  const normalized: NormalizedInvoiceFilters = {
    estado: isVencidas ? undefined : estado,
    clientId: raw.clientId || undefined,
    projectId: raw.projectId || undefined,
    numero: Number.isInteger(numero) && Number(numero) > 0 ? numero : undefined,
    tipo:
      raw.tipo && VALID_TYPES.includes(raw.tipo as InvoiceType)
        ? (raw.tipo as InvoiceType)
        : undefined,
    moeda:
      raw.moeda && VALID_CURRENCIES.includes(raw.moeda as Currency)
        ? (raw.moeda as Currency)
        : undefined,
    mesInicio: monthRange?.start,
    mesFim: monthRange?.end,
    dataInicio: validDate(raw.dataInicio),
    dataFim: validDate(raw.dataFim),
    vencidas: isVencidas,
    pagoInicio: paidMonthRange?.start,
    pagoFim: paidMonthRange?.end,
    hasActiveFilters: false,
  };

  normalized.hasActiveFilters = Boolean(
    normalized.estado?.length ||
      normalized.clientId ||
      normalized.projectId ||
      normalized.numero ||
      normalized.tipo ||
      normalized.moeda ||
      normalized.mesInicio ||
      normalized.dataInicio ||
      normalized.dataFim ||
      normalized.vencidas ||
      normalized.pagoInicio,
  );

  return normalized;
}

export function invoiceFiltersToSearchParams(raw: RawInvoiceFilters) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(raw)) {
    if (value) params.set(key, value);
  }

  return params;
}
