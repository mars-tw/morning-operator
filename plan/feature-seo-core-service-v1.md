---
goal: Make SEO a fixed-scope, multilingual core service and publish a safe interactive preview
version: 1.0
date_created: 2026-07-20
last_updated: 2026-07-20
owner: Morning Operator maintainers
status: 'Completed'
tags: [feature, seo, multilingual, showcase, open-source]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan adds an auditable SEO foundation service to Morning Operator, improves the repository's own technical search foundations, and publishes a synthetic interactive preview without collecting personal data or guaranteeing rankings, traffic, leads, or revenue.

## 1. Requirements & Constraints

- **REQ-001**: Add one versioned SEO foundation recipe to `src/lib/project-recipes.ts` with explicit inputs, outputs, metrics, coverage range, approvals, prohibited actions, setup steps, verification checks, limitations, and a scenario-only revenue model.
- **REQ-002**: Add a multilingual SEO service section to `src/app/[locale]/page.tsx` using English, Traditional Chinese, Japanese, and Spanish copy from `src/i18n/messages.ts`.
- **REQ-003**: Add a dedicated interactive SEO growth lab to `public/showcase/` using only categorical buttons and synthetic output, with no form, network request, browser persistence, URL collection, email collection, or unsafe HTML sink.
- **REQ-004**: Add crawlable metadata, canonical URLs, locale alternates, robots rules, sitemap output, social metadata, and truthful JSON-LD to the Next.js application and static showcase where technically applicable.
- **REQ-005**: Publish the SEO service as a practical public-benefit workflow with a reusable 90-day measurement model based on impressions, qualified clicks, indexed pages, conversions, and manual review.
- **SEC-001**: Do not send customer URLs, query exports, analytics records, customer records, credentials, or unpublished content to an AI provider without an approved design and minimum necessary scope.
- **SEC-002**: Structured data must describe visible, factual content only and must not include fake ratings, reviews, prices, availability, customers, or outcomes.
- **CON-001**: Treat ranking, indexing, traffic, lead, time-saving, and revenue outcomes as scenarios or measurements, never guarantees.
- **CON-002**: Do not implement automated link buying, keyword stuffing, doorway pages, cloaking, fake local listings, bulk unsolicited outreach, or autonomous production publishing.
- **CON-003**: Keep four locale dictionaries type-aligned and keep unsupported locale handling backward-compatible.
- **GUD-001**: Follow current Google Search Central guidance for useful content, descriptive titles, canonicalization, crawlability, sitemaps, and structured data.
- **GUD-002**: Preserve the existing blueprint-style visual identity while making the SEO preview the featured project.
- **PAT-001**: Keep every retryable or external SEO operation outside the static preview and behind existing owner approval records.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Define the SEO product contract and technical metadata foundation.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Add `professional-seo-foundation` to `src/lib/project-recipes.ts` and extend recipe tests with exact safety and measurement assertions. | ✅ | 2026-07-20 |
| TASK-002 | Add `src/lib/site-url.ts`, `src/app/robots.ts`, and `src/app/sitemap.ts` with a validated deployment base URL and four canonical locale URLs. | ✅ | 2026-07-20 |
| TASK-003 | Extend `src/app/layout.tsx` and `src/app/[locale]/page.tsx` metadata with canonical, hreflang, x-default, Open Graph, Twitter, and safe JSON-LD output. | ✅ | 2026-07-20 |

### Implementation Phase 2

- GOAL-002: Publish the multilingual SEO service and interactive preview.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004 | Add four-locale SEO service copy to `src/i18n/messages.ts` and render a visible SEO service section in `src/app/[locale]/page.tsx`. | ✅ | 2026-07-20 |
| TASK-005 | Add a dedicated `#seo-growth-lab` query-routing board, interactive synthetic scenario generator, and translated content to `public/showcase/app.js`, `index.html`, and `styles.css` without changing the four existing project cards. | ✅ | 2026-07-20 |
| TASK-006 | Add `public/showcase/sitemap.xml`, truthful metadata, static JSON-LD, and 404 noindex using the actual GitHub Pages URL; document that a GitHub project subpath cannot control the host-root robots file. | ✅ | 2026-07-20 |

