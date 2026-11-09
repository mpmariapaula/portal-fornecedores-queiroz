import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT ?? 5432),
  database: process.env.PGDATABASE,
  user: process.env.PORTAL_ADMIN_USER,
  password: process.env.PORTAL_ADMIN_PASSWORD,
});

async function main() {
  const codigo = 4827;
  const senha = process.env.PORTAL_TEST_PASSWORD;

  if (!senha) {
    throw new Error(
      "Configure PORTAL_TEST_PASSWORD no arquivo .env.local."
    );
  }

  if (senha.length < 8) {
    throw new Error("A senha de teste precisa ter pelo menos 8 caracteres.");
  }

  const fornecedor = await pool.query(
    `SELECT seqpessoa
     FROM fornecedores
     WHERE seqpessoa = $1
       AND ativo = TRUE`,
    [codigo]
  );

  if (fornecedor.rowCount !== 1) {
    throw new Error("Fornecedor de teste não encontrado ou inativo.");
  }

  const senhaHash = await bcrypt.hash(senha, 12);

  await pool.query(
    `INSERT INTO usuarios_portal (seqpessoa, senha_hash, ativo)
     VALUES ($1, $2, TRUE)
     ON CONFLICT (seqpessoa)
     DO UPDATE SET
       senha_hash = EXCLUDED.senha_hash,
       ativo = TRUE`,
    [codigo, senhaHash]
  );

  console.log("Usuário de teste cadastrado com sucesso.");
  console.log("Código do fornecedor:", codigo);
}

main()
  .catch((error) => {
    console.error("Falha ao cadastrar usuário:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
