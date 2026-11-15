"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = ".ocean-drive, .section-scene, .sunset-scene, .ticker-x, .hero";

/**
 * Pauses looping scenery while it is off screen. Animations that nobody can
 * see still cost compositing time on every frame, which is what made long
 * pages feel heavy while scrolling. Uses the Web Animations API rather than an
 * attribute, so it never changes the HTML React is hydrating.
 */
export function OffscreenPause() {
  const path = usePathname();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          for (const animation of entry.target.getAnimations({ subtree: true })) {
            // Only looping scenery; one-off reveals and transitions finish on their own.
            if (animation.effect?.getTiming().iterations !== Infinity) continue;
            if (entry.isIntersecting) animation.play();
            else animation.pause();
          }
        }
      },
      { rootMargin: "120px 0px" },
    );
    const frame = requestAnimationFrame(() => {
      document.querySelectorAll(SELECTOR).forEach((element) => observer.observe(element));
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [path]);
  return null;
}
