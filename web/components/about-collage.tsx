"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gallery } from "@/content/gallery";
import { profile } from "@/content/profile";

/** Scattered layout: position (% of the stage), width (vw-ish), tilt, drift speed. */
const spots = [
  { left: 2, top: 4, width: 22, tilt: -4, speed: 0.18 },
  { left: 74, top: 0, width: 20, tilt: 3, speed: 0.3 },
  { left: 8, top: 58, width: 18, tilt: 3, speed: 0.42 },
  { left: 78, top: 54, width: 19, tilt: -3, speed: 0.22 },
  { left: 30, top: 74, width: 15, tilt: -2, speed: 0.5 },
  { left: 56, top: 70, width: 14, tilt: 4, speed: 0.12 },
];
const photos = gallery.filter((item) => item.role).slice(0, spots.length);

/**
 * Lando Norris-style scattered photos around one short line: each photo drifts
 * at its own speed while the section scrolls, which reads as depth. Static
 * (still scattered) without motion; a simple grid on phones.
 */
export function AboutCollage() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const stage = ref.current;
    const world = document.querySelector<HTMLElement>(".world");
    if (
      !stage ||
      world?.dataset.motion !== "on" ||
      world.dataset.mode === "recruiter" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !matchMedia("(min-width: 900px)").matches
    )
      return;
    const items = [...stage.querySelectorAll<HTMLElement>(".collage-photo")];
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = stage.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      const offset = box.top + box.height / 2 - innerHeight / 2;
      items.forEach((item) => {
        const speed = Number(item.dataset.speed);
        item.style.translate = `0 ${(offset * speed * -0.6).toFixed(1)}px`;
      });
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", request, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", request);
      items.forEach((item) => (item.style.translate = ""));
    };
  }, []);

  if (!photos.length) return null;
  return (
    <section ref={ref} className="collage" aria-labelledby="collage-title">
      {photos.map((photo, index) => {
        const spot = spots[index];
        return (
          <figure
            key={photo.src}
            className="collage-photo"
            data-speed={spot.speed}
            style={
              {
                "--left": `${spot.left}%`,
                "--top": `${spot.top}%`,
                "--w": `${spot.width}%`,
                "--tilt": `${spot.tilt}deg`,
              } as React.CSSProperties
            }
          >
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 900px) 45vw, 22vw" />
            <figcaption>{photo.event}</figcaption>
          </figure>
        );
      })}
      <div className="collage-copy">
        <p className="eyebrow">OFF THE KEYBOARD</p>
        <h2 id="collage-title">{profile.headline}</h2>
        <p>
          {profile.hackathonFinals} hackathon finals, workshops, meetups and late nights. The people
          and places behind the work.
        </p>
        <p className="collage-signature script" aria-hidden="true">
          Mukul
        </p>
      </div>
    </section>
  );
}
