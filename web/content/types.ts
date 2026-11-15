export type Pending = { status: "pending"; note: string };
export type Project = {
  slug: string;
  title: string;
  /** One sentence anyone can follow, with no jargon. */
  plain: string;
  /** One short proof point shown on cards. */
  metric: string;
  category: string;
  description: string;
  objective: string;
  technologies: string[];
  status: "Details pending" | "Deployed" | "In development" | "Open source";
  /* Screenshots, clips and diagrams are files, not fields: see lib/project-media.ts. */
  demo: string | null;
  github: string | null;
  architecture: { nodes: string[]; description: string } | null;
  challenges: string[];
  results: string[];
  achievements: string[];
  missing: string[];
  accent: string;
};
export type Experience = {
  slug: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  /** One sentence anyone can follow. */
  plain: string;
  responsibilities: string[];
  technologies: string[];
  challenges: string[];
  impact: string[];
  missionNarrative: string;
};
export type Hackathon = {
  slug: string;
  title: string;
  date: string;
  description: string;
  result: string;
  projectSlug: string | null;
  team: string[];
  photo?: { src: string; alt: string; width: number; height: number };
};
export type Achievement = {
  title: string;
  description: string;
  date: string;
  evidence: string | null;
};
export type GalleryItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  category: "Hackathons" | "Workshops" | "Meetups" | "Leadership";
  event: string;
  location: string;
  /** As precise as known. Month-only dates mean the year was not supplied. */
  date: string;
  role: string | null;
};
export type TimelineItem = {
  date: string;
  title: string;
  description: string;
  /** Short location code, and where it happened. */
  code: string;
  place: string;
  kind: "Study" | "Work" | "Hackathon" | "Milestone";
};
