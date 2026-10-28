function parseHostname(connectionString: string) {
  try {
    return new URL(connectionString).hostname;
  } catch {
    return "";
  }
}

function parsePort(connectionString: string) {
  try {
    const port = new URL(connectionString).port;
    return port ? Number(port) : undefined;
  } catch {
    return undefined;
  }
}

function isSupabaseDirectIpv6Connection(connectionString: string) {
  const hostname = parseHostname(connectionString);
  const port = parsePort(connectionString);

  return (
    hostname.startsWith("db.") &&
    hostname.endsWith(".supabase.co") &&
    (port === undefined || port === 5432)
  );
}

function isVercelRuntime() {
  return process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
}

function missingRuntimeUrlMessage() {
  return [
    "CORE_DATABASE_URL não configurado.",
    "Define uma connection string de runtime para Postgres.",
    "Em Vercel com Supabase usa a string Supavisor transaction mode (*.pooler.supabase.com:6543).",
  ].join(" ");
}

export function getRuntimeDatabaseUrl() {
  const connectionString =
    process.env.CORE_DATABASE_URL || process.env.CORE_DATABASE_DIRECT_URL;

  if (!connectionString) {
    throw new Error(missingRuntimeUrlMessage());
  }

  if (isVercelRuntime() && isSupabaseDirectIpv6Connection(connectionString)) {
    throw new Error(
      [
        "Configuração inválida da base de dados em Vercel.",
        "A CORE_DATABASE_URL actual usa a ligação directa da Supabase (db.<project-ref>.supabase.co:5432), que depende de IPv6.",
        "A Vercel é listada pela própria Supabase como plataforma IPv4-only.",
        "No dashboard da Supabase abre Connect e copia a string Supavisor transaction mode (*.pooler.supabase.com:6543) para CORE_DATABASE_URL no Vercel.",
      ].join(" ")
    );
  }

  return connectionString;
}

export function getMigrationDatabaseUrl() {
  return (
    process.env.CORE_DATABASE_DIRECT_URL ||
    process.env.CORE_DATABASE_URL ||
    (() => {
      throw new Error(missingRuntimeUrlMessage());
    })()
  );
}

export function getBackupDatabaseUrl() {
  return (
    process.env.CORE_DATABASE_DIRECT_URL ||
    process.env.CORE_DATABASE_URL ||
    (() => {
      throw new Error(missingRuntimeUrlMessage());
    })()
  );
}
