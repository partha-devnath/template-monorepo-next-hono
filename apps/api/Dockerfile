FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock turbo.json tsconfig.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

RUN bun install --frozen-lockfile

COPY . .

RUN bun --cwd apps/api run build

FROM oven/bun:1-slim AS runner
WORKDIR /app

COPY --from=base /app/apps/api/dist ./dist

EXPOSE 3001
CMD ["bun", "dist/index.js"]
