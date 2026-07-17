import crypto from "node:crypto";
import type Database from "better-sqlite3";
import { createTranslator, resolveLocale } from "@/i18n";
import { getDb } from "./db";
import {
  estimateAutomationOutcome,
  estimateMonthlyHours,
  intakeSchema,
  type IntakeDraft,
  type IntakeInput,
  type JobType,
  type PaymentSuccessInput,
  type ProjectState,
  sanitizeCustomerText,
  scoreLead
} from "./contracts";
import {
  automationGoals,
  getIndustryPack,
  isIndustryPackId,
  supportsAutomationGoal,
  type AutomationGoal,
  type IndustryPackId
} from "./industry-packs";
import { assertProjectTransition } from "./project-machine";
import { getPublicOffer } from "./public-config";

const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();

export type LeadRow = {
  id: string;
  locale: string;
  industry_pack: IndustryPackId;
  industry_pack_version: number;
  primary_platform: string;
  automation_goal: string;
  brand_name: string;
  email: string;
  store_url: string;
  industry: string;
  uses_shopify: number;
  uses_current_platform: number;
  monthly_orders: string;
  team_size: string;
  daily_minutes: number;
  weekly_report_minutes: number;
  biggest_problem: string;
  requested_scope: string;
  implementation_timing: string;
  hourly_cost_minor: number;
  company_note: string;
  score: number;
  estimated_monthly_hours: number;
  risk_tier: string;
  recoverable_hours_low: number;
  recoverable_hours_high: number;
  monthly_value_low: number;
  monthly_value_high: number;
  status: string;
  created_at: string;
};

export type ProjectRow = {
  id: string;
  lead_id: string;
  payment_id: string;
  name: string;
  state: ProjectState;
  specification: string | null;
  build_artifact_path: string | null;
  created_at: string;
  updated_at: string;
};

export type JobRow = {
  id: string;
  project_id: string | null;
  type: JobType;
  payload_json: string;
  status: string;
  attempts: number;
  max_attempts: number;
  run_after: string;
  lease_until: string | null;
  last_error: string | null;
  artifact_path: string | null;
  created_at: string;
  updated_at: string;
};

