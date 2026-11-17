"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Mail,
  Download,
  Gamepad2,
  LayoutGrid,
  Map,
  Pause,
  Phone,
  Settings,
} from "lucide-react";
import { districts } from "@/content/navigation";
import { world } from "@/content/world";
import { updateGame, useGame } from "@/lib/game-store";
import { audioManager } from "@/lib/audio-manager";
import { unlockTrophy } from "@/lib/trophies";
import type { Panel } from "@/lib/events";
import { BootScreen } from "./hud/boot-screen";
import { HudOverlay } from "./hud/hud-overlay";
import { Toasts } from "./hud/toasts";
import { MissionIntro } from "./hud/mission-intro";
import { GameEvents } from "./hud/game-events";
import { Reticle } from "./hud/reticle";
import { TimeOfDaySync } from "./hud/clock";
import { OffscreenPause } from "./hud/offscreen-pause";
import { ScrollReveal } from "./hud/scroll-reveal";
import { SmoothScroll } from "./hud/smooth-scroll";
import { TiltCards } from "./tilt-cards";
import { ExternalLinks } from "./hud/external-links";
import { PosterFx } from "./poster-fx";
import { LazyOceanDrive } from "./world/lazy-ocean-drive";
import { socials } from "@/content/socials";

const link = (kind: string) => socials.find((item) => item.kind === kind)?.href ?? "/contact";
const email = link("email");
const github = link("github");
const linkedin = link("linkedin");

const AudioSettings = dynamic(() => import("./audio-settings"));
const Terminal = dynamic(() => import("./terminal"));
const QuickTravel = dynamic(() => import("./hud/quick-travel"));
const PauseMenu = dynamic(() => import("./hud/pause-menu"));
const MainMenu = dynamic(() => import("./hud/main-menu"));

