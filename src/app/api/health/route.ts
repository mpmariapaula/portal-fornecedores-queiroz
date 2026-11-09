
import { NextResponse } from "next/server";
import { pool } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await pool.query("SELECT 1");

    return NextResponse.json({
      ok: true,
      mensagem: "Serviço disponível.",
    });
  } catch (error) {
    console.error("Erro ao verificar a disponibilidade do banco de dados.");

    return NextResponse.json(
      {
        ok: false,
        mensagem: "Serviço temporariamente indisponível.",
      },
      { status: 503 }
    );
  }
}
