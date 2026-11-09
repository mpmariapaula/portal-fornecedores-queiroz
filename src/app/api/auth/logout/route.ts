import { NextResponse } from "next/server";
import { NOME_COOKIE_SESSAO } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const resposta = NextResponse.json({ ok: true });

  resposta.cookies.set(NOME_COOKIE_SESSAO, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return resposta;
}
