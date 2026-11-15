import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Code2 as Github } from "lucide-react";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { projectMedia } from "@/lib/project-media";
import { projectArt } from "@/lib/art";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { hackathons } from "@/content/hackathons";
import { safeHref } from "@/content/socials";
import { playtime } from "@/lib/playtime";
import { DetailList, PageHeading } from "@/components/page-parts";
import { MissionComplete } from "@/components/hud/mission-complete";

export const dynamicParams = false;

type Props = { params: Promise<{ section: string; slug: string }> };
export function generateStaticParams() {
  return [
    ...projects.map((item) => ({ section: "missions", slug: item.slug })),
    ...experience.map((item) => ({ section: "experience", slug: item.slug })),
  ];
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug } = await params;
  const item =
    section === "missions"
      ? projects.find((item) => item.slug === slug)
      : section === "experience"
        ? experience.find((item) => item.slug === slug)
        : null;
  return {
    title: item
      ? "title" in item
        ? item.title
        : item.company
      : "Mission unavailable",
    description: item?.description,
    ...(item ? { alternates: { canonical: `/${section}/${slug}` } } : {}),
  };
}
export default async function DetailPage({ params }: Props) {
  const { section, slug } = await params;
  if (section === "missions") {
    const project = projects.find((item) => item.slug === slug);
    if (!project) notFound();
    const hackathon = hackathons.find((item) => item.projectSlug === project.slug);
    const shared = (other: (typeof projects)[number]) =>
      other.technologies.filter((tech) => project.technologies.includes(tech)).length;
    const related = projects
      .filter((item) => item.slug !== project.slug)
      .sort((a, b) => shared(b) - shared(a))
      .slice(0, 3);
    const results = [...project.achievements, ...project.results];
    const media = projectMedia(project.slug);
    return (
      <main
        id="main"
        className={`inner-page project-detail accent-${project.accent}`}
      >
        <PageHeading
          scene="missions"
          art={projectArt(project.slug)}
          number={String(projects.indexOf(project) + 1).padStart(2, "0")}
          eyebrow={project.category}
          title={project.title.toUpperCase()}
          description={project.plain}
        >
          <div className="detail-actions">
            <span
              className={`status-pill status-${project.status.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {project.status}
            </span>
            <span className="project-metric">{project.metric}</span>
            {safeHref(project.github) && (
              <a className="button button-glass" href={safeHref(project.github)!} target="_blank" rel="noreferrer">
                <Github size={17} />
                Source code
                <ArrowUpRight size={15} />
              </a>
            )}
            {safeHref(project.demo) && (
              <a className="button button-primary" href={safeHref(project.demo)!} target="_blank" rel="noreferrer">
                Live demo
                <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </PageHeading>
        <div className="page-body detail-stack">
          {(media.cover || media.clip || media.screens.length > 0) && (
            <section className="detail-section detail-visual" aria-label="Screenshots and video">
              {media.clip ? (
                <video
                  className="detail-clip"
                  controls
                  muted
                  playsInline
                  preload="none"
                  poster={media.clip.poster ?? undefined}
                  aria-label={`${project.title} walkthrough video`}
                >
                  <source src={media.clip.src} type={media.clip.type} />
                </video>
              ) : (
                media.cover && (
                  <div className="detail-shot">
                    <Image
                      src={media.cover}
                      alt={`${project.title} screenshot`}
                      fill
                      priority
                      sizes="(max-width: 960px) 92vw, 900px"
                      unoptimized={media.cover.endsWith(".gif")}
                    />
                  </div>
                )
              )}
              {media.screens.length > 0 && (
                <div className="detail-screens">
                  {media.screens.map((src, i) => (
                    <a key={src} href={src} className="detail-shot" target="_blank" rel="noreferrer">
                      <Image
                        src={src}
                        alt={`${project.title} screenshot ${i + 2}`}
                        fill
                        sizes="(max-width: 960px) 46vw, 300px"
                      />
                    </a>
                  ))}
                </div>
              )}
            </section>
          )}
          <section className="detail-section">
            <h2>How it works</h2>
            <p className="briefing-line">{project.description}</p>
            {media.diagram ? (
              <figure className="arch-figure">
                <Image
                  src={media.diagram}
                  alt={`${project.title} architecture diagram`}
                  width={1200}
                  height={700}
                  sizes="(max-width: 960px) 92vw, 900px"
                  className="arch-image"
                  unoptimized={media.diagram.endsWith(".svg")}
                />
              </figure>
            ) : (
              project.architecture && (
                <figure className="arch-figure">
                  <ArchitectureDiagram
                    nodes={project.architecture.nodes}
                    columns={3}
                    className="arch-wide"
                  />
                  <ArchitectureDiagram
                    nodes={project.architecture.nodes}
                    columns={1}
                    className="arch-tall"
                  />
                  <figcaption>{project.architecture.description}</figcaption>
                </figure>
              )
            )}
            <p>{project.objective}</p>
          </section>
          {project.challenges.length > 0 && (
            <DetailList title="The hard parts" items={project.challenges} />
          )}
          {results.length > 0 && <DetailList title="Results" items={results} />}
          <section className="detail-section">
            <h2>Stack</h2>
            <div className="tags">
              {project.technologies.map((tech) => (
                <Link key={tech} href="/skills">
                  <span>{tech}</span>
                </Link>
              ))}
            </div>
            {hackathon && (
              <p className="muted detail-built-for">
                Built for{" "}
                <Link href="/hackathons">
                  {hackathon.title} ({hackathon.result})
                </Link>
              </p>
            )}
          </section>
        </div>
        <section className="related-ops" aria-labelledby="related-title">
          <h2 id="related-title">More projects</h2>
          <ul className="dossier-more related-chapters">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/missions/${item.slug}`}>
                  <span>{item.title}</span>
                  <small>{item.description}</small>
                  <ArrowRight size={15} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <MissionComplete id={`missions/${project.slug}`} label={project.title} />
        <div className="next-operation">
          <Link href="/missions" className="text-link">
            All projects <ArrowUpRight size={17} />
          </Link>
          <Link
            className="text-link"
            href={`/missions/${projects[(projects.indexOf(project) + 1) % projects.length].slug}`}
          >
            Next: {projects[(projects.indexOf(project) + 1) % projects.length].title}{" "}
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }
  if (section === "experience") {
    const item = experience.find((item) => item.slug === slug);
    if (!item) notFound();
    const index = experience.indexOf(item);
    const [role, setup] = item.role.replace(")", "").split(" (");
    const next = experience[(index + 1) % experience.length];
    const current = /present/i.test(item.duration);
    return (
      <main id="main" className="inner-page project-detail experience-detail">
        <PageHeading
          scene="experience"
          number={`CH${experience.length - index}`}
          eyebrow={`${role} · ${item.duration}`}
          title={item.company.toUpperCase()}
          description={item.plain}
        >
          <div className="detail-actions">
            <span
              className={`status-pill ${current ? "status-deployed" : "status-open-source"}`}
            >
              {current ? "Current role" : "Completed"}
            </span>
            {setup && <span className="project-metric">{setup}</span>}
            <span className="project-metric">{playtime(item.duration)}</span>
          </div>
        </PageHeading>
        <div className="page-body detail-stack">
          <section className="detail-section">
            <h2>The job</h2>
            <p className="briefing-line">{item.description}</p>
            <p>{item.missionNarrative}</p>
          </section>
          <section className="detail-section">
            <h2>What I did</h2>
            <ol className="objective-list">
              {item.responsibilities.map((line, i) => (
                <li key={line}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <p>{line}</p>
                </li>
              ))}
            </ol>
          </section>
          {item.challenges.length > 0 && (
            <DetailList title="The hard parts" items={item.challenges} />
          )}
          {item.impact.length > 0 && <DetailList title="Results" items={item.impact} />}
          <section className="detail-section">
            <h2>Stack</h2>
            <div className="tags">
              {item.technologies.map((tech) => (
                <Link key={tech} href="/skills">
                  <span>{tech}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
        <section className="related-ops" aria-labelledby="related-title">
          <h2 id="related-title">The rest of the story</h2>
          <ul className="dossier-more related-chapters">
            {experience
              .filter((entry) => entry.slug !== item.slug)
              .map((entry) => (
                <li key={entry.slug}>
                  <Link href={`/experience/${entry.slug}`}>
                    <span>{entry.company}</span>
                    <small>
                      {entry.role} · {entry.duration}
                    </small>
                    <ArrowRight size={15} />
                  </Link>
                </li>
              ))}
          </ul>
        </section>
        <MissionComplete id={`experience/${item.slug}`} label={item.company} />
        <div className="next-operation">
          <Link href="/experience" className="text-link">
            All experience <ArrowUpRight size={17} />
          </Link>
          <Link className="text-link" href={`/experience/${next.slug}`}>
            Next: {next.company} <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }
  notFound();
}
