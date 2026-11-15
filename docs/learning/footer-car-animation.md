# How the footer car animation works

The cars that cruise along the coast road at the bottom of every page are **pure SVG + CSS**. No JavaScript moves them, no canvas, no animation library. JavaScript is only used to *load* the scene at the right moment and to *pause* it when nobody can see it.

Files involved:

| File | Role |
| --- | --- |
| `web/components/shell.tsx` | Puts the scene inside the `<footer>` |
| `web/components/world/lazy-ocean-drive.tsx` | Loads the scene only when you scroll near the footer |
| `web/components/world/ocean-drive.tsx` | Draws the whole street as one SVG, including the cars |
| `web/app/styles/game.css` | Sizes the scene and defines the car keyframes |
| `web/app/styles/ux.css`, `feedback.css` | Shorter scene on inner pages, placeholder gradient |
| `web/components/hud/offscreen-pause.tsx` | Pauses the cars when the footer is off screen |
| `web/app/styles/mobile.css` | Phone layout for the footer text (the scene itself scales on its own) |

---

## Step 1. The footer reserves a band for the scene

In `shell.tsx` the footer's first child is the scene:

```tsx
<footer className={`footer${path === "/" ? "" : " footer-short"}`}>
  <LazyOceanDrive className="footer-scene" />
  {/* …call to action, name block, links… */}
</footer>
```

`game.css` gives the footer a CSS variable for the scene height and pushes the text down by that much:

```css
.footer {
  --scene-h: clamp(300px, 34vw, 480px);   /* fluid: 300px on phones, 480px max */
  padding: calc(var(--scene-h) + 28px) … 120px;
}
.footer .ocean-drive {
  inset: 0 0 auto 0;        /* pinned to the top of the footer */
  height: var(--scene-h);
}
.footer > :not(.ocean-drive) { position: relative; z-index: 1; }  /* text above the scene */
```

`ux.css` makes it shorter everywhere except home: `.footer.footer-short { --scene-h: clamp(180px, 18vw, 270px); }`. Changing one variable resizes the scene *and* the padding, because both read it.

**Concept:** CSS custom properties scoped to a component, `clamp()` for fluid sizing.

## Step 2. Load it only when it is about to be seen

The street is decorative and far down the page, so it is not part of the first download. `lazy-ocean-drive.tsx` renders an empty `<div>` with the same class (so it takes the same space and shows a sunset gradient from `feedback.css`), and watches it:

```tsx
const observer = new IntersectionObserver(
  (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      void load();                      // import("./ocean-drive")
    }
  },
  { rootMargin: "900px 0px" },          // start 900px before it scrolls into view
);
```

`import("./ocean-drive")` tells the bundler to put the scene in its **own JavaScript chunk**, fetched only now. When it arrives:

```tsx
setScene(() => mod.OceanDrive);
```

Note the arrow function. `setState(fn)` treats a function argument as an updater and would *call* `OceanDrive`; wrapping it means "store this function as the value".

Why not `next/dynamic`? It uses Suspense, and suspending inside a page view transition made navigation stutter. A plain `import()` never suspends.

**Concepts:** IntersectionObserver, dynamic `import()` code splitting, placeholder to avoid layout shift.

## Step 3. One SVG, one coordinate system

`ocean-drive.tsx` draws everything in a single `<svg>`:

```tsx
<svg viewBox="0 0 1600 640" preserveAspectRatio="xMidYMax slice">
```

- `viewBox="0 0 1600 640"`: inside the SVG, the world is 1600 units wide and 640 tall, whatever the real pixel size.
- `preserveAspectRatio="xMidYMax slice"`: like `object-fit: cover`, scale until the box is filled, crop the overflow, and keep the **bottom** (`YMax`) anchored. On a narrow phone the sides are cropped, but the road (near the bottom) is always visible. That is why the scene needs no phone-specific CSS.

The road sits at `y = 520` (`const BASE = 520`), 54 units tall. Everything is drawn in paint order: sky → sun → towers → hotels → road and lamps → **cars** → beach, surf → palms. Because palms are painted after the cars, a car "passes behind" a palm. That ordering is the depth illusion.

**Concepts:** SVG `viewBox`, `preserveAspectRatio`, painter's algorithm.

## Step 4. Draw a car once, reuse it

```tsx
function Car({ body, trim }: { body: string; trim: string }) {
  return (
    <g>
      <ellipse cx="80" cy="44" rx="78" ry="5" fill="#000" opacity=".45" />      {/* shadow */}
      <path d="M4 34 L18 29 L46 25 L64 13 L104 11 L126 23 L150 27 L157 35 L153 40 H6 Z" fill={body} />
      <path d="M68 16 L102 14 L117 24 H58 Z" fill="#0a0418" opacity=".85" />    {/* windows */}
      <path d="M8 33 H152" stroke={trim} strokeWidth="1.6" opacity=".9" />      {/* trim line */}
      <circle cx="36" cy="40" r="9" fill="#07030f" stroke={trim} strokeWidth="1.4" />   {/* wheels */}
      <circle cx="126" cy="40" r="9" fill="#07030f" stroke={trim} strokeWidth="1.4" />
      <rect x="150" y="29" width="6" height="3" fill="#fff6c8" />               {/* headlight */}
      <rect x="3" y="31" width="5" height="3" fill="#ff2e5a" />                 {/* tail light */}
    </g>
  );
}
```

