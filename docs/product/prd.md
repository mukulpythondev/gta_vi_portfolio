> **Historical document.** This was the planning spec written before the build. The shipped site differs in places; for how things work today see [docs/README.md](../README.md).

# MUKUL RANA — SOLARA COAST // PERSONAL PORTFOLIO

## Master Product Requirements + Design + Engineering Specification

**Document Version:** 1.0
**Status:** Build Specification
**Primary Goal:** Create an immersive, interactive software-engineering portfolio inspired by the atmosphere, navigation, storytelling, UI language, and cinematic feel of modern open-world crime games—while remaining an original design.

---

# 0. PRODUCT VISION

The portfolio should **not feel like a traditional portfolio website**.

It should feel like:

> **A playable digital profile of a software engineer.**

The visitor enters Mukul's world, explores his career as missions, projects as operations/heists, hackathons as side quests, skills as inventory, achievements as trophies, and contact information as an in-game phone.

The website must communicate two things simultaneously:

### Layer 1 — Recruiter usability

A recruiter should be able to understand within 30–60 seconds:

* Who Mukul is
* What he does
* What technologies he works with
* Where he has worked
* What he has built
* His strongest projects
* His achievements
* How to contact him

### Layer 2 — Memorable experience

A technical visitor should think:

> "I've never seen a portfolio like this."

The experience should reward exploration without making basic information difficult to access.

---

# 1. CORE DESIGN PRINCIPLE

## "GAME ON THE SURFACE, ENGINEER UNDERNEATH"

The website should visually behave like a game.

But the underlying information architecture should remain a **professional portfolio**.

Do NOT sacrifice:

* readability
* accessibility
* performance
* SEO
* responsive design
* recruiter usability
* direct links
* project information

for the theme.

The GTA-inspired layer is the **presentation system**, not the content system.

---

# 2. BRAND / WORLD

Create an original fictional world around Mukul.

Working title:

> **MUKUL RANA // SOLARA COAST**

(Renamed from "Leonida", which is the in-game state name used by GTA VI. Solara Coast is original.)

Alternative:

> **MUKUL RANA — SOFTWARE ENGINEER**

The environment should have:

* neon nightlife
* sunset gradients
* tropical/urban atmosphere
* dark UI
* cinematic photography
* map interfaces
* mission cards
* phone UI
* achievement notifications
* game HUD
* subtle grain
* glass/metal UI elements

Avoid directly copying:

* GTA logos
* Rockstar logos
* GTA VI logo
* Rockstar fonts
* official GTA artwork
* official loading screens
* copyrighted characters
* copyrighted UI assets

Everything should be original.

---

# 3. TARGET USERS

## Primary

### Recruiter

Needs:

> "Who is this person and should I look further?"

Must quickly access:

* Resume
* Experience
* Skills
* Projects
* Contact

---

### Engineering Manager

Needs:

> "Can this person actually build things?"

Show:

* architecture
* production work
* technical decisions
* scale
* technologies
* engineering challenges

---

### Engineer / Developer

Needs:

> "What has this guy actually built?"

Show:

* GitHub
* projects
* architecture
* demos
* technical stack
* hackathons

---

### General visitor

Needs:

> "This website is fun."

Give them:

* exploration
* animations
* sound
* easter eggs
* map
* interactive character profile

---

# 4. EXPERIENCE FLOW

The intended journey:

```text
OPEN WEBSITE
     ↓
CINEMATIC LOADING
     ↓
INTRO / HERO
     ↓
WELCOME TO MUKUL'S WORLD
     ↓
MAIN MAP / NAVIGATION
     ↓
CHARACTER PROFILE
     ↓
MISSIONS
     ↓
PROJECTS
     ↓
WORK EXPERIENCE
     ↓
HACKATHONS
     ↓
SKILLS / INVENTORY
     ↓
ACHIEVEMENTS
     ↓
GALLERY
     ↓
CONTACT / PHONE
```

