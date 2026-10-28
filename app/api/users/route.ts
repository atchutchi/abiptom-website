import { NextResponse } from "next/server";
import { dbAdmin } from "@/core/lib/db";
import { authorizeOperation } from "@/core/lib/auth/authorization";

export async function GET() {
  const authorization = await authorizeOperation("usersWrite");
  if (!authorization.success) {
    const status = authorization.error === "Não autenticado" ? 401 : 403;
    return NextResponse.json({ error: authorization.error }, { status });
  }

  const allUsers = await dbAdmin.query.users.findMany({
    orderBy: (u, { asc }) => [asc(u.nomeCompleto)],
    columns: {
      id: true,
      nomeCompleto: true,
      nomeCurto: true,
      email: true,
      role: true,
      cargo: true,
      activo: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ data: allUsers });
}
