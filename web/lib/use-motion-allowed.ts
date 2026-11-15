"use client";
import { useSyncExternalStore } from "react";
import { useGame } from "./game-store";

const query = "(prefers-reduced-motion: reduce)";
function subscribe(callback: () => void) {
  const media = matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
    () => true,
  );
}

/** True only when game mode is on, the motion toggle is on and the OS allows motion. */
export function useMotionAllowed() {
  const state = useGame();
  const reduced = useReducedMotion();
  return state.mode === "game" && state.motion && !reduced;
}
