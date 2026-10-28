import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const redirectUrl = new URL("/api/reports/pl", req.url);

  redirectUrl.searchParams.set("periodo", "mensal");

  const ano = searchParams.get("ano");
  const mes = searchParams.get("mes");

  if (ano) {
    redirectUrl.searchParams.set("ano", ano);
  }

  if (mes) {
    redirectUrl.searchParams.set("mes", mes);
  }

  return NextResponse.redirect(redirectUrl);
}
