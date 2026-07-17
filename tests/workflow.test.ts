import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { drainJobs } from "@/lib/automation";
import { closeDb, getDb } from "@/lib/db";
import { assertProjectTransition } from "@/lib/project-machine";
import { createLead, decideApproval, failJob, getDashboardData, getProject, leaseNextJob, processPaymentSuccess } from "@/lib/repository";

let tempDir = "";
beforeEach(() => { tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "autopilot-test-")); process.env.AUTOPILOT_DB_PATH = path.join(tempDir, "test.db"); process.env.AUTOPILOT_AI_MODE = "mock"; closeDb(); });
afterEach(() => { closeDb(); fs.rmSync(tempDir, { recursive: true, force: true }); });

function lead() { return createLead({ locale: "en", brandName: "整合測試商店", email: "test@example.com", storeUrl: "https://example.com", industry: "lifestyle", usesShopify: true, monthlyOrders: "100_500", teamSize: "2_5", dailyMinutes: 45, weeklyReportMinutes: 90, biggestProblem: "low_stock", requestedScope: "read_only_report", implementationTiming: "within_30_days", privacyConsent: true, marketingConsent: false, companyNote: "" }); }

describe("business workflow", () => {
  it("processes payment exactly once and gates build and deployment", async () => {
    const created = lead(); const eventId = "event-1234"; const payloadHash = crypto.createHash("sha256").update(eventId).digest("hex");
    const first = processPaymentSuccess({ provider: "mock", providerEventId: eventId, leadId: created.id, amountMinor: 65000, currency: "USD", payloadHash, signatureValid: true });
    expect(processPaymentSuccess({ provider: "mock", providerEventId: eventId, leadId: created.id, amountMinor: 65000, currency: "USD", payloadHash, signatureValid: true }).duplicate).toBe(true);
    await drainJobs();
    expect(getProject(first.projectId)?.state).toBe("spec_approval");
    const spec = getDb().prepare("SELECT id FROM approvals WHERE kind='specification'").get() as { id: string };
    decideApproval(spec.id, "approved", "test"); await drainJobs();
    expect(getProject(first.projectId)?.state).toBe("deploy_approval");
    const deploy = getDb().prepare("SELECT id FROM approvals WHERE kind='deployment'").get() as { id: string };
    decideApproval(deploy.id, "approved", "test");
    expect(getProject(first.projectId)?.state).toBe("delivered");
    expect((getDb().prepare("SELECT COUNT(*) AS count FROM payments").get() as { count: number }).count).toBe(1);
    expect(getDashboardData().revenueByCurrency).toEqual([{ currency: "USD", amount_minor: 65000 }]);
  });
  it("rejects invalid state transitions", () => expect(() => assertProjectTransition("paid", "delivered")).toThrow(/Invalid/));
  it("backs off and dead-letters after maximum attempts", () => {
    const created = lead(); const eventId = "event-retry"; const payloadHash = crypto.createHash("sha256").update(eventId).digest("hex");
    processPaymentSuccess({ provider: "mock", providerEventId: eventId, leadId: created.id, amountMinor: 65000, currency: "USD", payloadHash, signatureValid: true });
    const job = leaseNextJob(); expect(job).toBeTruthy();
    expect(failJob(job!.id, new Error("temporary"))).toBe("retry");
  });
});
