# Release process

This document describes a release; it does not authorize publishing to an external registry or hosting provider.

1. Add the real repository and release links after the public remote exists; never publish placeholder URLs.
2. Confirm `CHANGELOG.md` contains the release date and version.
3. Run `pnpm install --frozen-lockfile` and `pnpm verify` from a clean checkout.
4. Run `pnpm test:e2e` and build the `Dockerfile`.
5. Confirm the default configuration starts in explicit demo mode and contains no credential.
6. Create a signed `vMAJOR.MINOR.PATCH` tag from a reviewed commit.
7. Publish release notes summarizing migrations, security changes, and known limitations.
8. Build container images from the tagged commit in CI; do not build release artifacts from an uncommitted workstation.
9. Attach a software bill of materials and image digest when the public registry workflow is enabled.
10. Verify upgrade and rollback against a copy of the database before directing users to update.

External publication, registry login, DNS changes, and production deployment require the repository owner's explicit authorization.
