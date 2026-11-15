"use client";
import { Moon, Sunset } from "lucide-react";
import { useEffect } from "react";
import { timeOfDay, useClock } from "@/lib/use-clock";

/** Keeps the dusk/night palette in step with the visitor's clock. Renders nothing. */
export function TimeOfDaySync() {
  const clock = useClock();
  const time = timeOfDay(clock);
  useEffect(() => {
    if (clock) document.documentElement.dataset.time = time;
  }, [clock, time]);
  return null;
}

/** Real local time, shown in the pause menu. */
export function HudClock() {
  const clock = useClock();
  const time = timeOfDay(clock);
  if (!clock) return <span className="hud-clock" aria-hidden="true">--:--</span>;
  const Icon = time === "night" ? Moon : Sunset;
  const label = clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  return (
    <span className="hud-clock" title="Your local time">
      <Icon size={14} aria-hidden="true" />
      <span className="sr-only">Local time </span>
      {label}
    </span>
  );
}
