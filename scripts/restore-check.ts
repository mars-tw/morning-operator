import assert from "node:assert/strict";
import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getDb } from "../src/lib/db";
import { getCounts } from "../src/lib/repository";

async function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "autopilot-restore-"));
  const backupPath = path.join(tempDir, "restore.db");
  await getDb().backup(backupPath);
  const restored = new Database(backupPath, { readonly: true });
  const integrity = restored.pragma("integrity_check") as Array<{ integrity_check: string }>;
  assert.equal(integrity[0]?.integrity_check, "ok");
  const tables = restored.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='projects'").all();
  assert.equal(tables.length, 1);
  const restoredProjects = (restored.prepare("SELECT COUNT(*) AS count FROM projects").get() as { count: number }).count;
  restored.close();
  process.stdout.write(`${JSON.stringify({ ok: true, restoredProjects, sourceCounts: getCounts() })}\n`);
  fs.rmSync(tempDir, { recursive: true, force: true });
}

main().catch((error) => { process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`); process.exitCode = 1; });
