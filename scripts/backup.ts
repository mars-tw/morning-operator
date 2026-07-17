import fs from "node:fs";
import path from "node:path";
import { getDb } from "../src/lib/db";

async function main() {
  const outputDir = path.resolve(process.cwd(), "var", "backups");
  fs.mkdirSync(outputDir, { recursive: true });
  const destination = path.join(outputDir, `autopilot-${new Date().toISOString().replace(/[:.]/g, "-")}.db`);
  await getDb().backup(destination);
  process.stdout.write(`${destination}\n`);
}

main().catch((error) => { process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`); process.exitCode = 1; });
