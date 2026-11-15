import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  AudioLines,
  Droplets,
  Eye,
  Globe,
  Layers,
  Network,
  PlayCircle,
  ShieldCheck,
  Trophy,
  Workflow,
} from "lucide-react";
import type { Project } from "@/content/types";
import { projectMedia } from "@/lib/project-media";
import { projectArt } from "@/lib/art";
import { ArchitectureDiagram } from "./architecture-diagram";
import { ReviewedBadge } from "./reviewed-badge";

const icons: Record<string, typeof Workflow> = {
  "offline-multimodal-rag": Layers,
  microrag: Network,
  anonproof: ShieldCheck,
  hydrosense: Droplets,
  trinetra: Eye,
  sonaraudio: AudioLines,
};

/**
 * Short on purpose: hook, one proof point, three tags.
 * The long technical summary lives on the detail page. The art is the
 * project's poster when one exists, then its screenshot, then its own
 * request-flow diagram.
 * Server component only (reads public/projects at build time).
 */
export function ProjectCard({ project }: { project: Project; index?: number }) {
  const Icon = icons[project.slug] ?? Workflow;
  const media = projectMedia(project.slug);
  const poster = projectArt(project.slug);
  const image = poster ?? media.cover;
  return (
    <Link
      href={`/missions/${project.slug}`}
      className={`project-card accent-${project.accent}`}
    >
      <div className={`project-art${image ? " has-cover" : " has-diagram"}`}>
        {image ? (
          <Image
            src={image}
            alt={poster ? "" : `${project.title} screenshot`}
            fill
            sizes="(max-width: 700px) 100vw, 33vw"
            unoptimized={image.endsWith(".gif")}
          />
        ) : project.architecture ? (
          <ArchitectureDiagram
            nodes={project.architecture.nodes}
            variant="card"
            label={`${project.title} architecture`}
          />
        ) : (
          <Icon size={58} strokeWidth={1} className="art-icon" />
        )}
        {(project.demo || media.clip) && (
          <span className="project-proof">
            {project.demo && (
              <span>
                <Globe size={12} aria-hidden="true" /> Live demo
              </span>
            )}
            {media.clip && (
              <span>
                <PlayCircle size={12} aria-hidden="true" /> Video
              </span>
            )}
          </span>
        )}
        <span className="status-stamp">{project.status}</span>
        <ReviewedBadge id={`missions/${project.slug}`} />
      </div>
      <div className="project-info">
        <p className="eyebrow">{project.category}</p>
        <h3>
          {project.title}
          <ArrowUpRight size={22} />
        </h3>
        <p className="project-hook">{project.description}</p>
        <p className="project-metric">
          <Trophy size={14} aria-hidden="true" /> {project.metric}
        </p>
        <div className="tags">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
