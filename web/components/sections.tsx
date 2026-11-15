import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Download,
  FolderLock,
  ShieldCheck,
  Mic,
  Trophy,
  Wrench,
} from "lucide-react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { experience, experiencePlaceholder } from "@/content/experience";
import { hackathons, hackathonPlaceholder } from "@/content/hackathons";
import { achievements, achievementPlaceholder } from "@/content/achievements";
import { gallery, galleryPlaceholder } from "@/content/gallery";
import { certifications, certificationsRepo } from "@/content/certifications";
import { timeline } from "@/content/timeline";
import { safeHref, socials } from "@/content/socials";
import { sectionInfo } from "@/content/sections";
import { art } from "@/lib/art";
import { PageHeading, PendingContent } from "./page-parts";
import type { SceneKey } from "./world/section-scenes";
import { WorldMap } from "./world/world-map";
import { Phone } from "./phone";
import { TrophyCase } from "./trophy-case";
import { Operations } from "./operations";
import { Inventory } from "./inventory";
import { Gallery } from "./gallery";
import { StoryMode } from "./flight-log";
import { AboutCollage } from "./about-collage";
import { SaveSlots, playtime } from "./save-slots";

export { sectionInfo };

const email = (socials.find((item) => item.kind === "email")?.href ?? "").replace("mailto:", "");
const dossier = art("art/about/dossier");
const contactMissions = [
  {
    icon: BriefcaseBusiness,
    title: "Hire me full-time",
    text: "AI product or backend engineering roles, where the system has to work in production.",
    subject: "Role at our team",
  },
  {
    icon: Wrench,
    title: "Build something with me",
    text: "An app, an AI feature or a backend that needs to keep working as it grows. Contract or freelance.",
    subject: "Project enquiry",
  },
  {
    icon: Mic,
    title: "Hackathons, talks, judging",
    text: "Team up for a hackathon, judge one, or talk about building real products with AI at your event.",
    subject: "Hackathon or event",
  },
];