The user should **never be forced to follow this sequence**.

Everything should be accessible from the HUD/map.

---

# 5. LOADING SCREEN

Initial loading should feel cinematic.

Example:

```text
MUKUL RANA

INITIALIZING SYSTEM...

[██████████████████░░]

Loading missions...
Loading projects...
Loading achievements...
Loading inventory...

SYSTEM READY
```

Then transition into the main experience.

### Loading requirements

* Keep it short.
* Never intentionally delay the visitor.
* If assets load instantly, animation should still be brief.
* Provide a skip option if necessary.
* Don't block content unnecessarily.

---

# 6. HERO / SPAWN POINT

The homepage is the visitor's spawn point.

Visual:

```text
                         MUKUL RANA

                 SOFTWARE ENGINEER
             AI • BACKEND • BUILDER

       ┌──────────────────────────────────┐
       │                                  │
       │        CINEMATIC VISUAL          │
       │                                  │
       └──────────────────────────────────┘

             [ START EXPLORING ]

          [ VIEW MISSIONS ] [ RESUME ]
```

Possible headline:

> **I build systems, ship products, and occasionally turn weekends into hackathons.**

Subheadline:

> Software Engineer focused on AI, backend systems, and building products from zero to production.

---

# 7. HUD

Persistent navigation should feel like an in-game HUD.

Possible top navigation:

```text
┌───────────────────────────────────────────────┐
│ MUKUL       MAP     MISSIONS     PHONE    ⚙ │
└───────────────────────────────────────────────┘
```

Mobile:

```text
             MUKUL
       ─────────────────
       MAP   ☰   PHONE
```

HUD should remain subtle.

---

# 8. WORLD MAP

The map is the primary navigation metaphor.

Imagine a stylized fictional city.

Locations:

```text
       🏙️ DOWNTOWN
           │
           │
    🏢 CORPORATE HQ
           │
           │
🏆 ARENA ──┼── 💻 DEV DISTRICT
           │
           │
       🏠 SAFEHOUSE
           │
           │
       📱 PHONE
```

Each location corresponds to a portfolio section.

### Map locations

| Location         | Section      |
| ---------------- | ------------ |
| Safehouse        | About        |
| Corporate HQ     | Experience   |
| Mission District | Projects     |
| Arena            | Hackathons   |
| Warehouse        | Skills       |
| Trophy Room      | Achievements |
| Photo Studio     | Gallery      |
| Phone Booth      | Contact      |

---

# 9. CHARACTER PROFILE

Rename "About Me" to:

> **CHARACTER PROFILE**

Information:

```text
NAME
Mukul Rana

CLASS
Software Engineer

SPECIALIZATION
AI / Backend / Systems

LOCATION
India

EDUCATION
B.Tech CSE

CURRENT STATUS
Building + shipping
```

Include a professional biography.

The content should explain:

* background
* engineering interests
* career journey
* AI interests
* startup experience
* hackathons
* what he enjoys building

Keep the actual writing professional even though the UI is playful.

---

# 10. CHARACTER STATS

Visualize technical capabilities as game statistics.

Example:

```text
CHARACTER STATS

BACKEND             █████████░  90
AI / GENAI          █████████░  92
FULL STACK          ████████░░  85
SYSTEM DESIGN       ████████░░  80
CLOUD               ████████░░  82
DATABASES           █████████░  88
DEVOPS              ███████░░░  72
PRODUCT THINKING    █████████░  90
```

Important:

These should be presented as **portfolio UI**, not as objective industry rankings.

Do not imply that these are externally validated scores.

---

# 11. EXPERIENCE → MAIN MISSIONS

Work experience becomes:

> **MAIN MISSIONS**

Each company gets a mission card.

Example:

```text
MISSION 01

ENTERPRISE AI PLATFORM

CLIENT
GHD

ROLE
Software Engineer

STATUS
COMPLETED

OBJECTIVE
Build scalable document ingestion
and AI processing infrastructure.

TECH
FastAPI
PostgreSQL
Redis
Kafka
Azure AI
```

