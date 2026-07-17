---
title: Industry Automation Factory Architecture Specification
version: 1.0
date_created: 2026-07-17
last_updated: 2026-07-17
owner: Autopilot HQ Maintainers
tags: [architecture, automation, industry-packs, safety, self-hosted]
---

# Introduction

This specification defines how Morning Operator supports multiple industries without claiming universal profitability or allowing uncontrolled AI actions. The system converts recurring administrative work into measurable, approval-gated workflows through versioned industry packs.

## 1. Purpose & Scope

The specification applies to public intake, fit scoring, effort and payback estimates, specification generation, AI-assisted build jobs, quality assurance, delivery approval, and open-source industry-pack contributions.

The initial supported packs are commerce operations, professional services, appointment businesses, creator and education operations, property and field services, and generic back-office operations. Regulated or safety-critical decisions are outside the fixed-scope automation service.

The intended audience is maintainers, contributors, self-hosting operators, and AI agents implementing new packs. The system may estimate labor reduction and payback ranges but must never guarantee revenue, savings, or business success.

## 2. Definitions

- **Industry Pack**: A versioned data object defining one repeatable service pattern, suitable inputs, supported goals, risk tier, metrics, and prohibited actions.
- **Work Item**: A recurring unit such as an order, lead, appointment, document, content asset, or service request.
- **Coverage Range**: A conservative low and high percentage of current repetitive effort that may be suitable for automation after validation.
- **Human Approval Gate**: A persisted decision that must exist before the next high-impact state transition.
- **Draft-and-Review**: AI prepares an artifact, but a human verifies and sends, publishes, or applies it.
- **Restricted**: A workflow that can summarize or route information but cannot make or execute consequential decisions.
- **Payback Range**: Setup price divided by estimated monthly labor value, expressed as a range and not a guarantee.

## 3. Requirements, Constraints & Guidelines

- **REQ-001**: The registry shall expose exactly one canonical definition for each industry pack identifier.
- **REQ-002**: Each pack shall declare supported automation goals, example inputs, output metrics, human approval requirements, prohibited actions, risk tier, and coverage range.
- **REQ-003**: Public intake shall retain industry pack, primary platform, automation goal, current monthly work volume, current repetitive labor, and hourly labor-cost estimate.
- **REQ-004**: The API shall return fit score, current monthly hours, recoverable-hours range, monthly labor-value range, payback range, risk tier, and an explicit non-guarantee statement.
- **REQ-005**: Specification generation shall include the chosen pack, allowed automation goal, data minimization rules, approval gates, acceptance metrics, and prohibited actions.
- **REQ-006**: Existing Shopify intake records and API clients shall remain readable through defaults and forward-only schema migration.
- **REQ-007**: All public locales shall receive complete translations for pack names, goals, estimate labels, safety boundaries, and error states.
- **SEC-001**: A restricted pack or autonomous external-action request shall never be marked qualified for the fixed-scope automated build path.
- **SEC-002**: Medical, financial, employment, legal, housing eligibility, biometric, safety, and other consequential decisions shall require domain-specific review and shall not be executed by the reference worker.
- **SEC-003**: Generated specifications shall treat public notes and imported records as untrusted data and shall exclude personal data not required for the approved workflow.
- **SEC-004**: Revenue, savings, coverage, and payback values shall be labeled as estimates based on user-supplied inputs.
- **CON-001**: The first release supports six general packs; it does not claim coverage for every jurisdiction, regulation, or workflow variant.
- **CON-002**: SQLite remains the single-host source of truth and one worker remains the supported concurrency model.
- **CON-003**: Industry packs are code-reviewed static data in this release; runtime upload of executable pack code is prohibited.
- **GUD-001**: Prefer repetitive, observable, reversible work over autonomous judgment or irreversible external actions.
- **GUD-002**: Measure success with hours reviewed, work-item throughput, error rate, approval rate, and manual intervention rate rather than income claims.
- **PAT-001**: Apply the sequence measure, constrain, draft, approve, execute, verify, and improve to every supported workflow.

## 4. Interfaces & Data Contracts

### Industry pack contract

```ts
type IndustryPack = {
  id: "commerce_ops" | "professional_services" | "appointments" |
      "creator_education" | "property_field" | "backoffice";
  version: 1;
  riskTier: "low" | "medium" | "restricted";
  coverage: { low: number; high: number };
  goals: AutomationGoal[];
  metrics: string[];
  requiredApprovals: string[];
  prohibitedActions: string[];
};
```

### Canonical intake additions

```json
{
  "industryPack": "professional_services",
  "primaryPlatform": "email",
  "automationGoal": "lead_followup",
  "monthlyOrders": "100_500",
  "dailyMinutes": 60,
  "weeklyReportMinutes": 120,
  "hourlyCostMinor": 3000,
  "requestedScope": "draft_and_review"
}
```

