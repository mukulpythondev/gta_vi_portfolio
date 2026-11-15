import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { experience } from "@/content/experience";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
/** "Sep 2024 – Mar 2025" → "7 mo". Present counts to the build date. */
export function playtime(duration: string) {
  const [from, to] = duration.split(/\s+[–-]\s+/);
  const month = (text: string) => {
    if (/present/i.test(text)) {
      const now = new Date();
      return now.getFullYear() * 12 + now.getMonth();
    }
    const [m, y] = text.trim().split(" ");
    return Number(y) * 12 + MONTHS.indexOf(m);
  };
  const months = month(to ?? from) - month(from) + 1;
  if (months < 12) return `${months} mo`;
  return months % 12
    ? `${Math.floor(months / 12)} yr ${months % 12} mo`
    : `${months / 12} yr`;
}

/** Total months across all jobs. */
export function monthsOf(duration: string) {
  const [from, to] = duration.split(/\s+[–-]\s+/);
  const month = (text: string) => {
    if (/present/i.test(text)) {
      const now = new Date();
      return now.getFullYear() * 12 + now.getMonth();
    }
    const [m, y] = text.trim().split(" ");
    return Number(y) * 12 + MONTHS.indexOf(m);
  };
  return month(to ?? from) - month(from) + 1;
}

/**
 * Each job as a game save slot. Used on the homepage and the experience page.
 * Playtime is shown as a number only: a bar had no fixed maximum to read against.
 */
export function SaveSlots({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className={`save-slots${detailed ? " is-detailed" : ""}`}>
      {experience.map((item, index) => {
        const current = /present/i.test(item.duration);
        const [role, setup] = item.role.replace(")", "").split(" (");
        return (
          <li key={item.slug}>
            <Link
              href={`/experience/${item.slug}`}
              className={`save-slot${current ? " is-current" : ""}`}
            >
              <span className="slot-number" aria-hidden="true">
                {String(experience.length - index).padStart(2, "0")}
              </span>
              <div className="slot-body">
                <p className="slot-label">{item.duration}</p>
                <strong>{item.company}</strong>
                <span className="slot-role">
                  {role}
                  {setup && <em>{setup}</em>}
                </span>
                <span className="slot-desc">{item.description}</span>
                {detailed && (
                  <ul className="slot-objectives">
                    {item.responsibilities.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
                <span className="slot-tags">
                  {item.technologies.slice(0, detailed ? 8 : 4).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </span>
              </div>
              <div className="slot-side">
                <span className="slot-status">
                  {current ? "In progress" : "Completed"}
                </span>
                <dl>
                  <dt>Playtime</dt>
                  <dd>{playtime(item.duration)}</dd>
                </dl>
                <span className="slot-cta">
                  {current ? "Continue" : "Replay"} <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
