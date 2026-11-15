# Solara Coast art prompts (Gemini)

The hero (`art/hero/key`) is the approved style reference. Every other image should match it.

## How to use

1. **Attach the approved hero image to every prompt** as the style reference.
   For prompts marked 👤, also attach `web/public/profile.jpg` for the likeness.
2. Paste the **style block** and then the asset prompt in the same message.
3. Generate 2–4 options and keep the best. **Download full size.**
4. Save it with the exact filename in the "Save as" column into `art-raw/` (create this folder in the repo root).
   Don't resize, crop or convert anything: I handle the exact sizes, WebP output, upscaling and watermark cleanup.
5. If signs come out with letters, follow up with: *"Replace all lettering on signs with abstract neon shapes, no letters."*

You don't need to generate these, I make them from the hero: `hero/key-mobile`, `hero/depth`,
`hero/layer-1..5`, `og/default`.

## Style block (paste before every prompt)

```
Match the art style of the attached reference image exactly: cinematic digital matte painting in the style of a modern open-world crime game loading screen, painterly brushwork, semi-realistic proportions, dramatic volumetric lighting, atmospheric haze, wet reflective surfaces, subtle film grain. Fictional Miami-style coastal city called Solara Coast. Palette: deep violet #2b1055, magenta #d53369, sunset orange #ff9a3c, neon pink #ff2e88 and cyan #18f0ff accents, near-black shadows #0d0820. Not a cartoon, not flat vector, not anime. No text, no letters, no logos, no watermarks, no UI, no borders.
```

---

## 1. Core (do these first)

| # | Save as | Ratio | Prompt |
|---|---|---|---|
| 1 | `boot.png` | 16:9 | Wide establishing shot of the Solara Coast skyline seen from the ocean at dusk: glass towers and Art Deco hotels along the shoreline, neon reflections stretching across calm water, a few palm silhouettes, a small speedboat wake in the foreground. No people. The center of the image must stay fairly dark and simple because a title will sit on top. |
| 2 👤 | `dossier.png` | 4:5 portrait | The same young man from the reference photo, in the same outfit (dark bomber jacket, black t-shirt, headphones around neck), waist-up three-quarter view on a rooftop at blue-hour dusk, the city skyline glowing behind him, holding a smartphone that lights his face in cyan, calm confident expression, slight smile. Keep the top 20% of the image as open sky for a quote. |
| 3 | `phone.png` | 9:16 portrait | Phone wallpaper: night beach with a lighthouse on a rocky point on the right, a soft beam across a starry violet sky, gentle waves with neon city reflections far left. Soft, low-contrast and slightly blurred so app icons stay readable on top. |
| 4 | `map.png` | 4:3 | Top-down painted aerial map of a fictional coastal city, like an open-world game map, viewed straight down. The ocean and a sandy beach run along the entire RIGHT edge. A river winds in from the bottom-left. Clearly separate district landmarks: top-left an apartment block; top-center a cluster of glass skyscrapers; top-right a beach strip with palms and hotels; center-left a sports stadium; center-right warehouses with neon roofs; lower-center a container port with cranes; bottom-left a white columned museum near a park; bottom-right a colorful arts quarter with murals. Roads in a grid, dusk lighting, subtle neon glow, no labels or icons. |

## 2. Page banners (ultra-wide, the left side stays dark)

Add this line to every banner prompt:
```
Ultra-wide 21:9 cinematic banner. The LEFT 55% must be dark, soft and low-detail (deep violet shadow fading in) because a large title sits there; all the interesting detail is on the RIGHT side. No people in focus.
```

| # | Save as | Prompt |
|---|---|---|
| 5 | `scene-map.png` | High aerial view over Solara Coast at dusk, city grid lights, coastline curving on the right, clouds catching orange light. |
| 6 | `scene-about.png` | A safehouse apartment balcony at night, laptop glowing on a small table, headphones beside it, city lights and palms beyond the railing. |
| 7 | `scene-missions.png` | Container port at sunset: giant cranes, stacked colorful shipping containers, pink sky, wet dock reflections. |
| 8 | `scene-experience.png` | Lobby of a glass corporate tower at night, marble floor reflections, elevator lights, cyan and pink neon trim, the city visible through tall windows. |
| 9 | `scene-hackathons.png` | A packed tech-event arena: stage lights and haze, a giant blank glowing screen, crowd silhouettes with laptops raised, confetti in the air. |
| 10 | `scene-skills.png` | A hidden warehouse "armory" wall, but instead of weapons it holds neatly mounted laptops, mechanical keyboards, server blades, cables and drones, lit by neon tube lights. |
| 11 | `scene-achievements.png` | A trophy hall with marble columns, gold trophies and glowing glass awards on pedestals, spotlight beams, neon pink accents. |
| 12 | `scene-gallery.png` | A mural-covered alley in the arts quarter at dusk, polaroid-style photos pinned along a brick wall, string lights overhead. |
| 13 | `scene-timeline.png` | A coastal highway at sunset with long-exposure car light trails, palms streaking past, the sun on the horizon. |
| 14 | `scene-contact.png` | A lighthouse on a cliff at night above the ocean, a glowing old phone booth at the cliff edge, a warm lantern light. |
| 15 | `scene-resume.png` | Noir detective desk under a single lamp: a manila dossier folder, scattered photos, a coffee cup, a vintage pen, neon light through window blinds. |
| 16 | `scene-coast.png` | Ocean Drive boulevard at dusk: Art Deco hotels with neon, a row of palms, classic convertibles cruising, wet road reflections. |

