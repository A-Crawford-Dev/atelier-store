# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

Starter for an eCommerce app ("Atelier Store"): Next.js 16 (App Router, `src/` dir, Turbopack), TypeScript, Tailwind CSS v4, Better Auth, Drizzle ORM, Postgres on Neon. The storefront (home page, product pages) reads its catalog from Postgres; there is no cart, checkout or auth UI yet. Better Auth tables are generated (`src/db/auth-schema.ts`, migration `0001_auth`). There is no test runner configured.

## Commands

```
npm run dev            # dev server (Turbopack)
npm run build          # production build — requires DATABASE_URL pointing at a migrated, seeded DB (see below)
npm run lint           # ESLint (flat config, eslint-config-next)
npm run typecheck      # tsc --noEmit

npm run auth:generate  # Better Auth CLI (`auth` devDependency, pinned to the better-auth version) → writes src/db/auth-schema.ts; add --yes to skip prompts
npm run db:generate    # drizzle-kit: create SQL migrations in drizzle/
npm run db:migrate     # apply migrations
npm run db:push        # push schema directly (prototyping)
npm run db:studio      # Drizzle Studio
npm run db:seed        # idempotent sample catalog (src/db/seed.ts via tsx); resets stock quantities
```

Env vars live in `.env.local` (template: `.env.example`): `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`. `drizzle.config.ts` loads `.env.local` then `.env` via dotenv; Next.js loads them itself.

## Architecture

