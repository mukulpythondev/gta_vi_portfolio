> **Historical document.** This was the planning spec written before the build. The shipped site differs in places; for how things work today see [docs/README.md](../README.md).

# UI Level-Up Plan: from "themed site" to "playable world"

Companion to `docs/product/prd.md`. That PRD defines *what* the portfolio contains; this plan defines *how the UI gets from where it is today to a game-like, sunset-neon open-world experience*.

> Originality rule (unchanged from the PRD): evoke the genre (open-world crime/action game UI, Miami-style neon sunsets) but never use Rockstar/GTA logos, artwork, characters, fonts, loading-screen art, or trademarked in-game names.

---

## 1. Where we are today (audit, 7 Nov 2026)

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 (installed, but almost all styling lives in a single 2,584-line `app/globals.css`) · Lucide icons · Web Audio synth (`lib/audio-manager.ts`) · Playwright + axe tests.
**No animation library is installed.** Motion is two CSS keyframes (`arrival`, `loading`).

**What already exists (keep it, it's a strong foundation):**

| Area | File(s) | State |
|---|---|---|
| HUD header, recruiter nav, mobile dock, menu dialog | `components/shell.tsx` | Works, but reads as a normal website navbar |
| Hero / spawn point | `app/page.tsx` | One stock photo (`public/leonida-coast.jpg`) + big type. Static. |
| World map | `components/world-map.tsx` | CSS boxes for water/islands/roads + 8 markers. Flat, no interaction beyond links |
| Mission cards | `components/project-card.tsx`, `operations.tsx` | Placeholder "dossier" art (grid + rings + icon) |
| Inventory, gallery, terminal, audio settings | `components/*.tsx` | Functional |
| Game state | `lib/game-store.ts` | Game/Recruiter mode, sound, motion, visited routes, secrets (localStorage) |
| Loading | `app/loading.tsx` | Route-level fallback only; no intro boot sequence |
| Easter eggs | Konami code, `sudo hire-mukul` | Works |

**Why it feels "far behind":**
1. **Palette is pastel, not neon.** Tokens are `--lime #d6f08a`, `--cyan #94dfda`, `--pink #f4accc` on a green-black `#101211`. Soft and tasteful, but no sunset heat, no glow.
2. **Nothing moves.** No intro, no page transitions, no scroll choreography, no hover physics. Game UIs are defined by motion.
3. **The HUD isn't a HUD.** It's a top navbar. There's no minimap, no objective tracker, no notification toasts, no "wanted/progress" meter.
4. **The map is a diagram, not a place.** Flat CSS shapes, no pan/zoom, no hover intel, no route line, no fog of war.
5. **Sections open like web pages**, not like missions. No briefing cards, no "mission start / mission passed" moments.
6. **Only one image.** No original art direction pipeline (key art, textures, district illustrations).
7. **Naming risk:** the world is called **"Leonida"**, which is the official in-game state name in GTA VI. It's used in the README, PRD, HUD caption, map label, menu, image filename, and OG title. This should be renamed to an original name before anything ships.

---

## 2. Creative direction

### 2.1 World name (pick one in Phase 0)
Replace "Leonida" everywhere with an original fictional region. Suggestions: **Solara Coast**, **Palmera Bay**, **Costa Neón**, **Port Mirage**. Districts keep their current names (Safehouse, Dev District, The Arena, etc.), which are generic and fine.

### 2.2 Palette: "Sunset → Neon Night"
Two moods driven by a single `data-time` attribute on `<html>` so the whole site can shift from dusk to night as you scroll or as a toggle.

| Token | Dusk | Night | Use |
|---|---|---|---|
| `--sky-top` | `#2b1055` | `#0a0618` | Background gradients |
| `--sky-mid` | `#d53369` | `#3a0ca3` | Hero sky, section washes |
| `--sky-low` | `#ff9a3c` | `#7209b7` | Horizon glow |
| `--neon-pink` | `#ff2e88` | same | Primary accent, CTAs |
| `--neon-cyan` | `#18f0ff` | same | HUD lines, minimap, focus rings |
| `--neon-orange` | `#ffb238` | same | Rewards, XP, "mission passed" |
| `--palm` | `#0fd99b` | same | Success, "online" |
| `--ink` | `#07050d` | same | Panels |
| `--glass` | `rgb(20 12 40 / .55)` + 16px blur | same | HUD panels |

Glow is done with layered `text-shadow`/`box-shadow` in the accent colour, not images. Keep body text off-white (`#f4f0ff`) on `--ink` panels so WCAG AA contrast still passes (existing axe tests will catch regressions).

### 2.3 Typography
Keep it open-source and non-trademarked:
- **Display:** a condensed heavy grotesk for HUD/mission titles (keep *Barlow Condensed 800*, or try *Anton* / *Bebas Neue*).
- **Script accent:** one brush/signature face for "Welcome to…" style moments (*Yellowtail*, *Pacifico* or *Mr Dafoe*), used sparingly: hero tagline, district names on the map, "Mission passed". This one font does most of the "Miami game" vibe work.
- **Body:** keep Space Grotesk.
- **HUD numerals:** a mono (*JetBrains Mono* / *Space Mono*) for coordinates, timers, counters.

### 2.4 Texture & art
- Film grain (already exists), plus **scanline** and **chromatic-aberration** overlays applied only to HUD panels and transitions.
- **Original key art:** commission or generate (with rights) 3–5 illustrated "loading screen" panels in a painterly comic style: the engineer at a desk at night, a city skyline with palms, a hackathon crowd, etc. Must be original characters (Mukul himself or abstract figures), not lookalikes of game characters.
- **District illustrations** for the map: one stylized building/landmark per district (SVG, hand-made or illustrated).
- Retire the stock Unsplash photo once key art exists.

---

## 3. Game-UI systems to build

These are reusable systems; sections plug into them.

### 3.1 Boot sequence / loading screen
- First visit per session only (flag in `game-store`), never on route changes.
- 1.5–2.5 s max: logo-less title card → rotating original key-art panel with Ken Burns pan → tip text ("TIP: Press M to open the map") → progress bar → "PRESS ANY KEY" (or auto-continue after 800 ms).
- Skippable with any key/click. Skipped entirely in Recruiter Mode and for `prefers-reduced-motion`.
- Real progress: tie bar to font + hero-image load via `document.fonts.ready` and image `decode()`, so it never fakes a delay.

### 3.2 HUD layer (`components/hud/*`)
A fixed overlay that sits above content, all `pointer-events: none` except interactive bits.
- **Minimap** (bottom-left, circular): mini version of the world map with a "you are here" blip for the current route; click opens full map. Hidden on mobile (dock replaces it).
- **Objective tracker** (top-right): "Current objective: Check out the Operations" that updates per route, suggests the next unvisited section using `visited` from `game-store`.
- **Progress / "Rep" meter**: % of districts visited (already tracked), shown as stars or a bar. Pure fun, no fake skill scores.
- **Toast notifications**: "New area discovered: Dev District", "Secret unlocked", "Achievement: Read every operation". Queue system with sound hook.
- **Money/XP counter gag** (optional): ticks up with lines of code or projects shipped, using real numbers only.
- Header shrinks to a slim glass bar; brand becomes a monogram badge.

### 3.3 Pause / weapon-wheel menu
Replace the plain `<dialog>` list with:
- **Desktop:** a radial "selection wheel" (hold `Tab` or click the menu button) with 8 segments = 8 districts; mouse angle or arrow keys select, release to travel. Fallback list remains for screen readers.
- **Mobile:** full-screen "phone" UI (already in PRD as Contact): app icons for each section.
- `Esc` opens a **pause menu** with: Resume, Map, Settings (audio/motion/mode), Stats, Quit to Recruiter Mode.

### 3.4 Mission-briefing section intros
Every section route opens with a 1-second briefing card before the content slides in:
```
MISSION 02 / DEV DISTRICT
THE OPERATIONS
Objective: Review 6 operations
[ START ]  (auto-starts, skippable)
```
Letterbox bars animate in and out (cinematic 2.39:1), title in display font, district in script font. Built once as `<MissionIntro>` and driven by the existing `sectionInfo` map in `components/sections.tsx`.

### 3.5 "Mission passed" moments
When a visitor scrolls to the end of a project/experience detail page: big script "Operation complete" overlay, reward line ("+1 Operation reviewed"), toast, optional chime. Once per item, stored in `game-store`.

### 3.6 Page transitions
Route changes play a ~400 ms wipe: diagonal neon slash or a "camera swoop" (scale + blur + letterbox). Use the **View Transitions API** (supported in Next 16 / React 19 via `<ViewTransition>`), with Motion as fallback.

### 3.7 Map 2.0
- SVG map drawn as an original coastline with neon roads, water shader-ish gradient, and the district landmark illustrations.
- **Pan & zoom** (drag/pinch/wheel) with clamped bounds; double-click zooms to a district.
- **Hover intel card** per marker: district name (script), what's inside, completion %.
- **Route line**: animated GPS path from "you" to the hovered district.
- **Fog of war**: unvisited districts slightly desaturated; visiting "discovers" them with a toast.
- Keyboard: arrow keys move between markers, Enter travels. List view remains for a11y and Recruiter Mode.

### 3.8 Cinematic hero
Options, in order of cost:
1. **Layered parallax illustration** (sky, sun, skyline, palms, water as separate PNG/WebP layers) reacting to mouse + scroll, with a slow sunset colour shift. Lowest risk, biggest win. **Recommended.**
2. **Short looped video** (6–10 s, original footage or render, <2 MB, poster image first).
3. **Light 3D scene** (R3F): low-poly skyline + water + sun. Only if 1 is done and there's a clear reason (the PRD says to avoid 3D unless justified).

Hero content: name in display font, "Welcome to [World name]" in script, role line, and a "PRESS START" CTA that pulses. Radio widget becomes a car-radio style station display.

### 3.9 Radio & audio
Audio engine exists. Upgrade the UI to a **station dial** (scroll/arrow to change), station names as original stations ("Night Drive FM", "Deep Focus Radio"), now-playing ticker. Add SFX hooks for: toast, menu open, wheel tick, mission start, mission passed. Keep: off by default, no autoplay, mute when hidden.

### 3.10 Stats screen
Pause-menu "Stats" tab in the style of a game stats page: districts discovered, operations viewed, secrets found, time in world, real numbers from content (projects shipped, hackathons). No invented proficiency scores (the PRD forbids them).

---

## 4. Section-by-section upgrades

| Section (route) | Game metaphor | Upgrade |
|---|---|---|
| Home `/` | Spawn point | Boot sequence → parallax sunset hero → "Press start" → identity strip becomes a scrolling neon ticker → featured operations as a horizontal "mission select" carousel |
| Map `/map` | World map | Map 2.0 (3.7) |
| About `/about` | Character select | Full-height character card: portrait/illustration on the left with rim-light glow; right side "bio", focus tags as perk badges; real-data "stats" bars (project coverage) |
| Projects `/missions` | Heists / operations board | Corkboard or tactical-table layout: mission cards with difficulty pips, status stamp ("SHIPPED", "IN PROGRESS"), crew/tech icons. Filter bar becomes tabs like a game menu |
| Project detail `/missions/[slug]` | Heist planning screen | Mission intro → "Objective / Approach / Crew (tech) / Blueprint (architecture diagram) / Outcome" panels → "Operation complete" moment |
| Experience `/experience` | Main story missions | Vertical mission chain with chapter numbers; each role is a "story mission" card with company as the "contact" |
| Hackathons `/hackathons` | Side quests | Quest log UI with result badges (gold/silver/participated), map-pin locations |
| Skills `/skills` | Inventory / weapon wheel | Grid inventory with item rarity colours by category, item tooltip showing "used in" projects (data already exists) |
| Achievements `/achievements` | Trophy room | Trophy cards that pop with toast animation on first view; locked/unlocked states |
| Gallery `/gallery` | Photo mode / snapmatic-style feed | In-game camera viewfinder frame around photos, filter chips, lightbox with HUD metadata (location, year) |
| Timeline `/timeline` | Story mode | Horizontal scroll-driven chapter strip with year markers and a progress bar |
| Contact `/contact` | In-game phone | Phone mock UI: "Contacts" app (email, GitHub, LinkedIn), "Messages" app with the contact form, ringtone SFX |
| Resume `/resume` | Dossier | Classified-file aesthetic, one-click PDF download, always reachable in 1 click from the HUD |

---

## 5. Motion design rules

- **Durations:** micro 120–180 ms, UI panels 250–400 ms, cinematic moments 800–1500 ms. Nothing blocks reading for more than 1.5 s.
- **Easing:** snappy out (`cubic-bezier(.2,.9,.1,1)`) for HUD; slow in-out for camera moves.
- **Signature moves:** letterbox in/out, neon slash wipe, text "type-on" for HUD labels, glitch flicker (max 150 ms) on toasts, magnetic hover on CTAs, card tilt on mission cards.
- **Scroll:** smooth scrolling + scroll-linked parallax on hero and timeline only; normal scrolling elsewhere.
- **Accessibility guardrails (non-negotiable):** `prefers-reduced-motion` and the existing motion toggle disable all non-essential motion; Recruiter Mode disables intros, transitions, toasts, and audio; every game control has a plain keyboard + screen-reader equivalent; no flashing above 3 Hz.

---

## 6. Tech & libraries

| Need | Choice | Why |
|---|---|---|
| Component animation, layout, gestures | **Motion** (`motion`, formerly Framer Motion) | React-native API, gestures for map pan/drag, `AnimatePresence` for intros/toasts |
| Timelines, scroll choreography | **GSAP + ScrollTrigger** (now free incl. plugins) | Precise cinematic sequences for boot, hero parallax, timeline |
| Smooth scroll | **Lenis** | Pairs with ScrollTrigger; disable in reduced-motion/recruiter |
| Route transitions | **View Transitions API** (React `<ViewTransition>`) | Native, cheap; Motion fallback |
| Map pan/zoom | Motion gestures, or `@use-gesture/react` | Small, keyboard-friendly wrapper we control |
| Glow/blur/grain | CSS + one SVG filter | No runtime cost |
| Optional 3D | **React Three Fiber + drei**, lazy-loaded | Only for hero option 3 |
| Styling | Migrate gradually from `globals.css` to **Tailwind 4 `@theme` tokens** + CSS modules per system | 2,584-line global file is the main maintainability risk |
| State | Keep `lib/game-store.ts`; extend with `discovered`, `completed`, `toasts`, `bootSeen` | Already SSR-safe and tested |

Budget: keep JS for the home route under ~180 KB gzipped; lazy-load GSAP/Lenis/R3F by route. Re-run the existing Lighthouse report after each phase.

---

## 7. Implementation roadmap

Each phase ships on its own and leaves the site working.

### Phase 0 · Foundations (1–2 days)
- Rename "Leonida" to the chosen original world name across code, content, README, PRD, image filename, OG image.
- Introduce design tokens (palette, fonts, radii, glows, durations) in Tailwind `@theme`; add script + mono fonts.
- Install Motion, GSAP, Lenis. Add a `useMotionAllowed()` hook (reduced-motion + toggle + recruiter mode).
- Split `globals.css` into `tokens.css`, `base.css`, and per-system files.

### Phase 1 · First impression (3–4 days) **← recommended starting point**
- Boot sequence / loading screen (3.1).
- Cinematic parallax sunset hero with "Press start" (3.8 option 1).
- Neon re-skin of HUD header, buttons, cards using new tokens.
- Page transitions (3.6).
Result: the first 10 seconds feel like booting a game.

### Phase 2 · HUD & game loop (3–4 days)
- HUD layer: minimap, objective tracker, rep meter, toast system (3.2).
- Discovery + "Mission passed" moments (3.5) wired to `game-store`.
- Mission-briefing intros on every section (3.4).

### Phase 3 · World map 2.0 (3–5 days)
- New SVG map art + district landmarks, pan/zoom, hover intel, route line, fog of war, keyboard nav (3.7).

### Phase 4 · Section reskins (5–7 days)
- Section-by-section upgrades from §4, in this order: Projects → Project detail → About → Skills → Experience → Contact phone → Achievements/Hackathons → Gallery → Timeline → Resume.

### Phase 5 · Menus, radio, polish (3–4 days)
- Selection wheel + pause menu + stats screen (3.3, 3.10).
- Radio dial UI and SFX hooks (3.9).
- Original key art swapped in for loading panels and hero layers.

### Phase 6 · Hardening (2 days)
- Extend Playwright tests: boot skip, reduced-motion path, recruiter mode bypasses all game layers, map keyboard nav, toast a11y (`aria-live`).
- Lighthouse/perf budget check, mobile pass, axe pass.
- Final originality audit: no trademarked names, logos, fonts, or lookalike art.

---

## 8. Lessons from themed portfolios people have already built

Researched 7 Nov 2026. These are the best-known OS-style and game-style portfolios. Several OS clones copy Microsoft/Apple UI pixel-for-pixel; we take their *patterns and polish*, not their assets.

### 8.1 Reference sites

| Site | Theme | What makes it feel real |
|---|---|---|
| [aduncan.dev](https://aduncan.dev) ([repo](https://github.com/aduncandev/web-xp)) | Windows XP | Full lifecycle: boot bar → login with user accounts → desktop → log off / shutdown animation. Draggable, resizable, minimizable windows with z-order. Start menu with submenus, taskbar tray clock + volume. System sounds for every event, volume saved in localStorage. Any real JS error shows a blue-screen with the actual error. |
| [mitchivin.com](https://mitchivin.com/) | Windows XP | Startup sound, Start menu, taskbar, even the dotted focus outlines and a CRT/monitor texture. Fidelity in tiny details. |
| [ahsan-xp.vercel.app](https://ahsan-xp.vercel.app/) ([write-up](https://dev.to/mahmudulahsan/building-a-nostalgic-windows-xp-portfolio-with-nextjs-16-shadcn-3dcn)) | Windows XP | Same stack as ours (Next.js 16 + Tailwind 4). Every section is an "app": file explorer = projects, Notepad = README, System Properties = fun stats. AI assistant character answers questions about the owner. 3 colour themes. |
| [portfolio.zxh.me](https://portfolio.zxh.me) ([repo](https://github.com/Renovamen/playground-macos)) | macOS | Dock, menu bar, windows, working mini-apps. Reads the visitor's **real battery level** into the menu bar. Real data makes a fake system feel alive. |
| [keyyard.xyz](https://keyyard.xyz) | Minecraft | Pixel fonts and block motifs, a 3D head that follows the mouse, an RPG "character sheet" for skills, a trophy cabinet page, toast notifications, Konami-code achievement. |
| [matteosantoro.dev](https://matteosantoro.dev/) | Handheld RPG | Whole site is a pixel-perfect handheld game: sprites, chiptune sound, D-pad navigation. |
| [bruno-simon.com](https://bruno-simon.com) ([case study](https://medium.com/@bruno_simon/bruno-simon-portfolio-case-study-960402cc259b)) | 3D driving game | The benchmark game portfolio (Awwwards Site of the Month). See lessons below. |
| [henryheffernan.com](https://henryheffernan.com) ([repo](https://github.com/henryjeff/portfolio-website)) | 3D room + retro OS | Camera flies into a 3D computer whose screen is a working retro OS. Strong "cinematic entry" moment. |
| [hafeedjraybee.com](https://hafeedjraybee.com) ([breakdown](https://contra.com/p/3qeAoLRE-video-game-hud-themed-animated-portfolio-site)) | Sci-fi shooter HUD | HUD framing on every page, typewriter titles on scroll, page transitions that keep the HUD on screen, GSAP micro-interactions, respects reduced motion. Closest to what our HUD should feel like. |
| [terminal.satnaing.dev](https://terminal.satnaing.dev/) | Terminal | Proof that one committed metaphor beats many half-done ones. We already have a terminal; it can stay as an easter egg. |

More roundups: [Five nostalgic developer portfolios](https://www.wearedevelopers.com/magazine/644-five-nostalgic-developer-portfolios-for-inspiration), [Awwwards: 3D game project navigation](https://www.awwwards.com/inspiration/3d-game-project-navigation-bruno-simon).

### 8.2 What they have in common, and what we add because of it

1. **They simulate the whole lifecycle, not just a skin.** XP clones go boot → login → desktop → shutdown. → *Add:* boot → **title screen** ("Press start") → in-world → **pause menu** → "Quit to Recruiter Mode". Turn `app/not-found.tsx` and `app/error.tsx` into in-world screens ("Mission failed · Retry / Return to map") instead of plain pages.
2. **Every section is a "thing" from the world.** The XP site's projects live in a file explorer, its README in Notepad. → Our mapping in §4 already does this; push it further: Contact is literally a phone with apps, Skills is literally an inventory grid, Resume is literally a dossier folder.
3. **Real data makes the fake world feel alive.** The macOS clone shows your real battery; XP clones show a real clock. → *Add:* HUD clock with the visitor's **real local time**, and the palette follows it (dusk tokens before ~8 pm, night tokens after). Optional: real weather for the visitor's city via a free API, shown as a HUD icon.
4. **Sound is tied to every system event, with one volume control.** → Our audio engine already persists volume; wire SFX to toast, menu, wheel tick, mission start/pass (§3.9).
5. **The start button unlocks audio** (Bruno Simon): browsers block sound until a click, so "Press start" doubles as the audio permission. → Our title-screen "Press start" calls `audioManager.activate()`.
6. **Teach controls gradually, don't front-load them** (Bruno). → First-visit hint toasts: "Press M for map" on arrival, "Hold Tab for quick travel" after the second page, "Esc to pause" later.
7. **Readability beats spectacle.** Bruno re-angled his camera when testers couldn't read projects. → Mission briefings auto-dismiss in ~1 s; content panels are always solid glass, never text over busy art.
8. **Tiny details carry authenticity.** XP's dotted focus rings, CRT texture. → Custom reticle cursor on desktop, neon cyan focus rings, consistent HUD corner brackets, scanlines only on HUD panels.
9. **A character you can talk to.** The XP site's assistant answers questions about the owner. → The PRD's AI NPC fits here later as an in-world phone contact ("Text the engineer"), Phase 5+ and only with a real backend.
10. **Easter eggs and achievements reward exploring.** Keyyard: Konami achievement + "level up" toast. → We have Konami + `sudo hire-mukul`; surface them as achievements in the toast and stats systems.
11. **Touch needs its own controls** (Bruno added a joystick). → Mobile gets the phone UI as the menu and swipeable mission cards instead of the selection wheel.
12. **A fast way out.** The best ones still let people get to the content. → Our Recruiter Mode is the escape hatch; keep it one click from every screen.

### 8.3 Roadmap changes from this research
- **Phase 1** adds: title screen with "Press start" as audio unlock; real-time clock driving dusk/night palette.
- **Phase 2** adds: gradual control-hint toasts; in-world 404/error screens.
- **Phase 4** adds: Contact as a full phone with apps.
- **Phase 5** adds: achievements for easter eggs; reticle cursor and detail pass.

---

## 9. Open questions for you

1. Which original world name do you want (or your own)?
2. Art: will you commission/illustrate key art, or should we start with code-drawn SVG/gradient scenes and swap art in later?
3. Hero: parallax illustration (recommended), video, or light 3D?
4. Do you have real content ready (projects detail, experience, photos)? Phases 4+ look far better with it.
