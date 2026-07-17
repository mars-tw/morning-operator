import fs from "node:fs";
import path from "node:path";
import pino from "pino";
import { runApprovedCodexJob } from "./codex-runner";
import {
  completeJob,
  createSpecification,
  failJob,
  getDashboardData,
  getProject,
  getQueuedNotifications,
  leaseNextJob,
  markBuildCompleted,
  markBuildStarted,
  markNotification,
  markQa,
  type JobRow
} from "./repository";
import { readSecret } from "./secrets";

const log = pino({ level: process.env.LOG_LEVEL || "info" });

async function handleJob(job: JobRow): Promise<string | undefined> {
  if (job.type === "draft_spec") {
    if (!job.project_id) throw new Error("draft_spec job is missing project_id");
    createSpecification(job.project_id);
    return undefined;
  }

  if (job.type === "codex_build") {
    if (!job.project_id) throw new Error("codex_build job is missing project_id");
    const current = getProject(job.project_id);
    if (!current) throw new Error("Project does not exist");
    if (current.state === "build_queued" || current.state === "qa_failed") markBuildStarted(job.project_id);
    const result = await runApprovedCodexJob(job.id, job.project_id);
    markBuildCompleted(job.project_id, result.artifactPath);
    return result.artifactPath;
  }

  if (job.type === "qa") {
    if (!job.project_id) throw new Error("qa job is missing project_id");
    const payload = JSON.parse(job.payload_json) as { artifactPath?: string };
    if (!payload.artifactPath || !fs.existsSync(payload.artifactPath)) {
      markQa(job.project_id, false, "缺少建置產物，無法驗收。");
      throw new Error("Build artifact does not exist");
    }
    const content = fs.readFileSync(payload.artifactPath, "utf8");
    const passed = content.includes("#") && !content.includes("QA_FAIL");
    const evidence = passed
      ? `QA 通過。產物：${path.relative(process.cwd(), payload.artifactPath)}；大小：${Buffer.byteLength(content)} bytes。`
      : "QA 失敗：產物格式不完整。";
    markQa(job.project_id, passed, evidence);
    if (!passed) throw new Error(evidence);
    return payload.artifactPath;
  }

  if (job.type === "send_digest") {
    const outputDir = path.resolve(process.cwd(), "var", "digests");
    fs.mkdirSync(outputDir, { recursive: true });
    const digestPath = path.join(outputDir, `${new Date().toISOString().slice(0, 10)}.json`);
    fs.writeFileSync(digestPath, JSON.stringify(getDashboardData().metrics, null, 2));
    return digestPath;
  }

  if (job.type === "send_notifications") {
    const queued = getQueuedNotifications();
    for (const notification of queued) {
      const apiKey = readSecret("RESEND_API_KEY");
      const from = process.env.OPERATOR_FROM_EMAIL;
      if (!apiKey || !from || notification.recipient.endsWith("@example.com")) {
        markNotification(notification.id, "preview", {
          reason: "email provider not configured or demo recipient"
        });
        continue;
      }
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          from,
          to: [notification.recipient],
          subject: notification.subject,
          text: notification.body
        })
      });
      if (!response.ok) {
        const message = await response.text();
        markNotification(notification.id, "failed", {
          status: response.status,
          message: message.slice(0, 500)
        });
        throw new Error(`Email delivery failed with ${response.status}`);
      }
      markNotification(notification.id, "sent", { provider: "resend" });
    }
    return undefined;
  }

  throw new Error(`Unsupported job type: ${job.type}`);
}

export async function runOneJob(): Promise<boolean> {
  const job = leaseNextJob();
  if (!job) return false;
  log.info({ jobId: job.id, type: job.type, attempt: job.attempts }, "job.started");
  try {
    const artifactPath = await handleJob(job);
    completeJob(job.id, artifactPath);
    log.info({ jobId: job.id, type: job.type }, "job.succeeded");
  } catch (error) {
    const status = failJob(job.id, error);
    log.error({ jobId: job.id, type: job.type, status, error }, "job.failed");
  }
  return true;
}

export async function drainJobs(maxJobs = 100): Promise<number> {
  let processed = 0;
  while (processed < maxJobs && (await runOneJob())) processed += 1;
  return processed;
}
