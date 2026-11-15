# Portfolio Builder — a Claude skill

**Your portfolio, in any theme you can imagine.** Name a world (Bollywood, Ramayan, cyberpunk, retro arcade, cricket, noir, anime, an open-world game) and Claude interviews you about your work, turns the theme into a full design (palette, fonts, copy voice, section names, motifs, an intro moment, a signature animated scene) and builds a fast, accessible Next.js site with a one-click plain mode for recruiters.

Extracted from a shipped portfolio that scores 91–92 performance and 100 accessibility, best practices and SEO on Lighthouse mobile.

## What it does

1. **Interviews you** in short rounds: theme and flavour, mood, motion level, then your bio, projects, experience, skills and links. Pre-fills from a pasted resume or GitHub.
2. **Translates the theme** into a nine-row theme sheet. Bollywood becomes "Blockbusters" and "Filmography" with marquee lights; Ramayan becomes "Kandas" and "Astras" with a manuscript that unrolls and lamps along a bridge; an arcade becomes "Levels" and "Power-ups".
3. **Builds the site** from proven patterns: no-flash mode switching, intro screen, chapter cards between pages, a one-at-a-time notification queue, parallax hero, a looping signature scene, menu overlay, scroll reveal.
4. **Ships it**: tests (Playwright + axe), performance budgets, Vercel deploy and a launch checklist.

Three motion levels (Calm, Story, Immersive). Real facts only, original art only, respectful handling of cultural and religious themes, and no sound unless you ask.

## Install

- **Claude Code (one project):** copy this folder to `.claude/skills/portfolio-builder/`.
- **Claude Code (all projects):** copy it to `~/.claude/skills/portfolio-builder/`.
- **Claude.ai:** zip the folder and upload it in Settings → Capabilities → Skills.

Then say: *"Build my portfolio with a Bollywood theme"*.

## Contents

```
SKILL.md                         workflow and rules
references/
  question-flow.md               the interview
  themes.md                      turn any theme into a theme sheet; worked Bollywood, Ramayan, cyberpunk, arcade + quick seeds
  design-system.md               tokens, type, components, plain mode, accessibility
  animation-patterns.md          11 motion patterns with code and cost rules
  content-templates.md           typed content files
  build-and-deploy.md            folders, media convention, scripts, tests, budgets, deploy
examples/
  open-world-game.md             a complete shipped example
templates/
  brief.md                       build brief to confirm before coding
  tokens.css                     token file with neutral defaults
  prepaint-script.ts             no-flash mode script
  site-store.ts                  saved settings + progress
  toasts.ts                      notification queue
  parallax.tsx                   pointer/scroll parallax
  lazy-scene.tsx                 load a scene near the viewport
  footer-scene.tsx / .css        example signature scene
  offscreen-pause.tsx            pause loops off screen
```

## License

MIT for the skill text and templates.
