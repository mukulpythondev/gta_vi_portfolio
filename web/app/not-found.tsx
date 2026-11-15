import Link from "next/link";
import { MapPin, MoveLeft } from "lucide-react";
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <span className="letterbox top" aria-hidden="true" />
      <span className="letterbox bottom" aria-hidden="true" />
      <MapPin size={35} />
      <p className="failed script" aria-hidden="true">Mission failed</p>
      <p className="eyebrow">LOCATION UNKNOWN</p>
      <h1>404</h1>
      <h2>You&apos;re outside the map.</h2>
      <p>This location doesn&apos;t exist. The city is still right here.</p>
      <Link className="button button-primary" href="/map">
        <MoveLeft size={17} />
        Return to the city
      </Link>
    </main>
  );
}
