import { isIP } from "node:net";

export type AuditSafeValue =
  | string
  | number
  | boolean
  | null
  | AuditSafeValue[]
  | { [key: string]: AuditSafeValue };

const SENSITIVE_KEY_PARTS = [
  "password",
  "token",
  "secret",
  "authorization",
  "cookie",
  "servicerolekey",
];

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
  return SENSITIVE_KEY_PARTS.some((part) => normalized.includes(part));
}

function sanitizeValue(value: unknown): AuditSafeValue | undefined {
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) {
    return value
      .map(sanitizeValue)
      .filter((item): item is AuditSafeValue => item !== undefined);
  }

  if (typeof value === "object") {
    const sanitized: Record<string, AuditSafeValue> = {};
    for (const [key, entryValue] of Object.entries(value)) {
      if (isSensitiveKey(key)) continue;
      const entry = sanitizeValue(entryValue);
      if (entry !== undefined) sanitized[key] = entry;
    }
    return sanitized;
  }

  return undefined;
}

export function sanitizeAuditDetails(value: unknown): AuditSafeValue | null {
  return sanitizeValue(value) ?? null;
}

export function maskIpAddress(value: string | null | undefined): string {
  if (!value || value === "unknown") return "unknown";

  const version = isIP(value);
  if (version === 4) {
    const parts = value.split(".");
    return `${parts.slice(0, 3).join(".")}.x`;
  }

  if (version === 6) {
    const visible = value.split(":").filter(Boolean).slice(0, 4);
    return visible.length ? `${visible.join(":")}::` : "::";
  }

  return "unknown";
}
