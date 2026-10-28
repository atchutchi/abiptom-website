import { NextResponse } from "next/server";
import { createClient } from "@/core/lib/supabase/server";
import { getPostLoginRedirectPath } from "@/core/lib/auth/redirects";
import { repairInternalUserFromAuth, syncAuthMetadataForDbUser } from "@/core/lib/users/auth-link";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 },
    );
  }

  const dbUser = await repairInternalUserFromAuth({
    authUserId: user.id,
    email: user.email,
  });

  if (!dbUser) {
    return NextResponse.json(
      { error: "Utilizador não encontrado na aplicação" },
      { status: 404 },
    );
  }

  try {
    await syncAuthMetadataForDbUser(dbUser);
  } catch (syncError) {
    console.error("Falha ao sincronizar metadata Auth no login", syncError);
  }

  const nextPath = new URL(request.url).searchParams.get("next");

  return NextResponse.json({
    role: dbUser.role,
    active: dbUser.activo,
    redirectTo: getPostLoginRedirectPath(dbUser.role, nextPath),
  });
}
