"use client";
import { useSyncExternalStore } from "react";

let now: Date | null = null;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    now = new Date();
    timer = setInterval(() => {
      now = new Date();
      listeners.forEach((notify) => notify());
    }, 20000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/** The visitor's real local time; null during server render. */
export function useClock() {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => null,
  );
}

export function timeOfDay(date: Date | null): "dusk" | "night" {
  if (!date) return "dusk";
  const hour = date.getHours();
  return hour >= 20 || hour < 5 ? "night" : "dusk";
}
