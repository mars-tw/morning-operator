---
goal: Build a Local-First AI Business Autopilot With Safe Revenue and Delivery Automation
version: 1.0
date_created: 2026-07-17
last_updated: 2026-07-17
owner: Solo founder
status: 'Completed'
tags: [architecture, automation, ai, payments, operations]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan builds a runnable one-person AI automation business headquarters. The first vertical slice accepts a lead, records a payment event, creates a project, drafts a specification, waits for owner approval, queues an isolated Codex build job, records QA evidence, and blocks production deployment until a second approval.

## 1. Requirements & Constraints

- **REQ-001**: Provide a public Traditional Chinese sales page with a concrete fixed-scope automation offer and intake form.
- **REQ-002**: Persist leads, payment events, projects, approvals, jobs, notifications, and audit records in one local SQLite database.
- **REQ-003**: Convert an idempotent successful payment event into exactly one customer project and onboarding job.
- **REQ-004**: Generate a sanitized specification draft from intake data and require explicit owner approval before code generation.
- **REQ-005**: Run approved code-generation jobs through Codex CLI in a job-specific Git workspace with workspace-write sandboxing.
- **REQ-006**: Save generated artifacts, command results, QA evidence, and job state transitions for operator review.
- **REQ-007**: Provide an owner dashboard for leads, revenue, approvals, projects, queued jobs, failures, and notifications.
- **REQ-008**: Provide mock payment and mock AI paths so the complete vertical slice runs without third-party credentials.
- **REQ-009**: Provide adapters and environment variables for hosted checkout, email delivery, monitoring, and future payment providers.
- **REQ-010**: Provide daily digest, retry, dead-letter, backup, restore-check, and health-check operations.
- **SEC-001**: Never expose payment secrets, AI credentials, admin credentials, raw customer secrets, or Codex authentication to public pages, logs, generated prompts, or Git.
- **SEC-002**: Verify webhook signatures before accepting live provider events and preserve provider event IDs for idempotency.
- **SEC-003**: Treat intake text as untrusted data, delimit it in generated prompts, and prohibit it from overriding system policy or allowed commands.
- **SEC-004**: Require owner approval for specification lock, production deployment, refunds, discounts, bulk outbound messages, and destructive data actions.
- **SEC-005**: Run Codex with `--sandbox workspace-write`, `--ask-for-approval never`, and a job-specific working directory; never use danger-full-access.
- **CON-001**: The repository starts empty and has Node.js 24, pnpm 11, Python 3.12, Git, and Codex CLI but no Docker daemon.
- **CON-002**: External merchant onboarding, bank identity verification, production domains, and provider secrets require the owner's later authorization.
- **CON-003**: The initial database and worker target one trusted machine; multi-host scaling requires migration to PostgreSQL.
- **GUD-001**: Prefer deterministic domain state transitions, typed contracts, idempotency keys, structured logs, and narrow adapters.
- **GUD-002**: Keep the operator experience Traditional Chinese and expose only decisions, exceptions, money, and deadlines.
- **PAT-001**: Use a transactional outbox and leased job queue so database state and automation dispatch cannot silently diverge.
- **PAT-002**: Generate patches and previews before production release; production deployment remains an explicit approval gate.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Establish repository contracts, safety policy, deterministic plan, and runtime configuration.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `/AGENTS.md` with repository commands, security boundaries, approval gates, and verification requirements. | ✅ | 2026-07-17 |
| TASK-002 | Create root pnpm, TypeScript, Git ignore, environment example, and package configuration files. | ✅ | 2026-07-17 |
| TASK-003 | Create `/docs/architecture.md`, `/docs/approval-matrix.md`, and `/docs/operator-runbook.md`. | ✅ | 2026-07-17 |
| TASK-004 | Create and validate this implementation plan at `/plan/architecture-ai-business-autopilot-v1.md`. | ✅ | 2026-07-17 |

