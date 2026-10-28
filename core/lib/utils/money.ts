export function toFiniteNumber(value: string | number | null | undefined): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const normalised = value.trim().replace(/\s/g, "").replace(",", ".");
    if (!normalised) return 0;
    const parsed = Number(normalised);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function toXofInteger(value: string | number | null | undefined): number {
  return Math.round(toFiniteNumber(value));
}

export function toXofString(value: string | number | null | undefined): string {
  return String(toXofInteger(value));
}

export function toCurrencyStorageString(
  value: string | number | null | undefined,
  currency = "XOF",
): string {
  if (currency === "XOF") {
    return toXofString(value);
  }

  const n = toFiniteNumber(value);
  return n.toFixed(2);
}

export function multiplyToXofInteger(
  value: string | number | null | undefined,
  rate: string | number | null | undefined = 1,
): number {
  return toXofInteger(toFiniteNumber(value) * toFiniteNumber(rate));
}
