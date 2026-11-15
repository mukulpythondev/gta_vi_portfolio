"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Blocks that slide in the first time they scroll into view. */
const SELECTOR = [
  ".home .section-heading",
  ".home .ability-card",
  ".home .scene-copy",
  ".about-story > h2",
  ".home .spotlight-card",
  ".home .home-project-grid > *",
  ".mission-file",
  ".home .reel-track > li",
  ".contact-layout > div > *:not(.contact-status, .contact-missions)",
  ".contact-status > div",
  ".contact-missions > li",
  ".contact-layout .phone",
].join(", ");

const EASE = "cubic-bezier(0.2, 0.9, 0.1, 1)";

/**
 * Animates each block once as it scrolls in, using the Web Animations API.
 * Nothing is written to the DOM (no attributes, classes or inline styles), so
 * it can never disagree with the server-rendered HTML React is hydrating, and
 * nothing can get stuck hidden if script fails.
 */
export function ScrollReveal() {
  const path = usePathname();
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".world");
    const allowed =
      root?.dataset.motion === "on" &&
      root.dataset.mode !== "recruiter" &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!allowed || !("animate" in Element.prototype)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          const siblings = element.parentElement ? Array.from(element.parentElement.children) : [];
          const delay = Math.min(siblings.indexOf(element), 5) * 90;
          element.animate(
            [{ opacity: 0, translate: "0 36px" }, { opacity: 1, translate: "0 0" }],
            { duration: 720, delay, easing: EASE, fill: "backwards" },
          );
          element.querySelector(".spotlight-photo")?.animate(
            [{ opacity: 0, translate: "-40px 10px", rotate: "-6deg" }, { opacity: 1, translate: "0 0", rotate: "0deg" }],
            { duration: 900, delay: delay + 120, easing: EASE, fill: "backwards" },
          );
        }
      },
      // Fire just before a block enters, so it never shows and then vanishes.
      { rootMargin: "0px 0px 10% 0px", threshold: 0 },
    );
    const frame = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((element) => {
        // Already on screen at load: leave it as it is.
        if (element.getBoundingClientRect().top < innerHeight) return;
        observer.observe(element);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [path]);
  return null;
}