### Estimate response additions

```json
{
  "fitScore": 85,
  "riskTier": "medium",
  "currentMonthlyHours": 30.7,
  "recoverableHours": { "low": 9.2, "high": 16.9 },
  "monthlyValueMinor": { "low": 27600, "high": 50700 },
  "paybackMonths": { "fast": 1.3, "slow": 2.4 },
  "currency": "USD",
  "qualified": true,
  "disclaimer": "Estimate based on supplied inputs; results are not guaranteed."
}
```

## 5. Acceptance Criteria

- **AC-001**: Given a supported low-risk pack and draft-and-review scope, when intake is submitted, then the API returns a non-empty estimate range and retains the pack on the lead.
- **AC-002**: Given a regulated industry or autonomous external-action scope, when intake is scored, then `qualified` is false and risk tier is `restricted`.
- **AC-003**: Given an existing lead database without pack columns, when the application opens it, then migrations add defaults without removing existing records.
- **AC-004**: Given any supported locale, when the public page renders, then all six packs and all estimate labels appear without fallback-key text.
- **AC-005**: Given a paid lead, when a specification is drafted, then it contains pack-specific metrics, approvals, prohibited actions, and no unsupported autonomous step.
- **AC-006**: Given a pull request adding a pack, when CI runs, then registry completeness, risk invariants, translations, typecheck, build, smoke, and browser tests pass.

## 6. Test Automation Strategy

- **Test Levels**: Unit tests for registry and estimates; integration tests for migration, intake, payment, specification, and approvals; end-to-end tests for selection and localized result rendering.
- **Frameworks**: Vitest for unit and integration tests; Playwright for browser tests; GitHub Actions for CI.
- **Test Data Management**: Use temporary SQLite databases and synthetic organizations only. Remove each temporary directory after the test.
- **CI/CD Integration**: Run the existing `pnpm verify`, `pnpm test:e2e`, container builds, dependency updates, and CodeQL workflows.
- **Coverage Requirements**: Every pack must appear in the registry completeness test; every risk tier must have a qualification test.
- **Performance Testing**: Registry lookup and estimate calculation must complete synchronously without network access; public intake remains bounded by existing request limits.

## 7. Rationale & Context

A universal autonomous agent would create misleading claims, unpredictable scope, and unacceptable safety risk. Static industry packs provide extensibility while keeping behavior inspectable, testable, translatable, and reviewable. Range estimates make uncertainty visible and allow users to decide whether a workflow is economically worth piloting.

## 8. Dependencies & External Integrations

### External Systems
- **EXT-001**: Business system adapter - Supplies approved records through least-privilege read access or controlled draft APIs.

### Third-Party Services
- **SVC-001**: Hosted payment service - Provides signed, idempotent payment events in the configured currency.
- **SVC-002**: Notification service - Sends transactional notifications from a verified domain after operator configuration.

### Infrastructure Dependencies
- **INF-001**: Persistent single-host storage - Stores SQLite, audit events, approvals, jobs, and backups.

### Data Dependencies
- **DAT-001**: Synthetic workflow fixtures - Provide pack-specific QA without real customer or end-user records.

### Technology Platform Dependencies
- **PLT-001**: Node.js and Next.js runtime - Hosts localized public routes, API boundaries, and the background worker.

### Compliance Dependencies
- **COM-001**: Deployer legal review - Determines privacy, retention, marketing, employment, consumer, professional, and sector-specific obligations for each operating region.

## 9. Examples & Edge Cases

```text
Allowed: summarize new inquiries, draft replies, require human send approval, track response time.
Restricted: decide who receives medical care, credit, employment, housing, insurance, or legal advice.
Not qualified: request to issue refunds or publish content automatically without a review gate.
Edge: zero hourly cost returns a labor-value range of zero and no finite payback claim.
Edge: unsupported locale falls back to English; unsupported pack is rejected at the API boundary.
```

## 10. Validation Criteria

- The industry registry and public intake compile under strict TypeScript.
- All registry entries satisfy invariant tests and contain no executable code.
- Six pack identifiers survive an intake-to-specification workflow test.
- Restricted requests cannot enqueue a Codex build without an explicit approved specification.
- Four localized public pages render the pack selector and estimate result without horizontal overflow.
- `pnpm verify` and `pnpm test:e2e` exit with status 0.

## 11. Related Specifications / Further Reading

[Global open-source implementation plan](../plan/feature-global-open-source-platform-v1.md)
[Approval matrix](../docs/approval-matrix.md)
[Production readiness](../docs/production-readiness.md)
