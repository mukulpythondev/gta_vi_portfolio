import fs from "node:fs";
import path from "node:path";

/**
 * Project media is picked up from files, so adding a screenshot never needs a
 * code change. Drop files into web/public/projects/<slug>/ and rebuild:
 *
 *   cover.webp | cover.png | cover.jpg | cover.gif   card, featured slot, top of the detail page
 *   clip.mp4 | clip.webm  (+ clip-poster.jpg/webp)   20 to 30 s screen recording, detail page
 *   diagram.svg | diagram.png | diagram.webp          architecture diagram (replaces the drawn one)
 *   screen-1.png, screen-2.webp, ...                  extra screenshots, detail page
 *
 * Read at build time on the server only.
 */
export type ProjectMedia = {
  cover: string | null;
  clip: { src: string; type: string; poster: string | null } | null;
  diagram: string | null;
  screens: string[];
};

const image = /\.(webp|png|jpe?g|gif|avif)$/i;
const root = path.join(process.cwd(), "public", "projects");

function list(slug: string) {
  try {
    return fs.readdirSync(path.join(root, slug)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

const cache = new Map<string, ProjectMedia>();

export function projectMedia(slug: string): ProjectMedia {
  const hit = cache.get(slug);
  if (hit) return hit;
  const files = list(slug);
  const url = (file: string) => `/projects/${slug}/${file}`;
  const named = (base: string, test: RegExp) =>
    files.find((file) => file.toLowerCase().startsWith(`${base}.`) && test.test(file));
  const cover = named("cover", image);
  const clip = named("clip", /\.(mp4|webm)$/i);
  const poster = named("clip-poster", image);
  const diagram = named("diagram", /\.(svg|webp|png|jpe?g)$/i);
  const media: ProjectMedia = {
    cover: cover ? url(cover) : null,
    clip: clip
      ? { src: url(clip), type: clip.toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4", poster: poster ? url(poster) : cover ? url(cover) : null }
      : null,
    diagram: diagram ? url(diagram) : null,
    screens: files.filter((file) => /^screen-/i.test(file) && image.test(file)).map(url),
  };
  cache.set(slug, media);
  return media;
}
