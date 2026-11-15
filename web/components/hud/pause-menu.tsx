"use client";
import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  Gamepad2,
  Home,
  Keyboard,
  Map,
  Play,
  Radio,
  RotateCcw,
  TerminalSquare,
} from "lucide-react";
import { districts, discoveredDistricts } from "@/content/navigation";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import { world } from "@/content/world";
import { resetProgress, updateGame, useGame } from "@/lib/game-store";
import { trophyList } from "@/lib/trophies";
import { useModal } from "@/lib/use-modal";
import { useClock } from "@/lib/use-clock";
import { HudClock } from "./clock";

export default function PauseMenu({
  onClose,
  onSettings,
  onMainMenu,
  onTerminal,
}: {
  onClose: () => void;
  onSettings: () => void;
  onMainMenu: () => void;
  onTerminal: () => void;
}) {
  const dialog = useModal();
  const state = useGame();
  const clock = useClock();
  const [tab, setTab] = useState<"stats" | "controls">("stats");
  const [confirmReset, setConfirmReset] = useState(false);
  const discovered = discoveredDistricts(state.visited).length;
  const reviewed = state.completed.filter((id) => id.startsWith("missions/")).length;
  const days = state.firstSeen && clock ? Math.max(0, Math.floor((clock.getTime() - state.firstSeen) / 86400000)) : 0;
  const total = Math.round(
    ((discovered / districts.length) * 0.4 +
      (reviewed / projects.length) * 0.4 +
      (state.trophies.length / trophyList.length) * 0.2) *
      100,
  );
  const stats: [string, string][] = [
    ["World completion", `${total}%`],
    ["Districts discovered", `${discovered} / ${districts.length}`],
    ["Operations completed", `${reviewed} / ${projects.length}`],
    ["Trophies unlocked", `${state.trophies.length} / ${trophyList.length}`],
    ["Secrets found", `${state.secrets.length} / 2`],
    ["Days on the coast", String(days)],
    ["Operations in the portfolio", String(projects.length)],
    ["Technologies in the inventory", String(skills.length)],
  ];
  return (
    <dialog
      ref={dialog}
      className="pause-dialog"
      aria-labelledby="pause-title"
      data-lenis-prevent
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="pause-side">
        <p className="eyebrow">{world.name.toUpperCase()}</p>
        <h2 id="pause-title">Paused</h2>
        <HudClock />
        <button className="pause-item" onClick={onClose} autoFocus>
          <Play size={17} /> Resume
        </button>
        <Link className="pause-item" href="/map" onClick={onClose}>
          <Map size={17} /> World map
        </Link>
        <button className="pause-item" aria-pressed={tab === "stats"} onClick={() => setTab("stats")}>
          <BarChart3 size={17} /> Stats
        </button>
        <button className="pause-item" aria-pressed={tab === "controls"} onClick={() => setTab("controls")}>
          <Keyboard size={17} /> Controls
        </button>
        <button className="pause-item" onClick={onMainMenu}>
          <Home size={17} /> Main menu
        </button>
        <button className="pause-item" onClick={onSettings}>
          <Radio size={17} /> Radio & settings
        </button>
        <button className="pause-item" onClick={onTerminal}>
          <TerminalSquare size={17} /> Terminal
        </button>
        <button
          className="pause-item"
          onClick={() => {
            updateGame({ mode: state.mode === "game" ? "recruiter" : "game" });
            onClose();
          }}
        >
          {state.mode === "game" ? <BriefcaseBusiness size={17} /> : <Gamepad2 size={17} />}
          {state.mode === "game" ? "Quit to Recruiter Mode" : "Back to Game Mode"}
        </button>
      </div>
      <div className="pause-main">
        {tab === "stats" ? (
          <>
            <p className="eyebrow">STATS · THIS DEVICE ONLY</p>
            <dl className="stat-table">
              {stats.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="pause-reset">
              {confirmReset ? (
                <>
                  <span>Reset all progress on this device?</span>
                  <button
                    className="button button-glass"
                    onClick={() => {
                      resetProgress();
                      setConfirmReset(false);
                    }}
                  >
                    Yes, reset
                  </button>
                  <button className="text-link" onClick={() => setConfirmReset(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="text-link" onClick={() => setConfirmReset(true)}>
                  <RotateCcw size={15} /> Reset progress
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="eyebrow">CONTROLS</p>
            <dl className="controls-table">
              {[
                ["M", "Open the world map"],
                ["Q", "Quick travel"],
                ["Esc", "Pause / close"],
                ["Arrows", "Move between districts on the map and wheel"],
                ["Drag · Scroll", "Pan and zoom the map"],
                ["↑↑↓↓←→←→BA", "Something for developers"],
              ].map(([key, label]) => (
                <div key={key}>
                  <dt>
                    <kbd>{key}</kbd>
                  </dt>
                  <dd>{label}</dd>
                </div>
              ))}
            </dl>
            <p className="muted">Shortcuts are active in Game Mode and never fire while you type.</p>
          </>
        )}
      </div>
    </dialog>
  );
}
