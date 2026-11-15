import { world } from "./world";

export type SectionInfo = {
  title: string;
  eyebrow: string;
  district: string;
  description: string;
  number: string;
  objective: string;
};

export const sectionInfo: Record<string, SectionInfo> = {
  map: {
    title: "THE WORLD MAP",
    eyebrow: `${world.name.toUpperCase()} / ALL PAGES`,
    district: world.name,
    description:
      "Every page of this portfolio is a district on one map. Pick one to travel there, or press M from anywhere.",
    number: "00",
    objective: "Pick a district and set a waypoint",
  },
  about: {
    title: "CHARACTER PROFILE",
    eyebrow: "ABOUT",
    district: "Safehouse",
    description: "The engineer behind the operations, and the story so far.",
    number: "01",
    objective: "Meet the main character",
  },
  missions: {
    title: "THE OPERATIONS",
    eyebrow: "PROJECTS",
    district: "Dev District",
    description:
      "From AI assistants to product platforms. The ideas, the systems, and the work behind them.",
    number: "02",
    objective: "Review the operations board",
  },
  experience: {
    title: "MAIN MISSIONS",
    eyebrow: "EXPERIENCE",
    district: "Corporate HQ",
    description:
      "Professional work. Engineering responsibilities. Real-world outcomes.",
    number: "03",
    objective: "Follow the main story",
  },
  hackathons: {
    title: "SIDE QUESTS",
    eyebrow: "HACKATHONS",
    district: "The Arena",
    description: "Problems worth solving. Teams worth building with.",
    number: "04",
    objective: "Check the side quest log",
  },
  skills: {
    title: "THE ARMORY",
    eyebrow: "SKILLS",
    district: "The Warehouse",
    description: "Every skill is a weapon. Stats count where it was actually used.",
    number: "05",
    objective: "Pick your loadout",
  },
  achievements: {
    title: "THE TROPHY ROOM",
    eyebrow: "ACHIEVEMENTS",
    district: "Hall of Fame",
    description: "Milestones backed by the work, plus the trophies you earn here.",
    number: "06",
    objective: "Unlock every trophy",
  },
  gallery: {
    title: "PHOTO MODE",
    eyebrow: "GALLERY",
    district: "Arts Quarter",
    description: "The people and moments behind the projects.",
    number: "07",
    objective: "Browse the camera roll",
  },
  contact: {
    title: "LET'S TALK",
    eyebrow: "CONTACT",
    district: "Ocean Drive",
    description: "The next good idea starts with a conversation.",
    number: "08",
    objective: "Make the call",
  },
  resume: {
    title: "THE DOSSIER",
    eyebrow: "RESUME",
    district: "Records Office",
    description: "The professional profile, all in one place.",
    number: "09",
    objective: "Pull the file",
  },
};
