import { projects } from "@/content/projects";
import { ProjectCard } from "./project-card";

/** Six projects fit on one screen with the short card, so no filter is needed. */
export function Operations() {
  return (
    <>
      <div className="filter-toolbar">
        <span className="results-count">
          {projects.length.toString().padStart(2, "0")} PROJECTS
        </span>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
