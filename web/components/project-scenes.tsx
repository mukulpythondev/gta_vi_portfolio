import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Trophy } from "lucide-react";
import type { Project } from "@/content/types";
import { projectArt } from "@/lib/art";
import { projectMedia } from "@/lib/project-media";
import { ArchitectureDiagram } from "./architecture-diagram";

/**
 * GTA VI-style scenes: each project fills the screen and sticks while the next
 * one slides up over it. Pure CSS (position: sticky), so it costs nothing to
 * scroll and works without script. Server component.
 */
export function ProjectScenes({ projects }: { projects: Project[] }) {
  return (
    <div className="scenes">
      {projects.map((project, index) => {
        const image = projectArt(project.slug) ?? projectMedia(project.slug).cover;
        return (
          <article
            key={project.slug}
            className={`scene accent-${project.accent}`}
            aria-labelledby={`scene-${project.slug}`}
          >
            {image ? (
              <div className="scene-art" aria-hidden="true">
                <Image src={image} alt="" fill sizes="100vw" />
              </div>
            ) : (
              project.architecture && (
                <div className="scene-art scene-diagram">
                  <ArchitectureDiagram
                    nodes={project.architecture.nodes}
                    columns={2}
                    label={`${project.title} architecture`}
                  />
                </div>
              )
            )}
            <div className="scene-shade" aria-hidden="true" />
            <div className="scene-copy">
              <p className="eyebrow">
                <span className="section-index">{String(index + 1).padStart(2, "0")} /</span>
                {project.category}
              </p>
              <h3 id={`scene-${project.slug}`}>{project.title}</h3>
              <p className="scene-hook">{project.description}</p>
              <p className="scene-plain">{project.plain}</p>
              {project.achievements[0] && (
                <p className="scene-stamp">
                  <Trophy size={15} aria-hidden="true" /> {project.achievements[0].replace(/\.$/, "")}
                </p>
              )}
              <Link className="button button-primary" href={`/missions/${project.slug}`}>
                Open the mission <ArrowUpRight size={18} />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
