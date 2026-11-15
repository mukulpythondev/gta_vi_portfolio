# Frontend concepts in this codebase

A study guide: each concept, what it is in one paragraph, exactly where it is used here, and a small exercise. Read top to bottom; later sections build on earlier ones. Paths are relative to `web/`.

---

## Part 1. Next.js and React fundamentals

### 1. Server and client components

In the App Router, every component is a **server component** unless its file starts with `"use client"`. Server components run at build time, send HTML, and ship **zero JavaScript**. Client components hydrate in the browser and can use state, effects and event handlers.

- Server: `components/sections.tsx`, `app/page.tsx`, `components/world/ocean-drive.tsx` (it has no hooks, so it could be either).
- Client: `components/shell.tsx`, everything in `components/hud/`, `components/explain-toggle.tsx`.

Rule of thumb used here: keep the client boundary as low in the tree as possible. The home page is a server component that renders small client islands.

*Exercise:* add `console.log("hi")` to `sections.tsx` and run `npm run build`. The log appears in the terminal, never in the browser.

### 2. Static generation with dynamic routes

`app/[section]/page.tsx` serves every list page from **one file**. `generateStaticParams()` returns `[{ section: "about" }, { section: "missions" }, …]`, so Next prerenders each one to HTML at build time. `[section]/[slug]` does the same for detail pages. In Next 16 `params` is a **Promise** (`const { section } = await params;`).

*Exercise:* run `npm run build` and read the route table: `●` means "prerendered from generateStaticParams".

### 3. Metadata, OG images, sitemap, JSON-LD

- `export const metadata` in `app/layout.tsx` with a `title.template` ("%s | Mukul Rana").
- `generateMetadata()` in dynamic routes for per-page titles and canonical URLs.
- `app/opengraph-image.tsx` renders the social card from JSX at build time.
- `app/sitemap.ts`, `app/robots.ts` are code, so they list every route automatically.
- A `<script type="application/ld+json">` describes a schema.org `Person` for search engines.

### 4. `next/font`

`app/layout.tsx` loads four Google fonts. Next downloads them at build time, **self-hosts** them (no request to Google), sets `font-display: swap`, preloads them, and exposes each as a CSS variable (`--font-display` …) used throughout the CSS.

*Lesson learned here:* turning off preload for two fonts made Lighthouse worse, because late font swaps re-laid out the hero. Measure before "optimising".

### 5. `next/image` and art direction

`components/world/hero-art.tsx` uses `getImageProps()` to build two responsive `srcset`s and puts them in a `<picture>`: a portrait crop for phones (`<source media="(max-width: 700px)">`, quality 75) and a landscape one for desktop (quality 85). `fetchPriority="high"` + `loading="eager"` tell the browser this is the LCP image. `next.config.ts` enables AVIF/WebP output.

### 6. View Transitions

`app/layout.tsx` wraps pages in React's `<ViewTransition default="page-swap">`. On client navigation the browser snapshots old and new pages and animates between them with CSS (`::view-transition-old/new`). This is why lazy pieces avoid Suspense: suspending mid-transition stalls it.

### 7. Code splitting

Three levels:

1. **Per route**: automatic.
2. **`next/dynamic`** for dialogs (`shell.tsx`: `PauseMenu`, `MainMenu`, `QuickTravel`, `Terminal`, `AudioSettings`): their code downloads the first time they open.
3. **Plain `import()`** on demand: the footer street (`world/lazy-ocean-drive.tsx`).

*Exercise:* in DevTools → Network → JS, open the pause menu (Esc) and watch a new chunk arrive.

---

## Part 2. State without a state library

### 8. `useSyncExternalStore` stores

`lib/game-store.ts`, `lib/toasts.ts` and `lib/use-motion-allowed.ts` keep state in a plain module variable plus a `Set` of listeners, and expose it through React's `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`. Any component can read it; `updateGame()` notifies all of them. The server snapshot returns defaults, so server HTML never depends on `localStorage` and hydration stays consistent.

### 9. Persisting to `localStorage` safely

`read()` in `game-store.ts` validates every field (types, ranges, array lengths) because storage is user-editable input, and every access is in `try/catch` so private browsing and blocked storage still work.

### 10. A window event bus

`lib/events.ts` is three lines: `window.dispatchEvent(new CustomEvent("solara:panel", { detail: "pause" }))`. The shell listens once. Any component, even deep in a server-rendered page, can open a menu without prop drilling or context.

### 11. A queue with timing rules

`lib/toasts.ts` shows one toast at a time, holds them for 3.5 s after a page load and while a dialog or the boot screen is open, dedupes by title, and drops the oldest hint when full. It is a good example of modelling **UX rules as data and timers** instead of scattering `setTimeout`s across components.

---

## Part 3. CSS architecture

### 12. Design tokens with custom properties

`app/styles/tokens.css` defines every colour, glow, radius, easing and spacing value as `--variables`. A night palette is just `:root[data-time="night"] { --sky-top: …; }` overriding a few. Tailwind 4 is bridged with `@theme inline` so utilities use the same tokens.

### 13. Cascade by file order

`app/globals.css` imports CSS files in a deliberate order; later files win on equal specificity. Phone fixes are in `mobile.css`, imported last, so they override everything without `!important`.

### 14. State as `data-` attributes

