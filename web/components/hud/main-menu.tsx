"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Crosshair,
  Film,
  Keyboard,
  Play,
  RotateCcw,
  Settings2,
  Target,
} from "lucide-react";
import { districts, discoveredDistricts } from "@/content/navigation";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";
import { skills } from "@/content/skills";
import { world } from "@/content/world";
import { resetProgress, updateGame, useGame } from "@/lib/game-store";
import { audioManager } from "@/lib/audio-manager";
import { useModal } from "@/lib/use-modal";
import { art } from "@/lib/art";

type View = "menu" | "controls" | "credits";

const controls: [string, string][] = [
  ["M", "World map"],
  ["Q", "Quick travel wheel"],
  ["Esc", "Pause menu / back"],
  ["↑ ↓", "Move through menus"],
  ["Enter", "Confirm"],
  ["Drag · Scroll", "Pan and zoom the map"],
  ["↑↑↓↓←→←→BA", "Developer secret"],
];

/** Title screen: the "front end" of the game, shown after the boot and from the pause menu. */
export default function MainMenu({
  onClose,
  onSettings,
}: {
  onClose: () => void;
  onSettings: () => void;
}) {
  const dialog = useModal();
  const router = useRouter();
  const state = useGame();
  const list = useRef<HTMLUListElement>(null);
  const [view, setView] = useState<View>("menu");
  const [focus, setFocus] = useState(0);
  const discovered = discoveredDistricts(state.visited).length;
  const reviewed = state.completed.filter((id) => id.startsWith("missions/")).length;
  const hasSave = discovered > 0 || reviewed > 0 || state.trophies.length > 1;

  const go = (href: string) => {
    router.push(href);
    onClose();
  };

  const items: {
    label: string;
    icon: typeof Play;
    detail: string;
    action: () => void;
  }[] = [
    {
      label: hasSave ? "Continue" : "Play",
      icon: Play,
      detail: hasSave
        ? `Save found: ${discovered}/${districts.length} districts, ${reviewed}/${projects.length} operations.`
        : `Spawn on ${world.name} and explore the work at your own pace.`,
      action: onClose,
    },
    {
      label: "New game",
      icon: RotateCcw,
      detail: "Wipe progress on this device and start from the world map.",
      action: () => {
        resetProgress();
        go("/map");
      },
    },
    {
      label: "Operations",
      icon: Target,
      detail: `${projects.length} projects across AI, cloud and product.`,
      action: () => go("/missions"),
    },
    {
      label: "Armory",
      icon: Crosshair,
      detail: `${skills.length} weapons in the loadout. Every skill, as gear.`,
      action: () => go("/skills"),
    },
    {
      label: "Controls",
      icon: Keyboard,
      detail: "Keyboard shortcuts and how to move around.",
      action: () => setView("controls"),
    },
    {
      label: "Settings",
      icon: Settings2,
      detail: "Radio, music, effects and motion.",
      action: onSettings,
    },
    {
      label: "Credits",
      icon: Film,
      detail: "Who made this, and with what.",
      action: () => setView("credits"),
    },
    {
      label: "Recruiter mode",
      icon: BriefcaseBusiness,
      detail: "Skip the game. Plain pages, same facts.",
      action: () => {
        updateGame({ mode: "recruiter" });
        onClose();
      },
    },
  ];

  const move = (index: number) => {
    const next = (index + items.length) % items.length;
    setFocus(next);
    audioManager.cue("tick");
    list.current?.querySelectorAll("button")[next]?.focus();
  };

  return (
    <dialog
      ref={dialog}
      className="title-screen"
      aria-label="Main menu"
      data-lenis-prevent
      onClose={onClose}
      onKeyDown={(event) => {
        if (view !== "menu") return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          move(focus + (event.key === "ArrowDown" ? 1 : -1));
        }
      }}
      onCancel={(event) => {
        if (view !== "menu") {
          event.preventDefault();
          setView("menu");
        }
      }}
    >
      <div className="title-art" aria-hidden="true">
        <Image src={art("art/boot/key") ?? "/solara-coast.jpg"} alt="" fill sizes="100vw" />
      </div>
      <div className="title-shade" aria-hidden="true" />
      <div className="title-grain" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <div className="title-layout">
        <div className="title-left">
          <div className="title-logo">
            <span className="script">{world.name}</span>
            <strong>
              MUKUL<span>RANA</span>
            </strong>
            <small>A PERSONAL OPEN WORLD · VOL. 01</small>
          </div>

          {view === "menu" ? (
            <ul ref={list} className="title-menu">
              {items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <button
                      className={index === focus ? "is-focused" : undefined}
                      autoFocus={index === 0}
                      onMouseEnter={() => {
                        if (index !== focus) audioManager.cue("tick");
                        setFocus(index);
                      }}
                      onFocus={() => setFocus(index)}
                      onClick={item.action}
                    >
                      <Icon size={18} aria-hidden="true" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="title-sub">
              <p className="eyebrow">{view === "controls" ? "CONTROLS" : "CREDITS"}</p>
              {view === "controls" ? (
                <dl className="controls-table">
                  {controls.map(([key, label]) => (
                    <div key={key}>
                      <dt>
                        <kbd>{key}</kbd>
                      </dt>
                      <dd>{label}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <dl className="credits-roll">
                  <div>
                    <dt>Design, code and story</dt>
                    <dd>{profile.name}</dd>
                  </div>
                  <div>
                    <dt>Role</dt>
                    <dd>{profile.role}</dd>
                  </div>
                  <div>
                    <dt>Engine</dt>
                    <dd>Next.js · React · TypeScript</dd>
                  </div>
                  <div>
                    <dt>Sound</dt>
                    <dd>Synthesized live with Web Audio</dd>
                  </div>
                  <div>
                    <dt>World</dt>
                    <dd>{world.name}, an original fictional coast</dd>
                  </div>
                </dl>
              )}
              <button className="button button-glass" autoFocus onClick={() => setView("menu")}>
                Back
              </button>
            </div>
          )}
        </div>

        {view === "menu" && (
          <aside className="title-preview" aria-live="polite">
            <p className="eyebrow">{String(focus + 1).padStart(2, "0")} / {items.length}</p>
            <h2>{items[focus].label}</h2>
            <p>{items[focus].detail}</p>
            <div className="title-save">
              <span>SAVE SLOT 01</span>
              <meter min={0} max={districts.length} value={discovered} aria-label="Districts discovered" />
              <small>
                {discovered}/{districts.length} districts · {state.trophies.length} trophies
              </small>
            </div>
          </aside>
        )}
      </div>

      <footer className="title-hints" aria-hidden="true">
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> Select
        </span>
        <span>
          <kbd>Enter</kbd> Confirm
        </span>
        <span>
          <kbd>Esc</kbd> {view === "menu" ? "Close" : "Back"}
        </span>
        <span className="title-version">v1.0 · {world.code}</span>
      </footer>
    </dialog>
  );
}
