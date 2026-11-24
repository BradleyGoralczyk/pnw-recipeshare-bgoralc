import "server-only";

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type NeonClient = NeonQueryFunction<false, false>;

let client: NeonClient | undefined;

export function getDb(): NeonClient {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error(
      "Database configuration is missing. Set DATABASE_URL in the server environment.",
    );
  }

  if (!client) client = neon(connectionString);
  return client;
}
