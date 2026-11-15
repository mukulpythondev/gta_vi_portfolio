"use client";
import { useEffect, useRef } from "react";
import { useMotionAllowed } from "@/lib/use-motion-allowed";

/**
 * Aim ring for fine pointers. It sits exactly on the pointer (no easing, so it
 * never trails behind), and only paints when the pointer actually moves.
 */
export function Reticle() {
  const allowed = useMotionAllowed();
  const ring = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ring.current;
    if (!allowed || !element || !matchMedia("(pointer: fine)").matches) return;
    let x = -100, y = -100, frame = 0, hot = false;
    const paint = () => {
      frame = 0;
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      element.classList.toggle("is-hot", hot);
    };
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      hot = Boolean((event.target as Element)?.closest?.("a,button,summary,[role=button],input,select"));
      element.classList.add("is-on");
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const leave = () => element.classList.remove("is-on");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [allowed]);
  return allowed ? <span ref={ring} className="reticle" aria-hidden="true" /> : null;
}
