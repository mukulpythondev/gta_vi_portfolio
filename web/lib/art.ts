import { artManifest } from "./art-manifest";

/**
 * Painted world art, if it has been generated. Every caller keeps its
 * code-drawn scene as the fallback, so a missing file never breaks a page.
 * Add or replace art with `npm run art` (see scripts/process-art.mjs).
 */
export function art(key: string): string | null {
  return artManifest[key] ?? null;
}

export const sceneArt = (scene: string) => art(`art/scenes/${scene}`);
export const projectArt = (slug: string) => art(`projects/${slug}/key`);
