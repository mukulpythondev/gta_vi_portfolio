"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sectionInfo } from "@/content/sections";
import { projects } from "@/content/projects";
import { useMotionAllowed } from "@/lib/use-motion-allowed";
import { audioManager } from "@/lib/audio-manager";

type Card = { number: string; district: string; title: string; objective: string };

function cardFor(path: string): Card | null {
  const [section, slug] = path.split("/").slice(1);
  const info = sectionInfo[section];
  if (!info) return null;
  if (section === "missions" && slug) {
    const project = projects.find((item) => item.slug === slug);
    if (!project) return null;
    return {
      number: `OPERATION ${String(projects.indexOf(project) + 1).padStart(2, "0")}`,
      district: info.district,
      title: project.title.toUpperCase(),
      objective: project.description,
    };
  }
  if (slug) return null;
  return {
    number: section === "map" ? "FREE ROAM" : `MISSION ${info.number}`,
    district: info.district,
    title: info.title,
    objective: info.objective,
  };
}

/**
 * Letterboxed briefing card on client-side navigation. Once per route per
 * session; any key or click dismisses it. Decorative (aria-hidden): the page
 * heading underneath carries the same information.
 */
export function MissionIntro() {
  const path = usePathname();
  const allowed = useMotionAllowed();
  const previous = useRef<string | null>(null);
  const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    const first = previous.current === null;
    previous.current = path;
    if (first || !allowed) return;
    let seen: string[] = [];
    try {
      seen = JSON.parse(sessionStorage.getItem("solara-intros") ?? "[]");
    } catch {}
    const next = cardFor(path);
    if (!next || seen.includes(path)) return;
    try {
      sessionStorage.setItem("solara-intros", JSON.stringify([...seen, path].slice(-40)));
    } catch {}
    queueMicrotask(() => setCard(next));
    audioManager.cue("open");
    const timer = setTimeout(() => setCard(null), 1700);
    return () => clearTimeout(timer);
  }, [path, allowed]);

  useEffect(() => {
    if (!card) return;
    const close = () => setCard(null);
    window.addEventListener("keydown", close, { once: true });
    window.addEventListener("pointerdown", close, { once: true });
    window.addEventListener("wheel", close, { once: true, passive: true });
    return () => {
      window.removeEventListener("keydown", close);
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("wheel", close);
    };
  }, [card]);

  if (!card) return null;
  return (
    <div className="mission-intro" aria-hidden="true">
      <span className="letterbox top" />
      <span className="letterbox bottom" />
      <div className="intro-card">
        <p className="intro-number">{card.number}</p>
        <p className="intro-district script">{card.district}</p>
        <p className="intro-title">{card.title}</p>
        <p className="intro-objective">
          <span>OBJECTIVE</span> {card.objective}
        </p>
      </div>
    </div>
  );
}
