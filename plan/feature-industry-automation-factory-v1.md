---
goal: Implement a safe multi-industry automation service factory with measurable labor-reduction estimates
version: 1.0
date_created: 2026-07-17
last_updated: 2026-07-17
owner: Autopilot HQ Maintainers
status: 'Completed'
tags: [feature, industry-packs, automation, estimates, safety]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-green)

This plan implements the industry-pack architecture defined in `spec/spec-architecture-industry-automation-factory.md` while preserving existing payment, approval, AI sandbox, and self-hosting boundaries.

## 1. Requirements & Constraints

- **REQ-001**: Add six static, typed industry packs with coverage ranges, supported goals, metrics, approvals, prohibited actions, and risk tiers.
- **REQ-002**: Extend public intake and API responses with pack, platform, goal, hourly cost, recoverable-hours range, monthly-value range, and payback range.
- **REQ-003**: Persist new intake fields through forward-only SQLite migrations without removing existing Shopify records.
- **REQ-004**: Generate pack-aware specifications that retain safety boundaries and measurable acceptance criteria.
- **REQ-005**: Render the pack catalog and estimate result in English, Traditional Chinese, Japanese, and Spanish.
- **REQ-006**: Document the pack format and contributor review requirements for open-source extensions.
- **SEC-001**: Restricted industries and autonomous external-action requests must never qualify for the fixed-scope automated build path.
- **SEC-002**: Estimates must be ranges labeled as non-guaranteed and must tolerate zero-value inputs without division errors.
- **SEC-003**: Pack definitions must be static data and must not contain dynamically loaded executable code.
- **CON-001**: Preserve existing public API defaults, database records, payment idempotency, approval gates, and mock vertical slice.
- **CON-002**: Do not claim all industries, jurisdictions, or business models are supported by the six initial packs.
- **GUD-001**: Maintain the operations-ledger visual identity and add one memorable workbench element: a pack selector that changes the visible automation blueprint.
- **PAT-001**: Model every workflow as measure, constrain, draft, approve, execute, verify, and improve.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Implement canonical industry data, scoring, estimates, and persistence.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `src/lib/industry-packs.ts` with six readonly pack definitions, lookup helpers, risk assessment, and invariant checks. | ✅ | 2026-07-17 |
| TASK-002 | Extend `src/lib/contracts.ts` with `industryPack`, `primaryPlatform`, `automationGoal`, `hourlyCostMinor`, new problem/scope values, and range estimate functions. | ✅ | 2026-07-17 |
| TASK-003 | Add backward-compatible lead columns and migrations in `src/lib/db.ts`; update `LeadRow` and `createLead` in `src/lib/repository.ts`. | ✅ | 2026-07-17 |
| TASK-004 | Update `src/app/api/intake/route.ts` to return canonical fit, risk, effort, value, payback, currency, qualification, and disclaimer fields. | ✅ | 2026-07-17 |
| TASK-005 | Update `createSpecification` in `src/lib/repository.ts` to include pack goals, metrics, approval gates, and prohibited actions. | ✅ | 2026-07-17 |

### Implementation Phase 2

- GOAL-002: Build the multilingual industry workbench and value-estimate experience.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-006 | Add all pack, goal, form, estimate, risk, and safety message keys to `src/i18n/messages.ts` for four locales. | ✅ | 2026-07-17 |
| TASK-007 | Redesign `src/app/[locale]/page.tsx` around reusable work, six industry blueprints, and measurable automation outcomes. | ✅ | 2026-07-17 |
| TASK-008 | Refactor `src/components/lead-form.tsx` to collect pack, platform, goal, work volume, current labor, and hourly cost and to render an estimate range. | ✅ | 2026-07-17 |
| TASK-009 | Add responsive workbench, blueprint card, risk badge, and estimate range styles to `src/app/globals.css`. | ✅ | 2026-07-17 |
| TASK-010 | Update metadata, README files, and product wording to describe multi-industry support without universal-income claims. | ✅ | 2026-07-17 |

