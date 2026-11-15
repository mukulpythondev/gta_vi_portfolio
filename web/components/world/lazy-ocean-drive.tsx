"use client";
import { useEffect, useRef, useState } from "react";

type Scene = (props: { className?: string }) => React.ReactNode;

/**
 * The footer street scene is decorative and below the fold, so it is not in
 * the first HTML. A same-size gradient holds its place, and the drawn scene
 * loads once the reader scrolls near it. Loaded with a plain import() rather
 * than next/dynamic so nothing suspends inside a page view transition.
 */
export function LazyOceanDrive({ className = "" }: { className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const [Scene, setScene] = useState<Scene | null>(null);
  useEffect(() => {
    const element = holder.current;
    if (!element || Scene) return;
    let cancelled = false;
    const load = () =>
      import("./ocean-drive").then((mod) => {
        if (!cancelled) setScene(() => mod.OceanDrive);
      });
    if (!("IntersectionObserver" in window)) {
      void load();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void load();
        }
      },
      { rootMargin: "900px 0px" },
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [Scene]);
  if (Scene) return <Scene className={className} />;
  return <div ref={holder} className={`ocean-drive ocean-drive-placeholder ${className}`} aria-hidden="true" />;
}
