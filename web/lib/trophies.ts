"use client";
import { getGame, updateGame } from "./game-store";
import { pushToast } from "./toasts";
import { audioManager } from "./audio-manager";

/**
 * In-world trophies for exploring the site. They describe what the visitor
 * did here, never claims about Mukul's career.
 */
export const trophyList = [
  { id: "spawn", title: "Welcome to the Coast", detail: "Entered the world for the first time." },
  { id: "cartographer", title: "Cartographer", detail: "Opened the world map." },
  { id: "explorer", title: "Explorer", detail: "Discovered every district." },
  { id: "first-op", title: "First Operation", detail: "Read an operation to the end." },
  { id: "all-ops", title: "Mastermind", detail: "Completed every operation." },
  { id: "radio", title: "Tuned In", detail: "Turned on the radio." },
  { id: "developer", title: "Developer Mode", detail: "Entered the secret code." },
  { id: "source", title: "You Found the Source", detail: "Ran the hire command in the terminal." },
  { id: "night-owl", title: "Night Owl", detail: "Explored the coast after dark." },
  { id: "dialed", title: "Dialed In", detail: "Opened the phone." },
] as const;
export type TrophyId = (typeof trophyList)[number]["id"];

export function unlockTrophy(id: TrophyId) {
  const state = getGame();
  if (state.trophies.includes(id)) return;
  const trophy = trophyList.find((item) => item.id === id)!;
  updateGame({ trophies: [...state.trophies, id] });
  if (state.mode === "game") {
    pushToast({ kind: "achievement", title: trophy.title, detail: trophy.detail });
    audioManager.cue("achievement");
  }
}
