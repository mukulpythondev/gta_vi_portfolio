# Checks and deployment

## Before you push

```sh
cd web
npm run check      # lint + types
npm run build      # production build
npm test           # browser tests (uses the last build)
npm run verify     # all three in order
```

Tests use Chrome. To use Playwright's own browser instead: `PLAYWRIGHT_CHANNEL=chromium npm test`.

## Deploy on Vercel

1. Import the repo and set **Root Directory** to `web`.
2. Add the environment variable `SITE_URL` = your domain, e.g. `https://mukulrana.dev` (used for the sitemap and link previews).
3. Deploy, add your domain, deploy again.

Security headers and image caching are already set in `web/next.config.ts`.

## Speed (2026-11-14)

Lighthouse, phone settings, middle of 3 runs:

| Page | Score | Main image (LCP) |
| --- | --- | --- |
| Home | 92 | 3.3 s |
| Project page | 92 | 3.4 s |
| Skills | 91 | 3.5 s |

Accessibility, best practices and SEO are 100. To keep it there: keep cover images under 250 KB, only animate `transform`/`opacity`, and load anything heavy only when it is needed.

## Launch checklist

- [ ] `npm run verify` passes
- [ ] All links open (socials, GitHub, demos, certificates)
- [ ] The link preview looks right when you paste the URL in a chat
- [ ] Tried on a real phone
