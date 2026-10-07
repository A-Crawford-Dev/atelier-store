# Atelier Store

Next.js (App Router, TypeScript, Tailwind CSS v4) with Better Auth, Drizzle ORM and Postgres on Neon.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL` (Neon) and `BETTER_AUTH_SECRET`.
3. Generate the Better Auth tables: `npm run auth:generate`, then add `export * from "./auth-schema";` to `src/db/schema.ts`.
4. Apply the schema: `npm run db:push` (or `db:generate` + `db:migrate`).
5. Start the dev server: `npm run dev`

## Layout

| Path | Purpose |
| --- | --- |
| `src/db/index.ts` | Drizzle client over the Neon serverless HTTP driver |
| `src/db/schema.ts` | Drizzle schema entry point (empty for now) |
| `drizzle.config.ts` | drizzle-kit config; migrations go in `drizzle/` |
| `src/lib/auth.ts` | Better Auth server instance (Drizzle adapter, email/password) |
| `src/lib/auth-client.ts` | Better Auth React client |
| `src/app/api/auth/[...all]/route.ts` | Better Auth route handler |

## Scripts

`dev`, `build`, `start`, `lint`, `typecheck`, `db:generate`, `db:migrate`, `db:push`, `db:studio`, `auth:generate`
