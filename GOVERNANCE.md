# Governance

Autopilot HQ uses a maintainer-led model. Maintainers are responsible for releases, security decisions, roadmap scope, and final review of changes that affect payment handling, personal data, AI execution permissions, or deployment safety.

## Decision process

1. Small fixes may be accepted through a reviewed pull request.
2. New adapters, schema changes, and public API changes require an issue describing the use case and migration path.
3. Security boundaries, approval gates, and privacy defaults require two maintainer approvals when the project has two or more active maintainers.
4. If consensus cannot be reached, the repository owner makes the final decision and records the rationale in the issue or pull request.

## Maintainer expectations

- Review security reports privately and acknowledge them within the window documented in `SECURITY.md`.
- Require passing automated verification before merge.
- Avoid vendor lock-in and disclose maintainer conflicts of interest.
- Never accept real customer data, credentials, or payment details in an issue or pull request.

## Becoming a maintainer

Regular contributors may be invited after sustained, constructive contributions and demonstrated care for the project's safety boundaries. Maintainer access is removed after prolonged inactivity or a serious breach of the code of conduct or security policy.
