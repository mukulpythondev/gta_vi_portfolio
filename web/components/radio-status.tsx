"use client";
import { Radio } from "lucide-react";
import { useGame } from "@/lib/game-store";
import { openPanel } from "@/lib/events";

const names: Record<string, string> = {
  "night-drive": "94.7 NIGHT DRIVE FM",
  sunset: "101.3 SUNSET BOULEVARD",
  ambient: "88.1 DEEP FOCUS RADIO",
};

export function RadioStatus() {
  const state = useGame();
  const live = state.sound && state.station !== "off";
  return (
    <button
      className={`hero-radio ${live ? "is-live" : ""}`}
      onClick={() => openPanel("sound")}
      aria-label="Open radio"
    >
      <Radio size={15} />
      <span className="hero-radio-text">{live ? names[state.station] : "RADIO OFF · TAP TO TUNE"}</span>
      <span className="equalizer" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
