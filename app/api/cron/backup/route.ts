import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/core/lib/cron/auth";
import { createSqlFallbackDump } from "@/core/lib/backup/sql-dump";
import { getBackupDatabaseUrl } from "@/core/lib/db/config";
import { createAdminClient } from "@/core/lib/supabase/admin";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

export async function GET(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const databaseUrl = getBackupDatabaseUrl();

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `abiptom-backup-${timestamp}.sql`;
  const tmpPath = path.join("/tmp", filename);
  let dumpEngine: "pg_dump" | "sql-fallback" = "pg_dump";

  let dumpSql: string;
  try {
    const { stdout } = await execFileAsync(
      "pg_dump",
      ["--no-owner", "--no-privileges", databaseUrl],
      {
        maxBuffer: 1024 * 1024 * 256,
      }
    );
    dumpSql = stdout;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    const errorCode =
      typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : "";

    if (errorCode !== "ENOENT") {
      return NextResponse.json(
        {
          error:
            "Falha ao executar pg_dump. Verifica se a runtime tem o binário disponível.",
          detail: message,
        },
        { status: 500 }
      );
    }

    dumpSql = await createSqlFallbackDump(databaseUrl);
    dumpEngine = "sql-fallback";
  }

  await fs.writeFile(tmpPath, dumpSql, "utf8");

  const buffer = await fs.readFile(tmpPath);
  const backupBucket = process.env.BACKUP_SUPABASE_BUCKET;

  if (!backupBucket) {
    return NextResponse.json({
      ok: true,
      warning:
        "Backup criado em memória local, mas BACKUP_SUPABASE_BUCKET não está configurado para upload remoto.",
      filename,
      bytes: buffer.byteLength,
      engine: dumpEngine,
    });
  }

  const supabase = createAdminClient();
  const storagePath = `db-backups/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(backupBucket)
    .upload(storagePath, buffer, {
      contentType: "application/sql",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      {
        error: "Backup gerado mas falhou upload para Supabase Storage.",
        detail: uploadError.message,
        filename,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    filename,
    bytes: buffer.byteLength,
    bucket: backupBucket,
    engine: dumpEngine,
    path: storagePath,
  });
}
