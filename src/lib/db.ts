import "server-only";
import { Pool } from "pg";

const globalForPostgres = globalThis as typeof globalThis & {
  postgresPool?: Pool;
};

function criarPool(): Pool {
  return new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT ?? 5432),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}

export const pool =
  globalForPostgres.postgresPool ?? criarPool();

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.postgresPool = pool;
}