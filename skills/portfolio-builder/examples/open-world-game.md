# Worked example: open-world game theme ("Solara Coast")

A shipped portfolio built with this method (Next.js 16, Lighthouse mobile 91–92 performance and 100 accessibility, best practices and SEO). Use it to see what a finished theme sheet looks like and how each pattern was dressed.

## Theme sheet

| Row | Decision |
| --- | --- |
| Theme | Open-world crime-drama video game, neon sunset coast. Mood only; no real game's names, logos, map or art |
| Palette | `--bg #0d0820`, `--panel rgb(20 12 40 / .72)`, accents neon pink `#ff2e88`, cyan `#18f0ff`, orange `#ffb238`; sky violet `#2b1055` → pink `#d53369` → orange `#ff9a3c`; night palette after 20:00 |
| Type | Barlow Condensed 600/800/900 italic (display), Space Grotesk (body), Yellowtail (one script word), JetBrains Mono (labels) |
| Voice | Short, cinematic, confident. Hero "AI THAT / SHIPS."; CTA "Next mission: let's build something real."; toasts "New area discovered" |
| Metaphors | Projects → Operations, Experience → Save slots, Skills → Armory, About → Safehouse, Contact → Phone, all pages → districts on a world map |
| Motifs | Neon outlines, HUD brackets, film grain (tiled PNG), letterbox bars, star ratings |
| Intro | Boot screen: "Loading 6 operations", progress bar, rotating tips, "Press start" |
| Signature scene | Footer coast road: hotels, palms, lamps, three cars driving in two lanes |
| Motion | Snappy UI (`cubic-bezier(.2,.9,.1,1)`), cinematic overlays (`cubic-bezier(.65,0,.35,1)`), parallax hero |
| Sensitivities | No trademarked names or game art; original world name; painted art is original |

Plain mode is called "Recruiter mode" here.

## How each pattern was dressed

| Pattern | This site |
| --- | --- |
| Intro screen | Boot screen with loading steps counted from content ("Loading 12 weapons into the armory") |
| Chapter card | Letterboxed "MISSION 03 / Corporate HQ / Experience" card on navigation; "Mission passed" stamp when a project page is read to the end |
| Notification queue | "New area discovered", "Achievement unlocked", control hints |
| Parallax hero | Painted key art layer that drifts with pointer and scroll |
| Signature scene | Footer street: cars are SVG groups sliding with `translateX`, negative delays to space them, the near lane a mirrored car |
| Menu overlay | Pause menu (`Esc`) with stats, clock and settings; quick-travel wheel (`Q`); main menu after the boot screen |
| Persistent overlay | HUD: minimap with "you are here", objective tracker with stars |
| Collectibles / easter egg | Trophies for exploring; Konami code opens an allow-listed terminal |
| Skills page | Armory: category = weapon class, usage counts from projects and roles |
| Experience | Save slots with slot numbers and "Continue" |

## What it taught

- Keep the plain path one click away on every page.
- Toasts on page load annoyed readers until they were queued, delayed 3.5 s and shown one at a time.
- Smooth-scroll libraries felt laggy; native scrolling won.
- Turning off font preloading to "save bandwidth" made LCP worse; measure every optimisation.
