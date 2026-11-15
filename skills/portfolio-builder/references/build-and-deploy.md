# Structure, media, build and deploy

## Folder layout

```
web/
  app/
    layout.tsx               fonts, metadata, pre-paint script, <Shell>
    page.tsx                 home
    [section]/page.tsx       every list page from one dynamic route (generateStaticParams)
    [section]/[slug]/page.tsx project and experience detail pages
    opengraph-image.tsx, sitemap.ts, robots.ts, not-found.tsx
    globals.css, styles/*.css
  components/
    shell.tsx                header, footer, mobile dock, overlays, shortcuts ("use client")
    sections.tsx             list page content (server component)
    overlay/                 intro, chapter card, toasts, menu
    scenes/                  hero scene, parallax, signature scene + lazy loader
    project-card.tsx …
  content/                   all facts and theme labels
  lib/                       site-store, toasts, use-modal, use-motion-allowed, project-media
  public/                    projects/<slug>/, gallery/, art/, resume.pdf
  tests/                     Playwright + axe
```

Pages are static. Only the shell, overlays and interactive widgets are client components.

## Media convention

Files are discovered at build time from `public/projects/<slug>/`, so adding a screenshot never needs code:

| File | Use | Spec |
| --- | --- | --- |
| `cover.webp` (or png/jpg/gif) | Card and detail hero | 1600×1000, ≤ 250 KB |
| `clip.mp4` / `.webm` | Demo on the detail page, `preload="none"` | 20–30 s, 1280×720, no audio, ≤ 4 MB |
| `diagram.svg` | "How it works" | optional; otherwise draw from a node list |
| `screen-1.png` … | Extra screens | optional |

```ts
// lib/project-media.ts (server only)
import fs from "node:fs"; import path from "node:path";
const root = path.join(process.cwd(), "public", "projects");
export function projectMedia(slug: string) {
  let files: string[] = [];
  try { files = fs.readdirSync(path.join(root, slug)); } catch {}
  const at = (re: RegExp) => { const f = files.find((n) => re.test(n)); return f ? `/projects/${slug}/${f}` : null; };
  return {
    cover: at(/^cover\.(webp|png|jpe?g|gif|avif)$/i),
    clip: at(/^clip\.(mp4|webm)$/i),
    diagram: at(/^diagram\.(svg|png|webp)$/i),
    screens: files.filter((f) => /^screen-\d+\./.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map((f) => `/projects/${slug}/${f}`),
  };
}
```

Themed art (hero, section banners, OG image) goes in `public/art/**` with a drawn SVG fallback for each slot. Keep the headline side of hero art calm and dark. No text or logos in art. Hero: phone crop at `quality: 75`, desktop at 85, `fetchPriority="high"`.

## Scripts

```json
{
  "engines": { "node": ">=20.9.0" },
  "scripts": {
    "dev": "next dev", "build": "next build", "start": "next start",
    "lint": "eslint .",
    "typecheck": "next typegen && tsc --noEmit",
    "check": "npm run lint && npm run typecheck",
    "test": "playwright test",
    "verify": "npm run check && npm run build && npm test"
  }
}
```

Runtime dependencies: `next`, `react`, `react-dom`, an icon set. Nothing else unless needed.

## Tests (Playwright, desktop and mobile projects)

1. Every route returns 200; unknown routes show the 404.
2. Home has no console errors; hero image decodes.
3. Intro plays once per session, Skip works, never in plain mode.
4. Escape opens/closes the menu; focus returns to the opener.
5. Plain mode hides overlays and stops animation; persists on reload.
6. Reduced motion → no running animations.
7. axe WCAG 2.1 AA scan on home, a list page and a detail page.
8. No horizontal overflow at 375 px.
9. Sitemap, robots, canonical and titles are correct.

## Budgets

| Metric | Limit |
| --- | --- |
| First-load JS (gzip) | ≤ 185 KB per route |
| CSS (gzip) | ≤ 35 KB |
| Phone hero image | ≤ 60 KB |
| Lighthouse mobile, median of 3 | Perf ≥ 90; A11y, Best practices, SEO 100 |
| CLS | < 0.05 |

## Deploy (Vercel)

Root Directory `web`, env `SITE_URL=https://your.domain`, add the domain, redeploy. In `next.config.ts`: `poweredByHeader: false`, security headers (nosniff, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, HSTS), `Cache-Control` for `/art` and `/projects`, AVIF/WebP images.

## Launch checklist

- [ ] `npm run verify` passes
- [ ] All links open
- [ ] OG preview looks right
- [ ] Tested on a real phone
- [ ] README and `docs/content-editing.md` explain how to change content
