"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Star } from "lucide-react";
import { districtFor, districts, discoveredDistricts } from "@/content/navigation";
import { projects } from "@/content/projects";
import { sectionInfo } from "@/content/sections";
import { world } from "@/content/world";
import { useGame } from "@/lib/game-store";
import { art } from "@/lib/art";
import { MapArt, pt } from "../world/map-art";

/** Game-mode overlay: minimap (bottom-left) and objective tracker (right). */
export function HudOverlay() {
  const state = useGame();
  const path = usePathname();
  const discovered = discoveredDistricts(state.visited);
  const here = districtFor(path);
  const next = districts.find((item) => !discovered.includes(item.href));
  const reviewed = state.completed.filter((id) => id.startsWith("missions/")).length;
  const score = discovered.length / districts.length + reviewed / projects.length;
  const stars = Math.round((score / 2) * 5);
  const sectionKey = path.split("/")[1];
  const objective = next
    ? `Next stop: ${next.label}`
    : reviewed < projects.length
      ? `Read every project (${reviewed}/${projects.length})`
      : "World complete. Make the call.";
  const objectiveHref = next ? next.href : reviewed < projects.length ? "/missions" : "/contact";
  const centre = here ? pt(here) : { x: 500, y: 350 };
  // Fold to a small chip once the reader scrolls, so it never sits on content.
  const [folded, setFolded] = useState(false);
  useEffect(() => {
    const onScroll = () => setFolded(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="hud-overlay" aria-hidden="false">
      <aside className={`objective${folded ? " is-folded" : ""}`} aria-label="Current objective">
        <p className="objective-label">
          OBJECTIVE
          <span className="rep" role="img" aria-label={`Progress rating ${stars} of 5`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={11} className={index < stars ? "on" : ""} aria-hidden="true" />
            ))}
          </span>
        </p>
        <Link href={objectiveHref} className="objective-link">
          {objective}
          <ChevronRight size={15} />
        </Link>
        {sectionInfo[sectionKey] && (
          <p className="objective-sub">Here: {sectionInfo[sectionKey].objective}</p>
        )}
        <div className="objective-meter" aria-hidden="true">
          <span style={{ width: `${(discovered.length / districts.length) * 100}%` }} />
        </div>
        <p className="objective-count">
          {discovered.length}/{districts.length} districts · {reviewed}/{projects.length} projects
        </p>
      </aside>
      {path !== "/" && path !== "/map" && (
      <Link href="/map" className="minimap" aria-label="Open world map from minimap">
        <span
          className="minimap-world"
          style={{
            transform: `translate(${-(centre.x / 1000) * 100 + 50}%, ${-(centre.y / 700) * 100 + 50}%)`,
          }}
        >
          <MapArt discovered={discovered} idPrefix="mini" detail={false} painted={art("art/map/mini")} />
          {districts.map((item) => (
            <i
              key={item.href}
              className={`minimap-dot ${discovered.includes(item.href) ? "known" : ""} ${here?.href === item.href ? "here" : ""}`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            />
          ))}
        </span>
        <span className="minimap-player" />
        <span className="minimap-label">{here ? here.district : world.name}</span>
      </Link>
      )}
    </div>
  );
}
