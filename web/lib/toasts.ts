"use client";
import { useSyncExternalStore } from "react";

export type Toast = {
  id: number;
  kind: "discovery" | "achievement" | "hint" | "mission" | "secret";
  title: string;
  detail?: string;
};

/**
 * One toast on screen at a time. New ones wait in a short queue, and nothing
 * shows until a few seconds after a page loads, the intro is gone and no
 * dialog is open, so a toast never lands on top of content being read.
 */
const QUEUE_MAX = 3;
const SETTLE_MS = 3500; // after a page load or route change
const GAP_MS = 700; // between two toasts

let queue: Toast[] = [];
let visible: Toast[] = [];
let counter = 0;
let holdUntil = 0;
let showTimer: ReturnType<typeof setTimeout> | undefined;
let hideTimer: ReturnType<typeof setTimeout> | undefined;
let wasBlocked = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((notify) => notify());

const now = () => (typeof performance === "undefined" ? 0 : performance.now());
const blocked = () =>
  typeof document !== "undefined" &&
  (document.documentElement.dataset.boot !== "done" || !!document.querySelector("dialog[open]"));

function schedule(delay = 0) {
  clearTimeout(showTimer);
  showTimer = setTimeout(pump, Math.max(delay, holdUntil - now(), 0));
}

function pump() {
  if (visible.length || !queue.length) return;
  if (blocked()) {
    wasBlocked = true;
    return schedule(600);
  }
  if (wasBlocked) {
    // The intro or a menu just closed: let the page show first.
    wasBlocked = false;
    holdUntil = Math.max(holdUntil, now() + 1500);
  }
  const wait = holdUntil - now();
  if (wait > 0) return schedule(wait);
  const [next, ...rest] = queue;
  queue = rest;
  visible = [next];
  emit();
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => dismissToast(next.id), next.kind === "hint" ? 6000 : 4500);
}

/** Hold the queue for a few seconds, e.g. while a new page settles. */
export function holdToasts(ms = SETTLE_MS) {
  holdUntil = Math.max(holdUntil, now() + ms);
  if (queue.length) schedule();
}

export function pushToast(toast: Omit<Toast, "id">) {
  const id = ++counter;
  if (queue.some((item) => item.title === toast.title) || visible[0]?.title === toast.title) return id;
  // Drop the oldest hint first when the queue is full; trophies matter more.
  queue = [...queue, { ...toast, id }];
  while (queue.length > QUEUE_MAX) {
    const hint = queue.findIndex((item) => item.kind === "hint");
    queue.splice(hint >= 0 ? hint : 0, 1);
  }
  if (!holdUntil) holdUntil = SETTLE_MS; // first load: measured from navigation start
  schedule();
  return id;
}

export function dismissToast(id: number) {
  queue = queue.filter((toast) => toast.id !== id);
  if (visible[0]?.id === id) {
    visible = [];
    clearTimeout(hideTimer);
    emit();
    schedule(GAP_MS);
  }
}

const empty: Toast[] = [];
export function useToasts() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => visible,
    () => empty,
  );
}
