"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Compass,
  FileText,
  LocateFixed,
  Minus,
  Plus,
} from "lucide-react";
import { districts, discoveredDistricts, type District } from "@/content/navigation";
import { world } from "@/content/world";
import { useGame } from "@/lib/game-store";
import { audioManager } from "@/lib/audio-manager";
import { DistrictIcon } from "../icons";
import { art } from "@/lib/art";
import { MapArt, MAP_H, MAP_W, pt, SPAWN } from "./map-art";

type View = { x: number; y: number; scale: number };
const MIN = 1;
const MAX = 2.6;
/** The Records Office (resume), between the Safehouse and Corporate HQ. */
const DOSSIER = { x: 36, y: 16 };

export function WorldMap({ compact = false }: { compact?: boolean }) {
  const state = useGame();
  const discovered = discoveredDistricts(state.visited);
  const [active, setActive] = useState<District | null>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, scale: 1 });
  const viewport = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; dist: number; scale: number; moved: boolean } | null>(null);

  const clamp = useCallback((next: View): View => {
    const box = viewport.current?.getBoundingClientRect();
    const scale = Math.min(MAX, Math.max(MIN, next.scale));
    if (!box) return { ...next, scale };
    const maxX = (box.width * (scale - 1)) / 2;
    const maxY = (box.height * (scale - 1)) / 2;
    return {
      scale,
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  }, []);

  const zoom = useCallback(
    (factor: number) =>
      setView((current) => clamp({ ...current, scale: current.scale * factor })),
    [clamp],
  );

  useEffect(() => {
    const element = viewport.current;
    if (compact || !element) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoom(event.deltaY < 0 ? 1.12 : 1 / 1.12);
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [compact, zoom]);

  const focusDistrict = (item: District) => {
    if (active?.href !== item.href) audioManager.cue("tick");
    setActive(item);
  };

  const spawn = pt(SPAWN);
  const target = active ? pt(active) : null;
  const route = target
    ? `M${spawn.x},${spawn.y} Q${(spawn.x + target.x) / 2},${Math.min(spawn.y, target.y) - 60} ${target.x},${target.y}`
    : "";

  return (
    <div className={`map-layout ${compact ? "compact-map" : ""}`}>
      <div className="map-frame">
        <div className="map-hud-top" aria-hidden="true">
          <span>{world.code} / 001 · FICTIONAL CITY</span>
          <span>
            {discovered.length}/{districts.length} DISCOVERED
          </span>
        </div>
        <div
          ref={viewport}
          className="map-viewport"
          role="region"
          aria-label={`${world.name} district map`}
          data-lenis-prevent={compact ? undefined : ""}
          onPointerDown={(event) => {
            if (compact || (event.target as Element).closest("a,button")) return;
            pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
            (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
            const list = [...pointers.current.values()];
            drag.current = {
              x: event.clientX,
              y: event.clientY,
              vx: view.x,
              vy: view.y,
              dist:
                list.length === 2
                  ? Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y)
                  : 0,
              scale: view.scale,
              moved: false,
            };
          }}
          onPointerMove={(event) => {
            if (!drag.current || !pointers.current.has(event.pointerId)) return;
            pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
            const list = [...pointers.current.values()];
            if (list.length === 2 && drag.current.dist) {
              const dist = Math.hypot(list[0].x - list[1].x, list[0].y - list[1].y);
              setView((current) =>
                clamp({ ...current, scale: drag.current!.scale * (dist / drag.current!.dist) }),
              );
              return;
            }
            const dx = event.clientX - drag.current.x;
            const dy = event.clientY - drag.current.y;
            if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true;
            setView((current) =>
              clamp({ ...current, x: drag.current!.vx + dx, y: drag.current!.vy + dy }),
            );
          }}
          onPointerUp={(event) => {
            pointers.current.delete(event.pointerId);
            if (!pointers.current.size) drag.current = null;
          }}
          onPointerCancel={(event) => {
            pointers.current.delete(event.pointerId);
            drag.current = null;
          }}
          onDoubleClick={compact ? undefined : () => zoom(1.5)}
        >
          <div
            className="map-canvas"
            style={{
              transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
              aspectRatio: `${MAP_W} / ${MAP_H}`,
            }}
          >
            <MapArt
              discovered={discovered}
              idPrefix={compact ? "mapc" : "map"}
              detail={!compact}
              painted={art(compact ? "art/map/mini" : "art/map/key")}
            />
            <svg className="map-route" viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              {route && <path key={route} d={route} />}
            </svg>
            <Link
              href="/"
              className="map-player map-landmark"
              style={{ left: `${SPAWN.x}%`, top: `${SPAWN.y}%`, ["--counter-scale" as string]: 1 / view.scale }}
              aria-label="Home: back to the start"
              onClick={(event) => {
                if (drag.current?.moved) event.preventDefault();
              }}
            >
              <i />
              <small>Home</small>
            </Link>
            <Link
              href="/resume"
              className="map-landmark map-dossier"
              style={{ left: `${DOSSIER.x}%`, top: `${DOSSIER.y}%`, ["--counter-scale" as string]: 1 / view.scale }}
              aria-label="Records Office: the dossier (resume)"
              onClick={(event) => {
                if (drag.current?.moved) event.preventDefault();
              }}
            >
              <span className="marker-pin">
                <FileText size={16} />
              </span>
              <small>Dossier</small>
            </Link>
            <div
              className="map-markers"
              onKeyDown={(event) => {
                if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)) return;
                const links = [...event.currentTarget.querySelectorAll<HTMLAnchorElement>("a")];
                const index = links.indexOf(document.activeElement as HTMLAnchorElement);
                const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
                links[(index + step + links.length) % links.length]?.focus();
                event.preventDefault();
              }}
            >
              {districts.map((item) => {
                const known = discovered.includes(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`map-marker ${known ? "is-known" : "is-unknown"} ${active?.href === item.href ? "is-active" : ""}`}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      ["--counter-scale" as string]: 1 / view.scale,
                    }}
                    aria-label={`${item.district}: ${item.professional}${known ? "" : " (undiscovered)"}`}
                    onPointerEnter={() => focusDistrict(item)}
                    onFocus={() => focusDistrict(item)}
                    onClick={(event) => {
                      if (drag.current?.moved) event.preventDefault();
                    }}
                  >
                    <span className="marker-pin">
                      <DistrictIcon name={item.icon} size={17} />
                    </span>
                    <small>{item.district}</small>
                  </Link>
                );
              })}
            </div>
          </div>
          <Compass className="compass" size={34} aria-hidden="true" />
        </div>
        {!compact && (
          <div className="map-controls">
            <button className="icon-button" aria-label="Zoom in" onClick={() => zoom(1.3)}>
              <Plus size={18} />
            </button>
            <button className="icon-button" aria-label="Zoom out" onClick={() => zoom(1 / 1.3)}>
              <Minus size={18} />
            </button>
            <button
              className="icon-button"
              aria-label="Recenter map"
              onClick={() => setView({ x: 0, y: 0, scale: 1 })}
            >
              <LocateFixed size={18} />
            </button>
          </div>
        )}
        <div className={`map-intel ${active ? "is-open" : ""}`} aria-live="polite">
          {active ? (
            <>
              <p className="eyebrow">
                {discovered.includes(active.href) ? "DISCOVERED" : "UNDISCOVERED"} · INTEL
              </p>
              <strong className="script">{active.district}</strong>
              <span>
                {active.label} / {active.professional}
              </span>
              <p>{active.intel}</p>
              <Link href={active.href} className="text-link">
                Set waypoint <ArrowUpRight size={15} />
              </Link>
            </>
          ) : (
            <p className="map-intel-hint">
              {compact ? "Hover a district for intel." : "Drag to pan · scroll or pinch to zoom · hover a district for intel."}
            </p>
          )}
        </div>
      </div>
      <div className="district-list">
        {districts.map((item, index) => {
          const known = discovered.includes(item.href);
          return (
            <Link
              href={item.href}
              key={item.href}
              className={known ? "is-known" : "is-unknown"}
              onPointerEnter={() => focusDistrict(item)}
            >
              <span className="district-number">0{index + 1}</span>
              <DistrictIcon name={item.icon} />
              <span>
                <strong>{item.label}</strong>
                <small>
                  {item.professional} / {item.district}
                </small>
              </span>
              <span className="district-status">{known ? "Visited" : "New"}</span>
              <ArrowUpRight size={17} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
