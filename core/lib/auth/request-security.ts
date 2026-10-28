import { isIP } from "node:net";

function validIp(value: string | null): string | null {
  const candidate = value?.trim() ?? "";
  return isIP(candidate) ? candidate : null;
}

export function getRequestIp(headers: Headers): string {
  const firstForwarded = headers.get("x-forwarded-for")?.split(",", 1)[0] ?? null;

  return (
    validIp(firstForwarded) ?? validIp(headers.get("x-real-ip")) ?? "unknown"
  );
}

export function normalizeAuthEmail(value: string): string {
  return value.trim().toLowerCase();
}
