"use client";
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { experience } from "@/content/experience";
import { playtime } from "@/lib/playtime";
import { useMotionAllowed } from "@/lib/use-motion-allowed";

/** Oldest job first, so the road runs left to right through time. */
const chapters = [...experience].reverse();
const desktopQuery = "(min-width: 761px)";

function subscribeDesktop(callback: () => void) {
  const media = matchMedia(desktopQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

/** Desktop drives the road sideways; phones read the same cards vertically. */
export function CareerRoad() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const motionAllowed = useMotionAllowed();
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => matchMedia(desktopQuery).matches,
    () => false,
  );

  useEffect(() => {
    const outer = section.current;
    const row = track.current;
    const stage = outer?.querySelector<HTMLElement>(".road-stage");
    if (
      !outer ||
      !row ||
      !stage ||
      !motionAllowed ||
      !desktop
    )
      return;
    let distance = 0;
    let frame = 0;
    let width = 0;
    const measure = () => {
      width = innerWidth;
      distance = Math.max(0, row.scrollWidth - innerWidth);
      // Pinned for as long as it takes to drive the whole road. The stage is
      // 100svh, which (unlike innerHeight) stays put when a phone's address
      // bar slides away, so the section doesn't jump mid-scroll.
      outer.style.height = `${stage.offsetHeight + distance}px`;
    };
    const update = () => {
      frame = 0;
      const top = outer.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, -top / Math.max(1, distance)));
      row.style.transform = `translate3d(${(-progress * distance).toFixed(1)}px, 0, 0)`;
      outer.style.setProperty("--road", progress.toFixed(4));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    outer.classList.add("is-pinned");
    measure();
    update();
    const onResize = () => {
      // Phones fire resize when the address bar shows or hides; only a real
      // width change (rotation, window resize) needs a new measurement.
      if (innerWidth !== width) measure();
      request();
    };
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", request);
      removeEventListener("resize", onResize);
      outer.classList.remove("is-pinned");
      outer.style.height = "";
      row.style.transform = "";
    };
  }, [motionAllowed, desktop]);

  return (
    <section ref={section} className="career-road" aria-labelledby="road-title">
      <div className="road-stage">
        <div className="road-head">
          <p className="eyebrow">
            <span className="section-index">04 /</span> MAIN STORY
          </p>
          <h2 id="road-title">
            THE ROAD SO FAR<span>.</span>
          </h2>
          <Link href="/experience" className="text-link">
            Full story <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="road-viewport">
          <div className="road-track" ref={track}>
            <span className="road-line" aria-hidden="true" />
            {chapters.map((item, index) => {
              const current = /present/i.test(item.duration);
              const [role, setup] = item.role.replace(")", "").split(" (");
              return (
                <Link
                  key={item.slug}
                  href={`/experience/${item.slug}`}
                  className={`road-stop${current ? " is-current" : ""}`}
                >
                  <span className="road-pin" aria-hidden="true">
                    <MapPin size={18} />
                  </span>
                  <span className="road-chapter">
                    CHAPTER {String(index + 1).padStart(2, "0")} · {current ? "IN PROGRESS" : "COMPLETED"}
                  </span>
                  <span className="road-date">{item.duration}</span>
                  <strong className="road-company">{item.company}</strong>
                  <span className="road-role">
                    {role}
                    {setup && <em> · {setup}</em>}
                  </span>
                  <span className="road-plain">{item.plain}</span>
                  {item.impact[0] && <span className="road-impact">{item.impact[0]}</span>}
                  <span className="road-foot">
                    <span className="road-tags">
                      {item.technologies.slice(0, 4).map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </span>
                    <span className="road-time">
                      <small>Playtime</small>
                      {playtime(item.duration)}
                    </span>
                  </span>
                </Link>
              );
            })}
            <Link href="/contact" className="road-stop road-next">
              <span className="road-pin" aria-hidden="true">
                <MapPin size={18} />
              </span>
              <span className="road-chapter">CHAPTER {String(chapters.length + 1).padStart(2, "0")} · LOCKED</span>
              <strong className="road-company">Your team?</strong>
              <span className="road-plain">
                The next chapter starts with a conversation. Open to GenAI and backend roles.
              </span>
              <span className="road-cta">
                Start the mission <ArrowUpRight size={18} />
              </span>
            </Link>
          </div>
        </div>
        <div className="road-progress" aria-hidden="true">
          <i />
        </div>
      </div>
    </section>
  );
}
