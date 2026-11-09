
import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const NOME_COOKIE_SESSAO = "portal_session";

const DURACAO_SESSAO_SEGUNDOS = 8 * 60 * 60;

type DadosSessao = {
  seqpessoa: number;
  exp: number;
};

function obterSegredo(): string {
  const segredo = process.env.SESSION_SECRET;

  if (!segredo || segredo.length < 32) {
    throw new Error(
      "SESSION_SECRET precisa ter pelo menos 32 caracteres."
    );
  }

  return segredo;
}

function assinar(conteudo: string): string {
  return createHmac("sha256", obterSegredo())
    .update(conteudo)
    .digest("base64url");
}

export function criarTokenSessao(seqpessoa: number): string {
  if (!Number.isInteger(seqpessoa) || seqpessoa <= 0) {
    throw new Error("Código de fornecedor inválido.");
  }

  const dados: DadosSessao = {
    seqpessoa,
    exp:
      Math.floor(Date.now() / 1000) +
      DURACAO_SESSAO_SEGUNDOS,
  };

  const conteudo = Buffer.from(
    JSON.stringify(dados)
  ).toString("base64url");

  return `${conteudo}.${assinar(conteudo)}`;
}

export function validarTokenSessao(
  token?: string
): DadosSessao | null {
  if (!token) return null;

  try {
    const partes = token.split(".");

    if (partes.length !== 2) return null;

    const [conteudo, assinaturaRecebida] = partes;
    const assinaturaEsperada = assinar(conteudo);

    const recebida = Buffer.from(
      assinaturaRecebida,
      "base64url"
    );

    const esperada = Buffer.from(
      assinaturaEsperada,
      "base64url"
    );

    if (
      recebida.length !== esperada.length ||
      !timingSafeEqual(recebida, esperada)
    ) {
      return null;
    }

    const dados = JSON.parse(
      Buffer.from(conteudo, "base64url").toString("utf8")
    ) as DadosSessao;

    if (
      !Number.isInteger(dados.seqpessoa) ||
      dados.seqpessoa <= 0 ||
      !Number.isInteger(dados.exp) ||
      dados.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return dados;
  } catch {
    return null;
  }
}

export async function obterSessaoFornecedor() {
  const armazenamentoCookies = await cookies();
  const token = armazenamentoCookies.get(
    NOME_COOKIE_SESSAO
  )?.value;

  return validarTokenSessao(token);
}