### Implementation Phase 2

- GOAL-002: Implement the persistent domain core and automation queue.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | Implement `/src/lib/db.ts` with SQLite initialization, WAL, foreign keys, migrations, and test database support. | ✅ | 2026-07-17 |
| TASK-006 | Implement `/src/lib/contracts.ts` with Zod schemas for intake, payments, approvals, projects, jobs, and webhook envelopes. | ✅ | 2026-07-17 |
| TASK-007 | Implement `/src/lib/repository.ts` with idempotent lead, event, project, approval, notification, and audit operations. | ✅ | 2026-07-17 |
| TASK-008 | Implement `/src/lib/automation.ts` with queue leases, retries, exponential backoff, dead-letter state, and deterministic handlers. | ✅ | 2026-07-17 |
| TASK-009 | Implement `/src/lib/project-machine.ts` with validated project state transitions and approval enforcement. | ✅ | 2026-07-17 |

### Implementation Phase 3

- GOAL-003: Implement the public revenue funnel and owner operations interface.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-010 | Implement `/src/app/page.tsx` and `/src/app/globals.css` as a responsive Traditional Chinese fixed-offer sales page. | ✅ | 2026-07-17 |
| TASK-011 | Implement `/src/app/api/intake/route.ts` to validate, store, score, audit, and acknowledge new leads. | ✅ | 2026-07-17 |
| TASK-012 | Implement `/src/app/admin/page.tsx` to display money, leads, projects, approvals, jobs, failures, and system health. | ✅ | 2026-07-17 |
| TASK-013 | Implement `/src/app/api/admin/approvals/[id]/route.ts` with admin authentication and auditable approve or reject transitions. | ✅ | 2026-07-17 |
| TASK-014 | Implement route and page guards plus `/src/lib/admin-auth.ts` with a local bootstrap credential and secure production checks. | ✅ | 2026-07-17 |

### Implementation Phase 4

- GOAL-004: Implement payment, project creation, specification, Codex generation, QA, and digest handlers.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-015 | Implement `/src/app/api/webhooks/payments/mock/route.ts` as a development-only idempotent payment simulator. | ✅ | 2026-07-17 |
| TASK-016 | Implement `/src/app/api/webhooks/payments/lemon-squeezy/route.ts` with raw-body HMAC verification and provider event idempotency. | ✅ | 2026-07-17 |
| TASK-017 | Implement the payment-success handler to create one project, one specification job, and one onboarding notification. | ✅ | 2026-07-17 |
| TASK-018 | Implement the specification handler to sanitize intake data, create acceptance criteria, and open a specification approval. | ✅ | 2026-07-17 |
| TASK-019 | Implement `/scripts/run-codex-job.ts` to invoke Codex only for an approved job inside `/var/workspaces/<job-id>`. | ✅ | 2026-07-17 |
| TASK-020 | Implement QA and delivery-artifact preview handlers that save evidence and open a deployment approval without deploying production. | ✅ | 2026-07-17 |
| TASK-021 | Implement daily digest and notification adapters with an explicit preview fallback when email credentials are absent. | ✅ | 2026-07-17 |

### Implementation Phase 5

- GOAL-005: Add verification, deployment preparation, reusable operating skill, and handoff evidence.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-022 | Add Vitest coverage for scoring, idempotency, state transitions, approvals, retries, and webhook signatures. | ✅ | 2026-07-17 |
| TASK-023 | Add Playwright coverage for intake submission and the owner approval path. | ✅ | 2026-07-17 |
| TASK-024 | Add GitHub Actions CI for install, typecheck, tests, build, and secret scanning. | ✅ | 2026-07-17 |
| TASK-025 | Add `/scripts/backup.ts`, `/scripts/restore-check.ts`, `/scripts/seed-demo.ts`, and `/scripts/smoke.ts`. | ✅ | 2026-07-17 |
| TASK-026 | Create and validate the reusable Codex skill `operate-ai-microbusiness` in the default Codex skill directory. | ✅ | 2026-07-17 |
| TASK-027 | Run dependency installation, typecheck, tests, production build, smoke test, backup restore test, and local browser inspection. | ✅ | 2026-07-17 |
| TASK-028 | Update task completion fields and document the exact external credentials and merchant actions still required. | ✅ | 2026-07-17 |

