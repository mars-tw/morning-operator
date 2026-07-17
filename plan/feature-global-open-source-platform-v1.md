---
goal: Globalize Autopilot HQ and make the repository ready for public open-source self-hosting
version: 1.0
date_created: 2026-07-17
last_updated: 2026-07-17
owner: Autopilot HQ Maintainers
status: 'Completed'
tags: [feature, i18n, open-source, deployment, security]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan converts the Taiwan-only local MVP into a multilingual, self-hostable, contributor-ready open-source application with safe defaults and a reproducible release path.

## 1. Requirements & Constraints

- **REQ-001**: The public experience must support `en`, `zh-TW`, `ja`, and `es` with deterministic English fallback.
- **REQ-002**: Every public locale must have an addressable URL and a visible language switcher.
- **REQ-003**: Intake submissions must retain the selected locale without collecting additional personal data.
- **REQ-004**: The repository must include a permissive open-source license, contribution workflow, code of conduct, support policy, security policy, and GitHub collaboration templates.
- **REQ-005**: A self-hosted installation must run the web process and background worker with persistent application data.
- **REQ-006**: CI must verify types, unit tests, production build, secret scanning, smoke flow, restore integrity, and container buildability.
- **REQ-007**: Payment records and public prices must use ISO 4217 currency identifiers and provider minor units without assuming TWD.
- **SEC-001**: Production startup must reject demo credentials and must not embed secrets in source, images, logs, or sample configuration.
- **SEC-002**: The container must run as a non-root user and expose a health check.
- **SEC-003**: Public demo behavior must never claim that mock payments, preview emails, or generated artifacts are real transactions.
- **CON-001**: SQLite supports one application host with a persistent local volume; horizontal scaling requires a future PostgreSQL adapter.
- **CON-002**: Legal, tax, payment onboarding, privacy disclosures, and data residency remain the deployer's responsibility.
- **CON-003**: No new runtime localization dependency may be introduced for the four static dictionaries.
- **GUD-001**: Preserve the existing operations-ledger visual identity while adapting typography and copy for multiple writing systems.
- **GUD-002**: User-facing text must describe business outcomes and safety boundaries rather than internal implementation details.
- **PAT-001**: Use a typed locale registry, server-side URL validation, and English fallback for missing translation keys.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Establish typed internationalization and localized public routes.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `src/i18n/locales.ts`, `src/i18n/messages.ts`, `src/i18n/translator.ts`, and tests for locale validation, negotiation, and fallback. | ✅ | 2026-07-17 |
| TASK-002 | Move the public product page to `src/app/[locale]/page.tsx` and make `src/app/page.tsx` negotiate `Accept-Language` before redirecting. | ✅ | 2026-07-17 |
| TASK-003 | Update `src/components/lead-form.tsx` to accept localized copy and submit the current locale. | ✅ | 2026-07-17 |
| TASK-004 | Add a keyboard-accessible locale switcher and locale-aware document metadata. | ✅ | 2026-07-17 |
| TASK-005 | Extend the intake contract and persistence schema with a backward-compatible locale field. | ✅ | 2026-07-17 |
| TASK-021 | Replace the TWD-only payment field with ISO currency plus minor-unit storage, migration, formatting, webhook, dashboard, and tests. | ✅ | 2026-07-17 |

### Implementation Phase 2

- GOAL-002: Make installation, deployment, and operations reproducible for global self-hosters.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-006 | Add a multi-stage non-root `Dockerfile`, `.dockerignore`, and container entrypoints. | ✅ | 2026-07-17 |
| TASK-007 | Add `docker-compose.yml` with separate web and worker services sharing a persistent SQLite volume. | ✅ | 2026-07-17 |
| TASK-008 | Add `docs/self-hosting.md` and `docs/production-readiness.md` with secrets, backups, HTTPS, email, payment, and scaling guidance. | ✅ | 2026-07-17 |
| TASK-009 | Add deployment-safe environment validation and document all global configuration in `.env.example`. | ✅ | 2026-07-17 |
| TASK-010 | Extend CI with end-to-end and Docker build jobs while retaining least-privilege permissions. | ✅ | 2026-07-17 |

### Implementation Phase 3

