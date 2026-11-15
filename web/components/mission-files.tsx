import Link from "next/link";
import { ArrowUpRight, Check, Clock, Globe, Layers, MapPin, Star, Trophy } from "lucide-react";
import { experience } from "@/content/experience";
import { ExplainToggle, Say } from "./explain-toggle";
import { playtime } from "@/lib/playtime";

/** One accent per chapter, newest first: cyan (now), orange, pink. */
const ACCENTS = ["cyan", "orange", "pink"];

/**
 * The experience page as a stack of mission files on a road: a HUD stat bar,
 * then each job with its briefing (plain or technical), objectives ticked off,
 * rewards (real outcomes), the loadout it used and a link to the full file.
 */
export function MissionFiles() {
  const first = experience[experience.length - 1].duration.split(/\s+[–-]\s+/)[0];
  const current = experience.find((item) => /present/i.test(item.duration));
  const stack = new Set(experience.flatMap((item) => item.technologies)).size;
  const remote = experience.filter((item) => /remote/i.test(item.role)).length;

  return (
    <div className="mission-files">
      <dl className="career-hud">
        <div>
          <Clock size={20} aria-hidden="true" />
          <dt>Total playtime</dt>
          <dd>{playtime(`${first} – Present`)}</dd>
        </div>
        <div>
          <MapPin size={20} aria-hidden="true" />
          <dt>Chapters</dt>
          <dd>{String(experience.length).padStart(2, "0")}</dd>
        </div>
        <div>
          <Globe size={20} aria-hidden="true" />
          <dt>Remote</dt>
          <dd>
            {remote}/{experience.length}
          </dd>
        </div>
        <div>
          <Layers size={20} aria-hidden="true" />
          <dt>Tools used</dt>
          <dd>{stack}</dd>
        </div>
        {current && (
          <div className="hud-now">
            <span className="now-dot" aria-hidden="true" />
            <dt>Now playing</dt>
            <dd>{current.company}</dd>
          </div>
        )}
      </dl>

      <div className="files-bar">
        <p className="eyebrow">MAIN STORY · NEWEST FIRST</p>
        <ExplainToggle />
      </div>

      <ol className="file-road">
        {experience.map((item, index) => {
          const live = /present/i.test(item.duration);
          const chapter = String(experience.length - index).padStart(2, "0");
          const [role, setup] = item.role.replace(")", "").split(" (");
          return (
            <li key={item.slug} className={`mission-file accent-${ACCENTS[index % ACCENTS.length]}${live ? " is-live" : ""}`}>
              <span className="file-pin" aria-hidden="true">
                {live ? <span className="now-dot" /> : <Check size={16} strokeWidth={3} />}
              </span>
              <article aria-labelledby={`file-${item.slug}`}>
                <header className="file-top">
                  <span className="file-chapter">
                    CHAPTER {chapter} · MAIN MISSION
                  </span>
                  <span className="file-status">{live ? "In progress" : "Mission passed"}</span>
                </header>

                <div className="file-head">
                  <span className="file-number" aria-hidden="true">
                    {chapter}
                  </span>
                  <div>
                    <p className="file-dates">
                      {item.duration} · <strong>{playtime(item.duration)}</strong>
                    </p>
                    <h2 id={`file-${item.slug}`}>{item.company}</h2>
                    <p className="file-role">
                      {role}
                      {setup && <em>{setup}</em>}
                    </p>
                  </div>
                </div>

                <Say className="file-brief" plain={item.plain} tech={item.missionNarrative} />

                <div className="file-grid">
                  <section>
                    <h3>Objectives</h3>
                    <ul className="file-objectives">
                      {item.responsibilities.map((line) => (
                        <li key={line}>
                          <Check size={15} strokeWidth={3} aria-hidden="true" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </section>
                  {item.impact.length > 0 && (
                    <section>
                      <h3>Rewards</h3>
                      <ul className="file-rewards">
                        {item.impact.map((line, rank) => (
                          <li key={line}>
                            {rank ? <Star size={15} aria-hidden="true" /> : <Trophy size={15} aria-hidden="true" />}
                            {line}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                <footer className="file-foot">
                  <span className="file-loadout" aria-label="Tools used">
                    {item.technologies.slice(0, 8).map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </span>
                  <Link href={`/experience/${item.slug}`} className="file-cta">
                    {live ? "Continue mission" : "Replay mission"} <ArrowUpRight size={16} />
                  </Link>
                </footer>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
