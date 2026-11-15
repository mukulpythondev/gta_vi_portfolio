"use client";
import { Lock, Trophy } from "lucide-react";
import { trophyList } from "@/lib/trophies";
import { useGame } from "@/lib/game-store";

/** Trophies earned by exploring this site. Stored on this device only. */
export function TrophyCase() {
  const state = useGame();
  const unlocked = trophyList.filter((item) => state.trophies.includes(item.id)).length;
  return (
    <section className="trophy-case" aria-labelledby="trophy-case-title">
      <div className="trophy-head">
        <div>
          <p className="eyebrow">IN-WORLD TROPHIES · THIS DEVICE</p>
          <h2 id="trophy-case-title">Your trophies</h2>
        </div>
        <span className="trophy-count">
          {unlocked}/{trophyList.length}
        </span>
      </div>
      <p className="muted">
        These track how you explored this portfolio. They are not career claims.
      </p>
      <ul className="trophy-grid">
        {trophyList.map((item) => {
          const on = state.trophies.includes(item.id);
          return (
            <li key={item.id} className={on ? "is-unlocked" : "is-locked"}>
              <span className="trophy-icon">{on ? <Trophy size={22} /> : <Lock size={20} />}</span>
              <strong>{on ? item.title : "Locked trophy"}</strong>
              <span>{item.detail}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