Clicking it opens a detailed mission.

---

# 12. EXPERIENCE DETAIL PAGE

Every experience should have:

### Mission briefing

```text
MISSION BRIEFING

Objective
...

Environment
...

Role
...

Duration
...

Team
...
```

### What I worked on

Explain actual responsibilities.

### Technical challenges

Examples:

* document ingestion
* asynchronous processing
* OCR
* queue architecture
* database design
* reliability
* APIs

### Architecture

Include architecture diagrams where appropriate.

### Technology

Display stack as inventory items.

### Impact

Where factual metrics exist:

```text
5,000+ enterprise documents
...
```

Never invent metrics.

### Mission outcome

Summarize what was shipped.

---

# 13. PROJECTS → HEISTS / OPERATIONS

Projects should be the visual centerpiece.

Rename:

> **MISSIONS**

or

> **OPERATIONS**

Each project gets a cinematic card.

Example:

```text
OPERATION 07

NITIGPT

CLASS
AI / RAG

OBJECTIVE
Turn complex documents into
simple conversational answers.

DIFFICULTY
★★★★☆

STATUS
DEPLOYED

[ START OPERATION ]
```

---

# 14. PROJECT DETAIL

Every project should contain:

### 01 — Mission briefing

Problem.

### 02 — Objective

What was being built.

### 03 — Strategy

How the problem was solved.

### 04 — Architecture

Visual architecture.

### 05 — Tech stack

Technologies.

### 06 — Engineering challenges

Actual technical problems.

### 07 — Results

Documented metrics/results.

### 08 — Demo

Embedded demo/video.

### 09 — Source

GitHub.

### 10 — Deployment

Live project where available.

---

# 15. PROJECTS TO INCLUDE

Initial content database should support:

### NitiGPT

WhatsApp document assistant.

Technology:

* GraphRAG
* Zep
* FastAPI
* Twilio
* OpenAI
* PDF processing

---

### Trinetra

AI crowd safety system.

Technology:

* Python
* XGBoost
* ResNet
* React Native
* Node.js
* MongoDB

---

### Combat IQ

AI Taekwondo coach.

Computer vision based.

---

### KYARA

Legal assistant for advocates.

RAG + fine-tuned model.

---

### Widesquare

Real-estate platform.

---

### Sponsogram

Creator-brand collaboration platform.

Potentially show:

> **STARTUP MISSION**

with your CTO role separately.

---

# 16. HACKATHONS → SIDE QUESTS

This should be one of the most visually interesting sections.

Title:

> **SIDE QUESTS**

Each hackathon is a mission card.

Example:

```text
SIDE QUEST

SMART INDIA HACKATHON 2025

MISSION:
National-level problem solving

RESULT:
NATIONAL FINALIST

TEAM:
...

PROJECT:
Trinetra

[ VIEW STORY ]
```

---

# 17. HACKATHON GALLERY

Use a cinematic photo gallery.

Categories:

```text
ALL
HACKATHONS
EVENTS
MEETUPS
TEAM
SPEAKING
COMMUNITY
```

Photos should open in a fullscreen lightbox.

Each photo can contain metadata:

```text
EVENT
Google AI Day

LOCATION
IIT Delhi

YEAR
2026
```

---

# 18. ACHIEVEMENTS → TROPHY ROOM

Title:

> **ACHIEVEMENTS**

or

> **TROPHY ROOM**

Include documented accomplishments:

* SIH National Finalist
* Hackathon wins
* Hackathon finalist appearances
* Certifications
* Community activities
* Judging
* Speaking
* Startup/CTO experience

Each trophy should have a short explanation.

---

# 19. INVENTORY → SKILLS

Create an inventory screen.

Categories:

### Weapons

Programming languages

### Tools

Frameworks

### Intelligence

AI/ML

### Infrastructure

