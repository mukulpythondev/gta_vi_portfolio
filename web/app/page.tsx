import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  Camera,
  Code2,
  FileSearch,
  MapPin,
  Rocket,
} from "lucide-react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { hackathons } from "@/content/hackathons";
import { gallery } from "@/content/gallery";
import { world } from "@/content/world";
import { ProjectCard } from "@/components/project-card";
import { RadioStatus } from "@/components/radio-status";
import { CoastScene } from "@/components/world/coast-scene";
import { Parallax } from "@/components/world/parallax";
import { ExplainToggle, Say } from "@/components/explain-toggle";
import { CareerRoad } from "@/components/career-road";
import { RailControls } from "@/components/scroll-rail";
import { Statement } from "@/components/statement";
import { ProjectScenes } from "@/components/project-scenes";
import { art, projectArt } from "@/lib/art";
import { HeroArt } from "@/components/world/hero-art";

export const metadata = { alternates: { canonical: "/" } };

// Three full-screen scenes, then the rest as cards.
const featured = projects.slice(0, 3);
const rest = projects.slice(3);
const heroArt = art("art/hero/key");
const heroArtMobile = art("art/hero/key-mobile");
const reel = gallery.filter((item) => item.role).slice(0, 8);

const byTitle = (slugs: string[]) =>
  slugs
    .map((slug) => projects.find((project) => project.slug === slug)!)
    .filter(Boolean);

/** What I do, said twice: in plain words first, and for engineers on request. */
const abilities = [
  {
    icon: Bot,
    key: "agents",
    title: "Tools that do the work",
    plain:
      "Assistants and apps that look things up, handle the boring steps and finish the task, instead of just chatting.",
    tech: "Agent loops are distributed systems with randomness inside. Typed tool contracts, bounded retries, state persisted between steps, every call traced.",
    tags: ["AI agents", "Tool calling", "MCP"],
    seen: byTitle(["sonaraudio", "trinetra"]),
  },
  {
    icon: FileSearch,
    key: "data",
    title: "Your data, handled with care",
    plain:
      "Search your own files and get answers that show where they came from, or prove something about yourself without handing over the document.",
    tech: "Most retrieval bugs are search bugs: structure-aware chunking, hybrid search and re-ranking, measured before the model sees a word. Privacy by default: share the yes or no, not the data.",
    tags: ["RAG", "Multimodal search", "Privacy"],
    seen: byTitle(["offline-multimodal-rag", "anonproof"]),
  },
  {
    icon: Rocket,
    key: "ship",
    title: "Built to stay up",
    plain:
      "I test that things work before people rely on them, then ship them as complete products that keep running when lots of people show up at once.",
    tech: "Queues in front of anything slow, safe retries, a time budget for every step, and backtests before claims. 120 ms a frame is a constraint, not a hope.",
    tags: ["Backends", "Cloud", "Real-time"],
    seen: byTitle(["hydrosense", "microrag"]),
  },
];

/** Second tape: the GenAI work, named the way the industry names it. */
const tape = [
  "GenAI Engineer",
  "AI Agents",
  "RAG",
  "LLM Apps",
  "MCP & Tool Calling",
  "Multimodal Search",
  "LangGraph",
  "Evals & Tracing",
  `Hackathon finalist ×${hackathons.filter((item) => /finalist/i.test(item.result)).length}`,
  "Open to roles",
];

