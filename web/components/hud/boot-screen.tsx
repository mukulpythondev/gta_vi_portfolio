"use client";
import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import { districts } from "@/content/navigation";
import { world } from "@/content/world";
import { updateGame, getGame } from "@/lib/game-store";
import { audioManager } from "@/lib/audio-manager";
import { unlockTrophy } from "@/lib/trophies";
import { openPanel } from "@/lib/events";

const tips = [
  "TIP: Press M anywhere to open the world map.",
  "TIP: Press Q for quick travel between districts.",
  "TIP: Recruiter Mode skips the game and shows the work.",
  "TIP: Some secrets only open for people who know the code.",
];

const steps = [
  `Loading ${districts.length} districts`,
  `Loading ${projects.length} operations`,
  `Loading ${skills.length} weapons into the armory`,
  "Tuning the radio",
];

/**
 * First-visit-per-session boot sequence. Rendered on the server and hidden by
 * the pre-paint script when it should not play, so there is no flash.
 */
export function BootScreen() {
  const [phase, setPhase] = useState<"hidden" | "loading" | "ready" | "leaving">("loading");
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const start = useRef<HTMLButtonElement>(null);
  const done = useRef(false);

  const finish = async (withSound = false) => {
    if (done.current) return;
    done.current = true;
    try {
      sessionStorage.setItem("solara-booted", "1");
    } catch {}
    if (withSound && (await audioManager.activate())) {
      updateGame({ sound: true, station: getGame().station === "off" ? "night-drive" : getGame().station });
    }
    if (!getGame().firstSeen) updateGame({ firstSeen: Date.now() });
    audioManager.cue("start");
    setPhase("leaving");
    setTimeout(() => {
      document.documentElement.dataset.boot = "done";
      setPhase("hidden");
      unlockTrophy("spawn");
      openPanel("menu");
    }, 650);
  };

  useEffect(() => {
    if (document.documentElement.dataset.boot === "done") {
      done.current = true;
      queueMicrotask(() => setPhase("hidden"));
      return;
    }
    let frame = 0;
    const began = performance.now();
    let fontsReady = false;
    document.fonts?.ready.then(() => (fontsReady = true));
    const tick = (now: number) => {
      const timed = Math.min(1, (now - began) / 900);
      const value = fontsReady ? timed : Math.min(timed, 0.9);
      setProgress(value);
      if (value >= 1) {
        setPhase("ready");
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const rotate = setInterval(() => setTipIndex((index) => (index + 1) % tips.length), 2600);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(rotate);
    };
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    start.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Shift") return;
      if ((event.target as HTMLElement)?.closest?.(".boot button")) return;
      void finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  if (phase === "hidden") return null;
  const step = Math.min(steps.length - 1, Math.floor(progress * steps.length));
  return (
    <div className={`boot is-${phase}`} role="dialog" aria-label="Intro" aria-modal="false">
      {/* No photo here: the real hero art is already painted underneath and
          shows through the tint, so the first visit loads the page, not a splash. */}
      <div className="boot-shade" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <button className="boot-skip" onClick={() => void finish()}>
        Skip intro
      </button>
      <div className="boot-center">
        <span className="boot-badge" aria-hidden="true">
          MR<span>.</span>
        </span>
        <p className="boot-presents">MUKUL RANA PRESENTS</p>
        <p className="boot-title script">{world.name}</p>
        <p className="boot-sub">A PERSONAL OPEN WORLD · VOL. 01</p>
        {phase === "loading" ? (
          <div className="boot-progress">
            <div className="boot-bar">
              <span style={{ transform: `scaleX(${progress})` }} />
            </div>
            <p role="status">
              {steps[step]}… <b>{Math.round(progress * 100)}%</b>
            </p>
          </div>
        ) : (
          <div className="boot-start">
            <button ref={start} className="button button-primary press-start" onClick={() => void finish()}>
              Press start
            </button>
            <button className="button button-glass" onClick={() => void finish(true)}>
              <Volume2 size={16} /> Start with sound
            </button>
          </div>
        )}
      </div>
      <p className="boot-tip" key={tipIndex}>{tips[tipIndex]}</p>
    </div>
  );
}
