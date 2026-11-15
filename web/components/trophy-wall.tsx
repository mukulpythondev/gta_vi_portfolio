import Image from "next/image";
import {
  ArrowUpRight,
  Code2,
  Flame,
  Gavel,
  Globe2,
  Landmark,
  MapPin,
  Medal,
  Megaphone,
  Trophy,
} from "lucide-react";
import { achievements } from "@/content/achievements";
import { gallery } from "@/content/gallery";
import { safeHref } from "@/content/socials";
import type { Achievement } from "@/content/types";

const ICONS = { medal: Medal, globe: Globe2, gavel: Gavel, landmark: Landmark, megaphone: Megaphone, flame: Flame, code: Code2 };
const RANK: Record<NonNullable<Achievement["tier"]>, string> = {
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  crew: "Crew",
};

/**
 * Achievements as a trophy wall: each award has a medal rank, its own emblem,
 * and either the real event photo or a headline number. The biggest results
 * take the wide slots.
 */
export function TrophyWall() {
  return (
    <ol className="trophy-wall" aria-label="Achievements">
      {achievements.map((item) => {
        const tier = item.tier ?? "bronze";
        const Icon = item.icon ? ICONS[item.icon] : Trophy;
        const photo = item.photo ? gallery.find((shot) => shot.src.endsWith(`/${item.photo}.jpg`)) : null;
        const evidence = safeHref(item.evidence);
        return (
          <li
            key={item.title}
            className={`award tier-${tier}${item.featured ? " is-featured" : ""}${photo ? " has-photo" : ""}${item.stat ? " has-stat" : ""}`}
          >
            {photo && (
              <div className="award-photo">
                <Image src={photo.src} alt={photo.alt} fill sizes={item.featured ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 100vw, 25vw"} />
              </div>
            )}
            {item.stat && (
              <span className="award-stat" aria-hidden="true">
                {item.stat}
              </span>
            )}
            <div className="award-body">
              <div className="award-top">
                <span className="award-emblem" aria-hidden="true">
                  <Icon size={22} strokeWidth={2.2} />
                </span>
                <span className="award-rank">{RANK[tier]}</span>
                <span className="award-date">{item.date}</span>
              </div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              {(item.where || evidence) && (
                <div className="award-foot">
                  {item.where && (
                    <span className="award-where">
                      <MapPin size={14} aria-hidden="true" /> {item.where}
                    </span>
                  )}
                  {evidence && (
                    <a className="text-link" href={evidence} target="_blank" rel="noreferrer">
                      View evidence <ArrowUpRight size={15} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
