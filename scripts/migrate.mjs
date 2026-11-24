import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
if (!connectionString) {
  if (process.env.VERCEL === "1") {
    throw new Error("Set DATABASE_URL before running database migrations on Vercel.");
  }
  console.log("Skipping database migrations because DATABASE_URL is not configured locally.");
  process.exit(0);
}

const sql = neon(connectionString);
await sql`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

const migrationsDirectory = join(process.cwd(), "db", "migrations");
const migrationFiles = readdirSync(migrationsDirectory)
  .filter((file) => file.endsWith(".sql"))
  .sort();

for (const name of migrationFiles) {
  const existing = await sql`SELECT name FROM schema_migrations WHERE name = ${name}`;
  if (existing.length > 0) continue;

  const source = readFileSync(join(migrationsDirectory, name), "utf8");
  const statements = source
    .split(/--\s*statement-breakpoint\s*/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  await sql.transaction((transaction) =>
    statements.map((statement) => transaction.query(statement)),
  );
  await sql`
    INSERT INTO schema_migrations (name)
    VALUES (${name})
    ON CONFLICT (name) DO NOTHING
  `;
  console.log(`Applied ${name}`);
}

console.log("Database schema is up to date.");
