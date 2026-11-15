"use client";
import { useEffect } from "react";
import { useMotionAllowed } from "@/lib/use-motion-allowed";

/** Pixels each layer moves per unit of pointer (x, y) and scroll. */
const depth: Record<string, [number, number, number]> = {
  "layer-art": [-16, -8, 90],
  "layer-sky": [-6, 0, 40],
  "layer-sun": [-14, -8, 160],
  "layer-far": [-24, 0, 90],
  "layer-near": [-40, 0, 50],
  "layer-water": [-40, 0, 50],
  "layer-palms": [-80, -10, 10],
  "layer-kites": [-18, -6, 120],
  "layer-graph": [-30, -8, 70],
  "layer-roof": [-70, -8, 0],
  "layer-outside": [-8, -2, 30],
  "layer-wall": [-20, 0, 60],
  "layer-lights": [-26, 0, 60],
  "layer-floor": [-34, -4, 40],
  "layer-chair": [-60, -6, 0],
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
      // Painted key art starts slightly zoomed and settles as you scroll (GTA VI style).
      zoom: element.classList.contains("layer-art") ? 0.1 : 0,
    }));
    // The copy lifts and fades as the hero scrolls away.
    const copy = [...root.querySelectorAll<HTMLElement>(".hero-grid, .hero-bottom")];
    if (!allowed) {
      layers.forEach(({ element }) => (element.style.transform = ""));
      copy.forEach((element) => {
        element.style.opacity = "";
        element.style.translate = "";
      });
      return;
    }
    let px = 0, py = 0, tx = 0, ty = 0, frame = 0;
    const render = () => {
      frame = 0;
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;
      const scroll = Math.min(1, scrollY / innerHeight);
      for (const { element, factor, zoom } of layers) {
        const scale = zoom ? ` scale(${(1 + zoom * (1 - scroll)).toFixed(4)})` : "";
        element.style.transform = `translate3d(${(px * factor[0]).toFixed(2)}px, ${(py * factor[1] + scroll * factor[2]).toFixed(2)}px, 0)${scale}`;
      }
      for (const element of copy) {
        element.style.opacity = String(Math.max(0, 1 - scroll * 1.6).toFixed(3));
        element.style.translate = `0 ${(-scroll * 90).toFixed(1)}px`;
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
