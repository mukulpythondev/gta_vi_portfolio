export type District = {
  href: string;
  label: string;
  professional: string;
  district: string;
  icon: string;
  intel: string;
  /** Position on the world map, in % of the map canvas. */
  x: number;
  y: number;
};

export const districts: District[] = [
  {
    href: "/about",
    label: "Character profile",
    professional: "About",
    district: "Safehouse",
    icon: "user",
    intel: "Who the engineer is, what drives the work.",
    x: 24,
    y: 30,
  },
  {
    href: "/experience",
    label: "Main missions",
    professional: "Experience",
    district: "Corporate HQ",
    icon: "building",
    intel: "Professional roles, responsibilities, outcomes.",
    x: 49,
    y: 22,
  },
  {
    href: "/missions",
    label: "Operations",
    professional: "Projects",
    district: "Dev District",
    icon: "code",
    intel: "Six operations, from AI assistants to platforms.",
    x: 68,
    y: 42,
  },
  {
    href: "/hackathons",
    label: "Side quests",
    professional: "Hackathons",
    district: "The Arena",
    icon: "flag",
    intel: "Weekend builds, teams and results.",
    x: 36,
    y: 54,
  },
  {
    href: "/skills",
    label: "The Armory",
    professional: "Skills",
    district: "The Warehouse",
    icon: "layers",
    intel: "Every technology, linked to where it was used.",
    x: 55,
    y: 66,
  },
  {
    href: "/achievements",
    label: "Trophy room",
    professional: "Achievements",
    district: "Hall of Fame",
    icon: "trophy",
    intel: "Milestones and in-world trophies.",
    x: 14,
    y: 79,
  },
  {
    href: "/gallery",
    label: "Photo mode",
    professional: "Gallery",
    district: "Arts Quarter",
    icon: "camera",
    intel: "The people and moments behind the projects.",
    x: 76,
    y: 76,
  },
  {
    href: "/contact",
    label: "Let's talk",
    professional: "Contact",
    district: "Ocean Drive",
    icon: "phone",
    intel: "Open the phone. Start a conversation.",
    x: 82,
    y: 20,
  },
];

export function districtFor(path: string) {
  return districts.find(
    (item) => path === item.href || path.startsWith(`${item.href}/`),
  );
}

export function discoveredDistricts(visited: string[]) {
  return districts
    .filter((item) =>
      visited.some(
        (path) => path === item.href || path.startsWith(`${item.href}/`),
      ),
    )
    .map((item) => item.href);
}
