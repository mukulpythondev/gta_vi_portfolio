import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import {
  Barlow_Condensed,
  JetBrains_Mono,
  Space_Grotesk,
  Yellowtail,
} from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/shell";
import { siteUrl } from "@/lib/site";
import { profile } from "@/content/profile";
import { world } from "@/content/world";

const body = Space_Grotesk({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const display = Barlow_Condensed({
  variable: "--font-display",
  weight: ["600", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
const script = Yellowtail({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Mukul Rana | GenAI Engineer",
    template: "%s | Mukul Rana",
  },
  description:
    "Mukul Rana, GenAI engineer. I build AI agents, RAG systems and the backends behind them, from the first idea to a live product that keeps working when real people use it.",
  openGraph: {
    title: `Mukul Rana // ${world.name}`,
    description: "GenAI engineer. AI agents, RAG and the backends behind them, from first idea to live product.",
    type: "website",
    siteName: "Mukul Rana",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#12061f" };

/**
 * Runs before paint: restores mode/motion and decides whether the boot
 * sequence should play, so the first frame is already correct.
 */
const bootScript = `(()=>{try{var d=document.documentElement,p=JSON.parse(localStorage.getItem("solara-preferences")||localStorage.getItem("leonida-preferences")||"null")||{};d.dataset.mode=p.mode==="recruiter"?"recruiter":"game";d.dataset.motion=p.motion===false?"off":"on";d.dataset.explain=localStorage.getItem("solara-explain")==="tech"?"tech":"plain";var h=new Date().getHours();d.dataset.time=h>=20||h<5?"night":"dusk";if(sessionStorage.getItem("solara-booted")||p.mode==="recruiter"||matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.boot="done";}catch(e){document.documentElement.dataset.boot="done"}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${display.variable} ${script.variable} ${mono.variable}`}
      data-mode="game"
      data-motion="on"
      data-time="dusk"
      data-scroll-behavior="smooth"
      data-explain="plain"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      {/* Extensions such as ColorZilla add attributes to <body> before React loads. */}
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: profile.name,
              jobTitle: profile.role,
              description: profile.bio,
              url: siteUrl.href,
              knowsAbout: profile.focus,
            }).replace(/</g, "\\u003c"),
          }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Shell>
          <ViewTransition default="page-swap">{children}</ViewTransition>
        </Shell>
      </body>
    </html>
  );
}
