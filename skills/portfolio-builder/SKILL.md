---
name: portfolio-builder
description: Builds a themed personal portfolio website in Next.js for any theme the user names (Bollywood, Ramayan, cyberpunk, retro arcade, open-world game, anime, space, cricket, noir…) by interviewing them about their work, translating the theme into palette, typography, copy voice, section metaphors and motion, then shipping a fast, accessible site with a plain mode for recruiters. Use when someone asks for a portfolio, personal site or resume site with a theme, story or "experience" feel.
---

# Portfolio Builder

Build a portfolio where the theme is the experience and the facts stay real. Any theme works; the method is the same.

## Workflow

1. **Interview.** Ask the questions in [references/question-flow.md](references/question-flow.md) in short rounds, with defaults. If the user shares a resume, LinkedIn export or GitHub, extract answers first and ask only for gaps. Never invent facts.
2. **Translate the theme.** Use [references/themes.md](references/themes.md) to turn the named theme into a theme sheet: palette tokens, fonts, copy voice, section metaphors, motifs, an intro moment, a signature scene and motion style. Several themes are worked out there as examples; derive new ones the same way.
3. **Confirm a brief.** Fill [templates/brief.md](templates/brief.md) with the theme sheet, page list, motion level and content gaps. Show it and get a yes before writing code.
4. **Scaffold.** `npx create-next-app@latest web --ts --eslint --app --tailwind --no-src-dir --import-alias "@/*"`. Lay out folders as in [references/build-and-deploy.md](references/build-and-deploy.md). Copy the generic modules from `templates/`.
5. **Content first.** Create `content/*.ts` from [references/content-templates.md](references/content-templates.md) and fill it with real data. Each project and role gets a one-sentence plain version.
6. **Design system.** Map the theme sheet onto the tokens and component recipes in [references/design-system.md](references/design-system.md).
7. **Motion.** Add the patterns for the chosen level from [references/animation-patterns.md](references/animation-patterns.md), dressed in the theme's motifs.
8. **Ship.** Media folders, tests, budgets and Vercel deploy: [references/build-and-deploy.md](references/build-and-deploy.md).

A complete worked example (an open-world game theme, built and shipped) is in [examples/open-world-game.md](examples/open-world-game.md).

## Motion levels

| Level | Includes |
| --- | --- |
| Calm | Theme palette and type, hover states, scroll reveal, one static hero scene |
| Story (default) | + intro screen, chapter cards between pages, notification toasts, parallax hero, animated signature scene |
| Immersive | + persistent overlay UI (progress, map or chapter index), menu overlay with shortcuts, collectibles, easter egg |

## Rules

- **Plain mode always.** One toggle turns off every effect and swaps themed labels for plain ones (Projects, Experience, Skills, Contact) over the same content.
- **Real facts only.** Unknown values stay empty; empty sections are hidden.
- **Original assets.** Evoke a theme; never copy a specific film, game, show or brand's logos, characters, screenshots, music or trademarked names. For religious, cultural or historical themes, keep imagery respectful and avoid caricature; ask before depicting deities or real people.
- **Readable first.** Body text stays in a readable font with 4.5:1 contrast, whatever the theme. Decorative fonts are for headings and accents only.
- **Accessible.** Keyboard reachable, native `<dialog>` for overlays with focus restored, decorative art `aria-hidden`, axe-clean, respects `prefers-reduced-motion`.
- **Fast.** Static pages, lazy overlays and below-fold scenes, loops that animate only `transform` and `opacity` and pause off screen. Budgets are in build-and-deploy.md.
- **No sound by default.** Add audio only if asked, opt-in, never autoplay.
