import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

let database: Database.Database | undefined;
let activePath: string | undefined;

const schema = `
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  locale TEXT NOT NULL DEFAULT 'en',
  brand_name TEXT NOT NULL,
  email TEXT NOT NULL,
  store_url TEXT NOT NULL,
  industry TEXT NOT NULL,
  uses_shopify INTEGER NOT NULL,
  monthly_orders TEXT NOT NULL,
  team_size TEXT NOT NULL,
  daily_minutes INTEGER NOT NULL,
  weekly_report_minutes INTEGER NOT NULL,
  biggest_problem TEXT NOT NULL,
  requested_scope TEXT NOT NULL,
  implementation_timing TEXT NOT NULL,
  privacy_consent INTEGER NOT NULL,
  marketing_consent INTEGER NOT NULL,
  company_note TEXT NOT NULL,
  score INTEGER NOT NULL,
  estimated_monthly_hours REAL NOT NULL,
  status TEXT NOT NULL,
  do_not_contact INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  signature_valid INTEGER NOT NULL,
  status TEXT NOT NULL,
  received_at TEXT NOT NULL,
  processed_at TEXT,
  UNIQUE(provider, provider_event_id)
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(provider, provider_event_id)
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  payment_id TEXT NOT NULL UNIQUE REFERENCES payments(id),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  specification TEXT,
  build_artifact_path TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  summary TEXT NOT NULL,
  created_at TEXT NOT NULL,
  decided_at TEXT,
  decision_note TEXT,
  UNIQUE(project_id, kind)
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id),
  type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  run_after TEXT NOT NULL,
  lease_until TEXT,
  last_error TEXT,
  artifact_path TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS jobs_ready_idx ON jobs(status, run_after, lease_until);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id),
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  sent_at TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  detail_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`;

function resolveDbPath(): string {
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.AUTOPILOT_DB_PATH || "var/data/autopilot.db");
}

export function getDb(): Database.Database {
  const dbPath = resolveDbPath();
  if (database && activePath === dbPath) return database;
  if (database) database.close();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  database = new Database(dbPath);
  activePath = dbPath;
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.pragma("busy_timeout = 5000");
  database.exec(schema);
  const leadColumns = database.pragma("table_info(leads)") as Array<{ name: string }>;
  if (!leadColumns.some((column) => column.name === "locale")) {
    database.exec("ALTER TABLE leads ADD COLUMN locale TEXT NOT NULL DEFAULT 'en'");
  }
  const paymentColumns = database.pragma("table_info(payments)") as Array<{ name: string }>;
  if (!paymentColumns.some((column) => column.name === "amount_minor")) {
    database.exec("ALTER TABLE payments ADD COLUMN amount_minor INTEGER NOT NULL DEFAULT 0");
    if (paymentColumns.some((column) => column.name === "amount_twd")) {
      database.exec("UPDATE payments SET amount_minor = amount_twd WHERE amount_minor = 0");
    }
  }
  return database;
}

export function closeDb(): void {
  database?.close();
  database = undefined;
  activePath = undefined;
}

export function getDbPath(): string {
  return resolveDbPath();
}
