---
goal: Publish a Free Open-Source Project Preview Gallery
version: 1.0
date_created: 2026-07-20
last_updated: 2026-07-20
owner: Morning Operator maintainers
status: 'Completed'
tags: [feature, showcase, github-pages, multilingual, open-source]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

Build and publish a four-locale, dependency-free project showcase with several interactive but non-transactional examples. The gallery lets users evaluate and remix viable website and operations concepts for free while preserving the repository's privacy, payment, claims, and deployment boundaries.

## 1. Requirements & Constraints

- **REQ-001**: Publish four interactive examples: web design studio, appointment microsite, creator product page, and group-buy operations board.
- **REQ-002**: Support English, Traditional Chinese, Japanese, and Spanish throughout the public gallery.
- **REQ-003**: Show each example's audience, fixed scope, free-first host, delivery steps, automation range, owner gates, and monetization scenario without guaranteeing income.
- **REQ-004**: Deploy the gallery from `public/showcase/` to GitHub Pages through a default-branch GitHub Actions workflow.
- **REQ-005**: Keep the gallery usable from the Next.js development server and as standalone static files with relative asset URLs.
- **SEC-001**: Collect no personal data, credentials, payment details, bookings, messages, or customer records.
- **SEC-002**: Make every simulated action explicit; no network request, storage write, live checkout, production booking, or external side effect is permitted.
- **CON-001**: Use GitHub Pages only as an open-source project showcase, not as online-business, e-commerce, or SaaS hosting.
- **CON-002**: Use no third-party runtime dependencies, analytics, remote fonts, or external media in the static gallery.
- **GUD-001**: Use Cloudflare Pages as the documented free-first route for a real commercial static site and Cloudflare Workers for reviewed server-side behavior.
- **PAT-001**: Keep localized copy and project definitions in a deterministic client-side registry and render them through one accessible interaction surface.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Define the research-backed showcase architecture and static verification contract.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `docs/free-preview-gallery.md` with official free-hosting evidence, selection rules, and GitHub Pages usage boundaries. | ✅ | 2026-07-20 |
| TASK-002 | Create `scripts/verify-showcase.mjs` and `tests/showcase.test.ts` to reject data collection, remote runtime dependencies, unsafe sinks, missing locales, and incomplete project definitions. | ✅ | 2026-07-20 |
| TASK-003 | Add `showcase:verify` to `package.json` and the main verification chain. | ✅ | 2026-07-20 |

### Implementation Phase 2

- GOAL-002: Build a distinctive, accessible, four-locale interactive project gallery.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004 | Create `public/showcase/index.html` with semantic navigation, project selection, live preview, execution blueprint, hosting guidance, and prominent synthetic-data disclaimers. | ✅ | 2026-07-20 |
| TASK-005 | Create `public/showcase/styles.css` with the blueprint sample-wall design, responsive layouts, keyboard focus, print behavior, and reduced-motion support. | ✅ | 2026-07-20 |
| TASK-006 | Create `public/showcase/app.js` with four-locale copy, four project definitions, local-only interactions, and downloadable non-PII project briefs. | ✅ | 2026-07-20 |

### Implementation Phase 3

- GOAL-003: Publish the showcase through a reviewable GitHub Pages workflow and prove it works.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-007 | Add `.github/workflows/pages.yml` using the official Pages actions and a `github-pages` deployment environment. | ✅ | 2026-07-20 |
| TASK-008 | Update `README.md`, `README.zh-TW.md`, `docs/deployment.md`, and `CHANGELOG.md` with the source, preview URL, and non-commercial showcase boundary. | ✅ | 2026-07-20 |
| TASK-009 | Run static verification, unit tests, the full repository verification, browser interaction checks, mobile screenshots, secret scanning, and diff checks. | ✅ | 2026-07-20 |
| TASK-010 | Commit, push, open a pull request, merge after all checks pass, enable GitHub Pages Actions publishing, and verify the public URL. | ✅ | 2026-07-20 |

## 3. Alternatives

- **ALT-001**: Export the complete Next.js application to GitHub Pages. Rejected because the application requires SQLite, APIs, webhooks, and a worker and therefore is not a purely static application.
- **ALT-002**: Deploy the showcase first to Cloudflare Pages. Deferred because it requires a separate authenticated account/project; Cloudflare remains the recommended path for real commercial static sites.
- **ALT-003**: Build four separate repositories. Rejected for the first version because one registry and one gallery provide lower maintenance cost and a clearer learning path while preserving copy-and-remix source files.

## 4. Dependencies

- **DEP-001**: Existing public `mars-tw/morning-operator` repository, Apache-2.0 license, and default-branch CI.
- **DEP-002**: GitHub Pages custom-workflow actions: `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4`, and `actions/deploy-pages@v4`.
- **DEP-003**: Existing Node.js, Vitest, Playwright, and secret-scanning toolchain.

## 5. Files

- **FILE-001**: `public/showcase/index.html`, `styles.css`, `app.js`, `.nojekyll`, and `404.html` static gallery assets.
- **FILE-002**: `.github/workflows/pages.yml` GitHub Pages publication workflow.
- **FILE-003**: `scripts/verify-showcase.mjs`, `tests/showcase.test.ts`, and `package.json` validation integration.
- **FILE-004**: `docs/free-preview-gallery.md`, `docs/deployment.md`, `README.md`, `README.zh-TW.md`, and `CHANGELOG.md` public guidance.
- **FILE-005**: `plan/feature-open-source-preview-gallery-v1.md` executable implementation record.

## 6. Testing

- **TEST-001**: Static verifier proves required files, locales, project IDs, disclaimers, relative assets, and zero prohibited collection or network patterns.
- **TEST-002**: Vitest proves the gallery registry is complete and the Pages workflow publishes only the static showcase directory with minimum permissions.
- **TEST-003**: Browser checks prove locale switching, all four examples, simulated interactions, brief download, visible focus, and no page-level overflow at 390 pixels.
- **TEST-004**: `pnpm verify` and `pnpm test:e2e` prove the new static showcase does not regress the application, worker, database, or existing browser flow.

## 7. Risks & Assumptions

- **RISK-001**: GitHub Pages can reject online-business or SaaS hosting; the deployed site must remain a code-project showcase with no data collection or live transactions.
- **RISK-002**: Free-hosting quotas and terms can change; documentation must include verification dates and primary-source links.
- **RISK-003**: A visually realistic mock can be mistaken for production; the persistent banner and action-level notices must clearly identify synthetic preview behavior.
- **ASSUMPTION-001**: Users can evaluate static interaction and source quality before configuring their own provider account, domain, backend, payment flow, or customer data.
- **ASSUMPTION-002**: Relative static assets and dependency-free JavaScript are sufficient for the first public preview gallery.

## 8. Related Specifications / Further Reading

[Free-first deployment guidance](../docs/deployment.md)

[Project recipes](../docs/project-recipes.md)

[GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

[GitHub Pages limits and usage boundaries](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

[Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)

[Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)
