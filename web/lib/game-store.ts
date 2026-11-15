"use client";
import { useSyncExternalStore } from "react";

export const stations = ["off", "night-drive", "sunset", "ambient"] as const;
export type Station = (typeof stations)[number];

export type Preferences = {
  mode: "game" | "recruiter";
  sound: boolean;
  master: number;
  music: number;
  sfx: number;
  station: Station;
  motion: boolean;
  /** Routes visited, used for district discovery and the objective tracker. */
  visited: string[];
  /** Easter eggs found. */
  secrets: string[];
  /** Detail pages read to the end ("mission passed"). */
  completed: string[];
  /** In-world achievement ids unlocked. */
  trophies: string[];
  /** Control hints already shown. */
  hints: number;
  /** First time the visitor entered the world (ms epoch). */
  firstSeen: number | null;
};

const STORAGE_KEY = "solara-preferences";
const LEGACY_KEY = "leonida-preferences";

const defaults: Preferences = {
  mode: "game",
  sound: false,
  master: 40,
  music: 25,
  sfx: 50,
  station: "off",
  motion: true,
  visited: [],
  secrets: [],
  completed: [],
  trophies: [],
  hints: 0,
  firstSeen: null,
};
let snapshot = defaults;
let loaded = false;
const listeners = new Set<() => void>();
const volume = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(100, value))
    : fallback;
const strings = (value: unknown, limit: number) =>
  Array.isArray(value)
    ? value.filter((item: unknown) => typeof item === "string").slice(0, limit)
    : [];

function read() {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY);
    const saved = JSON.parse(raw ?? "null");
    if (!saved || typeof saved !== "object") return;
    snapshot = {
      ...defaults,
      mode: saved.mode === "recruiter" ? "recruiter" : "game",
      master: volume(saved.master, 40),
      music: volume(saved.music, 25),
      sfx: volume(saved.sfx, 50),
      station: (stations as readonly string[]).includes(saved.station)
        ? saved.station
        : "off",
      motion: saved.motion !== false,
      visited: strings(saved.visited, 100),
      secrets: strings(saved.secrets, 10),
      completed: strings(saved.completed, 100),
      trophies: strings(saved.trophies, 30),
      hints:
        typeof saved.hints === "number" ? Math.max(0, Math.min(9, saved.hints)) : 0,
      firstSeen: typeof saved.firstSeen === "number" ? saved.firstSeen : null,
    };
  } catch {}
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!loaded) {
    loaded = true;
    read();
    listeners.forEach((notify) => notify());
  }
  return () => {
    listeners.delete(listener);
  };
}

export function getGame() {
  return snapshot;
}

export function updateGame(patch: Partial<Preferences>) {
  snapshot = { ...snapshot, ...patch };
  if (snapshot.mode === "recruiter") snapshot = { ...snapshot, sound: false };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    document.documentElement.dataset.mode = snapshot.mode;
    document.documentElement.dataset.motion = snapshot.motion ? "on" : "off";
  } catch {}
  listeners.forEach((notify) => notify());
}

export function resetProgress() {
  updateGame({
    visited: [],
    secrets: [],
    completed: [],
    trophies: [],
    hints: 0,
    firstSeen: Date.now(),
  });
}

export function useGame() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => defaults,
  );
}
