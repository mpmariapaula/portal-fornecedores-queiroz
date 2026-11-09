
import { NextResponse } from "next/server";
import { obterSessaoFornecedor } from "../../../../lib/auth";
import { pool } from "../../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const sessao = await obterSessaoFornecedor();

    if (!sessao) {
      return NextResponse.json(
        { mensagem: "Autenticação necessária." },
        { status: 401 }
      );
    }

    const resultado = await pool.query(
      `SELECT
         t.seqtitulo AS numero,
         e.descricao AS especie,
         t.dtaemissao AS data_emissao,
         t.dtavencimento AS data_vencimento,
         t.vlrnominal AS valor_nominal,
         t.vlrpago AS valor_pago,
         (t.vlrnominal - t.vlrpago) AS saldo_aberto
       FROM titulos t
       INNER JOIN especies e
         ON e.codespecie = t.codespecie
       INNER JOIN fornecedores f
         ON f.seqpessoa = t.seqpessoa
       INNER JOIN usuarios_portal u
         ON u.seqpessoa = f.seqpessoa
       WHERE t.seqpessoa = $1
         AND e.obrigdireito = 'D'
         AND f.ativo = TRUE
         AND u.ativo = TRUE
       ORDER BY t.dtavencimento ASC, t.seqtitulo ASC`,
      [sessao.seqpessoa]
    );

    const titulos = resultado.rows.map((titulo) => ({
      ...titulo,
      valor_nominal: Number(titulo.valor_nominal),
      valor_pago: Number(titulo.valor_pago),
      saldo_aberto: Number(titulo.saldo_aberto),
    }));

    const totalAberto = titulos.reduce(
      (total, titulo) => total + titulo.saldo_aberto,
      0
    );

    return NextResponse.json({
      fornecedor: sessao.seqpessoa,
      quantidade: titulos.length,
      total_aberto: Number(totalAberto.toFixed(2)),
      titulos,
    });
  } catch (error) {
    console.error("Erro ao consultar títulos financeiros:", error);

    return NextResponse.json(
      { mensagem: "Não foi possível consultar os títulos." },
      { status: 500 }
    );
  }
}
