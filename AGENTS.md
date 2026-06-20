# AGENTS.md

## Project overview

Full-stack monorepo template — Bun, Next.js 15, React 19, Hono, Better Auth, Drizzle ORM, PostgreSQL. Managed with Turborepo.

## Commit conventions

**Format**: `<type>: <description>`

| Type       | When to use                          |
| ---------- | ------------------------------------ |
| `feat`     | New feature                          |
| `fix`      | Bug fix                              |
| `refactor` | Code restructure, no behavior change |
| `docs`     | Documentation only                   |
| `style`    | Formatting, whitespace (no logic)    |
| `test`     | Add or update tests                  |
| `chore`    | Tooling, deps, config                |
| `perf`     | Performance improvement              |

## Commands

```bash
bun dev              # Start all apps in dev mode
bun run build        # Build all workspaces
bun run lint         # ESLint on all workspaces
bun run typecheck    # TypeScript type checking
bun run format       # Prettier formatting
bun run test         # Vitest (run)
bun run test:watch   # Vitest (watch)
```

## Project conventions

- **Runtime**: Bun (not Node). Use Bun-native APIs (`Bun.file()`, `Bun.env`, `Bun.serve()`)
- **Validation**: Zod for runtime validation of env vars, inputs, and API responses
- **Shared packages**: `@workspace/*` scope — internal only, never published
- **Database**: Drizzle ORM for schema and migrations — never write raw SQL
- **Backend**: Hono factory helpers (`createFactory`, `createApp`) for typed middleware and route creation
- **Frontend**: Next.js 15 App Router — Server Components by default, `"use client"` only when needed
- **Routing**: File-based routing with route groups (`(auth)`, `(dashboard)`)
- **Auth protection**: Next.js middleware (cookie-based) + client-side session checks
- **UI**: shadcn/ui components from `packages/ui/` — don't copy into apps. Always check shadcn first before building a component from scratch.
- **Exports**: No default exports — use named exports everywhere
- **Types**: Prefer `type` imports, export types alongside implementations
- **Environment**: `.env` files per app (never hardcode secrets), Zod-validated at startup
- **Testing**: Vitest with coverage via `@vitest/coverage-v8`
- **Test locations**: `__tests__/` directories next to source
- **API testing**: `apps/api` uses `bun test` + `bun:test` imports; other workspaces use `vitest`
- **Package resolution**: Packages export raw `.ts` source (no build step). Bun and Next.js consume TypeScript directly. Next.js uses `transpilePackages`.
- **Drizzle Kit** resolves schemas via `node_modules/@workspace/schemas` symlink.
- **Security**: Manual security headers middleware (CSP, HSTS, etc.) — no helmet library
- **Rate limiting**: In-memory `Map` with `setInterval` cleanup (`.unref()` to not block shutdown)
- **Dependencies**: Pinned to exact versions (`.npmrc` sets `save-exact=true`)
- **TypeScript**: `erasableSyntaxOnly` enabled — no enums, namespaces, or non-type-erasable syntax
- **Client env vars**: Use `NEXT_PUBLIC_` prefix for environment variables exposed to the browser

## Package structure

```
packages/
├── ui/          @workspace/ui        shadcn/ui components + utility hooks
├── schemas/     @workspace/schemas   Drizzle tables + Zod schemas + TS types + file validations
├── db/          @workspace/db        Drizzle client + migration runner + drizzle-kit config
├── auth/        @workspace/auth      Better Auth server instance
├── email/       @workspace/email     EmailSender interface + providers (console, mailpit, resend)
├── logger/      @workspace/logger    Winston (server) + styled console (browser)
└── files/       @workspace/files     S3 storage adapter + upload helper
```

## Next.js conventions

- **App Router**: All routes under `src/app/` with file-based routing
- **Route groups**: `(auth)` for public pages, `(dashboard)` for protected pages
- **Server/Client split**: Pages with forms/interactivity use `"use client"`. Layouts and pages that only render data stay server components.
- **`next/link`**: Always use `next/link` for internal navigation (not `<a>` tags)
- **`next/navigation`**: Use `useRouter`, `useSearchParams`, `usePathname` from `next/navigation` (not `next/router`)
- **Middleware**: `src/middleware.ts` for cookie-based route protection (fast, no DB reads)
- **`NEXT_PUBLIC_`**: Environment variables exposed to the browser must be prefixed with `NEXT_PUBLIC_`
- **`output: "standalone"`**: For production Docker deployment
- **`transpilePackages`**: Workspace packages listed in `next.config.ts` for TypeScript compilation

## Database migrations

```bash
bun --filter @workspace/db generate   # Diff schema → create SQL migration + update snapshot
bun --filter @workspace/db migrate     # Apply all pending migrations
bun --filter @workspace/db studio      # Open Drizzle Studio GUI
```

Tables go in `packages/schemas/src/db/`, re-exported from `packages/schemas/src/index.ts`. The API does NOT auto-migrate on startup.

## What to use when

| When you need to…                    | Use this                                                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Run a server                         | `Bun.serve()` + Hono `fetch` handler                                                                                      |
| Create typed API routes              | `hono/factory` (`createFactory`, `createApp`)                                                                             |
| Validate input / env / API responses | Zod schemas from `@workspace/schemas`                                                                                     |
| Query or mutate the database         | Drizzle client from `@workspace/db`                                                                                       |
| Add a new database table             | `pgTable` in `packages/schemas/src/db/` + re-export                                                                       |
| Authenticate a user / check session  | Better Auth from `@workspace/auth`                                                                                        |
| Send an email                        | `EmailSender` from `@workspace/email`                                                                                     |
| Upload / serve files                 | S3 adapter from `@workspace/files`                                                                                        |
| Log something                        | Winston logger from `@workspace/logger`                                                                                   |
| Fetch data in React                  | TanStack React Query (`useQuery` / `useMutation`)                                                                         |
| Manage form state                    | React Hook Form + Zod resolver                                                                                            |
| Manage global client state           | Zustand stores                                                                                                            |
| Navigate between pages               | `next/link` or `useRouter` from `next/navigation`                                                                          |
| Style a component                    | Tailwind CSS v4 utility classes                                                                                           |
| Add a reusable UI component          | `bun --filter @workspace/ui add <component>` (shadcn/ui install)                                                          |
| Run a one-off script                 | `bun run path/to/script.ts`                                                                                               |
| Add a dev dependency                 | Root `package.json`                                                                                                       |
| Add an app/package dependency        | That workspace's `package.json`                                                                                           |

## Reference docs

### Backend
- [Hono — Getting started with Bun](https://hono.dev/docs/getting-started/bun)
- [Hono — Factory helper](https://hono.dev/docs/helpers/factory)
- [Better Auth — Installation](https://better-auth.com/docs/installation)
- [Better Auth — Drizzle adapter](https://better-auth.com/docs/adapters/drizzle)
- [Drizzle ORM — PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)

### Frontend
- [Next.js — App Router](https://nextjs.org/docs/app)
- [Next.js — Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Next.js — Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js — Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [React 19](https://react.dev/reference/react)
- [TanStack React Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [React Hook Form](https://react-hook-form.com/get-started)
- [Zod](https://zod.dev)
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

### Runtime & tooling
- [Bun](https://bun.sh/docs)
- [Turborepo](https://turbo.build/repo/docs)
- [Docker](https://docs.docker.com)
