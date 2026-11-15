"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { skillCategories, skills } from "@/content/skills";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { audioManager } from "@/lib/audio-manager";
import { WeaponArt, type WeaponKind } from "./weapon-art";

/** Each skill category is a weapon class. Stats come from real usage, never self-rated. */
const classes: Record<string, { name: string; kind: WeaponKind; rarity: string }> = {
  Agents: { name: "Heavy weapons", kind: "launcher", rarity: "legendary" },
  RAG: { name: "Sniper rifles", kind: "sniper", rarity: "legendary" },
  Models: { name: "Assault rifles", kind: "rifle", rarity: "epic" },
  Backend: { name: "SMGs", kind: "smg", rarity: "rare" },
  Infra: { name: "Shotguns", kind: "shotgun", rarity: "rare" },
  Frontend: { name: "Sidearms", kind: "pistol", rarity: "uncommon" },
};

type Skill = (typeof skills)[number];

const opsCount = (skill: Skill) =>
  skill.projects.filter((item) => item.href.startsWith("/missions/")).length;
const jobsCount = (skill: Skill) =>
  skill.projects.filter((item) => item.href.startsWith("/experience/")).length;

export function Inventory() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [equippedName, setEquipped] = useState<string | null>(null);
  const filtered = skills
    .filter(
      (skill) =>
        (category === "All" || skill.category === category) &&
        skill.name.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => b.projects.length - a.projects.length);
  // The full set is 67 items: show the most-used as cards, the rest as compact chips.
  const compact = category === "All" && !query;
  const featured = compact ? filtered.slice(0, 12) : filtered;
  const more = compact ? filtered.slice(12) : [];
  const equipped =
    filtered.find((skill) => skill.name === equippedName) ?? filtered[0] ?? null;
  const wheel = skillCategories.slice(1);

  const pick = (item: string) => {
    if (item !== category) audioManager.cue("tick");
    setCategory(item);
    setEquipped(null);
  };

  return (
    <>
      <div className="armory-top">
        <div className="weapon-wheel" aria-label="Filter skills" role="group">
          {wheel.map((item, index) => {
            const info = classes[item];
            const angle = (index / wheel.length) * 360 - 90;
            return (
              <button
                key={item}
                className={`armory-slot rarity-${info.rarity}`}
                style={{
                  left: `${50 + 36 * Math.cos((angle * Math.PI) / 180)}%`,
                  top: `${50 + 36 * Math.sin((angle * Math.PI) / 180)}%`,
                }}
                aria-pressed={category === item}
                onClick={() => pick(item)}
              >
                <WeaponArt kind={info.kind} />
                <span className="armory-label">{item}</span>
                <small aria-hidden="true">{info.name}</small>
              </button>
            );
          })}
          <button
            className="armory-hub"
            aria-pressed={category === "All"}
            onClick={() => pick("All")}
          >
            All
            <small aria-hidden="true">{skills.length} weapons</small>
          </button>
        </div>

        <section
          className={`equipped rarity-${equipped ? classes[equipped.category].rarity : "rare"}`}
          aria-label="Equipped weapon"
        >
          <p className="eyebrow">EQUIPPED</p>
          {equipped ? (
            <>
              <WeaponArt kind={classes[equipped.category].kind} className="equipped-art" />
              <h2>{equipped.name}</h2>
              <p className="equipped-class">
                {classes[equipped.category].name} · {equipped.category}
              </p>
              <dl className="weapon-stats">
                <div>
                  <dt>Projects</dt>
                  <dd>
                    <meter min={0} max={projects.length} value={opsCount(equipped)} />
                    <span>{opsCount(equipped)}</span>
                  </dd>
                </div>
                <div>
                  <dt>Jobs</dt>
                  <dd>
                    <meter min={0} max={experience.length} value={jobsCount(equipped)} />
                    <span>{jobsCount(equipped)}</span>
                  </dd>
                </div>
              </dl>
              <p className="muted small-print">
                Stats count where the skill was actually used. Not a self-rating.
              </p>
            </>
          ) : (
            <p className="muted">Nothing in this slot.</p>
          )}
        </section>
      </div>

      <div className="filter-toolbar">
        <p className="results-count" aria-live="polite">
          {filtered.length} skills / {category === "All" ? "most used first" : classes[category].name}
        </p>
        <label className="search-field">
          <Search size={16} />
          <span className="sr-only">Search skills</span>
          <input
            placeholder="Search the armory"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <div className="inventory-grid">
        {featured.map((skill) => {
          const info = classes[skill.category];
          return (
            <details
              className={`skill-item rarity-${info.rarity}`}
              key={skill.name}
              onToggle={(event) => {
                if ((event.currentTarget as HTMLDetailsElement).open) setEquipped(skill.name);
              }}
            >
              <summary>
                <WeaponArt kind={info.kind} className="card-art" />
                <span>
                  <strong>{skill.name}</strong>
                  <small>{skill.category}</small>
                </span>
                <span
                  className="skill-count"
                  title={skill.projects.length ? "Projects and jobs that used it" : "Listed on the resume"}
                >
                  {skill.projects.length ? `×${skill.projects.length}` : "CV"}
                </span>
              </summary>
              <div className="skill-projects">
                <p className="eyebrow">USED IN</p>
                {!skill.projects.length && (
                  <p className="muted">From the resume skill set.</p>
                )}
                {skill.projects.map((project) => (
                  <Link key={project.href} href={project.href}>
                    {project.title}
                    <ArrowUpRight size={15} />
                  </Link>
                ))}
              </div>
            </details>
          );
        })}
      </div>
      {more.length > 0 && (
        <div className="armory-more">
          {wheel.map((item) => {
            const rest = more.filter((skill) => skill.category === item);
            if (!rest.length) return null;
            return (
              <div key={item} className="armory-more-row">
                <button type="button" className="armory-more-class" onClick={() => pick(item)}>
                  {item}
                  <small>{classes[item].name}</small>
                </button>
                <ul className="tags">
                  {rest.map((skill) => (
                    <li key={skill.name}>
                      <span>
                        {skill.name}
                        {skill.projects.length > 0 && <b> ×{skill.projects.length}</b>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <p className="muted small-print">
            ×N = projects and jobs that used it. CV = listed on the resume. Not a self-rating.
          </p>
        </div>
      )}
      {!filtered.length && (
        <p className="empty-search">No technologies match this search.</p>
      )}
    </>
  );
}
