# Translating any theme into a design

Every theme becomes the same **theme sheet**. Fill all nine rows, then the rest of the build only reads from the sheet.

| Row | Question to answer | Output |
| --- | --- | --- |
| 1. Palette | What colours does this world live in? Pick 1 background family, 1 surface, 2–3 accents, 1 sky/backdrop gradient | Token values for `tokens.css` |
| 2. Type | What lettering would appear in this world? | Display font (headings), readable body font, optional accent font |
| 3. Voice | How would a narrator of this world talk? | 3 voice rules + 5 sample lines (hero, CTA, 404, toast, empty state) |
| 4. Section metaphors | What are "projects", "experience", "skills", "about", "contact" called here? | Label map (plain mode keeps plain labels) |
| 5. Motifs | Which 3–5 shapes, textures or objects say "this world" at a glance? | SVG motifs, borders, dividers, background texture |
| 6. Intro moment | How does this world start a story? | First-visit intro screen concept |
| 7. Signature scene | One animated band that makes people smile | Footer or hero scene concept |
| 8. Motion style | How do things move here: snap, glide, unfurl, flicker, bounce? | Easing curves + 2–3 named transitions |
| 9. Sensitivities | Anything sacred, trademarked or easy to caricature? | Do / don't list |

**Derive, don't copy.** Take the mood, era and craft of a theme, never specific characters, logos, posters, frames, songs or trademarked names. Invent names for places and features.

---

## Worked examples

### Bollywood (masala-era poster style)

- **Palette:** deep maroon `#3a0a14` background, poster cream `#f6e7c8` surfaces, marigold `#ffb000`, magenta `#e4007c`, peacock teal `#00897b`; backdrop gradient maroon → saffron.
- **Type:** a heavy condensed display face with hand-painted feel (e.g. "Rozha One", "Bebas Neue"), readable body ("Poppins", "Hind").
- **Voice:** dramatic, warm, filmi. Hero: "Introducing… a developer with a 100-crore dream." CTA: "Picture abhi baaki hai. Let's talk." 404: "Yeh scene film mein nahi tha."
- **Metaphors:** Projects → Blockbusters, Experience → Filmography, Skills → Special talents, About → The hero's story, Contact → Book the star.
- **Motifs:** marquee bulbs around cards, painted-poster borders, film-reel dividers, confetti petals.
- **Intro:** a curtain parts, the title slams in with a drum hit (silent by default) and "In cinemas now".
- **Signature scene:** a theatre marquee with chasing lights spelling the latest project; petals drift in the footer.
- **Motion:** snap zooms (`scale` 1.15 → 1 with `--ease-snap`), whip-pan page transitions (`translateX` blur-free), chasing lights via `opacity` steps.
- **Sensitivities:** no real actors' faces or film titles; original poster art only.

### Ramayan (temple-mural / classical illustration)

- **Palette:** night indigo `#14123a`, palm-leaf parchment `#efe0bf`, vermilion `#d9381e`, gold leaf `#c9a227`, forest green `#2f5d3a`.
- **Type:** an elegant serif with Indic flavour for headings ("Yatra One", "Cormorant Garamond"), readable body ("Mukta", "Source Sans 3").
- **Voice:** calm, epic, respectful, like a storyteller. Hero: "This is the tale of a builder and the bridges they built." CTA: "Send word."
- **Metaphors:** Projects → Kandas (chapters), Experience → The journey, Skills → Astras (tools of the craft), About → The storyteller, Contact → Send a messenger.
- **Motifs:** lotus and arch frames, mural borders, diya glow, palm-leaf manuscript cards, a bridge of stones as a progress bar.
- **Intro:** a manuscript unrolls (`clip-path` reveal, one-shot) and a diya lights.
- **Signature scene:** a stone bridge built across water as you scroll the projects; lamps glow along the footer.
- **Motion:** slow unfurls and fades (`--ease-cine`), gentle float on lamps.
- **Sensitivities:** sacred text. No caricature of deities, no jokes at their expense; use symbolic motifs (lotus, bow silhouette, bridge) rather than depicting gods, unless the user explicitly asks and approves the style. Avoid using scripture as filler copy.

### Cyberpunk city

- **Palette:** `#05060b` background, `#0a0e18` surfaces, acid yellow `#fcee0a`, cyan `#00f0ff`, hot red `#ff003c`.
- **Type:** angular display ("Oxanium", "Rajdhani"), "Inter" body, "Share Tech Mono" for labels.
- **Voice:** terse, street-smart. Hero: "Netrunner for hire." 404: "Signal lost."
- **Metaphors:** Projects → Jobs, Experience → Contracts, Skills → Cyberware, Contact → Jack in.
- **Motifs:** scanlines, HUD brackets, glitch slices, holo-ad rectangles, rain.
- **Intro:** boot log typing out, then a glitch reveal.
- **Signature scene:** rain over a skyline with a train crossing.
- **Motion:** hard cuts, one-shot glitch with `clip-path`, flicker via `opacity` steps.

### Retro arcade

- **Palette:** `#0b0b1e`, `#15153a`, `#ffde00`, `#ff4fa3`, `#3dff6e`.
- **Type:** pixel display ("Press Start 2P", sparingly), "VT323" labels, "Inter" body.
- **Voice:** punchy, playful. Hero: "Player 1 has entered." CTA: "Insert coin." 404: "Game over. Continue?"
- **Metaphors:** Projects → Levels, Experience → High scores, Skills → Power-ups, Contact → Continue?
- **Motifs:** pixel borders, CRT texture, 8-bit stars.
- **Intro:** "INSERT COIN" blinking, press any key.
- **Signature scene:** a pixel sprite running along the footer.
- **Motion:** `steps()` easing for sprite frames, instant cuts.

### Open-world game (neon coast)

Fully built and shipped: see [../examples/open-world-game.md](../examples/open-world-game.md).

---

## Quick derivations

For any other theme, answer the nine rows in one pass. Some seeds:

| Theme | Metaphors (projects / experience / skills) | Signature scene |
| --- | --- | --- |
| Cricket | Innings / Career stats / Shots | Scoreboard ticking up; a ball rolling to the boundary |
| Space | Missions / Flight log / Ship systems | Star field with a slow orbiting planet |
| Noir detective | Case files / Past cases / Tools of the trade | Rain on a window, blinking neon sign |
| Comic book | Issues / Back catalogue / Powers | Panels sliding in with speech bubbles |
| Newspaper | Headlines / Archive / Beats | Printing press rolling a front page |
| Anime | Episodes / Arcs / Techniques | Speed-line transition, cherry blossoms |
| Greek myth | Labours / Odyssey / Gifts of the gods | Constellations connecting into figures |
| Cooking | Signature dishes / Kitchens worked / Pantry | Steam rising from a pot, ticket rail |