### Implementation Phase 3

- GOAL-003: Document, verify, and publish the change.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-007 | Add `docs/seo-service.md` with the fixed scope, owner approvals, prohibited practices, measurement model, free-first hosting path, and official references. | ✅ | 2026-07-20 |
| TASK-008 | Extend unit and static verification tests for recipe schema, locale parity, metadata, robots, sitemap, JSON-LD, privacy boundaries, four showcase projects, and the independent SEO lab. | ✅ | 2026-07-20 |
| TASK-009 | Run secret scan, typecheck, tests, production build, smoke, restore-check, browser checks, and live preview verification before publication. | ✅ | 2026-07-20 |

## 3. Alternatives

- **ALT-001**: Create many keyword-targeted landing pages immediately; rejected because thin or repetitive pages do not establish useful, maintainable service content.
- **ALT-002**: Add a third-party SEO SaaS dependency; rejected because the public preview must remain credential-free, provider-neutral, and self-hostable.
- **ALT-003**: Promise rankings or lead volume; rejected because search inclusion and commercial outcomes cannot be guaranteed.

## 4. Dependencies

- **DEP-001**: Existing Next.js metadata APIs and file conventions.
- **DEP-002**: Existing four-locale translation catalog and project recipe registry.
- **DEP-003**: Existing dependency-free `public/showcase/` GitHub Pages deployment.

## 5. Files

- **FILE-001**: `src/lib/project-recipes.ts` — versioned SEO service recipe.
- **FILE-002**: `src/lib/site-url.ts`, `src/app/robots.ts`, and `src/app/sitemap.ts` — canonical deployment URL and crawler endpoints.
- **FILE-003**: `src/app/layout.tsx` and `src/app/[locale]/page.tsx` — metadata, JSON-LD, and public SEO service section.
- **FILE-004**: `src/i18n/messages.ts` — aligned four-locale SEO copy.
- **FILE-005**: `public/showcase/` — dedicated SEO growth lab, metadata, 404 noindex, and sitemap.
- **FILE-006**: `tests/` and `scripts/verify-showcase.mjs` — deterministic validation.
- **FILE-007**: `docs/seo-service.md`, `README.md`, `README.zh-TW.md`, and `CHANGELOG.md` — operator and release documentation.

## 6. Testing

- **TEST-001**: Assert the SEO recipe parses, uses a scenario range, requires publishing approval, and prohibits manipulative or autonomous SEO actions.
- **TEST-002**: Assert every locale contains non-empty SEO keys and locale alternates cover `en`, `zh-TW`, `ja`, `es`, and `x-default`.
- **TEST-003**: Assert robots and sitemap expose only intended public routes with absolute validated URLs.
- **TEST-004**: Assert structured data parses as JSON and contains no rating, review, testimonial, guaranteed outcome, email, phone, address, or customer data.
- **TEST-005**: Assert the static showcase retains four project cards, adds the SEO growth lab, and still has no collection surface, network client, persistence, or unsafe HTML sink.
- **TEST-006**: Verify desktop and 390-pixel mobile rendering, keyboard controls, visible focus, reduced motion, and zero browser console errors.

## 7. Risks & Assumptions

- **RISK-001**: A deployment without a correct `AUTOPILOT_BASE_URL` could emit development URLs; require the public origin in production deployment configuration and test the resolver explicitly.
- **RISK-002**: Client-rendered locale changes in the single static showcase are not equivalent to separate localized URLs; do not publish misleading hreflang links for nonexistent pages.
- **RISK-003**: Structured data can become inaccurate as offers change; keep it minimal and derived from visible static copy.
- **ASSUMPTION-001**: The existing GitHub Pages URL remains the public educational preview and commercial deployments use an owner-approved host and domain.

## 8. Related Specifications / Further Reading

[Google Search Essentials](https://developers.google.com/search/docs/essentials)
[Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
[Next.js metadata and Open Graph images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
[Schema.org Service](https://schema.org/Service)
