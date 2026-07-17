# syntax=docker/dockerfile:1.7

FROM node:24-bookworm-slim AS build-base

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

WORKDIR /app

FROM build-base AS dependencies

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

FROM build-base AS builder

ARG NEXT_PUBLIC_CHECKOUT_URL=""
ARG NEXT_PUBLIC_DEFAULT_LOCALE="en"
ARG NEXT_PUBLIC_DEMO_MODE="true"
ARG NEXT_PUBLIC_OFFER_CURRENCY="USD"
ARG NEXT_PUBLIC_OFFER_SETUP_MINOR="65000"
ARG NEXT_PUBLIC_OFFER_MONTHLY_MINOR="6500"
ENV NEXT_PUBLIC_CHECKOUT_URL=$NEXT_PUBLIC_CHECKOUT_URL \
    NEXT_PUBLIC_DEFAULT_LOCALE=$NEXT_PUBLIC_DEFAULT_LOCALE \
    NEXT_PUBLIC_DEMO_MODE=$NEXT_PUBLIC_DEMO_MODE \
    NEXT_PUBLIC_OFFER_CURRENCY=$NEXT_PUBLIC_OFFER_CURRENCY \
    NEXT_PUBLIC_OFFER_SETUP_MINOR=$NEXT_PUBLIC_OFFER_SETUP_MINOR \
    NEXT_PUBLIC_OFFER_MONTHLY_MINOR=$NEXT_PUBLIC_OFFER_MONTHLY_MINOR

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:24-bookworm-slim AS runtime-base

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    AUTOPILOT_DB_PATH=/app/var/data/autopilot.db \
    HOSTNAME=0.0.0.0 \
    PORT=3000

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 10001 autopilot \
    && useradd --system --uid 10001 --gid 10001 --home-dir /app --shell /usr/sbin/nologin autopilot \
    && mkdir -p /app/var/data /app/var/backups /app/var/workspaces \
    && chown -R 10001:10001 /app

WORKDIR /app

COPY --chmod=755 docker/entrypoint.sh /usr/local/bin/autopilot-entrypoint

USER 10001:10001
ENTRYPOINT ["autopilot-entrypoint"]

FROM runtime-base AS web

COPY --from=builder --chown=10001:10001 /app/.next/standalone ./
COPY --from=builder --chown=10001:10001 /app/.next/static ./.next/static

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

CMD ["node", "server.js"]

FROM runtime-base AS worker

COPY --from=dependencies --chown=10001:10001 /app/node_modules ./node_modules
COPY --chown=10001:10001 package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY --chown=10001:10001 scripts ./scripts
COPY --chown=10001:10001 src ./src
COPY --chown=10001:10001 docker/healthcheck-worker.mjs ./docker/healthcheck-worker.mjs

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["node", "docker/healthcheck-worker.mjs"]

CMD ["node", "node_modules/tsx/dist/cli.mjs", "scripts/worker.ts"]
