# Project structure

A Next.js 16 site. Every page is built ahead of time as plain HTML; a small client "shell" adds the game layer (boot screen, HUD, menus, toasts, moving scenery) on top.

## Where things live (`web/`)

```
app/
  layout.tsx            fonts, page titles, the shell around every page
  page.tsx              home page
  [section]/page.tsx    all list pages: /about /missions /experience /skills /map …
  [section]/[slug]/     project and experience detail pages
  styles/               all CSS (see below)
components/
  shell.tsx             header, footer, mobile dock, menus, keyboard shortcuts
  sections.tsx          the content of each list page
  hud/                  boot screen, HUD, toasts, mission intro, pause/main menu, quick travel
  world/                drawn scenes, hero art, parallax, world map, footer street with cars
  project-card.tsx …    cards and widgets (save slots, armory, gallery, story mode, phone)
content/                every word and link on the site
lib/                    small helpers: saved settings, toast queue, media lookup
public/                 images, art, photos, resume
tests/                  automated browser tests
```

## Where to change what

| I want to change… | Go to |
| --- | --- |
| Text, links, projects, roles | `content/*.ts` (see [content-editing.md](content-editing.md)) |
| Header or footer | `components/shell.tsx` |
| A list page's layout | `components/sections.tsx` |
| A project/experience detail page | `app/[section]/[slug]/page.tsx` |
| Colours, fonts sizes, spacing | `app/styles/tokens.css` |
| Anything on phones only | `app/styles/mobile.css` |
| Boot screen, toasts, menus | `components/hud/` |
| Scenery and the footer cars | `components/world/` + `app/styles/game.css` |

## Styles

`app/globals.css` imports the CSS files in order; later files win:

`tokens` (colours, easing, spacing) → `base` (type, buttons) → `hud`, `overlays` (HUD, toasts, boot, dialogs) → `home`, `map`, `sections` (page layouts) → `modes` (Recruiter mode, motion off) → `game` (cards, scenes, footer) → `ux`, `motion`, `feedback` (later polish) → `mobile` (phone fixes) → `art` (rules for painted art).

## Game mode and Recruiter mode

The same content renders in both. Game mode adds the HUD, boot screen, toasts and motion; Recruiter mode hides them and shows a plain menu. The mode is an attribute on `<html>` (`data-mode`), set before the page paints so it never flashes, and CSS does the rest. Motion also switches off when the visitor's device asks for reduced motion.

## Things that keep it fast

- Menus and dialogs download only when opened; the footer street loads when you scroll near it.
- Looping animations only move things (`transform`) or fade them (`opacity`), and pause when off screen.
- Images go through `next/image`; the phone hero is a smaller, lighter crop.

How each of these works, step by step: [learning/frontend-concepts.md](learning/frontend-concepts.md).
