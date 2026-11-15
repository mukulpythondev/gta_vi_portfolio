"use client";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { getGame, updateGame, useGame } from "@/lib/game-store";
import { pushToast } from "@/lib/toasts";
import { unlockTrophy } from "@/lib/trophies";
import { audioManager } from "@/lib/audio-manager";
import { useMotionAllowed } from "@/lib/use-motion-allowed";
import { projects } from "@/content/projects";

/** Sentinel at the end of a detail page: reaching it completes the "mission". */
export function MissionComplete({ id, label }: { id: string; label: string }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const state = useGame();
  const allowed = useMotionAllowed();
  const [celebrate, setCelebrate] = useState(false);
  const done = state.completed.includes(id);

  useEffect(() => {
    const element = sentinel.current;
    if (!element || done) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const current = getGame();
        if (current.completed.includes(id)) return;
        const completed = [...current.completed, id];
        updateGame({ completed });
        if (current.mode === "game") {
          audioManager.cue("complete");
          pushToast({ kind: "mission", title: `${label} complete`, detail: "+1 operation reviewed" });
          if (allowed) {
            setCelebrate(true);
            setTimeout(() => setCelebrate(false), 2400);
          }
        }
        unlockTrophy("first-op");
        if (projects.every((project) => completed.includes(`missions/${project.slug}`)))
          unlockTrophy("all-ops");
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [id, label, done, allowed]);

  return (
    <>
      <div ref={sentinel} className={`mission-status ${done ? "is-done" : ""}`}>
        <CheckCircle2 size={18} />
        {done ? "Operation complete" : "Reach the end of the file to complete this operation"}
      </div>
      {celebrate && (
        <div className="mission-passed" aria-hidden="true">
          <span className="letterbox top" />
          <span className="letterbox bottom" />
          <div>
            <p className="script">Operation complete</p>
            <strong>{label.toUpperCase()}</strong>
            <span>+1 OPERATION REVIEWED</span>
          </div>
        </div>
      )}
    </>
  );
}
