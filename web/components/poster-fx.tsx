"use client";
import { useEffect } from "react";
import { useMotionAllowed } from "@/lib/use-motion-allowed";
import { COVER_GLSL, createGl, fitCanvas, imageReady, objectPosition } from "@/lib/webgl";

/** Hover targets, and where the poster image lives inside each. */
const TARGETS: [string, string][] = [
  [".project-card", ".project-art.has-cover img"],
  [".scene", ".scene-art:not(.scene-diagram) img"],
];

const FRAGMENT = `
varying vec2 vUv;
uniform sampler2D uImage0;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform float uHover;
uniform float uTime;
${COVER_GLSL}
void main() {
  vec2 dir = vUv - uMouse;
  dir.x *= uCanvas.x / uCanvas.y;
  float dist = length(dir);
  // Water ripple spreading from the cursor, fading with distance.
  float wave = sin(dist * 34.0 - uTime * 6.0) * exp(-dist * 6.0) * 0.007 * uHover;
  // Slight lens bulge under the cursor.
  float lens = exp(-dist * dist * 18.0) * 0.018 * uHover;
  vec2 uv = vUv + normalize(dir + 1e-5) * wave - dir * lens;
  // Chromatic split that grows with pointer speed (Lando-style).
  vec2 split = (uVel * 0.6 + vec2(0.0018, 0.0)) * uHover;
  float r = texture2D(uImage0, cover(uv + split)).r;
  vec4 g = texture2D(uImage0, cover(uv));
  float b = texture2D(uImage0, cover(uv - split)).b;
  gl_FragColor = vec4(r, g.g, b, 1.0);
}`;

/**
 * Project posters ripple and split their colours under the pointer. One
 * shared WebGL canvas is moved onto whichever poster is hovered, so there is
 * only ever one context. Desktop pointers with motion on only; the plain image
 * is untouched underneath.
 */
export function PosterFx() {
  const allowed = useMotionAllowed();
  useEffect(() => {
    if (!allowed || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const canvas = document.createElement("canvas");
    canvas.className = "poster-fx";
    canvas.setAttribute("aria-hidden", "true");
    const glx = createGl(canvas, FRAGMENT);
    if (!glx) return;
    const { gl, uniform } = glx;
    gl.uniform1i(uniform("uImage0"), 0);

    let host: HTMLElement | null = null;
    let image: HTMLImageElement | null = null;
    let frame = 0;
    let hover = 0, target = 0;
    let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5, vx = 0, vy = 0;
    let cx = 0, cy = 0;
    const start = performance.now();
    const aim = () => {
      if (!image) return;
      const box = image.getBoundingClientRect();
      tx = (cx - box.left) / box.width;
      ty = (cy - box.top) / box.height;
    };

    const render = (time: number) => {
      frame = 0;
      if (!image) return;
      hover += (target - hover) * 0.1;
      const nx = mx + (tx - mx) * 0.18;
      const ny = my + (ty - my) * 0.18;
      vx += (nx - mx - vx) * 0.25;
      vy += (ny - my - vy) * 0.25;
      mx = nx;
      my = ny;
      const [w, h] = fitCanvas(canvas, 1.25);
      gl.uniform2f(uniform("uCanvas"), w, h);
      gl.uniform2f(uniform("uMouse"), mx, my);
      gl.uniform2f(uniform("uVel"), vx, vy);
      gl.uniform1f(uniform("uHover"), hover);
      gl.uniform1f(uniform("uTime"), (time - start) / 1000);
      glx.draw();
      canvas.style.opacity = String(Math.min(1, hover * 4));
      if (target || hover > 0.01) frame = requestAnimationFrame(render);
      else detach();
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const detach = () => {
      canvas.remove();
      host = null;
      image = null;
    };

    const attach = async (card: HTMLElement, img: HTMLImageElement) => {
      if (img.currentSrc.endsWith(".gif")) return;
      host = card;
      image = img;
      await imageReady(img).catch(() => null);
      if (image !== img) return;
      glx.texture(0, img);
      gl.uniform2f(uniform("uImage"), img.naturalWidth, img.naturalHeight);
      gl.uniform2fv(uniform("uPos"), objectPosition(img));
      aim();
      mx = tx;
      my = ty;
      vx = vy = 0;
      img.insertAdjacentElement("afterend", canvas);
      wake();
    };

    const over = (event: PointerEvent) => {
      cx = event.clientX;
      cy = event.clientY;
      const element = event.target as Element | null;
      for (const [selector, inner] of TARGETS) {
        const card = element?.closest<HTMLElement>(selector);
        const img = card?.querySelector<HTMLImageElement>(inner);
        if (card && img) {
          if (card !== host) {
            hover = 0;
            target = 1;
            void attach(card, img);
          }
          target = 1;
          return;
        }
      }
      target = 0;
      wake();
    };
    const move = (event: PointerEvent) => {
      cx = event.clientX;
      cy = event.clientY;
      if (!image) return;
      aim();
      wake();
    };

    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointermove", move);
      detach();
      glx.dispose();
    };
  }, [allowed]);
  return null;
}