export function PortfolioSection({ section }: { section: string }) {
  const info = sectionInfo[section];
  return (
    <main id="main" className={`inner-page page-${section}`}>
      <PageHeading {...info} scene={section as SceneKey} back={section !== "map"} />
      <div className="page-body">
        {section === "map" && <WorldMap />}
        {section === "missions" && <Operations />}
        {section === "skills" && <Inventory />}
        {section === "about" && (
          <div className="about-layout">
            <section className="about-identity character-card">
              <span className="hud-corners" aria-hidden="true" />
              <div className={`character-portrait${profile.aboutPhoto || dossier ? " has-photo" : ""}`}>
                {dossier && (
                  <Image
                    className="portrait-art"
                    src={dossier}
                    alt={`${profile.name}, painted as the game's main character`}
                    width={1200}
                    height={1500}
                    sizes="(max-width: 900px) 100vw, 380px"
                  />
                )}
                {profile.aboutPhoto ? (
                  <Image
                    className={dossier ? "portrait-photo" : undefined}
                    src={profile.aboutPhoto}
                    alt={`${profile.name} with his laptop`}
                    width={960}
                    height={1280}
                    sizes="(max-width: 900px) 100vw, 380px"
                    priority={!dossier}
                  />
                ) : (
                  !dossier && (
                  <>
                    <span className="portrait-sun" aria-hidden="true" />
                    <span className="profile-monogram" aria-hidden="true">
                      MR<span>.</span>
                    </span>
                  </>
                  )
                )}
              </div>
              <p className="eyebrow">CHARACTER / 001 · SELECTED</p>
              <h2>{profile.name}</h2>
              <p>{profile.role}</p>
              <div className="perks" aria-label="Focus areas">
                {profile.focus.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>
            <div>
              <section className="detail-section">
                <p className="eyebrow">THE BRIEFING</p>
                <h2>Built with intent.</h2>
                <p>{profile.bio}</p>
                <p className="muted">{profile.bioTech}</p>
                <p className="muted">
                  {profile.location} · {profile.education}
                </p>
              </section>
            </div>
          </div>
        )}
        {section === "about" && <AboutCollage />}
        {section === "about" && timeline.length > 0 && (
          <section id="story" className="about-story" aria-labelledby="story-title">
            <p className="eyebrow">STORY MODE</p>
            <h2 id="story-title">The story so far.</h2>
            <StoryMode />
          </section>
        )}
        {section === "experience" &&
          (experience.length ? (
            <div className="career">
              <dl className="career-stats">
                <div>
                  <dt>Total playtime</dt>
                  <dd>{playtime(`${experience[experience.length - 1].duration.split(" – ")[0]} – Present`)}</dd>
                </div>
                <div>
                  <dt>Chapters</dt>
                  <dd>{String(experience.length).padStart(2, "0")}</dd>
                </div>
              </dl>
              <SaveSlots detailed />
            </div>
          ) : (
            <PendingContent
              title="The record is being assembled."
              note={experiencePlaceholder.note}
              slots={3}
              slotLabel="Story mission locked"
            />
          ))}
        {section === "hackathons" &&
          (hackathons.length ? (
            <>
            <p className="hack-summary">
              {hackathons.length} events ·{" "}
              {hackathons.filter((item) => /winner/i.test(item.result)).length} win ·{" "}
              {hackathons.filter((item) => /prize/i.test(item.result)).length} merit prize ·{" "}
              {hackathons.filter((item) => /finalist/i.test(item.result)).length} finals ·{" "}
              {hackathons.filter((item) => /judge/i.test(item.result)).length} judged
            </p>
            <ol className="hack-list" aria-label="Hackathons">
              {hackathons.map((item) => {
                const project = projects.find((entry) => entry.slug === item.projectSlug);
                return (
                  <li key={item.slug} className={`hack-row result-${item.result.toLowerCase().split(" ")[0]}`}>
                    {item.photo ? (
                      <Image
                        className="hack-thumb"
                        src={item.photo.src}
                        alt={item.photo.alt}
                        width={item.photo.width}
                        height={item.photo.height}
                        sizes="(max-width: 640px) 92vw, 120px"
                      />
                    ) : (
                      <span className="hack-thumb hack-thumb-empty" aria-hidden="true">
                        <Trophy />
                      </span>
                    )}
                    <div className="hack-copy">
                      <p className="eyebrow">{item.date}</p>
                      <h2>{item.title}</h2>
                      <p>{item.description}</p>
                      {project && (
                        <Link className="text-link" href={`/missions/${project.slug}`}>
                          Built: {project.title} <ArrowUpRight size={15} />
                        </Link>
                      )}
                    </div>
                    <strong className="hack-result">{item.result}</strong>
                  </li>
                );
              })}
            </ol>
            </>
          ) : (
            <PendingContent
              title="The stories are on their way."
              note={hackathonPlaceholder.note}
              slots={3}
              slotLabel="Side quest locked"
            />
          ))}
        {section === "achievements" &&
          (achievements.length ? (
            <div className="achievement-grid">
              {achievements.map((item) => (
                <article key={item.title}>
                  <Trophy size={35} />
                  <p className="eyebrow">{item.date}</p>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  {safeHref(item.evidence) && (
                    <a className="text-link" href={safeHref(item.evidence)!} target="_blank" rel="noreferrer">
                      View evidence <ArrowUpRight size={16} />
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <PendingContent
              title="Career milestones. Verified first."
              note={achievementPlaceholder.note}
            />
          ))}
        {section === "achievements" && (
          <section className="cert-shelf" aria-labelledby="certs-title">
            <div className="cert-head">
              <div>
                <p className="eyebrow">LICENCES · {certifications.length} COURSE CERTIFICATES</p>
                <h2 id="certs-title">Certifications</h2>
                <p className="muted">
                  Meta and Google courses on Coursera, from JavaScript and React to back-end basics and version
                  control. Each one links to its verification page.
                </p>
              </div>
              <a className="text-link" href={certificationsRepo} target="_blank" rel="noreferrer">
                All certificates on GitHub <ArrowUpRight size={16} />
              </a>
            </div>
            <ul className="cert-grid">
              {certifications.map((item) => (
                <li key={item.verify} className={`cert-card issuer-${item.issuer.toLowerCase()}`}>
                  <span className="cert-issuer">
                    <ShieldCheck size={16} /> {item.issuer}
                  </span>
                  <h3>{item.title}</h3>
                  <p className="eyebrow">{item.date} · Coursera</p>
                  <a className="text-link" href={item.verify} target="_blank" rel="noreferrer">
                    Verify <span className="sr-only">{item.title} certificate</span> <ArrowUpRight size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        {section === "achievements" && <TrophyCase />}
        {section === "gallery" && (
          <div className="viewfinder">
            <span className="vf-corner" aria-hidden="true" />
            <span className="vf-rec" aria-hidden="true">● REC · PHOTO MODE</span>
            {!gallery.length && (
              <PendingContent
                title="Memories, not stock moments."
                note={galleryPlaceholder.note}
              />
            )}
            <Gallery />
          </div>
        )}
        {section === "contact" && (
          <div className="contact-layout">
            <div>
              <div className="contact-note">
                <ShieldCheck size={19} />
                <p>
                  Email or LinkedIn reaches me directly. This site does not
                  send or store any messages.
                </p>
              </div>
              <dl className="contact-status">
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span className="live-dot" /> Open to roles
                  </dd>
                </div>
                <div>
                  <dt>Based in</dt>
                  <dd>{profile.location}</dd>
                </div>
                <div>
                  <dt>Works</dt>
                  <dd>Remote or on-site</dd>
                </div>
                <div>
                  <dt>Replies</dt>
                  <dd>Within a day</dd>
                </div>
              </dl>
              <p className="eyebrow contact-pick">PICK A MISSION</p>
              <ul className="contact-missions">
                {contactMissions.map(({ icon: Icon, ...item }) => (
                  <li key={item.title}>
                    <a href={`mailto:${email}?subject=${encodeURIComponent(item.subject)}`}>
                      <Icon size={22} />
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                      <em>
                        Start this mission <ArrowUpRight size={14} />
                      </em>
                    </a>
                  </li>
                ))}
              </ul>
              <Link href="/resume" className="text-link">
                Open the dossier <ArrowUpRight size={16} />
              </Link>
            </div>
            <Phone />
          </div>
        )}
        {section === "resume" && (
          <div className="dossier-folder">
            <span className="folder-tab" aria-hidden="true">CLASSIFIED · PERSONNEL FILE</span>
            <div className="resume-heading">
              <FolderLock size={38} />
              <div>
                <h2>{profile.name}</h2>
                <p>{profile.role} / AI agents / Products / Backends</p>
              </div>
            </div>
            {safeHref(
              socials.find((item) => item.kind === "resume")?.href ?? null,
            ) ? (
              <a
                className="button button-primary"
                href={safeHref(
                  socials.find((item) => item.kind === "resume")!.href,
                )!}
                download
              >
                <Download size={17} />
                Download resume
              </a>
            ) : (
              <div className="resume-pending">
                <p className="eyebrow">DOCUMENT NOT YET SUPPLIED</p>
                <h2>The resume is not available yet.</h2>
                <p>The original PDF will be linked here once provided.</p>
              </div>
            )}
            <div className="resume-summary">
              <section>
                <h3>Experience</h3>
                <ul>
                  {experience.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/experience/${item.slug}`}>
                        <strong>{item.company}</strong>
                        <span>{item.role}</span>
                        <small>
                          {item.duration} · {item.description}
                        </small>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Selected projects</h3>
                <ul>
                  {projects.slice(0, 3).map((item) => (
                    <li key={item.slug}>
                      <Link href={`/missions/${item.slug}`}>
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                        <small>{item.metric}</small>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Education</h3>
                <p>{profile.education}</p>
                <h3>Highlights</h3>
                <p>
                  {profile.hackathonFinals} hackathon finals · {profile.leetcode} LeetCode problems ·{" "}
                  {profile.location}
                </p>
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

