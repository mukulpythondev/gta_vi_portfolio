# web/ — the Solara Coast app

Next.js 16 App Router app. Repository overview: [../README.md](../README.md). Full docs: [../docs](../docs/README.md).

## Requirements

- Node.js 20.9 or newer, npm
- For tests: Chrome, or Playwright's Chromium (`PLAYWRIGHT_CHANNEL=chromium`)

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build (prerenders all routes) |
| `npm run start` | Serve the production build |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run typecheck` | Route types + `tsc --noEmit` |
| `npm run check` | Lint + typecheck |
| `npm test` / `test:ui` | Playwright suite (build first) |
| `npm run verify` | check → build → test |
| `npm run art` | Process `../art-raw/*.png` into `public/art/**` and regenerate `lib/art-manifest.ts` |

## Layout

```
app/          routes, layout, metadata, styles/
components/   shell, sections, hud/, world/, cards and widgets
content/      every fact on the site (typed)
lib/          state stores, media/art lookup, audio, helpers
public/       art/, projects/<slug>/, gallery/, resume, photos
scripts/      process-art.mjs
tests/        portfolio.spec.ts
```

## Common tasks

- **Edit your bio, projects or roles:** `content/*.ts` → [content-editing.md](../docs/content-editing.md)
- **Add a project screenshot or clip:** drop `cover.webp` / `clip.mp4` in `public/projects/<slug>/` → [content-editing.md](../docs/content-editing.md#screenshots-and-clips)
- **Phone-only style fix:** `app/styles/mobile.css`
- **Deploy:** Vercel with Root Directory `web`, set `SITE_URL` → [deployment.md](../docs/deployment.md)

## Environment

`SITE_URL` sets the canonical origin (see `.env.example`). On Vercel the production domain is used automatically when it is not set. No secrets are required.

## Notes for AI coding agents

`AGENTS.md` (loaded by `CLAUDE.md`) is written by `next dev`: this Next.js version differs from older training data, so read `node_modules/next/dist/docs/` before using an unfamiliar API.
