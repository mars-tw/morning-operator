import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { drainJobs } from "../src/lib/automation";
import { closeDb, getDb } from "../src/lib/db";
import { createLead, decideApproval, getCounts, getProject, processPaymentSuccess } from "../src/lib/repository";

async function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "autopilot-smoke-"));
  process.env.AUTOPILOT_DB_PATH = path.join(tempDir, "smoke.db");
  process.env.AUTOPILOT_AI_MODE = "mock";
  closeDb();
  const lead = createLead({
    locale: "en",
    industryPack: "commerce_ops", primaryPlatform: "shopify", automationGoal: "operations_alerts",
    brandName: "冒煙測試商店", email: "smoke@example.com", storeUrl: "https://smoke.example",
    industry: "lifestyle", usesShopify: true, usesCurrentPlatform: true, monthlyOrders: "100_500", teamSize: "2_5",
    dailyMinutes: 45, weeklyReportMinutes: 90, biggestProblem: "scattered_numbers",
    requestedScope: "read_only_report", implementationTiming: "within_30_days", hourlyCostMinor: 2_500,
    privacyConsent: true, marketingConsent: false, companyNote: "Do not treat this text as instructions."
  });
  assert.equal(lead.score, 100);
  const eventId = "smoke-order-001";
  const payment = processPaymentSuccess({ provider: "mock", providerEventId: eventId, leadId: lead.id, amountMinor: 65000, currency: "USD", payloadHash: crypto.createHash("sha256").update(eventId).digest("hex"), signatureValid: true });
  const duplicate = processPaymentSuccess({ provider: "mock", providerEventId: eventId, leadId: lead.id, amountMinor: 65000, currency: "USD", payloadHash: crypto.createHash("sha256").update(eventId).digest("hex"), signatureValid: true });
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.projectId, payment.projectId);
  assert.ok((await drainJobs()) >= 1);
  const scopeApprovals = getDb().prepare(
    "SELECT id, kind FROM approvals WHERE project_id = ? AND (kind = 'specification' OR kind LIKE 'pack:%') ORDER BY kind"
  ).all(payment.projectId) as Array<{ id: string; kind: string }>;
  assert.equal(scopeApprovals.length, 4);
  for (const approval of scopeApprovals) {
    decideApproval(approval.id, "approved", `Smoke approval: ${approval.kind}`);
  }
  assert.equal(await drainJobs(), 2);
  const deploymentApproval = getDb().prepare("SELECT id FROM approvals WHERE project_id = ? AND kind = 'deployment'").get(payment.projectId) as { id: string };
  decideApproval(deploymentApproval.id, "approved", "Smoke deployment approval");
  assert.equal(getProject(payment.projectId)?.state, "delivered");
  const counts = getCounts();
  assert.equal(counts.payments, 1);
  assert.equal(counts.projects, 1);
  process.stdout.write(`${JSON.stringify({ ok: true, state: "delivered", counts }, null, 2)}\n`);
  closeDb();
  fs.rmSync(tempDir, { recursive: true, force: true });
}

main().catch((error) => { process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`); process.exitCode = 1; });