export default function Home() {
  return (
    <main id="main" className="home">
      <section className={`hero${heroArt ? " has-art" : ""}`} aria-labelledby="hero-title">
        {heroArt ? <HeroArt desktop={heroArt} mobile={heroArtMobile} /> : <CoastScene />}
        <Parallax target=".hero" />
        <div className="hero-shade" />
        <div className="hero-grain" />
        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-welcome script">Welcome to {world.name}</p>
            <h1 id="hero-title">
              <span className="hero-name">Mukul</span>{" "}
              <span className="hero-name hero-name-2">Rana.</span>
            </h1>
            <div className="hero-role">
              <Code2 size={19} />
              <span>
                {profile.role.toUpperCase()} · {experience[0].company.toUpperCase()}
              </span>
            </div>
            <Say
              className="hero-description"
              plain="I build apps and the systems behind them, from the first idea to a live product that keeps working when real people use it."
              tech="Python and TypeScript, Postgres, Redis and Kafka. I care about fast responses, jobs that are safe to retry, and what the system does when something it depends on fails."
            />
            <div className="hero-actions">
              <Link href="/missions" className="button button-primary press-start">
                See the work <ArrowUpRight size={19} />
              </Link>
              <Link href="/map" className="button button-glass">
                Explore the map
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#abilities" className="scroll-cue">
            <span className="scroll-icon">
              <ArrowDown size={16} />
            </span>
            SCROLL TO EXPLORE
          </a>
          <span className="hero-location">
            <MapPin size={14} />
            {profile.location.toUpperCase()}
          </span>
          <RadioStatus />
        </div>
      </section>

      <div className="ticker-x">
        <p className="sr-only">
          Mukul Rana, GenAI engineer. I build AI agents and RAG systems, from first idea to live product.
        </p>
        {/* Two tapes crossing near the start, scrolling in opposite directions. */}
        <div className="xt xt-a" aria-hidden="true">
          <div className="xt-track">
            {[0, 1].map((copy) => (
              <span key={copy} className="xt-run">
                {hackathons.map((item) => (
                  <span key={item.slug} className="xt-item">
                    <b>{item.title}</b>
                    <em className={`xt-result result-${item.result.toLowerCase().split(" ")[0]}`}>
                      {item.result}
                    </em>
                    <i>✦</i>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <div className="xt xt-b" aria-hidden="true">
          <div className="xt-track">
            {[0, 1].map((copy) => (
              <span key={copy} className="xt-run">
                {tape.map((word) => (
                  <span key={word} className="xt-item">
                    <b>{word}</b>
                    <i>✦</i>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section
        className="section abilities"
        id="abilities"
        aria-labelledby="abilities-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span className="section-index">01 /</span> SPECIAL ABILITIES
            </p>
            <h2 id="abilities-title">
              WHAT I BUILD<span>.</span>
            </h2>
          </div>
          <ExplainToggle />
        </div>
        <div className="ability-grid">
          {abilities.map(({ icon: Icon, ...item }, index) => {
            const backdrop = item.seen.map((project) => projectArt(project.slug)).find(Boolean);
            return (
              <article
                className={`ability-card ability-${item.key}${backdrop ? " has-art" : ""}`}
                key={item.key}
              >
                {backdrop && (
                  <div className="ability-art" aria-hidden="true">
                    <Image src={backdrop} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
                  </div>
                )}
                <span className="ability-index">0{index + 1}</span>
                <span className="ability-icon" aria-hidden="true">
                  <Icon size={30} strokeWidth={1.5} />
                </span>
                <p className="ability-tags">{item.tags.join(" · ")}</p>
                <h3>{item.title}</h3>
                <Say plain={item.plain} tech={item.tech} />
                <div className="ability-seen">
                  <span>Seen in</span>
                  {item.seen.map((project) => {
                    const thumb = projectArt(project.slug);
                    return (
                      <Link key={project.slug} href={`/missions/${project.slug}`} className="seen-chip">
                        {thumb && <Image src={thumb} alt="" width={44} height={28} />}
                        {project.title}
                        <ArrowUpRight size={14} />
                      </Link>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Statement
        lines={[
          [{ text: "AI that" }, { text: "ships.", accent: "pink" }],
          [{ text: "Agents that" }, { text: "finish.", accent: "cyan" }],
          [{ text: "Systems that" }, { text: "stay up.", accent: "orange" }],
        ]}
      />

      <section className="scenes-section" aria-labelledby="scenes-title">
        <div className="section scenes-head">
          <p className="eyebrow">
            <span className="section-index">02 /</span> FEATURED OPERATIONS
          </p>
          <h2 id="scenes-title">
            THE BIG JOBS<span>.</span>
          </h2>
        </div>
        <ProjectScenes projects={featured} />
      </section>

      <section className="section operations-section" id="operations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span className="section-index">03 /</span> OPERATIONS
            </p>
            <h2>
              MORE OPERATIONS<span>.</span>
            </h2>
          </div>
          <Link href="/missions" className="text-link">
            All {projects.length} projects <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="project-grid home-project-grid">
          {rest.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <CareerRoad />

      <section className="section reel" aria-labelledby="reel-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span className="section-index">05 /</span> PHOTO MODE
            </p>
            <h2 id="reel-title">
              OUT IN THE WORLD<span>.</span>
            </h2>
          </div>
          <Link href="/gallery" className="text-link">
            <Camera size={17} /> Camera roll
          </Link>
        </div>
        <div className="scroll-rail at-start">
        <ul className="reel-track" id="reel-track" aria-label="Event photos">
          {reel.map((item) => (
            <li key={item.src}>
              <Link href="/gallery" className="reel-card">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="260px"
                />
                <span className="reel-role">{item.role}</span>
                <span className="reel-event">{item.event}</span>
              </Link>
            </li>
          ))}
        </ul>
        </div>
        <RailControls target="reel-track" count={reel.length} label="photos" />
      </section>
    </main>
  );
}