### Implementation Phase 3

- GOAL-003: Make industry packs safe and extensible for open-source contributors.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-011 | Add `docs/industry-packs.md` with schema, review checklist, examples, prohibited use cases, and contribution rules. | ✅ | 2026-07-17 |
| TASK-012 | Update `AGENTS.md`, `CONTRIBUTING.md`, `docs/approval-matrix.md`, and `docs/organization-tree.md` with pack and risk rules. | ✅ | 2026-07-17 |
| TASK-013 | Add registry, risk, range, migration, and specification tests under `tests/`. | ✅ | 2026-07-17 |
| TASK-014 | Update Playwright tests for pack selection, multilingual estimates, restricted results, and mobile layout. | ✅ | 2026-07-17 |
| TASK-015 | Run complete verification, visual inspection, plan validation, and commit the completed feature. | ✅ | 2026-07-17 |

## 3. Alternatives

- **ALT-001**: Accept arbitrary runtime-uploaded agent templates; rejected because executable community packs would bypass review and supply-chain controls.
- **ALT-002**: Create one universal prompt for every industry; rejected because scope, metrics, risk, and data requirements differ materially.
- **ALT-003**: Promise a fixed savings percentage; rejected because automation coverage depends on input quality, workflow variation, and human review needs.

## 4. Dependencies

- **DEP-001**: Existing Next.js localized routes and typed translation dictionaries.
- **DEP-002**: Existing Zod intake boundary and SQLite repository.
- **DEP-003**: Existing approval-gated job worker and specification workflow.
- **DEP-004**: Configured public offer price and ISO currency minor-unit helpers.

## 5. Files

- **FILE-001**: `src/lib/industry-packs.ts` defines static pack data and risk helpers.
- **FILE-002**: `src/lib/contracts.ts`, `src/lib/db.ts`, `src/lib/repository.ts`, and `src/app/api/intake/route.ts` implement canonical data and estimates.
- **FILE-003**: `src/app/[locale]/page.tsx`, `src/components/lead-form.tsx`, `src/app/globals.css`, and `src/i18n/messages.ts` implement the public experience.
- **FILE-004**: `tests/**` verifies registry, ranges, persistence, specifications, and browser behavior.
- **FILE-005**: `docs/industry-packs.md`, root governance files, and README files explain safe extension and positioning.

## 6. Testing

- **TEST-001**: Registry tests verify six unique packs, valid coverage ranges, supported goals, required approvals, metrics, and prohibited actions.
- **TEST-002**: Contract tests verify qualified low/medium-risk requests and rejected restricted/autonomous requests.
- **TEST-003**: Repository tests verify migrations, retained pack fields, pack-aware specifications, and unchanged approval gates.
- **TEST-004**: Translation tests verify identical message keys across four locales.
- **TEST-005**: Playwright verifies selection, localized results, restricted guidance, and 390px layout.
- **TEST-006**: `pnpm verify` and `pnpm test:e2e` exit with status 0.

## 7. Risks & Assumptions

- **RISK-001**: Users may interpret labor-value estimates as guaranteed profit; the UI, API, docs, and notifications must repeat the non-guarantee boundary.
- **RISK-002**: Generic packs may not match local regulations or specialized operations; restricted and custom requests must stop before automated build.
- **RISK-003**: Too many public fields can reduce completion rate; the form must keep defaults and use plain language.
- **ASSUMPTION-001**: Users can estimate recurring work volume, current time, and an approximate hourly labor cost.
- **ASSUMPTION-002**: Six general packs cover an initial discovery surface while specialized packs remain future reviewed contributions.

## 8. Related Specifications / Further Reading

[Industry automation factory specification](../spec/spec-architecture-industry-automation-factory.md)
[Global open-source implementation plan](feature-global-open-source-platform-v1.md)
[Production readiness](../docs/production-readiness.md)
