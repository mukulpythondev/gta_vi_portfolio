"use client";
import {
  ArrowUpRight,
  BatteryMedium,
  Code2 as Github,
  ContactRound as Linkedin,
  Download,
  Mail,
  MessageCircle,
  Signal,
} from "lucide-react";
import { safeHref, socials } from "@/content/socials";
import { profile } from "@/content/profile";
import { useClock } from "@/lib/use-clock";
import { art } from "@/lib/art";

const icons = { email: Mail, github: Github, linkedin: Linkedin, resume: Download };
const wallpaper = art("art/phone/wallpaper");

/** In-world phone: real clock in the status bar, contact apps, a message. */
export function Phone() {
  const clock = useClock();
  const time = clock
    ? clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    : "--:--";
  return (
    <section
      className={`phone${wallpaper ? " has-wallpaper" : ""}`}
      aria-label="Contact phone"
      style={wallpaper ? ({ "--wallpaper": `url(${wallpaper})` } as React.CSSProperties) : undefined}
    >
      <div className="phone-notch" />
      <div className="phone-status">
        <span>{time}</span>
        <span className="phone-status-icons" aria-hidden="true">
          <Signal size={13} />
          <BatteryMedium size={15} />
        </span>
      </div>
      <div className="phone-avatar">
        MR<span>.</span>
      </div>
      <h2>Mukul Rana</h2>
      <p>{profile.role}</p>
      <div className="phone-message">
        <MessageCircle size={15} aria-hidden="true" />
        <p>
          Got a problem worth solving? Pick an app below and let&apos;s talk.
        </p>
      </div>
      <div className="phone-apps">
        {socials.map((item) => {
          const Icon = icons[item.kind];
          const href = safeHref(item.href);
          return href ? (
            <a
              href={href}
              key={item.kind}
              className="phone-app"
              rel={href.startsWith("https:") ? "noopener noreferrer" : undefined}
            >
              <span className="app-icon">
                <Icon size={20} />
              </span>
              <span>{item.label}</span>
              <ArrowUpRight size={15} />
            </a>
          ) : (
            <div className="phone-app unavailable" key={item.kind}>
              <span className="app-icon">
                <Icon size={20} />
              </span>
              <span>
                {item.label}
                <small>Not yet supplied</small>
              </span>
              <span className="unavailable-dot" />
            </div>
          );
        })}
      </div>
      <div className="phone-home" />
    </section>
  );
}
