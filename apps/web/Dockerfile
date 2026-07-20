FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock turbo.json tsconfig.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/

RUN bun install

FROM base AS builder
WORKDIR /app

COPY apps/web/src ./apps/web/src
COPY apps/web/next.config.ts ./apps/web/
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/postcss.config.mjs ./apps/web/
COPY apps/web/public ./apps/web/public
COPY apps/web/components.json ./apps/web/

ENV NEXT_TELEMETRY_DISABLED=1
ENV STANDALONE=1
RUN cd apps/web && bun run build

FROM oven/bun:1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["bun", "apps/web/server.js"]
