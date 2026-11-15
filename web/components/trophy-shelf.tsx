"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { hackathons } from "@/content/hackathons";
import { useGame } from "@/lib/game-store";
import { useMotionAllowed } from "@/lib/use-motion-allowed";
import type { Shelf3D, TrophyPiece } from "@/lib/trophy-scene";

type Shelf = TrophyPiece & { label: string; slug: string; event: string };

const find = (pattern: RegExp) => hackathons.filter((item) => pattern.test(item.result));

/** One piece per kind of result, linked to the hackathon it came from. */
function shelfPieces(): Shelf[] {
  const winner = find(/winner/i)[0];
  const merit = find(/prize/i)[0];
  const national = find(/national/i)[0];
  const asia = find(/asia/i)[0];
  const finals = find(/^finalist$/i);
  const judge = find(/judge/i)[0];
  const list: (Shelf | null)[] = [
    winner && { kind: "cup-gold", face: "WINNER", sub: "", accent: "#ffc24a", label: "Winner", slug: winner.slug, event: winner.title },
    merit && { kind: "cup-silver", face: "MERIT", sub: "", accent: "#c9d4ff", label: "Merit prize", slug: merit.slug, event: merit.title },
    national && { kind: "medal-gold", face: "SIH", sub: "NATIONAL FINAL", accent: "#ff2e88", label: "National finalist", slug: national.slug, event: national.title },
    asia && { kind: "medal-cyan", face: "ASIA", sub: "FINALIST", accent: "#18f0ff", label: "Asia finalist", slug: asia.slug, event: asia.title },
    finals.length ? { kind: "star", face: `${finals.length}×`, sub: "", accent: "#ff8a3d", label: `Finalist ×${finals.length}`, slug: finals[0].slug, event: `${finals.length} hackathons` } : null,
    judge && { kind: "gavel", face: "", sub: "", accent: "#b48cff", label: "Judge", slug: judge.slug, event: judge.title },
  ];
  return list.filter((item): item is Shelf => Boolean(item));
}

const pieces = shelfPieces();

/** Scrolls to a hackathon row and flashes it. */
function visit(slug: string) {
  const row = document.getElementById(`hack-${slug}`);
  if (!row) return;
  row.scrollIntoView({ behavior: "smooth", block: "center" });
  row.classList.remove("is-flash");
  void row.offsetWidth;
  row.classList.add("is-flash");
}

/**
 * A 3D trophy shelf above the hackathon list. Three.js is only downloaded once
 * the shelf nears the screen; Recruiter mode and devices without WebGL just
 * get the labelled list underneath, which is always there for screen readers.
 */
export function TrophyShelf() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const shelf = useRef<Shelf3D | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const game = useGame().mode === "game";
  const animate = useMotionAllowed();

  useEffect(() => {
    const element = canvas.current;
    if (!element || !game) return;
    let cancelled = false;
    const load = async () => {
      try {
        const { mountShelf } = await import("@/lib/trophy-scene");
        if (cancelled) return;
        shelf.current = mountShelf(element, {
          pieces,
          animate,
          onHover: setActive,
          onSelect: (index) => visit(pieces[index].slug),
        });
        setReady(true);
      } catch {
        setReady(false);
      }
    };
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        void load();
      },
      { rootMargin: "400px" },
    );
    near.observe(element);
    return () => {
      cancelled = true;
      near.disconnect();
      shelf.current?.dispose();
      shelf.current = null;
      setReady(false);
    };
  }, [game, animate]);

  return (
    <section className={`trophy-shelf${ready ? " is-ready" : ""}`} aria-label="Trophy shelf">
      {game && (
        <div className="shelf-stage">
          <canvas ref={canvas} aria-hidden="true" />
          <span className="shelf-hint" aria-hidden="true">
            Hover a trophy · click to jump to the story
          </span>
        </div>
      )}
      <ul className="shelf-labels">
        {pieces.map((piece, index) => (
          <li key={piece.kind} className={active === index ? "is-active" : undefined}           style={{ "--accent": piece.accent } as CSSProperties}>
            <a
              href={`#hack-${piece.slug}`}
              onClick={(event) => {
                event.preventDefault();
                visit(piece.slug);
              }}
                        onPointerEnter={() => {
                          setActive(index);
                          shelf.current?.highlight(index);
                        }}
                        onPointerLeave={() => {
                          setActive(null);
                          shelf.current?.highlight(null);
                        }}
            >
              <strong>{piece.label}</strong>
              <span>{piece.event}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