- GOAL-003: Establish a complete open-source governance and contributor workflow.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-011 | Add Apache-2.0 `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, and `SUPPORT.md`. | ✅ | 2026-07-17 |
| TASK-012 | Add issue forms, pull request template, and dependency update automation under `.github/`. | ✅ | 2026-07-17 |
| TASK-013 | Replace the repository README with an English-first multilingual project overview, architecture diagram, quick start, safety boundaries, and contributor links. | ✅ | 2026-07-17 |
| TASK-014 | Add release and changelog guidance without publishing an external release or claiming a live hosted service. | ✅ | 2026-07-17 |
| TASK-015 | Add machine-readable repository metadata and package license fields without making the package publishable by accident. | ✅ | 2026-07-17 |

### Implementation Phase 4

- GOAL-004: Verify the global user path and release readiness.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-016 | Add unit tests for all locale selectors, fallback behavior, localized intake validation, and security boundaries. | ✅ | 2026-07-17 |
| TASK-017 | Update Playwright coverage for root language negotiation, all locale pages, language switching, mobile layout, and the existing admin flow. | ✅ | 2026-07-17 |
| TASK-018 | Run typecheck, unit tests, production build, smoke flow, restore check, secret scan, and end-to-end tests. | ✅ | 2026-07-17 |
| TASK-019 | Build the production container or, if the local Docker engine is unavailable, validate its syntax and rely on the added CI Docker job. | ✅ | 2026-07-17 |
| TASK-020 | Render desktop and mobile pages, inspect locale overflow and accessibility, and correct visual regressions. | ✅ | 2026-07-17 |

## 3. Alternatives

- **ALT-001**: Use a third-party i18n framework; rejected because four static dictionaries do not justify another runtime dependency.
- **ALT-002**: Detect locale only in the browser; rejected because addressable locale routes improve sharing, testing, and server-rendered metadata.
- **ALT-003**: Deploy only to one managed vendor; rejected because an open-source project must remain self-hostable and provider-neutral.

## 4. Dependencies

- **DEP-001**: Next.js App Router dynamic locale segments and server request headers.
- **DEP-002**: Existing Zod contracts and SQLite repository layer.
- **DEP-003**: Docker or another OCI-compatible builder for container verification.
- **DEP-004**: GitHub Actions for public repository verification.

## 5. Files

- **FILE-001**: `src/i18n/**` contains locale types, dictionaries, and negotiation helpers.
- **FILE-002**: `src/app/page.tsx` and `src/app/[locale]/page.tsx` implement locale routing and public rendering.
- **FILE-003**: `src/components/lead-form.tsx`, `src/lib/contracts.ts`, and `src/lib/repository.ts` retain locale through intake.
- **FILE-004**: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, and `docker/**` provide the self-hosted runtime.
- **FILE-005**: Root governance files and `.github/**` define collaboration and automated verification.
- **FILE-006**: `README.md` and `docs/**` explain architecture, deployment, safety, and global use.
- **FILE-007**: `tests/**` verifies the localized and operational paths.

## 6. Testing

- **TEST-001**: `pnpm typecheck` exits with status 0.
- **TEST-002**: `pnpm test` covers four locale registries, negotiation, fallback, contracts, payments, and workflow state.
- **TEST-003**: `pnpm build` produces the production Next.js application.
- **TEST-004**: `pnpm smoke` reaches `delivered` only after both approval gates.
- **TEST-005**: `pnpm restore-check` reports an integral restored database.
- **TEST-006**: `pnpm security:secrets` finds no high-confidence committed secret.
- **TEST-007**: `pnpm test:e2e` verifies public locale routes, form submission, admin login, approvals, and delivery.
- **TEST-008**: `docker build` succeeds locally or in the Docker CI job.
- **TEST-009**: Unit and workflow tests verify USD/TWD/JPY formatting, multi-currency aggregation, and backward-compatible payment storage.

## 7. Risks & Assumptions

- **RISK-001**: Translated commercial claims may not comply with every jurisdiction; deployers must replace sample copy and obtain local advice.
- **RISK-002**: A public repository attracts supply-chain and disclosure traffic; dependency updates and private vulnerability reporting must remain enabled.
- **RISK-003**: SQLite on network filesystems or multiple replicas can corrupt expectations even when the database itself remains integral.
- **RISK-004**: Right-to-left languages are not part of this release and require a later layout audit.
- **ASSUMPTION-001**: English, Traditional Chinese, Japanese, and Spanish cover the initial global demonstration audience.
- **ASSUMPTION-002**: Repository publication and production deployment require the owner's explicit external-account authorization and are not performed by this local implementation.

## 8. Related Specifications / Further Reading

[Existing architecture](../docs/architecture.md)
[Approval matrix](../docs/approval-matrix.md)
[Organization tree](../docs/organization-tree.md)
