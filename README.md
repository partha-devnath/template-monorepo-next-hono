# template-monorepo-next-hono

Production-ready full-stack monorepo template using **Bun**, **Next.js 15**, **React 19**, **Hono**, **Better Auth**, **Drizzle ORM**, and **PostgreSQL**.

## Stack

| Layer         | Technology                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------- |
| Runtime       | [Bun](https://bun.sh)                                                                         |
| Frontend      | [Next.js 15](https://nextjs.org) + [React 19](https://react.dev) + [shadcn/ui](https://ui.shadcn.com) |
| Backend       | [Hono](https://hono.dev)                                                                      |
| Auth          | [Better Auth](https://better-auth.com) — email/password, email verification, password reset   |
| Database      | [PostgreSQL](https://postgresql.org) + [Drizzle ORM](https://orm.drizzle.team)                |
| Forms         | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)                       |
| Data Fetching | [TanStack React Query](https://tanstack.com/query)                                            |
| State         | [Zustand](https://zustand-demo.pmnd.rs)                                                       |
| Logging       | [Winston](https://github.com/winstonjs/winston) + browser console                             |
| Monorepo      | [Turborepo](https://turbo.build/repo)                                                         |
| Styling       | [Tailwind CSS v4](https://tailwindcss.com)                                                    |

## Project structure

```
├── apps/
│   ├── web/              Next.js 15 App Router frontend
│   │   ├── src/
│   │   │   ├── app/          File-based routes (auth, dashboard)
│   │   │   ├── components/   Providers, ErrorBoundary, RouteGuards
│   │   │   ├── hooks/        use-auth, use-user (TanStack Query)
│   │   │   ├── lib/          Auth client (better-auth/react), API fetch wrapper
│   │   │   ├── stores/       Zustand app store example
│   │   │   └── middleware.ts Route protection (cookie-based)
│   │   └── .env.example
│   └── api/              Hono backend
│       ├── src/
│       │   ├── app.ts        Hono app with CORS, auth routes, health check
│       │   ├── index.ts      Entry point (Bun serve)
│       │   └── env.ts        Zod-validated environment
│       └── .env.example
├── packages/
│   ├── ui/               Shared shadcn/ui components
│   ├── schemas/          Drizzle ORM tables + Zod validation schemas + TS types
│   ├── db/               Drizzle client + migration runner
│   ├── auth/             Better Auth server instance
│   ├── email/            Email sender (console, mailpit, resend)
│   ├── files/            S3 storage adapter + upload helper
│   └── logger/           Winston (server) + styled console (browser)
├── docker-compose.yml    PostgreSQL + MinIO + Mailpit + API + web
├── turbo.json
└── package.json
```

## Quick start

### Prerequisites

- [Bun](https://bun.sh) >= 1.3
- [Docker](https://docker.com) (for PostgreSQL, MinIO, Mailpit)

### Setup

```bash
# 1. Clone and install dependencies
git clone <repo-url> my-project
cd my-project
bun install

# 2. Start PostgreSQL + Mailpit + MinIO
docker compose up -d

# 3. Copy environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 4. Edit your .env files (especially BETTER_AUTH_SECRET)
#    Generate a secret: bun -e "console.log(crypto.randomBytes(32).toString('hex'))"

# 5. Generate & run database migrations
bun --filter @workspace/db generate
bun --filter @workspace/db migrate

# 6. Start development servers
bun dev
```

This starts:

- **Frontend** → http://localhost:3000
- **API** → http://localhost:3001
- **Mailpit** → http://localhost:8025

### Available commands

```bash
bun dev              # Start all apps in development mode
bun run build        # Build all packages and apps
bun run lint         # Run ESLint on all workspaces
bun run typecheck    # Run TypeScript type checking
bun run format       # Format code with Prettier

# Database (run from repo root)
bun --filter @workspace/db generate   # Generate Drizzle migrations
bun --filter @workspace/db migrate    # Apply migrations
bun --filter @workspace/db studio     # Open Drizzle Studio
```

## Next.js features

- **App Router** with file-based routing and route groups (`(auth)`, `(dashboard)`)
- **Server Components** for layouts, Client Components (`"use client"`) for interactive pages
- **Middleware** for cookie-based route protection (fast, no DB calls needed)
- **next/link** and **next/navigation** for client-side transitions
- **Route Groups** for shared layouts (public auth layout vs protected dashboard layout)
- **output: "standalone"** for production Docker deployment
- **transpilePackages** for workspace package compatibility

## Bootstrapping a new project

```bash
# 1. Copy to a new folder
cp -r template-monorepo-next-hono my-project
cd my-project

# 2. Rename the root package (edit package.json: "name": "my-project")

# 3. Update the HTML title (edit apps/web/src/app/layout.tsx)

# 4. (Optional) Change DB credentials (edit docker-compose.yml + .env + apps/api/.env)

# 5. Generate a secret for auth
bun -e "const c = require('crypto'); console.log(c.randomBytes(32).toString('hex'))"

# 6. Reinitialize git
rm -rf .git && git init && git add -A && git commit -m "Initial commit from template"

# 7. Install, start services, apply migrations
bun install
docker compose up -d
bun --filter @workspace/db generate
bun --filter @workspace/db migrate
bun dev
```

## Auth flows

| Flow                | Route                       | Status |
| ------------------- | --------------------------- | ------ |
| Sign up             | `/signup`                   | ✅     |
| Email verification  | `/verify-email?token=...`   | ✅     |
| Sign in             | `/login`                    | ✅     |
| Forgot password     | `/forgot-password`          | ✅     |
| Reset password      | `/reset-password?token=...` | ✅     |
| Protected routes    | `/dashboard`                | ✅     |
| API auth middleware | `/api/protected`            | ✅     |

All emails (verification, password reset) are captured by Mailpit in development. View them at http://localhost:8025.

## Database Migrations

```bash
# 1. Add or edit table definitions in packages/schemas/src/db/

# 2. Export the new table from packages/schemas/src/index.ts

# 3. Generate the migration SQL
bun --filter @workspace/db generate

# 4. Apply it
bun --filter @workspace/db migrate
```

## Deployment

### Docker (local)

```bash
docker compose up --build -d
```

Services:
- **web** → http://localhost:3000 (Next.js standalone)
- **api** → http://localhost:3001 (Hono/Bun)
- **postgres** → localhost:5432
- **mailpit** → http://localhost:8025
- **minio** → http://localhost:9001 (console)

### Manual build

```bash
bun --filter api build
bun --filter web build
```

### Environment variables

| Variable               | Required | Description                                            |
| ---------------------- | -------- | ------------------------------------------------------ |
| `DATABASE_URL`         | ✅       | PostgreSQL connection string                           |
| `BETTER_AUTH_SECRET`   | ✅       | 32+ char random string                                 |
| `BETTER_AUTH_URL`      | ✅       | Public URL of API server                               |
| `CLIENT_URL`           | ✅       | Frontend URL (for CORS)                                |
| `PORT`                 |          | API server port (default 3001)                         |
| `LOG_LEVEL`            |          | Winston log level (default "info")                     |
| `EMAIL_PROVIDER`       |          | "console" \| "mailpit" \| "resend" (default "mailpit") |
| `NEXT_PUBLIC_API_URL`  | ✅       | API URL for frontend client                            |

## Reference docs

- [Next.js](https://nextjs.org/docs)
- [Hono](https://hono.dev/docs)
- [Better Auth](https://better-auth.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Bun](https://bun.sh/docs)
- [Turborepo](https://turbo.build/repo/docs)
