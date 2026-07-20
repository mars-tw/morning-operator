---
goal: Guided Project Setup and Commercial Readiness Optimizer
version: 1.0
date_created: 2026-07-20
last_updated: 2026-07-20
owner: Morning Operator maintainers
status: 'Completed'
tags: [feature, project-recipes, readiness, multilingual, safety]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

Turn the strongest repeatable patterns found in the five reviewed student projects into safe, versioned project recipes. Add a multilingual setup optimizer that helps a learner choose a recipe, configure an existing industry pack, verify commercial readiness, and carry safe defaults into the existing approval-gated intake flow without promising income.

## 1. Requirements & Constraints

- **REQ-001**: Publish a static, versioned recipe registry for group buying, IT monitoring, manufacturing watch, community events, and private household administration.
- **REQ-002**: Map every recipe to one of the six existing industry packs and do not introduce a seventh industry pack.
- **REQ-003**: Provide setup steps, free-first deployment guidance, approval points, verification checks, prohibited actions, safe sample inputs, and measurable outcomes for every recipe.
- **REQ-004**: Add a deterministic readiness assessment that separately reports assignment execution, commercial delivery, market potential, and monetization readiness as bounded estimates rather than promises.
- **REQ-005**: Add a four-locale project setup interface that can apply a recipe's safe defaults to the existing intake form.
- **SEC-001**: Hard-block cross-tenant data exposure, anonymous personal-data access, unsigned payment claims, mock transactions presented as real, missing idempotency, and autonomous consequential decisions.
- **SEC-002**: Do not persist readiness answers, personal data, credentials, payment data, or customer records through the public optimizer.
- **SEC-003**: Keep production deployment, real payments, outbound messages, and private-data processing behind the existing approval and verification gates.
- **CON-001**: Keep the application provider-neutral, self-hostable, and able to demonstrate the complete flow without credentials.
- **CON-002**: Preserve backward compatibility for existing intake, pack, payment, project, and job records.
- **GUD-001**: Present priority findings as P0 blockers, P1 delivery gaps, and P2 optimization opportunities with concrete next actions.
- **PAT-001**: Use typed static registries and Zod validation at every new public API boundary.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Encode reusable project recipes and commercial readiness rules.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Add a typed, versioned project recipe registry mapped to the existing industry packs. | ✅ | 2026-07-20 |
| TASK-002 | Add a Zod-validated readiness engine with bounded scoring, priority findings, and hard safety blockers. | ✅ | 2026-07-20 |
| TASK-003 | Add focused unit tests for registry completeness, score ranges, blocker precedence, and safe fixtures. | ✅ | 2026-07-20 |

### Implementation Phase 2

- GOAL-002: Make project selection and optimization easy for learners in all public locales.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004 | Add a no-persistence readiness API that returns validated recipe and assessment results with no-store caching. | ✅ | 2026-07-20 |
| TASK-005 | Build a distinctive, keyboard-accessible project setup optimizer and integrate it into the public page. | ✅ | 2026-07-20 |
| TASK-006 | Apply selected recipe defaults to the existing intake form without bypassing consent or approval gates. | ✅ | 2026-07-20 |
| TASK-007 | Add English, Traditional Chinese, Japanese, and Spanish interface copy without revenue guarantees. | ✅ | 2026-07-20 |

### Implementation Phase 3

- GOAL-003: Verify the vertical slice, responsive layout, and safety behavior.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-008 | Extend Playwright coverage for recipe selection, readiness blockers, intake handoff, locale rendering, and mobile overflow. | ✅ | 2026-07-20 |
| TASK-009 | Run targeted tests, `pnpm verify`, and `pnpm test:e2e`; fix all regressions before completion. | ✅ | 2026-07-20 |
| TASK-010 | Update operator documentation and changelog with the new setup and readiness workflow. | ✅ | 2026-07-20 |

## 3. Alternatives

- **ALT-001**: Copy each student project into the repository. Rejected because their runtimes, security assumptions, and data models conflict, and copying would preserve the weaknesses being removed.
- **ALT-002**: Add each reviewed project as a new industry pack. Rejected because the product deliberately keeps six stable packs; recipes are a safer, more composable layer.
- **ALT-003**: Calculate a single income score. Rejected because assignment quality, commercial operability, market fit, and monetization readiness are different signals and none guarantees revenue.
- **ALT-004**: Automatically deploy or connect real payment accounts from the wizard. Rejected because credentials, legal onboarding, production releases, and money movement require explicit owner action and provider verification.

## 4. Dependencies

- **DEP-001**: Existing industry-pack registry, intake contracts, approval workflow, payment verification, and site deployment registry.
- **DEP-002**: Existing multilingual translator and public page components.
- **DEP-003**: Zod for boundary validation and Vitest/Playwright for verification.

## 5. Files

- **FILE-001**: `src/lib/project-recipes.ts` static versioned recipe registry.
- **FILE-002**: `src/lib/project-readiness.ts` readiness schemas, scores, blockers, and priorities.
- **FILE-003**: `src/app/api/project-readiness/route.ts` no-persistence assessment endpoint.
- **FILE-004**: `src/components/project-setup-optimizer.tsx` guided setup and optimization interface.
- **FILE-005**: `src/components/lead-form.tsx`, `src/app/[locale]/page.tsx`, `src/app/globals.css`, and `src/i18n/messages.ts` integration and localization.
- **FILE-006**: Unit and browser tests under `tests/` plus operator documentation.

## 6. Testing

- **TEST-001**: Registry tests prove every recipe has a valid pack, version, safe boundary, approval points, verification steps, and measurable outcomes.
- **TEST-002**: Readiness tests prove bounded scores, deterministic findings, P0 precedence, and no claim that a score guarantees income.
- **TEST-003**: API tests prove malformed input is rejected and responses are no-store without persisting submitted evidence.
- **TEST-004**: Browser tests prove the wizard renders across four locales, applies safe defaults, remains keyboard-usable, and has no mobile horizontal overflow.
- **TEST-005**: Full verification proves typecheck, unit tests, production build, workflow smoke, backup restore, and browser checks pass.

## 7. Risks & Assumptions

- **RISK-001**: Learners may misread a readiness score as a revenue forecast; the interface separates dimensions and repeats that scores are evidence-based estimates, not earnings promises.
- **RISK-002**: Free hosting and third-party service terms can change; recipes describe deployment classes and route final choices through the maintained provider registry.
- **RISK-003**: A generic checklist can hide industry-specific legal duties; every recipe retains prohibited actions and an owner/legal-review checkpoint where needed.
- **ASSUMPTION-001**: The reviewed patterns are most useful as configuration recipes over the existing delivery factory, not as independent copied applications.
- **ASSUMPTION-002**: A learner can provide yes/no evidence about tests, authentication, privacy, payments, and operations without submitting customer data.

## 8. Related Specifications / Further Reading

[Repository architecture](../docs/architecture.md)

[Approval matrix](../docs/approval-matrix.md)

[Free-first deployment guide](../docs/deployment.md)
