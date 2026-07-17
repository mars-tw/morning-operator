---
goal: Free Sales and Promotional Website Launch Center
version: 1.0
date_created: 2026-07-17
last_updated: 2026-07-17
owner: Morning Operator maintainers
status: 'Completed'
tags: [feature, deployment, website, multilingual, provider-neutral]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

Add a multilingual, approval-gated website launch workflow that helps a user request a sales or promotional website, selects a compatible free-first hosting target, carries the selection into the delivery specification, and never deploys production without an owner approval.

## 1. Requirements & Constraints

- **REQ-001**: Add `website_launch` as a supported automation goal in all six existing industry packs without adding a seventh pack.
- **REQ-002**: Accept a validated site type and deployment target through the public intake API while preserving safe defaults for legacy clients.
- **REQ-003**: Publish a provider-neutral deployment registry covering Cloudflare Pages, Cloudflare Workers, Firebase Hosting, Google Cloud Run, GitHub Pages, and source-only delivery.
- **REQ-004**: Recommend Cloudflare Pages for static commercial landing sites and reject GitHub Pages as a target for commercial sales sites.
- **REQ-005**: Add a four-locale public launch planner and conditional website fields to the existing intake form.
- **REQ-006**: Store website requirements in SQLite and include them in the approval-gated delivery specification.
- **SEC-001**: Treat all public website requirements as untrusted data and never include raw customer notes in AI build instructions.
- **SEC-002**: Require the existing production deployment approval; do not add direct provider authentication or production deployment calls.
- **CON-001**: Keep all provider adapters optional and keep the credential-free mock vertical slice working.
- **CON-002**: Describe free allowances as current limits, not permanent guarantees, and link official provider documentation.
- **GUD-001**: Use GitHub as a source repository and CI origin for commercial sites, not GitHub Pages hosting.
- **PAT-001**: Represent provider capabilities in a static, typed, reviewable registry with deterministic compatibility rules.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Add the typed deployment domain and persist it through intake and specifications.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `src/lib/site-deployment.ts` with provider IDs, site types, compatibility states, official documentation links, and `recommendSiteDeployment`. | ✅ | 2026-07-17 |
| TASK-002 | Extend `src/lib/contracts.ts`, `src/lib/industry-packs.ts`, `src/lib/db.ts`, and `src/lib/repository.ts` with `website_launch`, `siteType`, and `deploymentTarget`, including backward-compatible defaults. | ✅ | 2026-07-17 |
| TASK-003 | Add specification text that records the selected hosting path, free-tier caveat, static or dynamic runtime, source-repository role, and production approval boundary. | ✅ | 2026-07-17 |

### Implementation Phase 2

- GOAL-002: Deliver a multilingual public planning interface and operator documentation.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004 | Create `src/components/site-launch-planner.tsx` and render it from `src/app/[locale]/page.tsx` with responsive, keyboard-accessible provider routing. | ✅ | 2026-07-17 |
| TASK-005 | Extend `src/components/lead-form.tsx` and `src/i18n/messages.ts` so website launch requests select a site type and compatible target in English, Traditional Chinese, Japanese, and Spanish. | ✅ | 2026-07-17 |
| TASK-006 | Replace `docs/deployment.md` with verified free-first hosting guidance and update `README.md`, architecture, approval, and changelog references. | ✅ | 2026-07-17 |

### Implementation Phase 3

- GOAL-003: Prove validation, compatibility, persistence, layout, and safety gates.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-007 | Add focused unit tests for provider recommendation, incompatible GitHub Pages commercial intake, defaults, registry completeness, and specification persistence. | ✅ | 2026-07-17 |
| TASK-008 | Extend browser tests for the four-locale launch planner, website fields, recommendation behavior, and mobile overflow. | ✅ | 2026-07-17 |
| TASK-009 | Run `pnpm verify`, `pnpm test:e2e`, secret scanning, diff checks, and commit only reviewed source and documentation files. | ✅ | 2026-07-17 |

## 3. Alternatives

- **ALT-001**: Deploy every generated site directly from Morning Operator. Rejected because production deployment and provider credentials require explicit owner authorization and provider-specific account setup.
- **ALT-002**: Use GitHub Pages as the default free host. Rejected because GitHub prohibits using Pages as free hosting for an online business or e-commerce site.
- **ALT-003**: Add Vercel Hobby as a commercial default. Rejected because its current Hobby terms are positioned for personal, non-commercial use.

## 4. Dependencies

- **DEP-001**: Existing Next.js public page, intake API, SQLite repository, specification approval, Codex build, QA, and deployment approval workflow.
- **DEP-002**: Official Cloudflare, GitHub, Firebase, and Google Cloud documentation used to maintain deployment metadata.

## 5. Files

- **FILE-001**: `src/lib/site-deployment.ts` typed provider registry and recommendation logic.
- **FILE-002**: `src/components/site-launch-planner.tsx` public interactive launch planner.
- **FILE-003**: `src/lib/contracts.ts`, `src/lib/industry-packs.ts`, `src/lib/db.ts`, and `src/lib/repository.ts` intake and persistence changes.
- **FILE-004**: `src/components/lead-form.tsx`, `src/app/[locale]/page.tsx`, `src/app/globals.css`, and `src/i18n/messages.ts` localized user experience.
- **FILE-005**: `docs/deployment.md`, related project documentation, and `CHANGELOG.md`.
- **FILE-006**: Unit and Playwright tests under `tests/`.

## 6. Testing

- **TEST-001**: Unit tests prove deterministic free-first recommendations and GitHub Pages incompatibility for commercial sites.
- **TEST-002**: Contract and repository tests prove legacy defaults, boundary validation, persistence, and approved specification content.
- **TEST-003**: Browser tests prove localized planner visibility, conditional intake fields, accessible controls, and mobile layout.
- **TEST-004**: Full verification proves secret scan, typecheck, tests, production build, workflow smoke, backup restore, and browser checks pass.

## 7. Risks & Assumptions

- **RISK-001**: Provider free tiers and terms can change; every displayed allowance includes a verification date and official link.
- **RISK-002**: A generated website may need paid services for traffic, domains, email, databases, or regulated content even when static hosting is free.
- **RISK-003**: Incorrectly exposing deployment credentials would create a production risk; this feature stores provider IDs only and performs no live deployment.
- **ASSUMPTION-001**: Most initial sales and campaign pages can ship as static assets with hosted checkout links or approved external forms.
- **ASSUMPTION-002**: Users requiring authenticated APIs, private data, or server-side transactions will accept a dynamic target with billing safeguards and owner review.

## 8. Related Specifications / Further Reading

[Repository architecture](../docs/architecture.md)

[Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)

[Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/)

[GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

[Firebase pricing](https://firebase.google.com/pricing)

[Google Cloud Run pricing](https://cloud.google.com/run/pricing)
