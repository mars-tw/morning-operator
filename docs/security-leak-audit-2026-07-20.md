# Security leak audit — 2026-07-20

## Executive summary

No critical, high, or medium-confidence credential leak was found in the repository snapshot or reachable Git history. GitHub secret scanning reported zero open alerts. The audit strengthened the local scanner and ignore rules so common credential, key-store, database, and build-artifact mistakes fail before publication.

This result is a repository audit, not proof that a credential was never exposed through another channel. Rotate any credential that is independently suspected of exposure.

## Scope and evidence

- Scanned 121 tracked and untracked, non-ignored files with `pnpm security:secrets`.
- Scanned nine reachable Git commits for high-confidence provider tokens and private-key markers; no matches were found.
- Reviewed sensitive-looking historical paths; only the expected `.env.example` template was present.
- Checked GitHub secret-scanning alerts for the public repository; zero open alerts were returned.
- Checked the working tree with `git diff --check`.
- Ran the full `pnpm verify` quality gate: secret scan, typecheck, 64 tests, production build, smoke flow, and restore check all passed.

No secret values, authentication material, or raw customer data were included in this report or shared with the independent reviewer.

## Resolved hardening items

### LOW-001 — Secret scanner coverage was too narrow

Resolved in `scripts/secret-scan.ts`. The scanner now rejects unexpected environment files, private keys and key stores, database files, common provider credentials, credential-bearing database URLs, hard-coded bearer headers, and generic hard-coded API credentials. Findings contain only the file name and signature category, never the matched value.

### LOW-002 — Ignore rules did not cover several sensitive artifact classes

Resolved in `.gitignore`. Environment files are ignored except for `.env.example`; runtime databases, logs, key stores, build output, Playwright artifacts, and TypeScript build metadata are also excluded.

## Reviewed non-findings

- `.env.example` contains deliberate development placeholders. Production validation rejects the demo password and short session secret.
- `NEXT_PUBLIC_*` values are public locale, offer-display, demo, or checkout-URL configuration; no private credential was found in client code.
- Email-like values found in tests and examples are placeholders, not customer records.
- The readiness preview endpoint validates a strict allowlist, returns `Cache-Control: no-store`, and does not persist its request body.
- Existing public Git history contains one author-email metadata value that is not a GitHub noreply address. History was not rewritten because that would be disruptive; future commits from this working copy use the account's GitHub noreply address.

## Independent Grok review

Grok CLI was restricted to de-identified, credential-free review batches with web search, memory, subagents, writes, and repository tools disabled. Five of six batches completed with no critical or high findings. One UI batch attempted to offload and request repository access, so the run was stopped without widening permissions; a local line-by-line fallback found no environment access, browser storage, logging, unsafe HTML, free-text PII, or unallowlisted event data. Grok's overall leakage conclusion did not block publication.

The only low-risk observations were that the same-origin preset event must retain its existing pack/goal allowlists and that the public preview API intentionally exposes recipe guidance and validation errors. Neither observation disclosed a secret or customer record.

## Verification commands

```text
pnpm security:secrets
pnpm verify
pnpm test:e2e
git diff --check
Git history high-confidence signature scan
GitHub secret-scanning open-alert query
```

The browser suite had previously passed all nine end-to-end tests for the same product changes; this audit changed only repository safeguards and documentation afterward.
