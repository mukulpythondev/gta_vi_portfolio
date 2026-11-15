"use client";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="not-found">
      <span className="letterbox top" aria-hidden="true" />
      <span className="letterbox bottom" aria-hidden="true" />
      <p className="failed script" aria-hidden="true">Mission failed</p>
      <p className="eyebrow">CONNECTION INTERRUPTED</p>
      <h1>MISSION FAILED</h1>
      <p>This district couldn&apos;t be loaded.</p>
      <button className="button button-primary" onClick={reset}>
        <RotateCcw size={17} />
        Retry mission
      </button>
      <Link href="/map" className="text-link">
        Return to the map
      </Link>
    </main>
  );
}
