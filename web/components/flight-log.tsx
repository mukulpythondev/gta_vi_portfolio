"use client";
import { useEffect, useRef } from "react";
import { BookOpen, BriefcaseBusiness, CalendarDays, CarFront, Flag, MapPin, Trophy } from "lucide-react";
import { timeline } from "@/content/timeline";
import type { TimelineItem } from "@/content/types";

const kindInfo: Record<TimelineItem["kind"], { icon: typeof BookOpen; reward: string }> = {
  Study: { icon: BookOpen, reward: "+ SKILL" },
  Work: { icon: BriefcaseBusiness, reward: "+ XP" },
  Hackathon: { icon: Trophy, reward: "+ RESPECT" },
  Milestone: { icon: Flag, reward: "+ REP" },
};

/**
 * Story mode as a run of story missions on a GPS route. A car drives down the
 * road as you scroll; each mission it reaches gets the "Mission passed" stamp.
 * Scroll work is one rAF-throttled handler writing a single transform.
 */
export function StoryMode() {
  const route = useRef<HTMLOListElement>(null);
  const car = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const list = route.current;
    const marker = car.current;
    if (!list || !marker) return;
    const missions = [...list.querySelectorAll<HTMLElement>(".story-mission")];
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = list.getBoundingClientRect();
      const anchor = innerHeight * 0.55;
      const progress = Math.min(1, Math.max(0, (anchor - box.top) / box.height));
      marker.style.transform = `translate3d(0, ${(progress * (box.height - 48)).toFixed(1)}px, 0)`;
      for (const mission of missions) mission.classList.toggle("is-passed", mission.getBoundingClientRect().top < anchor);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
    };
  }, []);

  const passed = timeline.length - 1;
  const current = timeline[timeline.length - 1];
  return (
    <div className="story-mode">
      <section className="story-hud" aria-label="Story summary">
        <div className="story-hud-grid" role="table" aria-label="Story progress">
          <div role="row" className="story-hud-head">
            <span role="columnheader">Missions</span>
            <span role="columnheader">Passed</span>
            <span role="columnheader">Last seen</span>
            <span role="columnheader">Completion</span>
          </div>
          <div role="row">
            <span role="cell">{String(timeline.length).padStart(2, "0")}</span>
            <span role="cell">{String(passed).padStart(2, "0")}</span>
            <span role="cell">{current.place}</span>
            <span role="cell" className="story-hud-pct">
              {Math.round((passed / timeline.length) * 100)}%
              <i style={{ width: `${(passed / timeline.length) * 100}%` }} />
            </span>
          </div>
        </div>
        <p className="story-hud-note">
          <span className="live-dot" /> STORY IN PROGRESS · FREE ROAM UNLOCKED
        </p>
      </section>

      <ol className="story-route" ref={route}>
        <span className="gps-road" aria-hidden="true" />
        <span className="gps-car" ref={car} aria-hidden="true">
          <CarFront size={24} strokeWidth={1.8} />
        </span>
        {timeline.map((item, index) => {
          const { icon: Icon, reward } = kindInfo[item.kind];
          const isCurrent = index === timeline.length - 1;
          return (
            <li key={`${item.date}-${item.title}`} className={`story-mission kind-${item.kind.toLowerCase()}${isCurrent ? " is-current" : ""}`}>
              <span className="gps-pin" aria-hidden="true">
                <Icon size={16} />
              </span>
              <article>
                <header className="mission-head">
                  <span>MISSION {String(index + 1).padStart(2, "0")}</span>
                  <span>{item.kind.toUpperCase()}</span>
                </header>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <dl className="mission-meta">
                  <div>
                    <dt className="sr-only">Date</dt>
                    <dd>
                      <CalendarDays size={14} /> <time>{item.date}</time>
                    </dd>
                  </div>
                  <div>
                    <dt className="sr-only">Location</dt>
                    <dd>
                      <MapPin size={14} /> {item.place}
                    </dd>
                  </div>
                  <div>
                    <dt className="sr-only">Reward</dt>
                    <dd className="mission-reward">{reward}</dd>
                  </div>
                </dl>
                <span className="mission-stamp" aria-hidden="true">
                  {isCurrent ? "In progress" : "Mission passed"}
                  <small>{isCurrent ? "objective active" : reward.replace("+ ", "") + " +1"}</small>
                </span>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
