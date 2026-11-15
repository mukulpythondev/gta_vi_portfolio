"use client";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Controls for a server-rendered horizontal list (`<ul id={target}>` inside a
 * `.scroll-rail` wrapper): faded edges where more waits, previous/next
 * buttons and a "1–4 of 8" counter. Edges and counter are written straight to
 * the DOM, so scrolling never re-renders React.
 */
export function RailControls({ target, count, label }: { target: string; count: number; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const prev = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const rail = document.getElementById(target);
    const wrap = rail?.closest<HTMLElement>(".scroll-rail");
    if (!rail || !wrap) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const left = rail.scrollLeft;
      const right = left + rail.clientWidth;
      const items = Array.from(rail.children) as HTMLElement[];
      const seen = items
        .map((item, index) => ({ index, mid: item.offsetLeft - rail.offsetLeft + item.offsetWidth / 2 }))
        .filter((item) => item.mid >= left && item.mid <= right);
      const atStart = left <= 4;
      const atEnd = right >= rail.scrollWidth - 4;
      wrap.classList.toggle("at-start", atStart);
      wrap.classList.toggle("at-end", atEnd);
      if (box.current) box.current.hidden = atStart && atEnd;
      if (prev.current) prev.current.disabled = atStart;
      if (next.current) next.current.disabled = atEnd;
      if (counter.current)
        counter.current.textContent = `${(seen[0]?.index ?? 0) + 1}–${(seen.at(-1)?.index ?? count - 1) + 1} of ${count}`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    rail.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [target, count]);

  const move = (direction: number) => {
    const rail = document.getElementById(target);
    rail?.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="scroll-rail-controls" ref={box}>
      <span className="scroll-rail-count" ref={counter} aria-live="polite">
        1–{count} of {count}
      </span>
      <button ref={prev} className="icon-button" aria-label={`Previous ${label}`} disabled onClick={() => move(-1)}>
        <ChevronLeft size={20} />
      </button>
      <button ref={next} className="icon-button" aria-label={`More ${label}`} onClick={() => move(1)}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
