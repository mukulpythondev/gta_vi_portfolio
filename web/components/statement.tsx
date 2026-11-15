"use client";
import { useEffect, useRef } from "react";

/**
 * One big line, Lando Norris style: the words light up one by one as the
 * section scrolls through the screen. Without motion (or before script runs)
 * every word is simply lit, so nothing is ever unreadable.
 */
export function Statement({ lines }: { lines: { text: string; accent?: string }[][] }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = ref.current;
    const world = document.querySelector<HTMLElement>(".world");
    if (
      !section ||
      world?.dataset.motion !== "on" ||
      world.dataset.mode === "recruiter" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const words = [...section.querySelectorAll<HTMLElement>(".st-word")];
    section.classList.add("is-live");
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = section.getBoundingClientRect();
      // 0 when the section's top reaches 85% of the screen, 1 when its bottom passes 55%.
      const progress = Math.min(1, Math.max(0, (innerHeight * 0.85 - box.top) / (box.height + innerHeight * 0.3)));
      const lit = Math.round(progress * words.length * 1.15);
      words.forEach((word, index) => word.classList.toggle("is-lit", index < lit));
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
      section.classList.remove("is-live");
    };
  }, []);

  return (
    <section ref={ref} className="statement" aria-label="What I do">
      <p className="statement-text">
        {lines.map((line, l) => (
          <span key={l} className="st-line">
            {line.map((part, p) =>
              part.text.split(" ").map((word, w) => (
                <span key={`${p}-${w}`} className={`st-word${part.accent ? ` st-${part.accent}` : ""}`}>
                  {word}{" "}
                </span>
              )),
            )}
          </span>
        ))}
      </p>
    </section>
  );
}
