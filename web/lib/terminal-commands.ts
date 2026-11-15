import { projects } from "../content/projects";
import { socials, safeHref } from "../content/socials";
export type CommandResult = {
  lines: string[];
  href?: string;
  secret?: boolean;
  clear?: boolean;
};
export function executeCommand(input: string): CommandResult {
  const command = input.trim().toLowerCase();
  const routes: Record<string, string> = {
    about: "/about",
    projects: "/missions",
    experience: "/experience",
    skills: "/skills",
    hackathons: "/hackathons",
    achievements: "/achievements",
    contact: "/contact",
    resume: "/resume",
    map: "/map",
    gallery: "/gallery",
    timeline: "/about#story",
    story: "/about#story",
  };
  if (!command) return { lines: [] };
  if (command === "help")
    return {
      lines: [
        "about / projects / experience / skills",
        "hackathons / achievements / gallery / story",
        "contact / resume / github / map",
        "whoami / clear / help",
      ],
    };
  if (command === "clear") return { lines: [], clear: true };
  if (command === "whoami")
    return {
      lines: ["mukul_rana", "GenAI Engineer / agents, RAG, MCP, LLM apps"],
    };
  if (command === "sudo hire-mukul")
    return {
      lines: [
        "Secret unlocked: YOU FOUND THE SOURCE.",
        "No elevated permissions needed. Just a conversation.",
      ],
      href: "/contact",
      secret: true,
    };
  if (command === "github") {
    const href = safeHref(
      socials.find((item) => item.kind === "github")?.href ?? null,
    );
    return href
      ? { lines: ["GitHub profile ready."], href }
      : { lines: ["GitHub URL has not yet been supplied."] };
  }
  if (Object.hasOwn(routes, command))
    return {
      lines:
        command === "projects"
          ? projects.map(
              (project, index) =>
                `${String(index + 1).padStart(2, "0")} ${project.title}`,
            )
          : [`Opening ${command}...`],
      href: routes[command],
    };
  return {
    lines: [
      `Unknown command: ${input.slice(0, 80)}`,
      "Type help for available commands.",
    ],
  };
}
