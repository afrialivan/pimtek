# AGENTS.md

Fresh `create-next-app` scaffold — App Router, no `src/`, no tests, no CI. All routes live under `app/` (`app/page.tsx`, `app/layout.tsx`, `app/globals.css`).

## Commands

- `npm run dev` — dev server (`next dev`, Turbopack on Next 16)
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — `eslint` (flat config, `eslint-config-next` core-web-vitals + typescript)
- Typecheck: no script defined — run `npx tsc --noEmit`
- No test runner configured; don't add one without asking.

## Quirks

- Stack: Next `16.4.0`, React 19, Tailwind CSS v4, TypeScript (`@/*` maps to repo root via `tsconfig.json`).
- `next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true` — follow Cache Components rules (async pages, explicit `"use cache"` where needed); don't disable these flags to work around errors.
- Tailwind v4: no `tailwind.config.*`; theme is CSS-first via `@import "tailwindcss"` + `@theme inline` in `app/globals.css`. Turbopack CSS loader is wired in `next.config.ts` (`@tailwindcss/turbopack`) — keep it.
- `app/layout.tsx` uses Next 16 typed routes: `LayoutProps<"/">` and `next/font/google` (`Geist`, `Geist_Mono`). Keep `Metadata` export pattern.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
