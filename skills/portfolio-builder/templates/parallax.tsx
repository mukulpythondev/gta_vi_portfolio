"use client";
import { useEffect } from "react";
import { useMotionAllowed } from "@/lib/use-motion-allowed"; // see references/animation-patterns.md

/** Pixels each layer moves per unit of pointer (x, y) and scroll. */
const depth: Record<string, [number, number, number]> = {
  // Name layers from back to front; tune the numbers per scene.
  "layer-art": [-16, -8, 90],    // a single painted image
  "layer-sky": [-6, 0, 40],
  "layer-far": [-24, 0, 90],
  "layer-mid": [-34, -4, 60],
  "layer-near": [-60, -6, 20],
  "layer-front": [-80, -10, 10],
};

/**
 * Moves the scene layers with the pointer and scroll. Writes transforms straight
 * to each layer (no CSS variables on the parent, so no style recalculation of the
 * whole hero), and sleeps when nothing changes or the hero is off screen.
 */
export function Parallax({ target }: { target: string }) {
  const allowed = useMotionAllowed();
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(target);
    if (!root) return;
    const layers = [...root.querySelectorAll<SVGElement>(".scene-layer")].map((element) => ({
      element,
      factor: depth[[...element.classList].find((name) => name in depth) ?? ""] ?? [0, 0, 0],
    }));
    if (!allowed) {
      layers.forEach(({ element }) => (element.style.transform = ""));
      return;
    }
    let px = 0, py = 0, tx = 0, ty = 0, frame = 0;
    const render = () => {
      frame = 0;
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;
      const scroll = Math.min(1, scrollY / innerHeight);
      for (const { element, factor } of layers) {
        element.style.transform = `translate3d(${(px * factor[0]).toFixed(2)}px, ${(py * factor[1] + scroll * factor[2]).toFixed(2)}px, 0)`;
      }
      if (Math.abs(tx - px) > 0.001 || Math.abs(ty - py) > 0.001) wake();
    };
    const wake = () => {
      if (!frame && scrollY < innerHeight * 1.1) frame = requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      tx = event.clientX / innerWidth - 0.5;
      ty = event.clientY / innerHeight - 0.5;
      wake();
    };
    wake();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", wake);
    };
  }, [allowed, target]);
  return null;
}