## 3. Project posters (16:9, tilted loading-screen panel feel)

Add this line to every poster prompt:
```
16:9 loading-screen style poster with one strong hero subject, centered composition, dramatic rim light in the accent color given, dark moody surroundings. No people's faces.
```

| # | Save as | Accent | Prompt |
|---|---|---|---|
| 17 | `project-offline-multimodal-rag.png` | cyan | A lone laptop glowing in a dark concrete bunker; around it, documents, photographs and sound waves float in a slow orbit, each connected to the screen by thin cyan light threads. |
| 18 | `project-microrag.png` | lime green | Four tall glowing server towers in a dark hall, connected by moving conveyor belts of light carrying small data cubes between them. |
| 19 | `project-nitigpt.png` | neon pink | A smartphone on a café table at night, glowing chat bubbles rising out of the screen like lanterns, a busy Indian street softly blurred behind. |
| 20 | `project-hydrosense.png` | cyan | A flooded road underpass at night in heavy rain, a car's headlights cutting through, a tall red-and-white water-level gauge showing rising water. |
| 21 | `project-trinetra.png` | lime green | High aerial view of a massive night festival crowd with a glowing heat-map overlay showing dense zones, a watchtower with a camera in the foreground. |
| 22 | `project-sonaraudio.png` | neon pink | Studio headphones resting on a rooftop ledge at dusk, the city skyline behind shaped like an audio equalizer, sound waves rippling through the sky. |

---

## Checklist

- [ ] All 22 saved in `art-raw/` with the exact filenames
- [ ] No letters on signs, no faces on the posters
- [ ] Mukul looks the same in the hero and the dossier
- [ ] Run `npm run art` in `web/` (crops away the Gemini watermark, resizes, compresses to WebP),
      then ping me to preview everything on the site

## Status (10 Nov)

**Done (all 22 + hero):** every slot is processed into `web/public/`. `npm run art` regenerates them from `art-raw/`.

