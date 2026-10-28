import path from "node:path";

type RestoreTargetInput = {
  restoreUrl: string | undefined;
  runtimeUrl?: string;
  directUrl?: string;
};

function parseDatabaseUrl(value: string | undefined, label: string): URL {
  if (!value) throw new Error(`${label} não está configurada.`);

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} não é uma URL PostgreSQL válida.`);
  }

  if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
    throw new Error(`${label} não é uma URL PostgreSQL válida.`);
  }

  return parsed;
}

function databaseIdentity(url: URL): string {
  const port = url.port || "5432";
  const database = decodeURIComponent(url.pathname.replace(/^\//, ""));
  return `${url.hostname.toLowerCase()}:${port}/${database.toLowerCase()}`;
}

export function assertSafeRestoreTarget({
  restoreUrl,
  runtimeUrl,
  directUrl,
}: RestoreTargetInput): void {
  const restore = parseDatabaseUrl(restoreUrl, "BACKUP_RESTORE_CORE_DATABASE_URL");
  const restoreIdentity = databaseIdentity(restore);

  for (const applicationUrl of [runtimeUrl, directUrl]) {
    if (!applicationUrl) continue;
    const applicationIdentity = databaseIdentity(
      parseDatabaseUrl(applicationUrl, "URL da aplicação"),
    );
    if (restoreIdentity === applicationIdentity) {
      throw new Error("A base de restauro tem de ser isolada da aplicação.");
    }
  }

  const databaseName = decodeURIComponent(restore.pathname.replace(/^\//, ""));
  if (!/(restore|verify|test)/i.test(databaseName)) {
    throw new Error(
      "O nome da base isolada deve conter restore, verify ou test.",
    );
  }
}

export function assertSafeRestoreFile(filePath: string, size: number): void {
  if (size <= 0) throw new Error("O dump está vazio.");
  if (!path.isAbsolute(filePath)) {
    throw new Error("Indica um caminho absoluto para o dump.");
  }
  if (!/\.(sql|dump|backup)$/i.test(filePath)) {
    throw new Error("O dump deve usar a extensão .sql, .dump ou .backup.");
  }
}

export function redactDatabaseUrl(value: string): string {
  const parsed = parseDatabaseUrl(value, "URL da base");
  parsed.username = "";
  parsed.password = "";
  return parsed.toString().replace(/\/$/, "");
}
