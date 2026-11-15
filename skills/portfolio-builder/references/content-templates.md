# Content templates

All facts live in `content/*.ts`. Components import from here and never hard-code portfolio data. Use `null` for unknown links and empty arrays for unknown lists; the UI hides empty sections.

## `content/types.ts`

```ts
export type Project = {
  slug: string;                 // URL: /projects/<slug>
  title: string;
  plain: string;                // one sentence a non-engineer understands
  description: string;          // card hook, under 10 words
  metric: string;               // one proof point: "SIH 2025 finalist", "40 min → 12 s"
  category: string;             // eyebrow: "AI / RAG"
  objective: string;            // technical summary: constraint → approach → result
  technologies: string[];       // most important first; cards show three
  status: "Deployed" | "Open source" | "In development";
  demo: string | null;
  github: string | null;
  architecture: { nodes: string[]; description: string } | null;  // drawn diagram fallback
  challenges: string[];
  results: string[];
  achievements: string[];
  accent: string;               // card accent colour
};

export type Experience = {
  slug: string; company: string; role: string; duration: string;
  description: string;          // one-line outcome
  plain: string;
  responsibilities: string[];   // achievement-style bullets with numbers
  technologies: string[];
  challenges: string[];
  impact: string[];
  themedLine: string;           // one sentence in the theme's voice (themed mode only)
};

export type Hackathon = { slug: string; title: string; date: string; description: string; result: string; projectSlug: string | null; team: string[] };
export type Achievement = { title: string; description: string; date: string; evidence: string | null };
export type GalleryItem = { src: string; alt: string; width: number; height: number; category: string; event: string; location: string; date: string; role: string | null };
export type TimelineItem = { date: string; title: string; description: string; code: string; place: string; kind: "Study" | "Work" | "Hackathon" | "Milestone" };
```

## `content/profile.ts`

```ts
export const profile = {
  name: "Ada Example",
  role: "Full-stack Engineer",
  headline: "Built with intent. Shipped with purpose.",
  bio: "Plain-words paragraph: what you build, for whom, one proof.",
  bioTech: "Technical paragraph: the tools you reach for and why.",
  location: "Berlin, Germany",
  availability: null as string | null,      // "Open to work from March"
  photo: "/profile.jpg" as string | null,   // null → monogram
  stats: [{ label: "Projects shipped", value: "20+" }],
  education: "B.Sc. Computer Science, Example University (2019–2023)",
};
```

## `content/socials.ts`

```ts
export const socials = [
  { label: "Email", href: "mailto:you@example.com", kind: "email" },
  { label: "GitHub", href: "https://github.com/you", kind: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/you", kind: "linkedin" },
  { label: "Download resume", href: "/resume.pdf", kind: "resume" },
] as const;

/** Only https:, mailto: and site-relative links reach the DOM. */
export function safeHref(value: string | null) {
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try { return ["https:", "mailto:"].includes(new URL(value).protocol) ? value : null; } catch { return null; }
}
```

## `content/theme.ts` and `content/navigation.ts`

The theme sheet's names live in data, so re-theming is a content change.

```ts
export const theme = { name: "Marquee Nights", tagline: "In cinemas now", voice: "dramatic, warm, filmi" };

export const sections = [
  // plain = label in plain mode and in page titles; themed = label in themed mode
  { href: "/about", plain: "About", themed: "The hero's story", intro: "Who I am." },
  { href: "/projects", plain: "Projects", themed: "Blockbusters", intro: "What I built." },
  { href: "/experience", plain: "Experience", themed: "Filmography", intro: "Where I worked." },
  { href: "/skills", plain: "Skills", themed: "Special talents", intro: "What I use." },
  { href: "/contact", plain: "Contact", themed: "Book the star", intro: "Say hello." },
];
```

Use plain labels for URLs, `<title>` and meta so search results stay clear.

## `content/sections.ts`

One record per `[section]` route: `title`, `eyebrow`, `description` (also the meta description), `number` ("03"), `objective` (shown on the chapter card).

## `content/skills.ts`

Categories plus extra skills. Derive usage counts from projects and experience so the skills page shows evidence, not self-ratings:

```ts
const uses = (skill: string) =>
  projects.filter((p) => p.technologies.includes(skill)).length +
  experience.filter((e) => e.technologies.includes(skill)).length;
```

## Copy guidelines

- Hooks under 10 words. Proof chips are numbers or named results.
- Lead with the constraint ("offline", "5,000 documents", "p95 under 200 ms"), then the approach, then the outcome.
- `plain` versions avoid every acronym.
- Titles and meta use plain labels ("Projects"); themed labels are decoration.
