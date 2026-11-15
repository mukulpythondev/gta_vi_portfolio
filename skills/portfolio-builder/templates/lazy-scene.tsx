"use client";
import { useEffect, useRef, useState } from "react";

type Scene = (props: { className?: string }) => React.ReactNode;

/**
 * Below-the-fold decorative scene: a same-size placeholder holds the space and
 * the real component is fetched with import() once it is ~900px away. A plain
 * import() (not next/dynamic) means nothing suspends inside a page transition.
 *
 *   <LazyScene className="footer-scene" />
 */
export function LazyScene({ className = "" }: { className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const [SceneComponent, setScene] = useState<Scene | null>(null);
  useEffect(() => {
    const element = holder.current;
    if (!element || SceneComponent) return;
    let cancelled = false;
    const load = () =>
      import("./footer-scene").then((mod) => {
        if (!cancelled) setScene(() => mod.FooterScene);
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
  }, [SceneComponent]);
  if (SceneComponent) return <SceneComponent className={className} />;
  return <div ref={holder} className={`scene scene-placeholder ${className}`} aria-hidden="true" />;
}
