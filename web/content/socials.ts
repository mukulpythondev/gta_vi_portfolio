export const socials: {
  label: string;
  href: string | null;
  kind: "email" | "github" | "linkedin" | "resume";
}[] = [
  { label: "Email", href: "mailto:devmukulrana@gmail.com", kind: "email" },
  { label: "GitHub", href: "https://github.com/mukulpythondev", kind: "github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mukul-webdev",
    kind: "linkedin",
  },
  { label: "Choose resume", href: "/resume", kind: "resume" },
];
export function safeHref(value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return ["https:", "mailto:"].includes(url.protocol) ? value : null;
  } catch {
    return null;
  }
}
