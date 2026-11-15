"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Every looping scene root. Add your own classes here.
const SELECTOR = ".scene, .hero, .footer-scene";

/**
 * Pauses looping scenery while it is off screen. Animations that nobody can
 * see still cost compositing time on every frame, which is what made long
 * pages feel heavy while scrolling.
 */
export function OffscreenPause() {
  const path = usePathname();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).toggleAttribute("data-offscreen", !entry.isIntersecting);
        }
      },
      { rootMargin: "120px 0px" },
    );
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll(SELECTOR).forEach((element) => observer.observe(element));
    });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [path]);
  return null;
}