Cloud / DevOps

### Database

Data systems

Example:

```text
INVENTORY

PROGRAMMING
Python
Java
JavaScript
TypeScript

BACKEND
FastAPI
Node.js
Express

FRONTEND
React
Next.js
Tailwind

AI
OpenAI
Gemini
LangChain
LangGraph
RAG
Computer Vision

DATA
PostgreSQL
MongoDB
Redis
Neo4j
Kafka

CLOUD
AWS
Azure
GCP

DEVOPS
Docker
GitHub Actions
```

---

# 20. TECH STACK VISUALIZATION

Don't dump every technology into a wall.

Use interactive filtering:

```text
[ ALL ]

[ AI ]

[ BACKEND ]

[ FRONTEND ]

[ DATABASE ]

[ CLOUD ]

[ DEVOPS ]
```

Clicking a technology shows where Mukul used it.

Example:

```text
FASTAPI

Used in:

→ NitiGPT
→ Enterprise Document Platform
→ Runtime AI Security
```

This creates a relationship between skills and real work.

---

# 21. TIMELINE

Create:

> **STORY MODE**

A horizontal/vertical timeline.

Example:

```text
2024
│
├── Started building seriously
│
2025
│
├── Hackathons
├── Internships
├── SIH
│
2026
│
├── Production AI Engineering
├── NTRO
├── Startup / CTO
├── AI events
│
2027
│
└── Graduation
```

Only use verified dates.

---

# 22. CONTACT → IN-GAME PHONE

Instead of boring contact section:

> **PHONE**

Create a phone UI.

```text
┌─────────────────────────┐
│       MUKUL PHONE       │
│                         │
│  📞 Email               │
│  💼 LinkedIn            │
│  💻 GitHub              │
│  📄 Resume              │
│  🐦 X                   │
│                         │
└─────────────────────────┘
```

Contact actions should work normally.

---

# 23. RESUME

Always provide an obvious:

> **DOWNLOAD RESUME**

Don't force users to explore the game to find it.

Put it:

* Hero
* HUD
* Phone
* Contact section

---

# 24. AI NPC

Optional advanced feature.

Title:

> **MUKUL AI**

Instead of a generic chatbot, the assistant acts as a portfolio guide.

Example:

Visitor:

> "What did Mukul build with FastAPI?"

Assistant:

> "FastAPI appears across several projects, including NitiGPT and enterprise document-processing work..."

The AI must only answer from the portfolio's structured knowledge base.

No hallucinated achievements.

Possible modes:

```text
ASK MUKUL

"What did you build?"

"What are your strongest projects?"

"Tell me about your work experience."

"Show me AI projects."
```

---

# 25. SOUND SYSTEM

Sound is an enhancement, not a requirement.

### Default

**Muted.**

User can activate:

```text
🔇 SOUND OFF
```

Then:

```text
🔊 SOUND ON
```

---

## Ambient Music

Original/licensed music only.

Possible styles:

* synthwave
* atmospheric electronic
* Miami-inspired retro
* cinematic ambient

Allow:

```text
RADIO

○ OFF
○ NIGHT DRIVE
○ SYNTHWAVE
○ AMBIENT
```

---

# 26. SOUND EFFECTS

Events:

| Event             | Sound                  |
| ----------------- | ---------------------- |
| Mission opened    | short confirmation     |
| Mission completed | achievement sound      |
| Map selection     | soft click             |
| Gallery           | camera shutter         |
| Achievement       | unlock sound           |
| Phone opened      | notification           |
| UI hover          | extremely subtle click |
| Resume            | confirmation           |
| Easter egg        | special sound          |

All sounds should be short.

---

# 27. AUDIO UX RULES

Never:

* autoplay loud music
* create continuous sound on every hover
* make sound mandatory
* rely on sound to communicate information

Provide:

```text
SOUND
MUSIC
SFX
MASTER VOLUME
```

Respect browser autoplay policies.

