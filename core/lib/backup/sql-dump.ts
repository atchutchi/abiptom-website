import { Client } from "pg";

type ColumnInfo = {
  name: string;
  dataType: string;
  udtName: string;
};

const NUMERIC_TYPES = new Set([
  "int2",
  "int4",
  "int8",
  "float4",
  "float8",
  "numeric",
]);

function escapeIdentifier(value: string) {
  return `"${value.replace(/"/g, "\"\"")}"`;
}

function escapeLiteral(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}

function serializeValue(value: unknown, column: ColumnInfo) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "NULL";
  }

  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  if (value instanceof Date) {
    return escapeLiteral(value.toISOString());
  }

  if (Buffer.isBuffer(value)) {
    return `decode(${escapeLiteral(value.toString("hex"))}, 'hex')`;
  }

  if (typeof value === "object") {
    const jsonValue = JSON.stringify(value);
    const cast = column.dataType === "json" ? "json" : "jsonb";
    return `${escapeLiteral(jsonValue)}::${cast}`;
  }

  if (
    NUMERIC_TYPES.has(column.udtName) &&
    /^-?\d+(\.\d+)?$/.test(String(value))
  ) {
    return String(value);
  }

  return escapeLiteral(String(value));
}

async function getPublicTables(client: Client) {
  const { rows } = await client.query<{ table_name: string }>(
    `
      select table_name
      from information_schema.tables
      where table_schema = 'public'
        and table_type = 'BASE TABLE'
      order by table_name
    `
  );

  return rows.map((row) => row.table_name);
}

async function getDependencyMap(client: Client) {
  const { rows } = await client.query<{
    table_name: string;
    referenced_table_name: string;
  }>(
    `
      select
        tc.table_name,
        ccu.table_name as referenced_table_name
      from information_schema.table_constraints tc
      join information_schema.constraint_column_usage ccu
        on tc.constraint_name = ccu.constraint_name
       and tc.constraint_schema = ccu.constraint_schema
      where tc.constraint_type = 'FOREIGN KEY'
        and tc.table_schema = 'public'
        and ccu.table_schema = 'public'
    `
  );

  const dependencies = new Map<string, Set<string>>();
  for (const row of rows) {
    if (!dependencies.has(row.table_name)) {
      dependencies.set(row.table_name, new Set<string>());
    }
    dependencies.get(row.table_name)?.add(row.referenced_table_name);
  }

  return dependencies;
}

function topologicallySortTables(
  tables: string[],
  dependencies: Map<string, Set<string>>
) {
  const remaining = new Map<string, Set<string>>();
  for (const table of tables) {
    remaining.set(table, new Set(dependencies.get(table) ?? []));
  }

  const sorted: string[] = [];

  while (remaining.size > 0) {
    const ready = [...remaining.entries()]
      .filter(([, deps]) => deps.size === 0)
      .map(([table]) => table)
      .sort();

    if (ready.length === 0) {
      sorted.push(...[...remaining.keys()].sort());
      break;
    }

    for (const table of ready) {
      sorted.push(table);
      remaining.delete(table);
      for (const deps of remaining.values()) {
        deps.delete(table);
      }
    }
  }

  return sorted;
}

async function getColumns(client: Client, tableName: string) {
  const { rows } = await client.query<{
    column_name: string;
    data_type: string;
    udt_name: string;
  }>(
    `
      select column_name, data_type, udt_name
      from information_schema.columns
      where table_schema = 'public'
        and table_name = $1
      order by ordinal_position
    `,
    [tableName]
  );

  return rows.map((row) => ({
    name: row.column_name,
    dataType: row.data_type,
    udtName: row.udt_name,
  }));
}

async function getSequenceStatements(client: Client) {
  const { rows } = await client.query<{
    sequencename: string;
    last_value: string | null;
    schemaname: string;
  }>(
    `
      select schemaname, sequencename, last_value::text
      from pg_sequences
      where schemaname = 'public'
    `
  );

  return rows
    .filter((row) => row.last_value !== null)
    .map(
      (row) =>
        `select setval('${row.schemaname}.${row.sequencename}', ${row.last_value}, true);`
    );
}

export async function createSqlFallbackDump(databaseUrl: string) {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const tables = await getPublicTables(client);
    const dependencyMap = await getDependencyMap(client);
    const orderedTables = topologicallySortTables(tables, dependencyMap);
    const lines: string[] = [
      "-- ABIPTOM Admin fallback SQL dump",
      `-- generated_at: ${new Date().toISOString()}`,
      "begin;",
    ];

    if (orderedTables.length > 0) {
      const truncateTables = orderedTables.map((table) => `public.${escapeIdentifier(table)}`);
      lines.push(
        `truncate table ${truncateTables.join(", ")} restart identity cascade;`
      );
    }

    for (const tableName of orderedTables) {
      const columns = await getColumns(client, tableName);
      const columnNames = columns.map((column) => escapeIdentifier(column.name));
      const { rows } = await client.query<Record<string, unknown>>(
        `select * from public.${escapeIdentifier(tableName)}`
      );

      if (rows.length === 0) {
        continue;
      }

      const values = rows.map((row) => {
        const serialized = columns.map((column) =>
          serializeValue(row[column.name], column)
        );
        return `(${serialized.join(", ")})`;
      });

      lines.push(
        `insert into public.${escapeIdentifier(tableName)} (${columnNames.join(", ")}) values`,
        `  ${values.join(",\n  ")};`
      );
    }

    const sequenceStatements = await getSequenceStatements(client);
    lines.push(...sequenceStatements, "commit;");

    return `${lines.join("\n")}\n`;
  } finally {
    await client.end();
  }
}