function audit(
  db: Database.Database,
  actor: string,
  action: string,
  entityType: string,
  entityId: string,
  detail: Record<string, unknown> = {}
): void {
  db.prepare(
    "INSERT INTO audit_log (id, actor, action, entity_type, entity_id, detail_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(id(), actor, action, entityType, entityId, JSON.stringify(detail), now());
}

function enqueueInTransaction(
  db: Database.Database,
  type: JobType,
  projectId: string | null,
  payload: Record<string, unknown>,
  maxAttempts = 3
): string {
  const jobId = id();
  const timestamp = now();
  db.prepare(
    `INSERT INTO jobs
      (id, project_id, type, payload_json, status, attempts, max_attempts, run_after, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'pending', 0, ?, ?, ?, ?)`
  ).run(jobId, projectId, type, JSON.stringify(payload), maxAttempts, timestamp, timestamp, timestamp);
  return jobId;
}

export function enqueueJob(
  type: JobType,
  projectId: string | null,
  payload: Record<string, unknown> = {},
  maxAttempts = 3
): string {
  return enqueueInTransaction(getDb(), type, projectId, payload, maxAttempts);
}

export function createLead(rawInput: IntakeDraft): LeadRow {
  const input: IntakeInput = intakeSchema.parse(rawInput);
  const db = getDb();
  const leadId = id();
  const timestamp = now();
  const score = scoreLead(input);
  const offer = getPublicOffer(input.locale);
  const estimate = estimateAutomationOutcome(input, offer.setupMinor, offer.monthlyMinor);
  const t = createTranslator(input.locale);
  const status = estimate.riskTier === "restricted" ? "restricted" : estimate.qualified ? "qualified" : score >= 40 ? "nurture" : "not_fit";
  db.transaction(() => {
    db.prepare(
      `INSERT INTO leads (
        id, locale, industry_pack, industry_pack_version, primary_platform, automation_goal, brand_name, email, store_url,
        industry, uses_shopify, uses_current_platform, monthly_orders, team_size, daily_minutes,
        weekly_report_minutes, biggest_problem, requested_scope, implementation_timing, hourly_cost_minor,
        privacy_consent, marketing_consent, company_note, score, estimated_monthly_hours, risk_tier,
        recoverable_hours_low, recoverable_hours_high, monthly_value_low, monthly_value_high, status, created_at
      ) VALUES (
        @id, @locale, @industryPack, @industryPackVersion, @primaryPlatform, @automationGoal, @brandName, @email, @storeUrl,
        @industry, @usesShopify, @usesCurrentPlatform, @monthlyOrders, @teamSize, @dailyMinutes,
        @weeklyReportMinutes, @biggestProblem, @requestedScope, @implementationTiming, @hourlyCostMinor,
        @privacyConsent, @marketingConsent, @companyNote, @score, @estimatedMonthlyHours, @riskTier,
        @recoverableHoursLow, @recoverableHoursHigh, @monthlyValueLow, @monthlyValueHigh, @status, @createdAt
      )`
    ).run({
      id: leadId,
      locale: input.locale,
      industryPack: input.industryPack,
      industryPackVersion: getIndustryPack(input.industryPack).version,
      primaryPlatform: input.primaryPlatform,
      automationGoal: input.automationGoal,
      brandName: input.brandName,
      email: input.email.toLowerCase(),
      storeUrl: input.storeUrl,
      industry: input.industry,
      usesShopify: input.usesShopify ? 1 : 0,
      usesCurrentPlatform: input.usesCurrentPlatform ? 1 : 0,
      monthlyOrders: input.monthlyOrders,
      teamSize: input.teamSize,
      dailyMinutes: input.dailyMinutes,
      weeklyReportMinutes: input.weeklyReportMinutes,
      biggestProblem: input.biggestProblem,
      requestedScope: input.requestedScope,
      implementationTiming: input.implementationTiming,
      hourlyCostMinor: input.hourlyCostMinor,
      privacyConsent: 1,
      marketingConsent: input.marketingConsent ? 1 : 0,
      companyNote: sanitizeCustomerText(input.companyNote),
      score,
      estimatedMonthlyHours: estimate.currentMonthlyHours,
      riskTier: estimate.riskTier,
      recoverableHoursLow: estimate.recoverableHours.low,
      recoverableHoursHigh: estimate.recoverableHours.high,
      monthlyValueLow: estimate.monthlyValueMinor.low,
      monthlyValueHigh: estimate.monthlyValueMinor.high,
      status,
      createdAt: timestamp
    });
    db.prepare(
      `INSERT INTO notifications
        (id, project_id, channel, recipient, subject, body, status, created_at)
       VALUES (?, NULL, 'email', ?, ?, ?, 'queued', ?)`
    ).run(
      id(),
      input.email.toLowerCase(),
      t("notification.auditSubject"),
      t("notification.auditBody", { hours: estimateMonthlyHours(input), score }),
      timestamp
    );
    enqueueInTransaction(db, "send_notifications", null, { reason: "lead-audit" });
    audit(db, "public", "lead.created", "lead", leadId, {
      score,
      status,
      locale: input.locale,
      industryPack: input.industryPack,
      automationGoal: input.automationGoal,
      riskTier: estimate.riskTier,
      recoverableHours: estimate.recoverableHours
    });
  })();
  return db.prepare("SELECT * FROM leads WHERE id = ?").get(leadId) as LeadRow;
}

export function getLead(leadId: string): LeadRow | undefined {
  return getDb().prepare("SELECT * FROM leads WHERE id = ?").get(leadId) as LeadRow | undefined;
}

function automationEligibility(lead: LeadRow): { eligible: boolean; reason: string } {
  if (lead.risk_tier === "restricted" || lead.industry === "regulated" || ["write_back", "autonomous_external_action"].includes(lead.requested_scope)) {
    return { eligible: false, reason: "restricted-risk" };
  }
  if (!isIndustryPackId(lead.industry_pack)) return { eligible: false, reason: "unknown-pack" };
  const pack = getIndustryPack(lead.industry_pack);
  if (lead.industry_pack_version !== pack.version) return { eligible: false, reason: "pack-version-mismatch" };
  if (!automationGoals.includes(lead.automation_goal as AutomationGoal)) return { eligible: false, reason: "unknown-goal" };
  if (!supportsAutomationGoal(lead.industry_pack, lead.automation_goal as AutomationGoal)) {
    return { eligible: false, reason: "unsupported-goal" };
  }
  return { eligible: true, reason: "eligible" };
}

function assertProjectEligibleForAutomation(db: Database.Database, projectId: string): LeadRow {
  const lead = db.prepare(
    "SELECT l.* FROM leads l JOIN projects p ON p.lead_id = l.id WHERE p.id = ?"
  ).get(projectId) as LeadRow | undefined;
  if (!lead) throw new Error("Project lead does not exist");
  const eligibility = automationEligibility(lead);
  if (!eligibility.eligible) throw new Error(`Project requires manual review: ${eligibility.reason}`);
  return lead;
}

export function recordInvalidWebhook(
  provider: string,
  providerEventId: string,
  payloadHash: string
): void {
  const db = getDb();
  db.prepare(
    `INSERT OR IGNORE INTO webhook_events
      (id, provider, provider_event_id, payload_hash, signature_valid, status, received_at)
     VALUES (?, ?, ?, ?, 0, 'rejected', ?)`
  ).run(id(), provider, providerEventId, payloadHash, now());
}

export function processPaymentSuccess(input: PaymentSuccessInput): {
  duplicate: boolean;
  projectId: string;
  paymentId: string;
} {
  const db = getDb();
  const existing = db.prepare(
    `SELECT p.id AS payment_id, pr.id AS project_id
       FROM payments p JOIN projects pr ON pr.payment_id = p.id
      WHERE p.provider = ? AND p.provider_event_id = ?`
  ).get(input.provider, input.providerEventId) as { payment_id: string; project_id: string } | undefined;
  if (existing) {
    return { duplicate: true, projectId: existing.project_id, paymentId: existing.payment_id };
  }
  if (!input.signatureValid) throw new Error("Payment signature is not valid");
  const lead = getLead(input.leadId);
  if (!lead) throw new Error("Lead does not exist");
  const eligibility = automationEligibility(lead);

  const paymentId = id();
  const projectId = id();
  const eventId = id();
  const timestamp = now();
  db.transaction(() => {
    const leadLocale = resolveLocale(lead.locale);
    const leadT = createTranslator(leadLocale);
    db.prepare(
      `INSERT INTO webhook_events
        (id, provider, provider_event_id, payload_hash, signature_valid, status, received_at, processed_at)
       VALUES (?, ?, ?, ?, 1, 'processed', ?, ?)`
    ).run(eventId, input.provider, input.providerEventId, input.payloadHash, timestamp, timestamp);
    const paymentColumns = db.pragma("table_info(payments)") as Array<{ name: string }>;
    if (paymentColumns.some((column) => column.name === "amount_twd")) {
      db.prepare(
        `INSERT INTO payments
          (id, provider, provider_event_id, lead_id, amount_minor, amount_twd, currency, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'succeeded', ?)`
      ).run(paymentId, input.provider, input.providerEventId, input.leadId, input.amountMinor, input.currency === "TWD" ? input.amountMinor : 0, input.currency, timestamp);
    } else {
      db.prepare(
        `INSERT INTO payments
          (id, provider, provider_event_id, lead_id, amount_minor, currency, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'succeeded', ?)`
      ).run(paymentId, input.provider, input.providerEventId, input.leadId, input.amountMinor, input.currency, timestamp);
    }
    db.prepare(
      `INSERT INTO projects
        (id, lead_id, payment_id, name, state, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'paid', ?, ?)`
    ).run(projectId, input.leadId, paymentId, `${lead.brand_name} | ${leadT("brand.name")}`, timestamp, timestamp);
    db.prepare("UPDATE leads SET status = ? WHERE id = ?").run(
      eligibility.eligible ? "customer" : "manual_review",
      input.leadId
    );
    if (eligibility.eligible) enqueueInTransaction(db, "draft_spec", projectId, { projectId });
    db.prepare(
      `INSERT INTO notifications
        (id, project_id, channel, recipient, subject, body, status, created_at)
       VALUES (?, ?, 'email', ?, ?, ?, 'queued', ?)`
    ).run(
      id(),
      projectId,
      lead.email,
      leadT("notification.paymentSubject"),
      eligibility.eligible ? leadT("notification.paymentBody") : leadT("notification.manualReviewBody"),
      timestamp
    );
    enqueueInTransaction(db, "send_notifications", projectId, { reason: "payment-onboarding" });
    audit(db, "payment-webhook", "payment.succeeded", "project", projectId, {
      provider: input.provider,
      amountMinor: input.amountMinor,
      currency: input.currency,
      automaticBuildEligible: eligibility.eligible,
      eligibilityReason: eligibility.reason
    });
  })();
  return { duplicate: false, projectId, paymentId };
}

export function transitionProject(projectId: string, to: ProjectState, actor: string): void {
  const db = getDb();
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(projectId) as ProjectRow | undefined;
  if (!project) throw new Error("Project does not exist");
  assertProjectTransition(project.state, to);
  db.prepare("UPDATE projects SET state = ?, updated_at = ? WHERE id = ?").run(to, now(), projectId);
  audit(db, actor, "project.transition", "project", projectId, { from: project.state, to });
}

export function createSpecification(projectId: string): string {
  const db = getDb();
  const row = db.prepare(
    `SELECT p.*, l.brand_name, l.store_url, l.industry_pack, l.primary_platform, l.automation_goal,
            l.monthly_orders, l.biggest_problem, l.requested_scope, l.risk_tier, l.company_note
       FROM projects p JOIN leads l ON l.id = p.lead_id WHERE p.id = ?`
  ).get(projectId) as (ProjectRow & LeadRow) | undefined;
  if (!row) throw new Error("Project does not exist");
  if (row.state !== "paid" && row.state !== "spec_draft") throw new Error("Project is not ready for specification");
  assertProjectEligibleForAutomation(db, projectId);

  if (!isIndustryPackId(row.industry_pack)) throw new Error("Project requires manual review: unknown-pack");
  const pack = getIndustryPack(row.industry_pack);
  const spec = [
    `# ${sanitizeCustomerText(row.brand_name, 80)} | Morning Operator delivery specification`,
    "",
    "## Approved workflow pack",
    `- Pack: ${pack.id}@${pack.version}`,
    `- Risk tier: ${row.risk_tier}`,
    `- Primary platform: ${sanitizeCustomerText(row.primary_platform, 80)}`,
    `- Platform URL: ${sanitizeCustomerText(row.store_url, 300)}`,
    `- Automation goal: ${sanitizeCustomerText(row.automation_goal, 80)}`,
    `- Monthly work volume: ${row.monthly_orders}`,
    `- Scope: ${row.requested_scope}`,
    "",
    "## Primary problem",
    `- ${row.biggest_problem}`,
    "",
    "## Success metrics",
    ...pack.metrics.map((metric) => `- ${metric}`),
    "",
    "## Required human approvals",
    ...pack.requiredApprovals.map((approval) => `- ${approval}`),
    "- production_delivery",
    "",
    "## Prohibited actions",
    ...pack.prohibitedActions.map((action) => `- ${action}`),
    "- No consequential medical, financial, employment, legal, housing, or safety decision.",
    "- No external write, send, publish, refund, payment, or deletion without a recorded approval.",
    "- Do not send unnecessary personal data or raw confidential records to AI systems.",
    "",
    "## Customer context (untrusted data)",
    "> Withheld from the AI build specification. An owner must review and convert any useful context into approved requirements.",
    "",
    "## Acceptance criteria",
    "1. Synthetic fixtures reproduce the approved workflow without real customer records.",
    "2. Repeated provider events remain idempotent.",
    "3. Missing or ambiguous data produces a review task instead of an external action.",
    "4. Pack metrics, typecheck, tests, and secret scan pass.",
    "5. A separate deployment approval exists before delivery."
  ].join("\n");

  db.transaction(() => {
    const current = (db.prepare("SELECT state FROM projects WHERE id = ?").get(projectId) as { state: ProjectState }).state;
    if (current === "paid") {
      assertProjectTransition("paid", "spec_draft");
      db.prepare("UPDATE projects SET state = 'spec_draft', updated_at = ? WHERE id = ?").run(now(), projectId);
    }
    assertProjectTransition("spec_draft", "spec_approval");
    db.prepare("UPDATE projects SET state = 'spec_approval', specification = ?, updated_at = ? WHERE id = ?").run(
      spec,
      now(),
      projectId
    );
    db.prepare(
      `INSERT INTO approvals
        (id, project_id, kind, status, summary, created_at)
       VALUES (?, ?, 'specification', 'pending', ?, ?)
       ON CONFLICT(project_id, kind) DO UPDATE SET
         status = 'pending', summary = excluded.summary, decided_at = NULL, decision_note = NULL`
    ).run(id(), projectId, spec, now());
    for (const requiredApproval of pack.requiredApprovals) {
      db.prepare(
        `INSERT INTO approvals
          (id, project_id, kind, status, summary, created_at)
         VALUES (?, ?, ?, 'pending', ?, ?)
         ON CONFLICT(project_id, kind) DO UPDATE SET
           status = 'pending', summary = excluded.summary, decided_at = NULL, decision_note = NULL`
      ).run(
        id(),
        projectId,
        `pack:${requiredApproval}`,
        `Required by ${pack.id}@${pack.version}: ${requiredApproval}`,
        now()
      );
    }
    audit(db, "worker", "specification.drafted", "project", projectId);
  })();
  return spec;
}

function queueBuildWhenAllScopeApprovalsPass(
  db: Database.Database,
  project: ProjectRow
): ProjectState {
  const approvals = db.prepare(
    "SELECT kind, status FROM approvals WHERE project_id = ? AND (kind = 'specification' OR kind LIKE 'pack:%')"
  ).all(project.id) as Array<{ kind: string; status: string }>;
  const specificationApproved = approvals.some(
    (approval) => approval.kind === "specification" && approval.status === "approved"
  );
  const packApprovals = approvals.filter((approval) => approval.kind.startsWith("pack:"));
  const allPackApprovalsPassed = packApprovals.length > 0 && packApprovals.every(
    (approval) => approval.status === "approved"
  );
  if (!specificationApproved || !allPackApprovalsPassed) return project.state;
  if (project.state !== "spec_approval") return project.state;
  assertProjectTransition(project.state, "build_queued");
  db.prepare("UPDATE projects SET state = 'build_queued', updated_at = ? WHERE id = ?").run(now(), project.id);
  enqueueInTransaction(db, "codex_build", project.id, { projectId: project.id });
  return "build_queued";
}

export function decideApproval(
  approvalId: string,
  decision: "approved" | "rejected",
  note: string,
  actor = "owner"
): { projectId: string; kind: string; state: ProjectState } {
  const db = getDb();
  return db.transaction(() => {
    const approval = db.prepare("SELECT * FROM approvals WHERE id = ?").get(approvalId) as
      | { id: string; project_id: string; kind: string; status: string }
      | undefined;
    if (!approval) throw new Error("Approval does not exist");
    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(approval.project_id) as ProjectRow;
    if (approval.status !== "pending") {
      return { projectId: project.id, kind: approval.kind, state: project.state };
    }

    db.prepare("UPDATE approvals SET status = ?, decided_at = ?, decision_note = ? WHERE id = ?").run(
      decision,
      now(),
      sanitizeCustomerText(note),
      approvalId
    );
    let nextState = project.state;
    if (approval.kind === "specification" || approval.kind.startsWith("pack:")) {
      if (decision === "approved") {
        assertProjectEligibleForAutomation(db, project.id);
        nextState = queueBuildWhenAllScopeApprovalsPass(db, project);
      } else {
        nextState = "spec_draft";
        assertProjectTransition(project.state, nextState);
        db.prepare("UPDATE projects SET state = ?, updated_at = ? WHERE id = ?").run(nextState, now(), project.id);
      }
    } else if (approval.kind === "deployment") {
      nextState = decision === "approved" ? "delivered" : "qa_passed";
      assertProjectTransition(project.state, nextState);
      db.prepare("UPDATE projects SET state = ?, updated_at = ? WHERE id = ?").run(nextState, now(), project.id);
      if (decision === "approved") {
        const lead = db.prepare(
          "SELECT l.* FROM leads l JOIN projects p ON p.lead_id = l.id WHERE p.id = ?"
        ).get(project.id) as LeadRow;
        const leadT = createTranslator(resolveLocale(lead.locale));
        db.prepare(
          `INSERT INTO notifications
            (id, project_id, channel, recipient, subject, body, status, created_at)
           VALUES (?, ?, 'email', ?, ?, ?, 'queued', ?)`
        ).run(id(), project.id, lead.email, leadT("notification.deliverySubject"), leadT("notification.deliveryBody"), now());
        enqueueInTransaction(db, "send_notifications", project.id, { reason: "delivery" });
      }
    } else {
      throw new Error("Unsupported approval kind");
    }
    audit(db, actor, `approval.${decision}`, "approval", approvalId, { kind: approval.kind, projectId: project.id });
    return { projectId: project.id, kind: approval.kind, state: nextState };
  })();
}

export function leaseNextJob(leaseMs = 5 * 60_000): JobRow | undefined {
  const db = getDb();
  return db.transaction(() => {
    const timestamp = now();
    const job = db.prepare(
      `SELECT * FROM jobs
        WHERE status IN ('pending', 'retry')
          AND run_after <= ?
          AND (lease_until IS NULL OR lease_until < ?)
        ORDER BY created_at ASC LIMIT 1`
    ).get(timestamp, timestamp) as JobRow | undefined;
    if (!job) return undefined;
    const leaseUntil = new Date(Date.now() + leaseMs).toISOString();
    db.prepare(
      "UPDATE jobs SET status = 'running', attempts = attempts + 1, lease_until = ?, updated_at = ? WHERE id = ?"
    ).run(leaseUntil, timestamp, job.id);
    return db.prepare("SELECT * FROM jobs WHERE id = ?").get(job.id) as JobRow;
  })();
}

export function completeJob(jobId: string, artifactPath?: string): void {
  const db = getDb();
  db.prepare(
    "UPDATE jobs SET status = 'succeeded', lease_until = NULL, artifact_path = ?, updated_at = ? WHERE id = ?"
  ).run(artifactPath || null, now(), jobId);
  audit(db, "worker", "job.succeeded", "job", jobId, { artifactPath });
}

export function failJob(jobId: string, error: unknown): "retry" | "dead" {
  const db = getDb();
  const job = db.prepare("SELECT * FROM jobs WHERE id = ?").get(jobId) as JobRow;
  const status = job.attempts >= job.max_attempts ? "dead" : "retry";
  const backoffMinutes = 2 ** Math.max(0, job.attempts - 1);
  const runAfter = new Date(Date.now() + backoffMinutes * 60_000).toISOString();
  const message = sanitizeCustomerText(error instanceof Error ? error.message : String(error), 2000);
  db.prepare(
    "UPDATE jobs SET status = ?, lease_until = NULL, run_after = ?, last_error = ?, updated_at = ? WHERE id = ?"
  ).run(status, runAfter, message, now(), jobId);
  audit(db, "worker", `job.${status}`, "job", jobId, { error: message });
  return status;
}

export function markBuildStarted(projectId: string): ProjectRow {
  assertProjectEligibleForAutomation(getDb(), projectId);
  transitionProject(projectId, "building", "worker");
  return getDb().prepare("SELECT * FROM projects WHERE id = ?").get(projectId) as ProjectRow;
}

export function markBuildCompleted(projectId: string, artifactPath: string): void {
  const db = getDb();
  db.transaction(() => {
    db.prepare("UPDATE projects SET build_artifact_path = ?, updated_at = ? WHERE id = ?").run(artifactPath, now(), projectId);
    enqueueInTransaction(db, "qa", projectId, { projectId, artifactPath });
    audit(db, "worker", "build.completed", "project", projectId, { artifactPath });
  })();
}

export function markQa(projectId: string, passed: boolean, evidence: string): void {
  const db = getDb();
  db.transaction(() => {
    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(projectId) as ProjectRow;
    const qaState: ProjectState = passed ? "qa_passed" : "qa_failed";
    assertProjectTransition(project.state, qaState);
    db.prepare("UPDATE projects SET state = ?, updated_at = ? WHERE id = ?").run(qaState, now(), projectId);
    if (passed) {
      assertProjectTransition("qa_passed", "deploy_approval");
      db.prepare("UPDATE projects SET state = 'deploy_approval', updated_at = ? WHERE id = ?").run(now(), projectId);
      db.prepare(
        `INSERT OR IGNORE INTO approvals
          (id, project_id, kind, status, summary, created_at)
         VALUES (?, ?, 'deployment', 'pending', ?, ?)`
      ).run(id(), projectId, evidence, now());
    }
    audit(db, "worker", passed ? "qa.passed" : "qa.failed", "project", projectId, { evidence });
  })();
}

export function getProject(projectId: string): ProjectRow | undefined {
  return getDb().prepare("SELECT * FROM projects WHERE id = ?").get(projectId) as ProjectRow | undefined;
}

export function getDashboardData() {
  const db = getDb();
  const metrics = db.prepare(
    `SELECT
      (SELECT COUNT(*) FROM leads) AS leads,
      (SELECT COUNT(*) FROM leads WHERE status = 'qualified') AS qualified,
      (SELECT COUNT(*) FROM payments WHERE status = 'succeeded') AS payments,
      (SELECT COUNT(*) FROM projects) AS projects,
      (SELECT COUNT(*) FROM approvals WHERE status = 'pending') AS pending_approvals,
      (SELECT COUNT(*) FROM jobs WHERE status = 'dead') AS dead_jobs`
  ).get() as Record<string, number>;
  return {
    metrics,
    revenueByCurrency: db.prepare(
      "SELECT currency, SUM(amount_minor) AS amount_minor FROM payments WHERE status = 'succeeded' GROUP BY currency ORDER BY currency"
    ).all() as Array<{ currency: string; amount_minor: number }>,
    leads: db.prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT 20").all() as LeadRow[],
    projects: db.prepare(
      `SELECT p.*, l.brand_name, l.email FROM projects p JOIN leads l ON l.id = p.lead_id
       ORDER BY p.created_at DESC LIMIT 20`
    ).all(),
    approvals: db.prepare(
      `SELECT a.*, p.name AS project_name FROM approvals a JOIN projects p ON p.id = a.project_id
       WHERE a.status = 'pending' ORDER BY a.created_at ASC`
    ).all(),
    jobs: db.prepare("SELECT * FROM jobs ORDER BY created_at DESC LIMIT 30").all() as JobRow[],
    notifications: db.prepare("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20").all(),
    audit: db.prepare("SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 30").all()
  };
}

export function getCounts(): Record<string, number> {
  const db = getDb();
  const tables = ["leads", "payments", "projects", "approvals", "jobs", "notifications", "audit_log"];
  return Object.fromEntries(
    tables.map((table) => [table, (db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get() as { count: number }).count])
  );
}

export type NotificationRow = {
  id: string;
  project_id: string | null;
  channel: string;
  recipient: string;
  subject: string;
  body: string;
  status: string;
  created_at: string;
  sent_at: string | null;
};

export function getQueuedNotifications(limit = 20): NotificationRow[] {
  return getDb().prepare(
    "SELECT * FROM notifications WHERE status = 'queued' ORDER BY created_at ASC LIMIT ?"
  ).all(limit) as NotificationRow[];
}

export function markNotification(
  notificationId: string,
  status: "sent" | "preview" | "failed",
  detail: Record<string, unknown> = {}
): void {
  const db = getDb();
  db.prepare("UPDATE notifications SET status = ?, sent_at = ? WHERE id = ?").run(
    status,
    status === "sent" ? now() : null,
    notificationId
  );
  audit(db, "notification-adapter", `notification.${status}`, "notification", notificationId, detail);
}
