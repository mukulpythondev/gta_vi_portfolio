import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FileClock, Lock, MoveLeft } from "lucide-react";
import { sceneArt } from "@/lib/art";
import { SectionScene, type SceneKey } from "./world/section-scenes";

export function PageHeading({
  number,
  eyebrow,
  title,
  description,
  scene,
  art,
  children,
  back = true,
}: {
  scene: SceneKey;
  /** Painted art for this heading; defaults to the scene's art, then the drawn scene. */
  art?: string | null;
  /** Off on the map itself, where a link back to the map points nowhere. */
  back?: boolean;
  children?: React.ReactNode;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  const painted = art ?? sceneArt(scene);
  return (
    <header className={`page-heading${painted ? " has-art" : ""}`}>
      {painted ? (
        <div className="heading-scene heading-art" aria-hidden="true">
          <Image src={painted} alt="" fill priority sizes="(max-width: 1320px) 100vw, 1320px" />
        </div>
      ) : (
        <SectionScene scene={scene} className="heading-scene" />
      )}
      <span className="hud-corners" aria-hidden="true" />
      {back && (
        <Link href="/map" className="back-link">
          <MoveLeft size={15} />
          Back to map
        </Link>
      )}
      <p className="eyebrow">
        <span className="section-index">{number} /</span>
        {eyebrow}
      </p>
      <h1>
        {title}
        <span>.</span>
      </h1>
      <p className="page-description">{description}</p>
      {children}
    </header>
  );
}

export function PendingContent({
  title,
  note,
  slots = 0,
  slotLabel = "Mission locked",
}: {
  title: string;
  note: string;
  slots?: number;
  slotLabel?: string;
}) {
  return (
    <>
      {slots > 0 && (
        <div className="locked-slots" aria-hidden="true">
          {Array.from({ length: slots }, (_, index) => (
            <div className="locked-slot" key={index}>
              <Lock size={22} />
              <span>
                {String(index + 1).padStart(2, "0")} / {slotLabel}
              </span>
              <small>Awaiting verified details</small>
            </div>
          ))}
        </div>
      )}
      <div className="pending-content">
        <FileClock size={32} strokeWidth={1.3} />
        <p className="eyebrow">AWAITING VERIFIED CONTENT</p>
        <h2>{title}</h2>
        <p>{note}</p>
        <Link className="text-link" href="/missions">
          Explore the projects <ArrowUpRight size={16} />
        </Link>
      </div>
    </>
  );
}

export function DetailList({
  title,
  items,
  index,
}: {
  title: string;
  items: string[];
  index?: string;
}) {
  return (
    <section className="detail-section">
      {index && <p className="eyebrow">{index}</p>}
      <h2>{title}</h2>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="muted">Verified details have not yet been supplied.</p>
      )}
    </section>
  );
}
