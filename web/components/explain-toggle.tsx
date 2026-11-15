"use client";
import { useSyncExternalStore } from "react";
import { audioManager } from "@/lib/audio-manager";

/**
 * Lets the visitor choose how things are explained. "Simply" is written for
 * anyone; "Technically" names the stack. Both texts are in the page, and CSS
 * shows one, so search engines and screen readers that read everything get both.
 */
type Explain = "plain" | "tech";

const subscribe = (notify: () => void) => {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-explain"] });
  return () => observer.disconnect();
};
const read = (): Explain => (document.documentElement.dataset.explain === "tech" ? "tech" : "plain");

export function ExplainToggle({ className = "" }: { className?: string }) {
  const mode = useSyncExternalStore(subscribe, read, () => "plain" as Explain);
  const set = (next: Explain) => {
    if (next === mode) return;
    document.documentElement.dataset.explain = next;
    try {
      localStorage.setItem("solara-explain", next);
    } catch {}
    audioManager.cue("tick");
  };
  return (
    <div className={`explain-toggle ${className}`} role="group" aria-label="How should I explain things?">
      <span className="explain-label">Explain it</span>
      <button type="button" aria-pressed={mode === "plain"} onClick={() => set("plain")}>
        Simply
      </button>
      <button type="button" aria-pressed={mode === "tech"} onClick={() => set("tech")}>
        Technically
      </button>
    </div>
  );
}

/** Two versions of the same idea; the toggle decides which one shows. */
export function Say({ plain, tech, as: Tag = "p", className = "" }: { plain: React.ReactNode; tech: React.ReactNode; as?: "p" | "span"; className?: string }) {
  return (
    <>
      <Tag className={`say-plain ${className}`}>{plain}</Tag>
      <Tag className={`say-tech ${className}`}>{tech}</Tag>
    </>
  );
}