Mode, motion, explain level, time of day and boot state are attributes on `<html>` (`data-mode="recruiter"` …). CSS reacts with attribute selectors. The **pre-paint script** in `layout.tsx` sets them from `localStorage` before the first frame, so there is never a flash of the wrong mode. `suppressHydrationWarning` on `<html>` tells React the attributes were changed on purpose.

*Exercise:* in DevTools, edit `<html data-mode="game">` to `recruiter` and watch the HUD vanish with no JavaScript.

### 15. Fluid sizing with `clamp()`

`font-size: clamp(48px, 9vw, 120px)` means "9% of the viewport width, but never under 48 or over 120". Used for headlines, the footer scene height, gutters (`--gutter: clamp(18px, 4vw, 56px)`).

### 16. "Explain it simply / technically"

`<Say plain="…" tech="…">` renders both texts; `[data-explain="plain"] .say-tech { display: none }` (and vice versa) shows one. The toggle only flips one attribute, so it is instant and works on server-rendered content.

---

## Part 4. Animation and performance

### 17. Compositor-only animation

Browsers render in stages: style → layout → paint → composite. Animating `transform` and `opacity` skips straight to composite (cheap, often on the GPU). Animating `height`, `box-shadow`, `top` re-runs layout or paint every frame. In this pass:

- the radio equalizer moved from `height` to `transform: scaleY()` (`base.css`);
- the "Press start" glow moved from animating `box-shadow` to fading a pre-painted `::after` with `opacity` (`overlays.css`).

*Exercise:* DevTools → Rendering → Paint flashing. Hover cards and watch which areas flash.

### 18. `requestAnimationFrame` loops that sleep

`components/world/parallax.tsx` eases each scene layer toward the pointer (`px += (tx - px) * 0.08`) and writes `translate3d` directly to each layer's `style`. It only requests another frame while the layers are still moving and the hero is on screen, so an idle page uses no CPU.

### 19. IntersectionObserver, three ways

- **Reveal on scroll** (`hud/scroll-reveal.tsx`): one shared observer marks elements `data-reveal="in"` once, then unobserves them.
- **Lazy load** (`world/lazy-ocean-drive.tsx`): load a chunk when an element is 900 px away.
- **Pause off screen** (`hud/offscreen-pause.tsx`): toggle `data-offscreen`, and CSS sets `animation-play-state: paused`.

### 20. Respecting motion preferences

Three independent switches: the OS setting (`@media (prefers-reduced-motion: reduce)` and `matchMedia` in `use-motion-allowed.ts`), the site's motion toggle (`data-motion="off"`), and Recruiter mode. Every looping animation checks all three.

### 21. SVG as an illustration engine

All scenes are SVG built in React: `viewBox` for a resolution-independent coordinate system, `preserveAspectRatio="xMidYMax slice"` for cover-style cropping, gradients and masks (`ocean-drive.tsx`'s striped sun is a `<mask>` of horizontal bars), repeated shapes merged into one `<path>`, and a **seeded random generator** so the "random" city is identical on every render. Full walkthrough: [footer-car-animation.md](footer-car-animation.md).

### 22. Measuring performance

Lab: Lighthouse (median of three runs), DevTools Performance panel, a Playwright script with CPU throttling reading `largest-contentful-paint` entries from a `PerformanceObserver`. Field: Core Web Vitals from real users after launch. See [../deployment.md](../deployment.md).

---

## Part 5. Accessibility

### 23. Native `<dialog>`

`dialog.showModal()` gives a focus trap, Escape to close, an inert background and the top layer for free. `lib/use-modal.ts` remembers which element opened it and restores focus on close.

### 24. Announcements and hidden decoration

- Toasts live in `aria-live="polite"` so screen readers announce them without interrupting.
- Scenes and the mission intro card are `aria-hidden="true"`: decoration that repeats what the page heading already says.
- A skip link (`.skip-link` → `#main`) is the first focusable element.

### 25. Keyboard shortcuts done right

`shell.tsx` ignores keys when focus is in an `input`, `textarea` or `contenteditable`, and only enables game shortcuts in Game mode.

### 26. Automated a11y tests

`tests/portfolio.spec.ts` runs axe WCAG scans on representative pages at desktop and phone sizes, checks focus restoration after closing dialogs, and checks reduced-motion styles.

---

## Part 6. Shipping

### 27. Security and caching headers

`next.config.ts` sends `nosniff`, `X-Frame-Options: DENY`, a strict referrer policy, a Permissions-Policy that disables camera/mic/geolocation, HSTS and COOP on every route, and long-lived `Cache-Control` for art and photos.

### 28. Safe links from data

`content/socials.ts` → `safeHref()` only lets `https:`, `mailto:` and site-relative links through, so a typo like `javascript:` in content can never reach the page.

### 29. A file-based media convention

`lib/project-media.ts` reads `public/projects/<slug>/` with Node's `fs` at build time. Dropping `cover.webp` into a folder is the whole "CMS". See [../content-editing.md](../content-editing.md#screenshots-and-clips).

---

## Suggested learning path

1. Week 1: Part 1 and 3. Change a token, add a project, add a page section.
2. Week 2: Part 2. Write a tiny `useSyncExternalStore` counter store and persist it.
3. Week 3: Part 4. Rebuild the footer street from scratch following the walkthrough, then measure it with Paint flashing.
4. Week 4: Part 5 and 6. Add a dialog with focus restore, write one Playwright + axe test, deploy a preview.
