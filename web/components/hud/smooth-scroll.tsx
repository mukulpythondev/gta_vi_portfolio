"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { useMotionAllowed } from "@/lib/use-motion-allowed";

/**
 * Smooth wheel scrolling with Lenis, tuned tight (lerp 0.14) so the page never
 * trails the wheel. Off on touch screens (native momentum is better there),
 * in Recruiter mode, with the motion toggle off and with reduced motion.
 * Modals and inner scrollers opt out with `data-lenis-prevent`.
 */
export function SmoothScroll() {
  const allowed = useMotionAllowed();
  useEffect(() => {
    if (!allowed || matchMedia("(pointer: coarse)").matches) return;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    // Lenis animates the scroll itself; CSS smooth scrolling would fight it.
    root.style.scrollBehavior = "auto";
    const lenis = new Lenis({ lerp: 0.14, smoothWheel: true, wheelMultiplier: 1 });
    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      root.style.scrollBehavior = previous;
    };
  }, [allowed]);
  return null;
}
