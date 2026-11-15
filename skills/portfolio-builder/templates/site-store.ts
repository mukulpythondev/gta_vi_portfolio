"use client";
/**
 * Preferences + progress, persisted to localStorage and shared through
 * useSyncExternalStore. Rename STORAGE_KEY to your site's slug.
 */
import { useSyncExternalStore } from "react";

export type Preferences = {
  mode: "themed" | "plain";
  motion: boolean;
  /** Routes visited: progress overlay and "new section" toasts. */
  visited: string[];
  /** Easter eggs found. */
  secrets: string[];
  /** Detail pages read to the end ("chapter complete"). */
  completed: string[];
  /** Visitor achievement ids. */
  trophies: string[];
  /** Control hints already shown. */
  hints: number;
  firstSeen: number | null;
};

const STORAGE_KEY = "portfolio-preferences"; // rename to your site slug

const defaults: Preferences = {
  mode: "themed",
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
const strings = (value: unknown, limit: number) =>
  Array.isArray(value) ? value.filter((item: unknown) => typeof item === "string").slice(0, limit) : [];

function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!saved || typeof saved !== "object") return;
    // Validate every field: localStorage is user-editable input.
    snapshot = {
      ...defaults,
      mode: saved.mode === "plain" ? "plain" : "themed",
      motion: saved.motion !== false,
      visited: strings(saved.visited, 100),
      secrets: strings(saved.secrets, 10),
      completed: strings(saved.completed, 100),
      trophies: strings(saved.trophies, 30),
      hints: typeof saved.hints === "number" ? Math.max(0, Math.min(9, saved.hints)) : 0,
      firstSeen: typeof saved.firstSeen === "number" ? saved.firstSeen : null,
    };
  } catch {}
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!loaded) {
    loaded = true; // read lazily on the client, after hydration
    read();
    listeners.forEach((notify) => notify());
  }
  return () => {
    listeners.delete(listener);
  };
}

export const getSite = () => snapshot;

export function updateSite(patch: Partial<Preferences>) {
  snapshot = { ...snapshot, ...patch };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    document.documentElement.dataset.mode = snapshot.mode;
    document.documentElement.dataset.motion = snapshot.motion ? "on" : "off";
  } catch {}
  listeners.forEach((notify) => notify());
}

export function useSite() {
  // Server snapshot = defaults, so SSR markup never depends on storage.
  return useSyncExternalStore(subscribe, () => snapshot, () => defaults);
}
