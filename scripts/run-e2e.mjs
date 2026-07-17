import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const playwrightCli = require.resolve("@playwright/test/cli");
const databasePath = process.env.PLAYWRIGHT_DB_PATH
  || path.join(process.cwd(), "var", "data", `playwright-${process.pid}.db`);
const child = spawn(process.execPath, [playwrightCli, "test", ...process.argv.slice(2)], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    PLAYWRIGHT_RUN_DB_PATH: databasePath,
    AUTOPILOT_DB_PATH: databasePath,
    AUTOPILOT_AI_MODE: "mock",
    AUTOPILOT_E2E_MODE: "true"
  },
  stdio: "inherit"
});

child.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Playwright exited from signal ${signal}`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
