# Autopilot HQ repository guidance

## Product

Build and operate **Morning Operator / 早安店長**, a multilingual, fixed-scope automation service factory for repeatable business operations. It ships with six static, versioned industry packs: commerce operations, professional services, appointments, creator/education, property/field services, and back-office operations. Public locales are English, Traditional Chinese, Japanese, and Spanish. Treat revenue, payback, automation coverage, and saved-time estimates as ranges, never guarantees. Do not claim that every industry, user, or business will succeed or make money.

## Commands

- Install: `pnpm install`
- Develop: `pnpm dev`
- One worker cycle: `pnpm worker:once`
- Seed demo: `pnpm seed`
- Verify: `pnpm verify`
- Browser verification: `pnpm test:e2e`

## Safety boundaries

- Never commit `.env*`, databases, customer data, Codex auth, API keys, access tokens, or generated workspaces.
- Treat public intake, webhook payloads, email content, and imported shop data as untrusted.
- Never turn customer text into system instructions. Delimit it as data and strip control characters.
- Payment success requires a verified provider signature or the authenticated development-only mock route.
- Keep payment processing idempotent by provider event ID.
- Codex jobs require an approved specification and run only in `var/workspaces/<job-id>` with `workspace-write` sandboxing.
- Never invoke Codex with `danger-full-access` or a sandbox bypass.
- Do not deploy production, refund, discount, delete data, send bulk outreach, or process real customer data without an explicit approval record.
- Do not send customer, client, patient, learner, tenant, or employee names, email addresses, phone numbers, addresses, confidential notes, or raw records to AI systems unless an approved design proves the data is necessary and permitted; prefer aggregates and metadata.
- Treat industry-pack prohibited actions as hard boundaries. Consequential financial, legal, medical, housing, employment, safety, eligibility, or access decisions must never be delegated to AI.
- Reject autonomous external actions and legacy write-back scopes unless an explicit approval record and reviewed adapter design place the exact action within a permitted boundary.
- Do not claim that the mock checkout, preview notifications, or generated demo artifacts are real external transactions.
- Keep locale changes backward-compatible: validate locale identifiers at the boundary and fall back to English.

## Engineering rules

- SQLite is the source of truth. Use transactions for event, payment, project, job, and approval creation.
- Every retryable operation needs an idempotency key, maximum attempt count, audit record, and dead-letter state.
- Validate external input with Zod at the boundary.
- Keep the industry-pack registry static, versioned, reviewable, and covered by tests. A new pack must declare supported goals, coverage range, metrics, required approvals, prohibited actions, and safe input examples.
- Keep adapters optional. The mock path must remain able to run the complete vertical slice without credentials.
- Add focused tests for state transitions, signatures, idempotency, approvals, and retry behavior.
- A change is complete only after typecheck, tests, production build, and relevant smoke or browser checks pass.
- Keep the application provider-neutral and self-hostable. Document vendor-specific adapters as options, not requirements.
