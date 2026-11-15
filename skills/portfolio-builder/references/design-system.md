# Design system

Theme-agnostic. The theme sheet fills the values; the structure stays.

## Tokens (`app/styles/tokens.css`, see `templates/tokens.css`)

| Group | Tokens | Filled from |
| --- | --- | --- |
| Surfaces | `--bg`, `--bg-2`, `--panel`, `--panel-solid`, `--line`, `--line-strong` | Palette: background + surface |
| Text | `--text`, `--muted`, `--dim` | Contrast ≥ 4.5:1 on `--panel` |
| Accents | `--accent`, `--accent-2`, `--accent-3` | Palette accents |
| Backdrop | `--sky-top`, `--sky-mid`, `--sky-low` | Backdrop gradient |
| Glow / shadow | `--glow-1`, `--glow-2` | Accent glows, or soft paper shadows for print themes |
| Shape | `--radius`, `--radius-sm` | Sharp (cyberpunk 2px), soft (romance 18px), none (newspaper) |
| Motion | `--ease-snap`, `--ease-cine`, `--t-micro`, `--t-panel`, `--t-cine` | Motion style |
| Layout | `--header-h`, `--gutter: clamp(18px, 4vw, 56px)`, `--max: 1320px` | Fixed |

Bridge to Tailwind 4: `@theme inline { --color-background: var(--bg); --font-sans: var(--font-body); }`.

## Typography

Load with `next/font/google` (self-hosted, `display: "swap"`, preloaded). Three roles, plus mono if the theme uses labels:

- **Display:** the theme font. Headings, numbers, card titles. Fluid size `clamp(40px, 8vw, 112px)`.
- **Body:** always a highly readable sans or serif, 16–18 px.
- **Accent:** optional decorative font for one word per screen at most.

## CSS files

One per system, imported in order from `globals.css`: `tokens → base → header → overlays → pages → modes → theme → mobile`. Phone rules only in `mobile.css`; plain-mode overrides only in `modes.css`.

## Components

Each is a fixed structure that takes the theme's labels, motifs and tokens.

| Component | Structure | Theme dresses |
| --- | --- | --- |
| Header | Brand mark, primary nav, plain-mode toggle, resume, menu | Frame style, brand mark |
| Hero | Headline, one-line role, CTA pair, portrait or initials, backdrop scene | Headline voice, scene |
| Project card | Image or drawn art, category label, title, hook (<10 words), one proof chip, status, three tags. Whole card is one link | Border motif, hover effect |
| Detail page | Content column + sticky facts panel (status, stack, links, related) | Panel material (glass, parchment, metal) |
| Experience list | Numbered rows: org + role, dates, stack, "Read more" | Row metaphor (save slot, film credit, chapter) |
| Skills | Top 12 as cards with usage counts derived from projects and roles; the rest as grouped chips | Card metaphor (weapon, spell, power-up) |
| Plain/technical toggle | Two-option switch; sets `data-explain` on `<html>`; `<Say plain tech>` renders both, CSS shows one | Labels only |
| Footer | Signature scene band, CTA, name block + link columns | Scene, CTA voice |
| Mobile dock | 4 large tap targets at the bottom (Home, Work, Menu, Contact) | Icons |

## Plain mode

`data-mode="plain"` on `<html>`: hide overlays, intro, toasts and scenes; stop all keyframe animations; keep hover/focus transitions; swap labels to plain ones; show a simple nav row.

## Accessibility baseline

Contrast ≥ 4.5:1 for body text, visible focus ring (`outline: 2px solid var(--accent); outline-offset: 3px`), skip link, 44 px touch targets, decorative art `aria-hidden`, meaningful alt on real photos.
