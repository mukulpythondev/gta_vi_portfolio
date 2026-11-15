"use client";
import { useEffect } from "react";
import { useMotionAllowed } from "@/lib/use-motion-allowed";

const SELECTOR = ".project-card, .ability-card, .hack-row";
const MAX = 7;

/**
 * Cards lean toward the cursor in 3D. Desktop pointers only, one delegated
 * listener for the whole page, and it only writes two CSS variables that the
 * hover styles in art.css read.
 */
export function TiltCards() {
  const allowed = useMotionAllowed();
  useEffect(() => {
    if (!allowed || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let active: HTMLElement | null = null;
    const reset = (element: HTMLElement | null) => {
      element?.style.removeProperty("--rx");
      element?.style.removeProperty("--ry");
    };
    const move = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest<HTMLElement>(SELECTOR) ?? null;
      if (card !== active) {
        reset(active);
        active = card;
      }
      if (!card) return;
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.setProperty("--ry", `${(x * MAX * 2).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${(-y * MAX * 2).toFixed(2)}deg`);
    };
    const leave = () => {
      reset(active);
      active = null;
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      leave();
    };
  }, [allowed]);
  return null;
}