- **Database** — `src/db/index.ts` exports a single `db` built with `drizzle-orm/neon-http` over `@neondatabase/serverless`. It throws at import time if `DATABASE_URL` is missing, which is why `next build` fails without it (the auth route imports `db` during page-data collection). The neon-http driver does not support interactive transactions; switch to `drizzle-orm/neon-serverless` (WebSocket `Pool`) if those are needed.
- **Schema** — `src/db/schema.ts` is the single entry point used by both the runtime `db` client and `drizzle.config.ts`. Every table file must be re-exported from it, or drizzle-kit and the Better Auth adapter won't see it.
- **Auth** — `src/lib/auth.ts` is the server `auth` instance (Drizzle adapter with `provider: "pg"` and the same `schema` object, email/password enabled, `nextCookies()` plugin — keep it last in `plugins`). It is mounted at `src/app/api/auth/[...all]/route.ts` via `toNextJsHandler`. Client code uses `authClient` from `src/lib/auth-client.ts` (`better-auth/react`). In server code, read sessions with `auth.api.getSession({ headers: await headers() })`.
- **Auth tables workflow** — Better Auth's tables (user, session, account, verification) are generated, not hand-written: after changing `auth.ts` options/plugins, run `npm run auth:generate`, make sure `src/db/schema.ts` has `export * from "./auth-schema";`, then `db:generate` + `db:migrate`. Until the auth migration is applied, Better Auth logs "Drizzle schema mismatch / Missing tables" and auth requests fail. Generated auth tables use text ids and `timestamp` (no time zone), unlike the catalog conventions — leave them as generated. Keep the `auth` devDependency at the exact `better-auth` version when upgrading; the old `@better-auth/cli` package is deprecated.
- **Next.js config** — `next.config.ts` enables `cacheComponents` and `partialPrefetching`, and pins `turbopack.root` to this directory (a stray lockfile in the user's home dir otherwise confuses root detection). Tailwind v4 is wired through the `@tailwindcss/turbopack` CSS loader rule; there is no `tailwind.config` file.

## Database conventions

- **Scope** — the catalog is deliberately just categories, products, product images and stock (`src/db/catalog-schema.ts`). Don't add carts, orders, payments, reviews, wishlists or variants unless asked.
- **Read path** — pages and components never import `db`. They call accessors in `src/lib/products.ts` / `src/lib/categories.ts`, which map rows to the UI's `Product` / `Category` shapes; keep those shapes stable rather than leaking row types into components.
- **Caching** — every DB read starts with `"use cache"` + `cacheLife("hours")` + `cacheTag("products")` (otherwise `cacheComponents` needs a `<Suspense>` boundary). After any catalog or stock write, call `revalidateTag("products")`. Cached stock can be up to an hour stale, so anything that gates a purchase (e.g. a future add-to-bag check) must read stock uncached.
- **Modeling** — money is integer minor units (cents) with the app-level `CURRENCY`, never floats/`numeric`. Stock lives in `product_stock` (one row per product; missing row = sold out), not as a column on `products`; it re-keys to variants when those exist. Images are rows in `product_images` ordered by `position` (0 = primary) with fully resolved URLs.
- **Table style** — uuid PKs (`defaultRandom()`), snake_case column names with camelCase TS keys, `timestamptz` `created_at`/`updated_at` (`$onUpdate`), DB `check` constraints for invariants like non-negative price/quantity, explicit `onDelete` on every FK, and `relations()` declared alongside the tables.
- **Migrations** — versioned only: edit schema → `db:generate` → review the SQL → `db:migrate`, and commit `drizzle/`. Don't use `db:push` against shared databases or edit an applied migration. Keep auth tables in their own migration.
- **Writes** — neon-http has no interactive transactions; group multi-statement writes with `db.batch([...])`.
- **Seed** — `db:seed` upserts by slug and resets stock to the sample values. `next build` needs a migrated and seeded DB because `/products/[slug]` `generateStaticParams` must return at least one slug.

## Design system

Minimal luxury-fashion aesthetic: monochrome, square corners, flat surfaces, imagery-led, small uppercase tracked UI labels, regular-weight headings. `src/app/globals.css` only imports Tailwind and three files in `src/styles/`:

- `tokens.css` — raw values as CSS variables on `:root` (re-scoped by the `theme-inverse` utility for black sections), exposed to Tailwind via `@theme inline`. **Tailwind's default color, radius and shadow scales are reset** — `bg-zinc-*`, `rounded-md`, `shadow-*` do not exist. Use the semantic colors (`ink`, `paper`, `surface`, `surface-strong`, `muted`, `subtle`, `line`, `line-strong`, `accent`, `danger`, `success`); always style against tokens, not hex values, so `theme-inverse` keeps working. Fluid spacing tokens `gutter`, `section`, `header` work with any spacing utility (`px-gutter`, `top-header`). Also defines the type scale (`text-base` is 15px), `aspect-product`/`-editorial`/`-hero`, `container-*` widths, and a `3xl` (1920px) breakpoint.
- `base.css` — element defaults (hairline border color, focus ring, selection, 16px form controls on mobile, reduced motion).
- `utilities.css` — `@utility` primitives (usable with variants, e.g. `md:btn-block`): type (`text-label`, `text-display`, `text-heading`, `text-title`, `text-price`), containers (`container-page`/`-content`/`-prose`, `bleed-x`, `section-y`), buttons (`btn` + `btn-primary`/`-secondary`/`-ghost`, sizes `btn-sm`/`btn-lg`, `btn-block`, `btn-icon`), links (`link` for inline copy, `link-reveal` for nav — honors `aria-current="page"`), layout (`grid-products` 2→3→4 cols, `grid-split`, `rail` snap carousel, `media-frame` + `media-cover`). Add new primitives here rather than repeating long class strings.

`theme-inverse` swaps the palette but sets no background: add `bg-paper` for a solid black band, or use it bare for white text/buttons over imagery.

## Storefront

- `src/app/layout.tsx` renders `SiteHeader` / `SiteFooter` around every page. Homepage sections live in `src/components/home/`, composed by `src/app/page.tsx`.
- Products and categories come from Postgres (see Database conventions); `src/lib/catalog.ts` holds static editorial content (nav, hero, collections, campaign, services, footer). Category, listing and service routes don't exist yet.
- Stock state is derived, not stored: `getStockState(stock)` → `in_stock` / `low_stock` (≤ 3) / `sold_out`. Product cards and the PDP both use it.
- Product grids go through `ProductGrid` (hides items that would leave a partial last row in the 3-column tablet range); cards are `ProductCard` (second image fades in on hover).
- **Product detail page** — `src/app/products/[slug]/page.tsx`. `generateStaticParams` prerenders every product (with Cache Components it must return ≥ 1 param; `dynamicParams` is not allowed). Unknown slugs call `notFound()` → `not-found.tsx`; with Cache Components this streams with a 200 status plus `noindex`, which is expected. Includes `generateMetadata` and Product JSON-LD.
- Images are remote Unsplash URLs through `next/image`; `next.config.ts` allows `images.unsplash.com` using the object form of `remotePatterns` (the `new URL()` shorthand rejects query strings and every image 400s). `unsplash()` in `src/lib/images.ts` builds URLs and can zoom into a focal point (imgix `fp-x/fp-y/fp-z`) — PDP detail shots are crops of the lead photo. Use `preload` (not the deprecated `priority`) for above-the-fold images. When choosing photos, check them at full size for visible brand logos/labels.
- Client components: `MobileMenu` (native `<dialog>`), `NewsletterForm` (not wired to a provider) and `ProductGallery` (scroll-position counter). "Add to Bag" is a placeholder button until a cart exists.

Fonts are loaded in `src/app/layout.tsx` with `next/font`: Jost (`font-sans`, default) and Cormorant Garamond (`font-serif`, editorial accents only).
- Path alias: `@/*` → `src/*`.