Store preferences in localStorage.

---

# 28. ANIMATION SYSTEM

Use animation strategically.

### Page transitions

Cinematic but fast.

### Mission cards

Hover:

* slight scale
* glow
* image movement
* UI details appear

### Map

* camera pan
* marker pulse
* location activation

### Achievements

* unlock animation

### Stats

* bars animate when entering viewport

### Gallery

* cinematic image transitions

Avoid excessive animation.

---

# 29. RESPONSIVE DESIGN

Desktop should be the full experience.

Mobile should be a **properly designed mobile game-like interface**, not simply the desktop layout squeezed down.

Mobile navigation:

```text
┌────────────────────┐
│ MUKUL       ☰     │
│                    │
│    CURRENT AREA    │
│                    │
│   [MISSION CARD]   │
│                    │
├────────────────────┤
│ MAP | MISSIONS | 📱│
└────────────────────┘
```

---

# 30. ACCESSIBILITY

Must support:

* keyboard navigation
* focus states
* reduced motion
* screen readers
* sufficient contrast
* alt text
* semantic HTML
* pause/disable animation
* mute controls

If:

```text
prefers-reduced-motion: reduce
```

then cinematic transitions should be significantly reduced.

---

# 31. PERFORMANCE

This is extremely important.

The site can look cinematic without becoming a 10-second loading monster.

Targets:

* optimized WebP/AVIF images
* lazy-loaded gallery
* lazy-loaded videos
* code splitting
* dynamic imports
* optimized fonts
* minimal JavaScript where possible
* no unnecessary 3D

Avoid Three.js unless there is a clear visual reason.

---

# 32. SEO

Despite the game UI, underlying HTML should contain:

```text
Mukul Rana
Software Engineer
AI Engineer
Backend Engineer
Projects
Experience
Hackathons
GitHub
```

Use:

* metadata
* OpenGraph
* structured data where appropriate
* semantic headings
* sitemap
* robots.txt

---

# 33. TECHNOLOGY RECOMMENDATION

Recommended stack:

```text
Next.js
TypeScript
Tailwind CSS
Framer Motion
GSAP
Lenis
```

Optional:

```text
Three.js
React Three Fiber
```

Only if required.

### Backend

The portfolio should initially be static.

Possible backend only for:

* AI NPC
* analytics
* contact form

---

# 34. CONTENT ARCHITECTURE

Do NOT hardcode every project directly into components.

Use structured data.

Example:

```typescript
type Project = {
  id: string
  title: string
  category: string
  status: string
  description: string
  objective: string
  technologies: string[]
  achievements?: string[]
  github?: string
  demo?: string
  images: string[]
}
```

Similarly:

```typescript
type Experience = {...}

type Hackathon = {...}

type Achievement = {...}

type GalleryItem = {...}
```

This lets Mukul update content without rebuilding the UI.

---

# 35. ROUTING

Recommended:

```text
/
 /about
 /missions
 /missions/[slug]
 /experience
 /experience/[slug]
 /hackathons
 /hackathons/[slug]
 /skills
 /achievements
 /gallery
 /contact
```

But visually these can still behave like a single interactive world.

SEO-friendly routes matter.

---

# 36. DATA MODEL

Central content:

```text
/content

profile.ts
experience.ts
projects.ts
hackathons.ts
skills.ts
achievements.ts
gallery.ts
timeline.ts
socials.ts
```

This makes the entire portfolio content-driven.

---

# 37. ADMIN / CMS

Not required for v1.

But architect content so a CMS can be added later.

Potential future:

```text
Portfolio Admin

Projects
Experience
Hackathons
Achievements
Gallery
Skills
```

---

# 38. ANALYTICS

Optional privacy-conscious analytics.

Track:

* page views
* project opens
* resume clicks
* GitHub clicks
* contact clicks
* AI NPC usage

Do NOT collect unnecessary personal data.

---

# 39. EASTER EGGS