const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function Shell({ children }: { children: React.ReactNode }) {
  const state = useGame();
  const path = usePathname();
  const [panel, setPanel] = useState<Panel | null>(null);
  const game = state.mode === "game";

  useEffect(() => {
    queueMicrotask(() => setPanel((current) => (current === "travel" ? null : current)));
  }, [path]);

  useEffect(() => {
    const open = (event: Event) => {
      const next = (event as CustomEvent<Panel>).detail;
      setPanel(next);
      audioManager.cue("open");
    };
    window.addEventListener("solara:panel", open);
    return () => window.removeEventListener("solara:panel", open);
  }, []);

  useEffect(() => {
    audioManager.sync(state);
    const sync = () => audioManager.sync(state);
    document.addEventListener("visibilitychange", sync);
    const root = document.documentElement;
    root.dataset.mode = state.mode;
    root.dataset.motion = state.motion ? "on" : "off";
    // CSS smooth scrolling only on touch screens; on desktop Lenis does it (SmoothScroll).
    root.style.scrollBehavior =
      !state.motion || !game || matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(pointer: coarse)").matches
        ? "auto"
        : "smooth";
    if (state.sound && state.station !== "off") unlockTrophy("radio");
    return () => document.removeEventListener("visibilitychange", sync);
  }, [state, game]);

  useEffect(() => {
    let position = 0;
    const unlock = (event: KeyboardEvent) => {
      if (
        !game ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      )
        return;
      if (event.key === konami[position]) position++;
      else position = event.key === konami[0] ? 1 : 0;
      if (position === konami.length) {
        position = 0;
        setPanel("terminal");
        if (!state.secrets.includes("developer"))
          updateGame({ secrets: [...state.secrets, "developer"] });
        unlockTrophy("developer");
        audioManager.confirm(true);
      }
    };
    document.addEventListener("keydown", unlock);
    return () => document.removeEventListener("keydown", unlock);
  }, [game, state.secrets]);

  /** Close only if this panel is still the active one; a late close event must not wipe a newer panel. */
  const closePanel = (which: Panel) =>
    setPanel((active) => (active === which ? null : active));

  const current = (href: string) =>
    path === href || path.startsWith(`${href}/`) ? "page" : undefined;

  return (
    <div
      className="world"
      data-mode={state.mode}
      data-motion={state.motion ? "on" : "off"}
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest("a,button"))
          audioManager.confirm();
      }}
    >
      <BootScreen />
      <header className="hud">
        <Link href="/" className="brand" aria-label="Mukul Rana home">
          <span className="brand-monogram brand-logo" aria-hidden="true">
            <small>GTA</small>
            <b>MR</b>
          </span>
          <span className="brand-caption">
            MUKUL RANA
            <small aria-hidden="true">{world.name.toUpperCase()} / PORTFOLIO</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/map" aria-current={current("/map")}>
            <Map size={15} />
            World map
          </Link>
          <Link href="/missions" aria-current={current("/missions")}>
            {game ? "Operations" : "Projects"}
          </Link>
          <Link href="/experience" aria-current={current("/experience")}>
            Experience
          </Link>
          <Link href="/contact" aria-current={current("/contact")}>
            <Phone size={14} />
            Contact
          </Link>
        </nav>
        {/* Only the controls people use most stay in the bar. Clock, terminal and
            radio live in the pause menu (Esc). */}
        <div className="hud-tools">
          <button
            className="mode-button"
            title={game ? "Recruiter mode" : "Game mode"}
            aria-label={game ? "Recruiter mode" : "Game mode"}
            onClick={() => updateGame({ mode: game ? "recruiter" : "game" })}
            aria-pressed={!game}
          >
            {game ? <BriefcaseBusiness size={15} /> : <Gamepad2 size={15} />}
            <span>{game ? "Recruiter mode" : "Game mode"}</span>
          </button>
          <Link className="icon-button resume-hud" href="/resume" title="Resume" aria-label="Resume">
            <Download size={18} />
          </Link>
          {game ? (
            <button
              className="icon-button"
              title="Pause menu (Esc): stats, radio, terminal"
              aria-label="Open pause menu"
              onClick={() => setPanel("pause")}
            >
              <Pause size={18} />
            </button>
          ) : (
            <button
              className="icon-button"
              title="Settings"
              aria-label="Open settings"
              onClick={() => setPanel("sound")}
            >
              <Settings size={18} />
            </button>
          )}
          <button
            className="icon-button menu-toggle"
            title="Quick travel (Q)"
            aria-label="Open menu"
            onClick={() => setPanel("travel")}
          >
            <LayoutGrid size={20} />
          </button>
        </div>
      </header>
      {!game && (
        <nav className="recruiter-nav" aria-label="Recruiter navigation">
          {[...districts.slice(0, 3), districts[4], districts[5]].map((item) => (
            <Link key={item.href} href={item.href} aria-current={current(item.href)}>
              {item.professional}
            </Link>
          ))}
          <Link href="/resume" aria-current={current("/resume")}>Resume</Link>
          <Link href="/contact" aria-current={current("/contact")}>Contact</Link>
        </nav>
      )}
      {children}
      <footer className={`footer${path === "/" ? "" : " footer-short"}`}>
        <LazyOceanDrive className="footer-scene" />
        {/* The contact page is already the call to action. */}
        {path !== "/contact" && (
        <div className="footer-cta">
          <p className="eyebrow">NEXT MISSION</p>
          <h2>
            LET&apos;S BUILD SOMETHING <span>REAL.</span>
          </h2>
          <p>
            Hiring a GenAI engineer, or have an AI product idea that needs building?
            Tell me what you&apos;re building.
          </p>
          <div className="footer-actions">
            <a className="button button-primary" href={email}>
              <Mail size={17} /> Email me
            </a>
            <Link className="button button-glass" href="/resume">
              <Download size={16} /> Resume
            </Link>
            <a className="button button-glass" href={github} target="_blank" rel="noreferrer">
              <Code2 size={16} /> GitHub
            </a>
            <a className="button button-glass" href={linkedin} target="_blank" rel="noreferrer">
              <ArrowUpRight size={16} /> LinkedIn
            </a>
          </div>
        </div>
        )}
        <div className="footer-base">
          <Link href="/" className="footer-brand">
            MUKUL RANA<span>GENAI ENGINEER</span>
          </Link>
          <nav className="footer-links" aria-label="Footer">
            <div>
              <p className="eyebrow">Explore</p>
              <Link href="/">Home</Link>
              <Link href="/missions">Projects</Link>
              <Link href="/experience">Experience</Link>
              <Link href="/skills">Skills</Link>
              <Link href="/hackathons">Hackathons</Link>
              <Link href="/resume">The dossier</Link>
            </div>
            <div>
              <p className="eyebrow">Story</p>
              <Link href="/about">About</Link>
              <Link href="/about#story">Story</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/achievements">Achievements</Link>
              <Link href="/map">World map</Link>
            </div>
          </nav>
          <p className="footer-credit">Inspired by GTA VI.</p>
        </div>
      </footer>
      <nav className="mobile-dock" aria-label="Mobile navigation">
        <Link href="/missions" aria-current={current("/missions")}>
          <Code2 size={19} />
          Projects
        </Link>
        <Link href="/experience" aria-current={current("/experience")}>
          <BriefcaseBusiness size={19} />
          Experience
        </Link>
        <Link href="/resume" aria-current={current("/resume")}>
          <Download size={19} />
          Resume
        </Link>
        <Link href="/contact" aria-current={current("/contact")}>
          <Mail size={19} />
          Contact
        </Link>
      </nav>
      {game && <HudOverlay />}
      <Toasts />
      <TimeOfDaySync />
      <MissionIntro />
      <Reticle />
      <GameEvents />
      <OffscreenPause />
      <ScrollReveal />
      <SmoothScroll />
      <TiltCards />
      <ExternalLinks />
      <PosterFx />
      {panel === "travel" && (
        <QuickTravel onClose={() => closePanel("travel")} onTerminal={() => setPanel("terminal")} />
      )}
      {panel === "pause" && (
        <PauseMenu
          onClose={() => closePanel("pause")}
          onSettings={() => setPanel("sound")}
          onMainMenu={() => setPanel("menu")}
          onTerminal={() => setPanel("terminal")}
        />
      )}
      {panel === "menu" && (
        <MainMenu onClose={() => closePanel("menu")} onSettings={() => setPanel("sound")} />
      )}
      {panel === "sound" && <AudioSettings onClose={() => closePanel("sound")} />}
      {panel === "terminal" && <Terminal onClose={() => closePanel("terminal")} />}
    </div>
  );
}
