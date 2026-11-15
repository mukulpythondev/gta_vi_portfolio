/**
 * Turns raw generated art in ../art-raw/*.png into site-ready files in public/.
 *
 *   npm run art            process every raw file that exists
 *   npm run art -- boot    process only files whose name contains "boot"
 *
 * Gemini stamps a sparkle in the bottom-right corner, so every crop is taken from
 * either above that corner or left of it, whichever keeps the larger image.
 * Files missing from art-raw are skipped; the site keeps its fallback for them.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RAW = path.resolve(process.cwd(), "..", "art-raw");
const PUBLIC = path.resolve(process.cwd(), "public");

/** Share of the image the watermark corner occupies, measured on Gemini output. */
const MARK_RIGHT = 0.07;
const MARK_BOTTOM = 0.13;

const scenes = [
  "map", "about", "missions", "experience", "hackathons", "skills",
  "achievements", "gallery", "timeline", "contact", "resume", "coast",
];
const projects = [
  "offline-multimodal-rag", "microrag", "anonproof", "hydrosense", "trinetra", "sonaraudio",
];

/** raw file -> outputs. kb is the size budget; focus (0..1) shifts the crop. */
const jobs = [
  {
    raw: "hero.png",
    // The sparkle sits on plain boat hull, so it is painted over with the hull
    // just left of it and the full width (Mukul's right side) is kept.
    clean: { cx: 0.9593, cy: 0.9271, size: 0.05, dx: -0.045 },
    out: [
      // 16:10 crop from the right: trimming open sea on the left pulls the
      // woman toward the centre, and the painting still fills the screen.
      { file: "art/hero/key.webp", w: 2400, h: 1500, kb: 380, focusX: 1, depth: true },
      // Square crop from the right of the frame so both characters fit on phones.
      { file: "art/hero/key-mobile.webp", w: 1080, h: 1080, kb: 200, focusX: 1, focusY: 0, depth: true },
      { file: "art/og/default.jpg", w: 1200, h: 630, kb: 150 },
    ],
  },
  { raw: "boot.png", out: [{ file: "art/boot/key.webp", w: 2560, h: 1440, kb: 350 }] },
  { raw: "dossier.png", out: [{ file: "art/about/dossier.webp", w: 1200, h: 1500, kb: 220 }] },
  { raw: "phone.png", out: [{ file: "art/phone/wallpaper.webp", w: 1170, h: 2532, kb: 200 }] },
  { raw: "map.png", out: [
    { file: "art/map/key.webp", w: 2000, h: 1400, kb: 400 },
    { file: "art/map/mini.webp", w: 600, h: 420, kb: 60 },
  ] },
  ...scenes.map((scene) => ({
    raw: `scene-${scene}.png`,
    out: [{ file: `art/scenes/${scene}.webp`, w: 2400, h: 720, kb: 200 }],
  })),
  ...projects.map((slug) => ({
    raw: `project-${slug}.png`,
    out: [{ file: `projects/${slug}/key.webp`, w: 1600, h: 1000, kb: 200 }],
  })),
];

/** Largest window of the target ratio that fits inside the given area, placed by focus. */
function fit(areaW, areaH, ratio, focusX, focusY) {
  let w = areaW;
  let h = Math.round(w / ratio);
  if (h > areaH) {
    h = areaH;
    w = Math.round(h * ratio);
  }
  return {
    width: w,
    height: h,
    left: Math.round((areaW - w) * focusX),
    top: Math.round((areaH - h) * focusY),
  };
}

/** Crop that avoids the watermark corner: above it, or left of it. */
function cropFor(W, H, ratio, focusX = 0.5, focusY = 0.5, marked = true) {
  if (!marked) return fit(W, H, ratio, focusX, focusY);
  const above = fit(W, Math.floor(H * (1 - MARK_BOTTOM)), ratio, focusX, focusY);
  const left = fit(Math.floor(W * (1 - MARK_RIGHT)), H, ratio, focusX, focusY);
  return above.width * above.height >= left.width * left.height ? above : left;
}

