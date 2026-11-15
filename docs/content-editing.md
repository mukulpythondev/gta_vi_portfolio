# Editing content

Every word and link on the site lives in `web/content/*.ts`. Edit the file, save, and the dev server reloads.

```sh
cd web
npm run dev        # http://localhost:3000
```

## Which file

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, role, bio (plain + technical), location, education, stats, photo |
| `socials.ts` | Email, GitHub, LinkedIn, resume link |
| `projects.ts` | Projects. The first one is featured on the home page |
| `experience.ts` | Jobs and roles |
| `skills.ts` | Skills by category (usage counts come from projects and roles) |
| `hackathons.ts`, `achievements.ts`, `certifications.ts` | Events, wins, certificates |
| `timeline.ts` | Story mode on the About page |
| `gallery.ts` | Event photos |
| `sections.ts`, `navigation.ts`, `world.ts` | Page titles, map districts, world name |

## Writing tips

- Every project and role has `plain`: one sentence anyone understands. The "Simply / Technically" toggle swaps it with the technical text.
- Keep the card hook (`description`) under ten words and the proof chip (`metric`) to one number or result.
- Unknown? Use `null` or an empty list. Empty sections are hidden, so never fill a gap with a guess.

## Add a project

1. Copy an existing entry in `projects.ts` and give it a new `slug` (lowercase-with-dashes; it becomes the URL).
2. Fill in the fields. `architecture.nodes` draws a simple diagram if you have no image.
3. Add media (below), then `npm run build` to check it.

## Screenshots and clips

Drop files into `web/public/projects/<slug>/`. No code change needed.

| File | Shows on | Size |
| --- | --- | --- |
| `cover.webp` | Card and top of the project page | 1600×1000, under 250 KB |
| `clip.mp4` | Project page (plays on click) | 20–30 s, 1280×720, no audio, under 4 MB |
| `diagram.svg` | "How it works" | optional |
| `screen-1.png`, `screen-2.png` … | Extra screens | optional |

## Photos

Save as `web/public/gallery/<name>.jpg` (about 1280 px wide), then add an entry in `gallery.ts` with its real width, height and a short description for `alt`.

## Painted art

Prompts for every art slot are in [art/prompts.md](art/prompts.md). Save generated images in `art-raw/` with the names from that file, then run `npm run art` in `web/`: it crops, resizes and compresses them into `public/art/`. Any missing image falls back to a drawn scene.

## Resume

Replace `web/public/Mukul_Rana_Resume.pdf` with the same name.
