import { defineConfig } from "@playwright/test";
import path from "node:path";

const playwrightDbPath = process.env.PLAYWRIGHT_RUN_DB_PATH
  || process.env.PLAYWRIGHT_DB_PATH
  || path.join(process.cwd(), "test-results", "playwright-direct.db");
process.env.PLAYWRIGHT_RUN_DB_PATH = playwrightDbPath;
process.env.AUTOPILOT_DB_PATH = playwrightDbPath;
process.env.AUTOPILOT_AI_MODE = "mock";
process.env.AUTOPILOT_E2E_MODE = "true";
process.env.ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD || "playwright-owner-password";
process.env.ADMIN_SESSION_SECRET = process.env.PLAYWRIGHT_SESSION_SECRET || "playwright-session-secret-32-characters-minimum";
process.env.AUTOPILOT_BASE_URL = "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120_000,
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "pnpm exec next start --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/api/health",
    env: {
      AUTOPILOT_DB_PATH: playwrightDbPath,
      AUTOPILOT_AI_MODE: "mock",
      AUTOPILOT_E2E_MODE: "true",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
      AUTOPILOT_BASE_URL: process.env.AUTOPILOT_BASE_URL
    },
    reuseExistingServer: false,
    timeout: 120_000
  }
});