## 3. Alternatives

- **ALT-001**: Use n8n as the system of record. Rejected because payment idempotency, project state, approval history, and retries require transactional ownership in the application database.
- **ALT-002**: Deploy the first version as a pure Vercel serverless application with SQLite. Rejected because generated workspaces, a leased worker, and durable local files need persistent compute and storage.
- **ALT-003**: Start with PostgreSQL, Redis, and container orchestration. Deferred because it adds external services before one paid offer is validated.

## 4. Dependencies

- **DEP-001**: Node.js 24 and pnpm 11 for application, worker, scripts, and tests.
- **DEP-002**: Next.js, React, TypeScript, Zod, better-sqlite3, and structured logging packages pinned in `/package.json`.
- **DEP-003**: Codex CLI authenticated on the trusted operator machine for approved generation jobs.
- **DEP-004**: Optional merchant, email, monitoring, GitHub, and deployment credentials described in `/.env.example`.

## 5. Files

- **FILE-001**: `/src/app/` public, admin, health, intake, approval, and payment webhook routes.
- **FILE-002**: `/src/lib/` domain contracts, database, repository, automation, authentication, integrations, and project state machine.
- **FILE-003**: `/scripts/` worker, Codex executor, seed, smoke, backup, and restore-check commands.
- **FILE-004**: `/tests/` unit, integration, webhook, and browser tests.
- **FILE-005**: `/docs/` architecture, approval, payment, deployment, incident, and operator documentation.
- **FILE-006**: `/.github/workflows/ci.yml`, `/AGENTS.md`, `/.env.example`, and root project configuration.

## 6. Testing

- **TEST-001**: `pnpm typecheck` exits with code 0.
- **TEST-002**: `pnpm test` verifies scoring, idempotency, state transitions, approvals, retry behavior, and signature validation.
- **TEST-003**: `pnpm build` creates a production Next.js build without runtime configuration leaks.
- **TEST-004**: `pnpm smoke` completes intake, mock payment, project creation, specification approval, mock build, QA, and deployment approval creation.
- **TEST-005**: `pnpm restore-check` restores a backup into a temporary database and verifies row counts and integrity.
- **TEST-006**: `pnpm test:e2e` verifies the public intake and authenticated owner workflow in a real browser.

## 7. Risks & Assumptions

- **RISK-001**: No software can guarantee passive income; acquisition, offer quality, refunds, compliance, and production incidents still require owner accountability.
- **RISK-002**: Untrusted intake content can attempt prompt injection; generated prompts must delimit customer data and enforce a fixed policy.
- **RISK-003**: SQLite and a single worker do not support high-availability multi-host operation; migrate before scaling beyond one trusted host.
- **RISK-004**: Merchant webhooks and tax treatment differ by provider and jurisdiction; production activation requires current provider documentation and professional tax confirmation.
- **ASSUMPTION-001**: The first offer is a seven-day order and daily-report automation package for small Taiwan online sellers.
- **ASSUMPTION-002**: The operator accepts specification and production deployment approvals as the minimum human safety gates.

## 8. Related Specifications / Further Reading

[Codex non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode)

[GitHub Actions continuous deployment](https://docs.github.com/en/actions/get-started/continuous-deployment)

[Lemon Squeezy webhooks](https://docs.lemonsqueezy.com/api/webhooks)

[Taiwan Ministry of Finance online transaction guidance](https://www.etax.nat.gov.tw/etwmain/tax-info/network-transaction-taxtation-area/seller/notice)
