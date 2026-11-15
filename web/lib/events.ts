"use client";
/** Tiny app-wide event bus for opening shell panels from anywhere. */
export type Panel = "sound" | "terminal" | "travel" | "pause" | "menu";
export function openPanel(panel: Panel) {
  window.dispatchEvent(new CustomEvent("solara:panel", { detail: panel }));
}
