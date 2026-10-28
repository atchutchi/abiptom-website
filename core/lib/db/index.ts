import { assertCoreDataAccess } from "@/core/lib/environment";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import type { User } from "@supabase/supabase-js";
import postgres from "postgres";
import * as schema from "./schema";
import { getRuntimeDatabaseUrl } from "./config";



// HMR em dev cria novos clientes a cada recompilação e esgota connection slots
// do Supabase. Cachear o cliente no globalThis evita fuga de ligações.
const globalForDb = globalThis as unknown as {
  pgClient?: ReturnType<typeof postgres>;
};

function createDb() {
  assertCoreDataAccess();
  const adminClient = globalForDb.pgClient ?? postgres(getRuntimeDatabaseUrl(), {
    prepare: false, ssl: "require", max: 5, idle_timeout: 20, connect_timeout: 10,
  });
  if (process.env.NODE_ENV !== "production") globalForDb.pgClient = adminClient;
  return drizzle(adminClient, { schema });
}
let initialized: ReturnType<typeof createDb> | undefined;
export const dbAdmin = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, property) {
    assertCoreDataAccess();
    const db = initialized ??= createDb();
    const value = Reflect.get(db, property);
    return typeof value === "function" ? value.bind(db) : value;
  },
});

type RlsUser = Pick<User, "id" | "email" | "app_metadata" | "user_metadata">;

function buildJwtClaims(user: RlsUser) {
  return JSON.stringify({
    aud: "authenticated",
    sub: user.id,
    email: user.email ?? null,
    role: "authenticated",
    app_metadata: user.app_metadata ?? {},
    user_metadata: user.user_metadata ?? {},
  });
}

export async function withAuthenticatedDb<T>(
  user: RlsUser,
  run: (db: typeof dbAdmin) => Promise<T>
): Promise<T> {
  return dbAdmin.transaction(async (tx) => {
    const claims = buildJwtClaims(user);

    await tx.execute(sql`select set_config('request.jwt.claims', ${claims}, true)`);
    await tx.execute(sql`select set_config('request.jwt.claim.sub', ${user.id}, true)`);
    await tx.execute(sql`select set_config('request.jwt.claim.role', 'authenticated', true)`);
    await tx.execute(sql`set local role authenticated`);

    return run(tx as unknown as typeof dbAdmin);
  });
}