This portfolio should have secrets.

Potential examples:

### Konami code

Unlock:

> **DEVELOPER MODE**

### Hidden terminal

```text
$ whoami

mukul_rana
```

### Terminal commands

```text
help
projects
skills
experience
contact
sudo hire-mukul
```

### Secret achievement

```text
🏆 ACHIEVEMENT UNLOCKED

YOU FOUND THE SECRET.
```

---

# 40. TERMINAL MODE

This could become one of the coolest additions.

A small terminal accessible from the HUD.

Commands:

```bash
help
about
projects
experience
skills
hackathons
achievements
contact
resume
github
```

Example:

```text
$ projects

Fetching missions...

01 NitiGPT
02 Trinetra
03 Combat IQ
04 KYARA
05 Sponsogram
```

---

# 41. VISUAL LANGUAGE

### Colors

Primary:

* deep black
* midnight blue
* neon pink
* warm orange
* sunset purple
* electric cyan

But don't use every color everywhere.

Use:

```text
Dark base
+
Warm sunset accent
+
Neon highlight
```

---

# 42. TYPOGRAPHY

Need two typefaces:

### Display

Bold cinematic typography.

### Body

Highly readable modern sans-serif.

Avoid using copyrighted GTA typefaces.

---

# 43. IMAGE DIRECTION

Use:

* cinematic city photography
* neon environments
* tropical/night imagery
* abstract technical imagery
* real hackathon photos
* project screenshots

The user's actual photos should dominate the hackathon/gallery sections.

Don't fabricate achievements through AI-generated images.

---

# 44. UI COMPONENT SYSTEM

Create reusable components:

```text
GameHUD
LoadingScreen
Map
MapMarker
MissionCard
MissionDetail
CharacterProfile
StatBar
Inventory
AchievementCard
Trophy
Timeline
Gallery
Phone
Terminal
AudioController
RadioPlayer
ProjectArchitecture
TechBadge
Modal
Lightbox
Toast
```

---

# 45. GLOBAL INTERACTION SYSTEM

Centralize:

```text
AudioManager
NavigationManager
AnimationManager
GameState
UserPreferences
```

Example:

```text
GameState

soundEnabled
musicEnabled
currentLocation
visitedLocations
unlockedAchievements
reducedMotion
```

---

# 46. STATE PERSISTENCE

Use localStorage for harmless preferences:

```text
soundEnabled
musicEnabled
visitedSections
easterEggsFound
```

Do not store sensitive information.

---

# 47. ERROR STATES

Even a portfolio needs good failure handling.

Example:

```text
MISSION UNAVAILABLE

The requested mission couldn't be loaded.

[RETURN TO MAP]
```

For AI:

```text
MUKUL AI IS CURRENTLY OFFLINE.

You can still explore the portfolio.
```

---

# 48. 404 PAGE

Make the 404 page part of the world.

```text
WANTED

404

You're outside the map.

The location you're looking for
doesn't exist.

[RETURN TO CITY]
```

---

# 49. CONTENT RULE

The game language should never make the portfolio content unclear.

For example:

Bad:

> "Completed a sick heist with PostgreSQL."

Good:

> **Mission:** Designed a PostgreSQL-backed document-processing service supporting asynchronous ingestion workflows.

The UI can say:

> HEIST COMPLETE

The actual technical content remains professional.

---

# 50. RECRUITER FAST PATH

Critical.

A recruiter should have:

```text
Hero
 ↓
Resume
 ↓
Experience
 ↓
Projects
 ↓
Contact
```

within **two clicks** from anywhere.

Add a persistent:

> **Recruiter Mode**

Potentially this is a brilliant feature.

### Recruiter Mode

Turns off:

* heavy animations
* music
* easter eggs

and shows:

```text
ABOUT
EXPERIENCE
PROJECTS
SKILLS
ACHIEVEMENTS
RESUME
CONTACT
```

Same content, professional presentation.

---

