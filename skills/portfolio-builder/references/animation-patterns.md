# Motion patterns

Theme-neutral building blocks. Each one is a structure; the theme sheet decides how it looks (a curtain, a manuscript, a boot log, a coin slot).

**Gate every pattern** on one hook and one set of CSS rules:

```ts
// lib/use-motion-allowed.ts
export function useMotionAllowed() {
  const state = useSite();                 // templates/site-store.ts
  const reduced = useReducedMotion();      // matchMedia("(prefers-reduced-motion: reduce)")
  return state.mode === "themed" && state.motion && !reduced;
}
```

```css
:root[data-motion="off"] .scene *, :root[data-mode="plain"] .scene * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .scene * { animation: none !important; } }
[data-offscreen], [data-offscreen] * { animation-play-state: paused !important; }
```

| # | Pattern | Level |
| --- | --- | --- |
| 1 | Pre-paint mode script | all |
| 2 | Scroll reveal | Calm+ |
| 3 | Intro screen | Story+ |
| 4 | Chapter card between pages | Story+ |
| 5 | Notification queue | Story+ |
| 6 | Parallax hero | Story+ |
| 7 | Signature scene (looping band) | Story+ |
| 8 | Off-screen pause | Story+ |
| 9 | Menu overlay + shortcuts | Immersive |
| 10 | Persistent overlay (progress / index / map) | Immersive |
| 11 | Collectibles and easter egg | Immersive |

---

### 1. Pre-paint mode script

`templates/prepaint-script.ts`, inlined in `<head>`. Sets `data-mode`, `data-motion`, `data-explain` and `data-intro="done"` on `<html>` before first paint, so plain-mode visitors and returning visitors never see a flash. Add `suppressHydrationWarning` to `<html>`.

### 2. Scroll reveal

One shared `IntersectionObserver` marks blocks `data-reveal="in"` once, then unobserves. Blocks already on screen are revealed immediately. The hidden state is CSS-only and applies only when motion is allowed, so nothing can get stuck hidden. Animate the `translate` property so it does not fight `transform` hovers.

```css
:root[data-motion="on"]:not([data-mode="plain"]) [data-reveal=""] { opacity: 0; }
:root[data-motion="on"]:not([data-mode="plain"]) [data-reveal="in"] {
  animation: reveal-in 720ms var(--ease-snap) backwards;
  animation-delay: calc(var(--reveal-i, 0) * 90ms);
}
@keyframes reveal-in { from { opacity: 0; translate: 0 36px; } }
```

Theme it with the entrance: rise (default), unfurl (`clip-path: inset(0 0 100% 0)` → `inset(0)`), zoom (`scale: 1.15`), slide-in panels.

### 3. Intro screen

First visit per session only. Server-rendered full-screen layer, hidden by `:root[data-intro="done"] .intro { display: none }`. Shows the theme's opening (curtain, title card, boot log, manuscript), a short progress (≈0.9 s, wait for `document.fonts.ready`), a start button and Skip. On start: write `sessionStorage`, fade out (opacity 650 ms), set `data-intro="done"`. Never in plain mode or with reduced motion.

Pulsing call-to-action, cheap version (fade a pre-painted glow instead of animating `box-shadow`):

```css
.start-button { position: relative; }
.start-button::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  box-shadow: 0 0 16px var(--accent), 0 0 50px var(--accent-2);
  opacity: 0; animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse { 50% { opacity: 1; } }
```

### 4. Chapter card between pages

On client navigation to a section, show a 1.5–1.7 s card: section number, themed name, title, one-line objective. Once per route per session, skip the first page load, dismiss on any key or click, `aria-hidden` (the page heading has the same text). Cinematic version: two bars scale in from top and bottom:

```css
.bars { animation: bars 1700ms var(--ease-cine) forwards; }
.bars.top { transform-origin: top; } .bars.bottom { transform-origin: bottom; }
@keyframes bars { 0%, 100% { transform: scaleY(0); } 15%, 85% { transform: scaleY(1); } }
```

Theme variants: film clapper, scroll unrolling, comic panel, "LEVEL 2" screen.

### 5. Notification queue

`templates/toasts.ts`: one visible at a time, max 3 queued, held 3.5 s after page load and while the intro or any `dialog[open]` is showing, 4.5 s on screen, deduped by title. Container `aria-live="polite"`, dismiss button on each. Themed labels: "New area discovered", "Scene unlocked", "Chapter complete", "Achievement".

### 6. Parallax hero

`templates/parallax.tsx`. Layers with classes like `.layer-sky`, `.layer-far`, `.layer-near` move with pointer and scroll. One rAF loop eases toward the pointer and writes `translate3d` to each layer; it stops requesting frames when settled or scrolled away. Never animate a CSS variable on the parent.

### 7. Signature scene

A looping illustrated band (usually the footer, sometimes the hero) that makes the theme memorable: cars on a coast road, marquee lights, a sprite running, lamps along a bridge, rain over a skyline.

- One `<svg viewBox="0 0 1600 640" preserveAspectRatio="xMidYMax slice">` so it crops like `object-fit: cover` and keeps the ground visible on phones.
- Moving objects are `<g>` groups animated with `transform` only, from off-screen to off-screen, `linear infinite`. Negative `animation-delay` spreads them out from the first frame.
- Put the CSS animation on an outer group and the SVG placement `transform` on an inner group (CSS transforms replace SVG transform attributes).
- Merge repeated shapes (windows, stars, bulbs) into one `<path>`. Use a seeded random generator so the scene is identical on every render.
- Load it with `templates/lazy-scene.tsx` (dynamic `import()` when within ~900 px), with a same-size gradient placeholder.

`templates/footer-scene.tsx` + `.css` is a working example (vehicles on a road); swap the shapes for the theme's motif.

### 8. Off-screen pause

`templates/offscreen-pause.tsx` toggles `data-offscreen` on every scene root; CSS pauses its animations.

### 9. Menu overlay + shortcuts

Native `<dialog>` with `showModal()` (focus trap, Escape, top layer). Restore focus to the opener on close. Load with `next/dynamic`. Open from anywhere with a window event: `dispatchEvent(new CustomEvent("site:panel", { detail: "menu" }))`. Shortcuts (`Esc` menu, `M` index/map) ignore keys typed into inputs. Theme it: pause menu, interval card, table of contents, command palette.

### 10. Persistent overlay

A small fixed element showing progress: districts visited, chapters read, scenes unlocked. Store progress in `templates/site-store.ts`. Bottom dock on phones.

### 11. Collectibles and easter egg

Achievements about the *visitor's* exploration (visited every page, read every project, found the secret), never career claims. Easter egg: Konami code or a hidden key opens an allow-listed command box. Never evaluate input.

## Cost rules

- Loops animate only `transform` and `opacity`. One-shot entrances may use `clip-path` or `filter`.
- No full-screen `mix-blend-mode`, no `backdrop-filter` outside dialogs, no SVG turbulence filters. Textures (grain, paper, CRT) are small tiled PNGs.
- Overlays are dynamic imports; below-fold scenes load near the viewport.