**Optional polish:**
- `dossier.png`: the face is slimmer and the glasses are rounder than the real Mukul. Regenerate with the
  **hero image as the character reference** (it's the closest likeness) using the fix prompt in chat.
- `project-nitigpt.png`: the shop signs have pseudo-Hindi lettering, which is fine at card size.

The broken first attempts are kept in `art-raw/_redo/` and can be deleted.

<details><summary>Original redo notes</summary>

**Redo (9):** these were saved while Gemini was still rendering (blurry preview plus a grey block).
Re-downloading gives the same broken file, so they **must be generated again** using the prompts below.

---

## Redo batch: ready-to-paste prompts

Each prompt below is complete, with the style block already included. You don't need to add anything.

**Before each one**
- Start a **new Gemini chat** for each image so earlier images don't bleed into the next one.
- **Attach style references:** your hero image, plus `art-raw/scene-coast.png` (the best of the finished set).
  For 👤, also attach `web/public/profile.jpg`.

**Before you download**
- **Wait until the image is fully sharp.** The progress shimmer must be gone, and if any part looks grey or blurry, wait longer.
- Then use **Download → full size**. Don't screenshot or copy-paste the image.

**Save** straight into `art-raw/` with the exact filename, then run `npm run art` in `web/`.

### 0. `hero.png`
Your approved hero image is already done: download it at full size and save it as `art-raw/hero.png`.
If you'd like to fix the sign lettering first, follow up in the same chat with:
```
Keep the image exactly the same, but replace all lettering on the neon signs with abstract neon shapes, no letters.
```

### 1. `dossier.png` 👤 (4:5 portrait)
```
Use the first attached photo as the character reference: keep this exact person's face, skin tone, glasses, beard and messy hairstyle so he is clearly recognizable. Match the art style of the other attached images: cinematic digital matte painting like a modern open-world crime game loading screen, painterly brushwork, semi-realistic proportions, volumetric light, subtle film grain. Not a cartoon, not flat vector.

Vertical 4:5 portrait. Waist-up, three-quarter view of the young man on a city rooftop at blue-hour dusk. He wears a dark bomber jacket over a black t-shirt, dark over-ear headphones around his neck, and holds a smartphone whose screen lights his face in soft cyan. Calm, confident expression with a slight smile. Behind him, a blurred skyline of glass towers and Art Deco buildings with pink and cyan neon, and a violet-to-orange sky. Warm orange rim light on his hair and shoulders.

Keep the top 20% of the image as calm open sky with nothing in it. He fills the lower 80%, centered.

Palette: deep violet #2b1055, magenta #d53369, sunset orange #ff9a3c, neon pink #ff2e88 and cyan #18f0ff accents, near-black shadows #0d0820. No text, no letters, no logos, no watermarks, no UI, no borders.
```

### 2. `phone.png` (9:16 portrait)
```
Match the art style of the attached images: cinematic digital matte painting, painterly brushwork, soft volumetric light, subtle film grain. Not a cartoon.

Vertical 9:16 smartphone wallpaper. A quiet night beach in a fictional Miami-style coastal city. A tall lighthouse on a rocky point in the lower right sends a soft beam across a starry deep-violet sky. Calm waves roll onto dark sand in the bottom third. Faint pink and cyan neon city lights glow far away on the left horizon. A few palm silhouettes at the edge.

It must be soft, low-contrast and slightly dreamy, with large calm areas of sky in the top two thirds so app icons stay readable on top. No bright spots in the middle.

Palette: deep violet #2b1055, magenta #d53369, neon pink #ff2e88 and cyan #18f0ff accents, near-black #0d0820. No text, no letters, no logos, no watermarks, no UI, no borders.
```

### 3. `map.png` (4:3)
```
Match the colors and painterly style of the attached images, but this is a map.

A 4:3 painted top-down aerial map of a fictional coastal city, viewed straight down like an open-world video game map at dusk. Painterly, detailed and clean, with no labels, no icons, no pins and no text.

Layout (important):
- The ocean runs along the entire RIGHT edge, with a curved sandy beach between the ocean and the city.
- A river enters from the bottom-left corner and winds toward the center.
- Top-left: a block of apartment buildings.
- Top-center: a dense cluster of tall glass skyscrapers.
- Top-right, along the beach: a palm-lined strip of hotels.
- Center-left: a large oval sports stadium.
- Center-right: warehouses with glowing neon roofs.
- Lower-center: a container port with cranes and colorful shipping containers on the river.
- Bottom-left: a white columned museum beside a green park.
- Bottom-right: a colorful arts district with murals and plazas.
A road grid connects everything, streetlights glow warm orange, and some roofs have neon pink and cyan accents.

Palette: deep violet #2b1055 base, magenta #d53369, orange #ff9a3c, neon pink #ff2e88, cyan #18f0ff ocean highlights. No text, no letters, no logos, no watermarks, no compass, no UI, no borders.
```

### 4. `scene-map.png` (21:9 banner)
```
Match the art style of the attached images exactly: cinematic digital matte painting like a modern open-world crime game loading screen, painterly brushwork, volumetric light, atmospheric haze, subtle film grain. Not a cartoon.

Ultra-wide 21:9 cinematic banner. A high aerial view over a fictional Miami-style coastal city at dusk: thousands of warm city lights in a street grid, glass towers with pink and cyan neon tops, the coastline curving along the right side, and clouds catching orange sunset light.

The LEFT 55% must be dark, soft and low-detail (deep violet sky and shadowed ocean fading in) because a large title sits there. All the detail and light is on the RIGHT side.

Palette: deep violet #2b1055, magenta #d53369, sunset orange #ff9a3c, neon pink #ff2e88 and cyan #18f0ff accents, near-black shadows #0d0820. No text, no letters, no logos, no watermarks, no UI, no borders, no people.
```

### 5. `scene-about.png` (21:9 banner)
```
Match the art style of the attached images exactly: cinematic digital matte painting like a modern open-world crime game loading screen, painterly brushwork, volumetric light, atmospheric haze, subtle film grain. Not a cartoon.

Ultra-wide 21:9 cinematic banner. A cozy safehouse apartment balcony at night: a laptop glowing cyan on a small round table, over-ear headphones and a coffee mug beside it, a potted plant, string lights along the railing, and beyond it palm trees and a neon-lit city skyline under a violet sky.

The LEFT 55% must be dark, soft and low-detail (deep violet shadow fading in) because a large title sits there. All the detail is on the RIGHT side. No people.

Palette: deep violet #2b1055, magenta #d53369, sunset orange #ff9a3c, neon pink #ff2e88 and cyan #18f0ff accents, near-black shadows #0d0820. No text, no letters, no logos, no watermarks, no UI, no borders.
```

### 6. `scene-missions.png` (21:9 banner)
```
Match the art style of the attached images exactly: cinematic digital matte painting like a modern open-world crime game loading screen, painterly brushwork, volumetric light, atmospheric haze, subtle film grain. Not a cartoon.

Ultra-wide 21:9 cinematic banner. A container port at sunset: giant ship-to-shore cranes silhouetted against a hot pink and orange sky, tall stacks of colorful shipping containers, wet dock surfaces reflecting the light, and small work lights glowing cyan. Sharp, detailed and crisp, not hazy.

The LEFT 55% must be dark, soft and low-detail (deep violet shadow fading in) because a large title sits there. All the detail is on the RIGHT side. No people.

Palette: deep violet #2b1055, magenta #d53369, sunset orange #ff9a3c, neon pink #ff2e88 and cyan #18f0ff accents, near-black shadows #0d0820. No text, no letters, no logos, no watermarks, no UI, no borders.
```

### 7. `project-offline-multimodal-rag.png` (16:9 poster)
```
Match the art style of the attached images exactly: cinematic digital matte painting like a modern open-world crime game loading screen, painterly brushwork, volumetric light, subtle film grain. Not a cartoon.

16:9 loading-screen poster with one strong centered subject. A lone laptop glowing on a metal desk inside a dark concrete bunker with no windows. Around the laptop, in a slow floating orbit, are paper documents, printed photographs, a PDF page, and glowing sound-wave ribbons, each connected to the laptop screen by thin glowing cyan light threads. An unplugged network cable lies on the floor. Strong cyan rim light, dark moody surroundings, sharp detail.

Palette: near-black #0d0820 and deep violet #2b1055 with strong cyan #18f0ff accent and a touch of magenta #d53369. No text, no letters, no logos, no watermarks, no UI, no borders, no people.
```

### 8. `project-microrag.png` (16:9 poster)
```
Match the art style of the attached images exactly: cinematic digital matte painting like a modern open-world crime game loading screen, painterly brushwork, volumetric light, subtle film grain. Not a cartoon.

16:9 loading-screen poster with one strong centered subject. Four tall server towers standing in a row in a dark industrial hall, each glowing lime green, connected by curved conveyor belts of light that carry small glowing data cubes from one tower to the next. Haze, light beams from above, a wet reflective floor, sharp detail.

Palette: near-black #0d0820 and deep violet #2b1055 with strong lime green #a3ff3c accent and a touch of cyan #18f0ff. No text, no letters, no logos, no watermarks, no UI, no borders, no people.
```

### 9. `project-nitigpt.png` (16:9 poster)
```
Match the art style of the attached images exactly: cinematic digital matte painting like a modern open-world crime game loading screen, painterly brushwork, volumetric light, subtle film grain. Not a cartoon.

16:9 loading-screen poster with one strong centered subject. A smartphone lying on a small round café table at night, its screen glowing neon pink. Rising out of the screen are several glowing chat bubbles floating upward like paper lanterns. Behind it, a busy Indian street at night is softly blurred: warm shop lights, a rickshaw and string lights. A cup of chai sits on the table. Sharp focus on the phone and bubbles.

Palette: near-black #0d0820 and deep violet #2b1055 with strong neon pink #ff2e88 accent and warm orange #ff9a3c street light. No text, no letters, no logos, no watermarks, no UI, no borders, no faces.
```

### Follow-up fixes (send in the same chat if needed)
- **Text or letters appeared:** `Keep everything the same but remove all text and letters; replace signs with abstract neon shapes.`
- **Too cartoony or flat:** `More painterly and cinematic, like a high-end digital matte painting with detailed lighting.`
- **Left side too busy (banners):** `Make the left half much darker and emptier; keep all detail on the right.`
- **Wrong shape:** `Recompose to [21:9 ultra-wide / 16:9 / 4:5 portrait / 9:16 portrait] without changing the content.`
- **Face doesn't match (dossier):** `Make the face match the reference photo more closely; keep everything else.`

Then run `npm run art` in `web/`, or one at a time, for example `npm run art -- dossier`.

</details>
