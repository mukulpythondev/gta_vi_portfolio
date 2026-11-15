"use client";
import { useEffect, useRef } from "react";
import { useMotionAllowed } from "@/lib/use-motion-allowed";
import { COVER_GLSL, createGl, fitCanvas, imageReady, objectPosition } from "@/lib/webgl";

const FRAGMENT = `
varying vec2 vUv;
uniform sampler2D uImage0;
uniform sampler2D uDepth;
uniform vec2 uMouse;
${COVER_GLSL}
void main() {
  vec2 uv = cover(vUv);
  // Focus on the couple (depth ~0.35): they stay put, the boat swings toward
  // the viewer and the skyline drifts the other way.
  float d = texture2D(uDepth, uv).r;
  vec2 offset = uMouse * (d - 0.35) * vec2(0.05, 0.035);
  // Second lookup at the shifted spot cuts the stretching at depth edges.
  d = texture2D(uDepth, uv + offset).r;
  offset = uMouse * (d - 0.35) * vec2(0.05, 0.035);
  gl_FragColor = texture2D(uImage0, clamp(uv + offset, 0.002, 0.998));
}`;

/**
 * Turns the painted hero into a 2.5D scene: a depth map (made at build time by
 * scripts/process-art.mjs) shifts near and far parts of the painting by
 * different amounts. Desktop follows the pointer; touch screens follow scroll
 * with a slow sway. The canvas reuses the <img> already on the page, and the
 * plain image stays underneath for no-WebGL, Recruiter and reduced motion.
 */
export function DepthHero({ depth, depthMobile }: { depth: string; depthMobile: string | null }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const allowed = useMotionAllowed();

  useEffect(() => {
    const canvas = ref.current;
    const image = canvas?.parentElement?.querySelector("img");
    if (!allowed || !canvas || !image) return;
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      await imageReady(image).catch(() => null);
      const glx = cancelled ? null : createGl(canvas, FRAGMENT);
      if (!glx) return;
      const { gl, uniform } = glx;
      gl.uniform1i(uniform("uImage0"), 0);
      gl.uniform1i(uniform("uDepth"), 1);

      const depthImage = new Image();
      const loadArt = async () => {
        const src = image.currentSrc.includes("key-mobile") && depthMobile ? depthMobile : depth;
        if (!depthImage.src.endsWith(src)) {
          depthImage.src = src;
          await imageReady(depthImage);
        }
        glx.texture(0, image);
        glx.texture(1, depthImage);
        gl.uniform2f(uniform("uImage"), image.naturalWidth, image.naturalHeight);
      };
      try {
        await loadArt();
      } catch {
        glx.dispose();
        return;
      }
      if (cancelled) return glx.dispose();

      const resize = () => {
        const [w, h] = fitCanvas(canvas);
        gl.uniform2f(uniform("uCanvas"), w, h);
        gl.uniform2fv(uniform("uPos"), objectPosition(image));
        wake();
      };

      const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
      let tx = 0, ty = 0, mx = 0, my = 0, frame = 0, visible = true, shown = false;
      const render = (time: number) => {
        frame = 0;
        if (!fine) {
          // Touch: scroll tilts the scene, a slow sway keeps it alive.
          tx = Math.sin(time / 2200) * 0.35;
          ty = -Math.min(1, scrollY / innerHeight) * 0.9;
        }
        mx += (tx - mx) * 0.07;
        my += (ty - my) * 0.07;
        gl.uniform2f(uniform("uMouse"), mx, my);
        glx.draw();
        if (!shown) {
          shown = true;
          canvas.classList.add("is-live");
        }
        if (!fine || Math.abs(tx - mx) > 0.0005 || Math.abs(ty - my) > 0.0005) wake();
      };
      function wake() {
        if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render);
      }
      const move = (event: PointerEvent) => {
        tx = (event.clientX / innerWidth - 0.5) * 2;
        ty = (event.clientY / innerHeight - 0.5) * 2;
        wake();
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        wake();
      });
      const sizer = new ResizeObserver(resize);
      const swap = () => loadArt().then(resize).catch(() => {});

      observer.observe(canvas);
      sizer.observe(canvas);
      image.addEventListener("load", swap);
      if (fine) addEventListener("pointermove", move, { passive: true });
      document.addEventListener("visibilitychange", wake);
      resize();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        sizer.disconnect();
        image.removeEventListener("load", swap);
        removeEventListener("pointermove", move);
        document.removeEventListener("visibilitychange", wake);
        canvas.classList.remove("is-live");
        glx.dispose();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [allowed, depth, depthMobile]);

  return <canvas ref={ref} className="depth-canvas" aria-hidden="true" />;
}
