
import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import {
  criarTokenSessao,
  NOME_COOKIE_SESSAO,
} from "../../../../lib/auth";
import { pool } from "../../../../lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const corpo: unknown = await request.json();

    if (
      typeof corpo !== "object" ||
      corpo === null ||
      !("codigo" in corpo) ||
      !("senha" in corpo) ||
      typeof corpo.codigo !== "string" ||
      typeof corpo.senha !== "string"
    ) {
      return NextResponse.json(
        { mensagem: "Informe o código e a senha." },
        { status: 400 }
      );
    }

    const codigo = corpo.codigo.trim();
    const senha = corpo.senha;

    if (
      !/^\d+$/.test(codigo) ||
      codigo.length > 20 ||
      senha.length === 0 ||
      senha.length > 128
    ) {
      return NextResponse.json(
        { mensagem: "Código ou senha inválidos." },
        { status: 400 }
      );
    }

    const resultado = await pool.query(
      `SELECT
         f.seqpessoa,
         f.nomerazao,
         u.senha_hash
       FROM fornecedores f
       INNER JOIN usuarios_portal u
         ON u.seqpessoa = f.seqpessoa
       WHERE f.seqpessoa = $1
         AND f.ativo = TRUE
         AND u.ativo = TRUE
       LIMIT 1`,
      [Number(codigo)]
    );

    const usuario = resultado.rows[0];

    if (
      !usuario ||
      typeof usuario.senha_hash !== "string" ||
      !(await compare(senha, usuario.senha_hash))
    ) {
      return NextResponse.json(
        { mensagem: "Código ou senha inválidos." },
        { status: 401 }
      );
    }

    const token = criarTokenSessao(usuario.seqpessoa);

    const resposta = NextResponse.json({
      ok: true,
      fornecedor: {
        codigo: usuario.seqpessoa,
        nome: usuario.nomerazao,
      },
    });

    resposta.cookies.set(NOME_COOKIE_SESSAO, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60,
    });

    return resposta;
  } catch (error) {
    console.error("Erro na autenticação do fornecedor:", error);

    return NextResponse.json(
      { mensagem: "Não foi possível realizar o login." },
      { status: 500 }
    );
  }
}
