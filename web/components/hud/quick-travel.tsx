"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Download, History, TerminalSquare, X } from "lucide-react";
import { districts, discoveredDistricts } from "@/content/navigation";
import { useGame } from "@/lib/game-store";
import { useModal } from "@/lib/use-modal";
import { audioManager } from "@/lib/audio-manager";
import { DistrictIcon } from "../icons";

/** Selection wheel on desktop, app grid on phones. Same links, same order. */
export default function QuickTravel({
  onClose,
  onTerminal,
}: {
  onClose: () => void;
  onTerminal: () => void;
}) {
  const dialog = useModal();
  const state = useGame();
  const discovered = discoveredDistricts(state.visited);
  const [active, setActive] = useState(0);
  const item = districts[active];
  const select = (index: number) => {
    if (index !== active) audioManager.cue("tick");
    setActive(index);
  };
  return (
    <dialog
      ref={dialog}
      className="travel-dialog"
      aria-label="Quick travel"
      data-lenis-prevent
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-head">
        <span>QUICK TRAVEL</span>
        <button className="icon-button" aria-label="Close menu" onClick={onClose}>
          <X />
        </button>
      </div>
      <nav
        className="wheel"
        aria-label="All sections"
        onKeyDown={(event) => {
          const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
          if (!keys.includes(event.key)) return;
          event.preventDefault();
          const step = keys.indexOf(event.key) < 2 ? 1 : -1;
          const next = (active + step + districts.length) % districts.length;
          select(next);
          event.currentTarget.querySelectorAll<HTMLAnchorElement>(".wheel-slot")[next]?.focus();
        }}
      >
        {districts.map((district, index) => (
          <Link
            key={district.href}
            href={district.href}
            className={`wheel-slot ${index === active ? "is-active" : ""} ${discovered.includes(district.href) ? "is-known" : ""}`}
            style={{ ["--i" as string]: index, ["--n" as string]: districts.length }}
            onPointerEnter={() => select(index)}
            onFocus={() => select(index)}
            onClick={onClose}
          >
            <span className="wheel-icon">
              <DistrictIcon name={district.icon} size={22} />
            </span>
            <span className="wheel-text">
              {district.professional}
              <small>{district.district}</small>
            </span>
            <ArrowUpRight size={16} className="wheel-arrow" />
          </Link>
        ))}
        <div className="wheel-centre" aria-hidden="true">
          <small>{item.district.toUpperCase()}</small>
          <strong className="script">{item.label}</strong>
          <span>{item.intel}</span>
        </div>
      </nav>
      <div className="travel-extra">
        <Link href="/about#story" onClick={onClose}>
          <History size={16} /> Story
        </Link>
        <Link href="/resume" onClick={onClose}>
          <Download size={16} /> Resume
        </Link>
        {state.mode === "game" && (
          <button className="menu-terminal" onClick={onTerminal}>
            <TerminalSquare size={16} />
            Open terminal
          </button>
        )}
      </div>
    </dialog>
  );
}
