"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { districtFor, districts, discoveredDistricts } from "@/content/navigation";
import { getGame, updateGame } from "@/lib/game-store";
import { holdToasts, pushToast } from "@/lib/toasts";
import { unlockTrophy } from "@/lib/trophies";
import { audioManager } from "@/lib/audio-manager";
import { openPanel } from "@/lib/events";
import { timeOfDay } from "@/lib/use-clock";

const hints = [
  { title: "Press M to open the map", detail: "Works from anywhere in Game Mode." },
  { title: "Press Q for quick travel", detail: "Jump to any district from the wheel." },
  { title: "Press Esc to pause", detail: "Stats, controls, radio and Recruiter Mode." },
];

const typing = (target: EventTarget | null) =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  target instanceof HTMLSelectElement ||
  (target instanceof HTMLElement && target.isContentEditable);

/** Discovery, trophies, control hints and keyboard shortcuts. Renders nothing. */
export function GameEvents() {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    // A new page gets a few quiet seconds before any toast appears.
    holdToasts();
    const state = getGame();
    const before = discoveredDistricts(state.visited);
    const visited = state.visited.includes(path) ? state.visited : [...state.visited, path].slice(-100);
    if (visited !== state.visited) updateGame({ visited });
    const after = discoveredDistricts(visited);
    const district = districtFor(path);
    const game = state.mode === "game";
    const booting = document.documentElement.dataset.boot !== "done";
    if (district && !before.includes(district.href) && game) {
      pushToast({ kind: "discovery", title: district.district, detail: `${district.label} unlocked on the map.` });
      audioManager.cue("toast");
    }
    if (path === "/map") unlockTrophy("cartographer");
    if (path === "/contact") unlockTrophy("dialed");
    if (after.length === districts.length) unlockTrophy("explorer");
    if (timeOfDay(new Date()) === "night") unlockTrophy("night-owl");
    if (!game || booting || state.hints >= hints.length || !matchMedia("(pointer: fine)").matches) return;
    const count = visited.length;
    if (count >= state.hints + 1) {
      const hint = hints[state.hints];
      const timer = setTimeout(() => {
        pushToast({ kind: "hint", ...hint });
        updateGame({ hints: getGame().hints + 1 });
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [path]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || typing(event.target)) return;
      if (getGame().mode !== "game" || document.documentElement.dataset.boot !== "done") return;
      const open = document.querySelector("dialog[open]");
      const key = event.key.toLowerCase();
      if (key === "escape" && !open) {
        event.preventDefault();
        openPanel("pause");
      } else if (open) {
        return;
      } else if (key === "m") {
        router.push("/map");
      } else if (key === "q") {
        openPanel("travel");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router]);

  return null;
}