# 51. "GAME MODE" VS "RECRUITER MODE"

This could be one of the defining features.

## GAME MODE

```text
🎮 EXPLORE

Music
Animations
Map
Missions
Easter eggs
Interactive UI
```

## RECRUITER MODE

```text
💼 PROFESSIONAL

Minimal UI
Fast navigation
Resume
Experience
Projects
Skills
Contact
```

Both use the same content database.

---

# 52. SECURITY

For AI features:

* API keys only server-side
* rate limit AI endpoint
* sanitize user input
* don't expose private portfolio data
* don't expose environment variables
* use server-side API routes
* validate external URLs
* prevent arbitrary tool execution

The AI NPC should **never have shell/system access**.

---

# 53. DEPLOYMENT

Suggested:

```text
GitHub
   ↓
CI/CD
   ↓
Vercel
   ↓
Custom Domain
```

Possible domain:

```text
mukulrana.dev
```

or another personal domain.

---

# 54. DEVELOPMENT PHASES

## PHASE 1 — Foundation

Build:

* Next.js
* TypeScript
* Tailwind
* routing
* content architecture
* responsive foundation

---

## PHASE 2 — Visual World

Build:

* color system
* typography
* HUD
* map
* loading screen
* transitions

---

## PHASE 3 — Content

Build:

* profile
* experience
* projects
* hackathons
* skills
* achievements
* gallery
* timeline

---

## PHASE 4 — Game Mechanics

Build:

* missions
* inventory
* map navigation
* trophies
* terminal
* easter eggs

---

## PHASE 5 — Audio

Build:

* audio manager
* SFX
* radio
* volume controls
* persistence

---

## PHASE 6 — AI

Build:

* Mukul AI
* portfolio knowledge base
* suggested questions
* fallback behavior

---

## PHASE 7 — Optimization

Run:

* Lighthouse
* accessibility audit
* mobile testing
* performance testing
* SEO audit

---

# 55. DEFINITION OF DONE

The portfolio is finished when:

### Experience

* [ ] Landing experience feels cinematic
* [ ] Map navigation works
* [ ] Every major section has a game metaphor
* [ ] Animations are smooth
* [ ] Audio is optional

### Content

* [ ] Bio complete
* [ ] Experience complete
* [ ] Projects complete
* [ ] Hackathons complete
* [ ] Skills complete
* [ ] Achievements complete
* [ ] Gallery complete
* [ ] Resume accessible
* [ ] Contact accessible

### Engineering

* [ ] Mobile responsive
* [ ] SEO implemented
* [ ] Accessible
* [ ] Fast initial load
* [ ] Images optimized
* [ ] No exposed secrets
* [ ] AI endpoint secured

### UX

* [ ] Recruiter can find resume quickly
* [ ] Recruiter can understand experience quickly
* [ ] GitHub links work
* [ ] Project demos work
* [ ] Contact works
* [ ] User can disable sound
* [ ] Reduced-motion supported

---

# 56. MOST IMPORTANT DESIGN RULE

The portfolio should follow this hierarchy:

```text
                 STORY
                   ↓
              EXPERIENCE
                   ↓
               CONTENT
                   ↓
                DESIGN
                   ↓
               ANIMATION
                   ↓
                 SOUND
```

**Not:**

```text
GTA EFFECTS
   ↓
ANIMATIONS
   ↓
SOUND
   ↓
"WHERE IS THE ACTUAL RESUME?"
```

The game layer should make people **want to explore your engineering story**.

---

# 57. FINAL EXPERIENCE

The ideal visitor journey should feel like:

> **"Who is this guy?"**

↓

> **"Okay, he's a software engineer."**

↓

> **"Wait, he actually built this?"**

↓

> **"He worked on production AI systems?"**

↓

> **"He was a national finalist?"**

↓

> **"There's an architecture diagram?"**

↓

> **"There's an AI version of him?"**

↓

> **"Okay, this is memorable."**

That is the goal.