/** Covers the watermark with a feathered copy of the area beside it; returns a PNG buffer. */
async function cleanMark(source, W, H, { cx, cy, size, dx }) {
  const side = Math.round(W * size);
  const left = Math.round(W * cx - side / 2);
  const top = Math.min(H - side, Math.round(H * cy - side / 2));
  const shift = Math.round(W * dx);
  const data = await sharp(source).removeAlpha().raw().toBuffer();
  const r = side / 2;
  for (let y = 0; y < side; y++) {
    for (let x = 0; x < side; x++) {
      // Solid in the middle, fading out over the outer 40% so no seam shows.
      const d = Math.hypot(x - r, y - r) / r;
      const a = d <= 0.6 ? 1 : d >= 1 ? 0 : (1 - d) / 0.4;
      if (!a) continue;
      const to = ((top + y) * W + left + x) * 3;
      const from = to + shift * 3;
      for (let c = 0; c < 3; c++) data[to + c] = Math.round(data[from + c] * a + data[to + c] * (1 - a));
    }
  }
  return sharp(data, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
}

let estimator = null;
/**
 * Greyscale depth map (white = near) for the WebGL depth effect, made locally
 * with Depth Anything V2 (small). Softened so the shader displaces smoothly
 * instead of tearing at edges, and kept small: the shader only needs gradients.
 */
async function depthMap(rgb, width, height) {
  if (!estimator) {
    const { pipeline } = await import("@huggingface/transformers");
    estimator = await pipeline("depth-estimation", "onnx-community/depth-anything-v2-small");
  }
  const { RawImage } = await import("@huggingface/transformers");
  const { depth } = await estimator(new RawImage(new Uint8ClampedArray(rgb), width, height, 3));
  const w = Math.min(1024, width);
  return sharp(Buffer.from(depth.data), { raw: { width: depth.width, height: depth.height, channels: 1 } })
    .resize(w, Math.round((w * height) / width))
    .blur(2.5)
    .webp({ quality: 80 })
    .toBuffer();
}

async function encode(pipeline, file, kb) {
  const jpg = file.endsWith(".jpg");
  for (const quality of [82, 76, 70, 64, 58, 52]) {
    const buffer = jpg
      ? await pipeline.clone().jpeg({ quality, mozjpeg: true }).toBuffer()
      : await pipeline.clone().webp({ quality, effort: 6, smartSubsample: true }).toBuffer();
    if (buffer.length <= kb * 1024 || quality === 52) return { buffer, quality };
  }
}

const filter = process.argv[2];
let done = 0;
for (const job of jobs) {
  if (filter && !job.raw.includes(filter)) continue;
  const source = path.join(RAW, job.raw);
  if (!fs.existsSync(source)) continue;
  const { width: W, height: H } = await sharp(source).metadata();
  const input = job.clean ? await cleanMark(source, W, H, job.clean) : source;
  for (const target of job.out) {
    const crop = target.region
      ? (() => {
          const side = Math.round(W * target.region.size);
          return {
            width: side,
            height: side,
            left: Math.round(W * target.region.cx - side / 2),
            top: Math.max(0, Math.round(H * target.region.cy - side / 2)),
          };
        })()
      : cropFor(W, H, target.w / target.h, target.focusX, target.focusY, !job.clean);
    const pipeline = sharp(input)
      .removeAlpha()
      .extract(crop)
      .resize(target.w, target.h, { kernel: "lanczos3" })
      .sharpen({ sigma: 0.6 });
    const { buffer, quality } = await encode(pipeline, target.file, target.kb);
    const dest = path.join(PUBLIC, target.file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buffer);
    const size = Math.round(buffer.length / 1024);
    const upscale = crop.width < target.w ? "  (upscaled)" : "";
    const over = size > target.kb ? "  OVER BUDGET" : "";
    console.log(`${job.raw.padEnd(36)} -> ${target.file.padEnd(38)} ${size} KB q${quality}${upscale}${over}`);
    done++;
    if (target.depth) {
      const depthFile = target.file.replace(/\.webp$/, "-depth.webp");
      const depthBuffer = await depthMap(await pipeline.clone().removeAlpha().raw().toBuffer(), target.w, target.h);
      fs.writeFileSync(path.join(PUBLIC, depthFile), depthBuffer);
      console.log(`${"".padEnd(36)} -> ${depthFile.padEnd(38)} ${Math.round(depthBuffer.length / 1024)} KB (depth)`);
      done++;
    }
  }
}
console.log(`\n${done} file(s) written.`);

/**
 * Record which slots have art so client and server components can choose art
 * or their code-drawn fallback without touching the file system at runtime.
 */
const found = [];
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(webp|jpg)$/i.test(entry.name)) found.push(path.relative(PUBLIC, full).replaceAll("\\", "/"));
  }
};
walk(path.join(PUBLIC, "art"));
for (const slug of projects) {
  if (fs.existsSync(path.join(PUBLIC, "projects", slug, "key.webp"))) found.push(`projects/${slug}/key.webp`);
}
const entries = found
  .sort()
  .map((file) => `  "${file.replace(/\.(webp|jpg)$/i, "")}": "/${file}",`)
  .join("\n");
fs.writeFileSync(
  path.resolve(process.cwd(), "lib", "art-manifest.ts"),
  `// Generated by scripts/process-art.mjs (npm run art). Do not edit by hand.\nexport const artManifest: Record<string, string> = {\n${entries}\n};\n`,
);
console.log(`Manifest: ${found.length} slot(s) in lib/art-manifest.ts`);

// Next caches optimized images by URL; art keeps its filename when replaced, so drop the caches
// (production build and dev server keep separate ones).
for (const dir of [[".next", "cache", "images"], [".next", "dev", "cache", "images"]]) {
  fs.rmSync(path.resolve(process.cwd(), ...dir), { recursive: true, force: true });
}
