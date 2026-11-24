import nextEnv from "@next/env";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const vitestCli = fileURLToPath(
  new URL("../node_modules/vitest/vitest.mjs", import.meta.url),
);
const result = spawnSync(
  process.execPath,
  [vitestCli, "run", "test/database.integration.test.ts"],
  { stdio: "inherit", env: process.env },
);

if (result.error) {
  console.error("Could not start the database integration tests.");
  process.exit(1);
}
process.exit(result.status ?? 1);