The car lives in its own little space: about 160 units long, facing right (headlight at x≈150, tail light at x≈3), wheels at y=40. It is a React component with two colour props, so three differently coloured cars cost three lines.

## Step 5. Two nested groups: one places, one moves

```tsx
<g className="od-car od-car-a">                                    {/* ← CSS animates this one */}
  <g transform={`translate(0 ${BASE - 12}) scale(0.56)`}>           {/* ← places it on the road */}
    <Car body="#ff2e88" trim="#ffe1f0" />
  </g>
</g>
```

Why two groups? A CSS `transform` on an SVG element **replaces** its `transform` attribute. If the animation were on the inner group it would wipe out the `translate(0 508) scale(0.56)` that puts the car on the road at 56% size. So:

- inner `<g>`: static SVG transform, "where and how big";
- outer `<g>`: CSS animation, "slide along x".

## Step 6. The keyframes

From `game.css`:

```css
.od-car-a { animation: od-drive-right 20s linear infinite; }
.od-car-c { animation: od-drive-right 20s linear infinite -10s; }
.od-car-b { animation: od-drive-left 19s linear infinite -6s; }

@keyframes od-drive-right {
  from { transform: translateX(-220px); }
  to   { transform: translateX(1820px); }
}
@keyframes od-drive-left {
  from { transform: translateX(1820px); }
  to   { transform: translateX(-220px); }
}
```

Reading it:

- Inside an SVG, `px` in a CSS transform means **viewBox units**, so `-220px` is 220 units left of the scene's left edge. A car is about 90 units long at 0.56 scale, so it starts fully hidden, and `1820` is fully past the right edge (1600). It therefore enters and leaves the frame off screen, with no pop.
- Distance 2040 units in 20 s = 102 units per second. `linear` keeps the speed constant (an `ease` curve would make cars brake and accelerate every lap).
- `infinite` restarts at `from` once it reaches `to`. Since both ends are off screen, the jump is invisible.

## Step 7. Spacing cars with negative delays

Cars A and C share the same lane and the same 20 s loop. C has `animation-delay: -10s`. A **negative** delay means "start as if you had already been running for 10 seconds", so at first paint C is already half a lap ahead. They are always exactly half a lap (1020 units) apart and can never overlap. It also means the road is busy from the very first frame instead of empty until the first car arrives.

## Step 8. The near lane drives the other way

```tsx
<g className="od-car od-car-b">
  <g transform={`translate(104 ${BASE + 14}) scale(-0.66 0.66)`}>
    <Car body="#18c8ff" trim="#e9feff" />
  </g>
</g>
```

- `scale(-0.66 0.66)` mirrors the car horizontally so it faces left, and makes it bigger than the far-lane cars (0.66 vs 0.56). Bigger and lower on screen (`BASE + 14` vs `BASE - 12`) reads as "closer to you".
- Mirroring flips around x = 0, so the car would sit from −106 to 0. `translate(104 …)` shifts it back to start near 0.
- Its loop is 19 s, not 20 s, so the two lanes drift relative to each other and the pattern does not look mechanical. `-6s` offsets it from the start.

## Step 9. Keeping it cheap

Animating only `transform` lets the browser move each car as a composited layer, without re-running layout or repainting the street every frame. On top of that, three switches turn it off:

```css
/* game.css: motion toggle off or Recruiter mode → no animation at all */
:root[data-motion="off"] :is(.ocean-drive, .section-scene) *,
.world[data-mode="recruiter"] :is(.ocean-drive, .section-scene) * { animation: none !important; }

/* the OS asked for less motion */
@media (prefers-reduced-motion: reduce) {
  :is(.ocean-drive, .section-scene) * { animation: none !important; }
}

/* off screen → paused (see offscreen-pause.tsx) */
[data-offscreen], [data-offscreen] * { animation-play-state: paused !important; }
```

`offscreen-pause.tsx` observes every `.ocean-drive` and toggles a `data-offscreen` attribute when it leaves the viewport. Recruiter mode hides the scene entirely (`.world[data-mode="recruiter"] .footer-scene { display: none }`).

The rest of the street is optimised too: the hundreds of hotel windows are merged into **two `<path>` elements** (lit and unlit) instead of hundreds of `<rect>`s, and the "random" skyline uses a seeded generator (`rng(31)`), so the city looks the same on every visit.

## Step 10. On phones

`mobile.css` only restyles the text below the scene (CTA heading size, button wrapping, link sizes). The scene itself adapts through `clamp()` heights and `preserveAspectRatio="… slice"`.

---

## Try it yourself

1. **Add a fourth car** in the far lane: copy `od-car-c`, give it a new class `od-car-d`, and add `.od-car-d { animation: od-drive-right 20s linear infinite -5s; }`. With delays 0, −5, −10 and −15 s you get four evenly spaced cars.
2. **Rush hour:** change `20s` to `12s` for both far-lane cars. Same distance, less time, so they go faster.
3. **Bumpy road:** add a third group around the `<Car>` with `class="od-bounce"` and `@keyframes od-bounce { 50% { transform: translateY(-1.5px); } }` at `0.4s ease-in-out infinite`. Separate groups let independent transforms combine.
4. **Headlight beam:** inside `Car`, add a `<path>` triangle in front of the headlight with `fill="#fff6c8" opacity=".15"`.
5. Open DevTools → Rendering → **Paint flashing**. Scroll to the footer: the cars should *not* flash green, proof that they are composited, not repainted.
