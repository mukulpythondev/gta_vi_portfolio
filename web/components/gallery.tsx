"use client";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Camera, X } from "lucide-react";
import { gallery } from "@/content/gallery";
import type { GalleryItem } from "@/content/types";
import { useModal } from "@/lib/use-modal";
import { audioManager } from "@/lib/audio-manager";

const categories = ["All", "Hackathons", "Leadership", "Workshops", "Meetups"] as const;
const place = (item: GalleryItem) => [item.location, item.date].filter(Boolean).join(" · ");

export function Gallery() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [limit, setLimit] = useState(12);
  const filtered = gallery.filter(
    (item) => category === "All" || item.category === category,
  );
  if (!gallery.length) return null;
  return (
    <>
      <div className="filter-toolbar">
        <div className="filters" aria-label="Gallery categories">
          {categories.map((item) => (
            <button
              key={item}
              aria-pressed={item === category}
              onClick={() => {
                if (item !== category) audioManager.cue("tick");
                setCategory(item);
                setLimit(12);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="results-count" aria-live="polite">
          <Camera size={14} /> {filtered.length.toString().padStart(2, "0")} SHOTS
        </span>
      </div>
      <div className="photo-roll">
        {filtered.slice(0, limit).map((item) => (
          <button
            key={item.src}
            className="photo-card"
            onClick={() => setSelected(item)}
            aria-label={`Open ${item.event} photo`}
          >
            <span className="photo-frame">
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 30vw"
              />
              {item.role && <span className="photo-role">{item.role}</span>}
            </span>
            <span className="photo-caption">
              <strong>{item.event}</strong>
              <small>{place(item)}</small>
            </span>
          </button>
        ))}
      </div>
      {filtered.length > limit && (
        <button type="button" className="button button-glass gallery-more" onClick={() => setLimit((n) => n + 12)}>
          Show more ({filtered.length - limit} left)
        </button>
      )}
      {selected && (
        <Lightbox
          item={selected}
          position={`${filtered.indexOf(selected) + 1} / ${filtered.length}`}
          onClose={() => setSelected(null)}
          onMove={(direction) => {
            const index = filtered.indexOf(selected);
            audioManager.cue("tick");
            setSelected(
              filtered[(index + direction + filtered.length) % filtered.length],
            );
          }}
        />
      )}
    </>
  );
}

function Lightbox({
  item,
  position,
  onClose,
  onMove,
}: {
  item: GalleryItem;
  position: string;
  onClose: () => void;
  onMove: (direction: number) => void;
}) {
  const dialog = useModal();
  return (
    <dialog
      className="lightbox"
      ref={dialog}
      data-lenis-prevent
      aria-label={item.event}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") onMove(1);
        if (event.key === "ArrowLeft") onMove(-1);
      }}
    >
      <div className="dialog-head">
        <span>● PHOTO MODE · {position}</span>
        <button className="icon-button" onClick={onClose} aria-label="Close photo">
          <X />
        </button>
      </div>
      {/* Fixed-size stage: every photo fits inside it, so the modal never
          resizes while the next photo loads or when the aspect ratio changes. */}
      <div className="lightbox-stage">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 1100px) 96vw, 1060px"
          className="lightbox-image"
        />
      </div>
      <div className="lightbox-controls">
        <button className="icon-button" aria-label="Previous photo" onClick={() => onMove(-1)}>
          <ArrowLeft />
        </button>
        <div className="lightbox-meta">
          {item.role && <span className="photo-role">{item.role}</span>}
          <strong>{item.event}</strong>
          <small>{place(item)}</small>
        </div>
        <button className="icon-button" aria-label="Next photo" onClick={() => onMove(1)}>
          <ArrowRight />
        </button>
      </div>
    </dialog>
  );
}
