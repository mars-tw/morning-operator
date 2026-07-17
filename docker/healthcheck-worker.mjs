import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

try {
  const workerIsRunning = fs.readdirSync("/proc").some((entry) => {
    if (!/^\d+$/.test(entry)) return false;
    try {
      return fs.readFileSync(`/proc/${entry}/cmdline`, "utf8").includes("scripts/worker.ts");
    } catch {
      return false;
    }
  });
  if (!workerIsRunning) throw new Error("worker process is not running");

  const databasePath = path.resolve(process.env.AUTOPILOT_DB_PATH || "/app/var/data/autopilot.db");
  const database = new Database(databasePath, { readonly: true, fileMustExist: true });
  database.prepare("SELECT 1").get();
  database.close();
  process.exit(0);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
