"use client";
import { useState } from "react";
import { Radio, X } from "lucide-react";
import { useGame, updateGame, type Station } from "@/lib/game-store";
import { audioManager } from "@/lib/audio-manager";
import { useModal } from "@/lib/use-modal";
import { world } from "@/content/world";

export const stationInfo: Record<Station, { name: string; freq: string; genre: string }> = {
  off: { name: "Radio off", freq: "--.-", genre: "Silence" },
  "night-drive": { name: "Night Drive FM", freq: "94.7", genre: "Dark synth" },
  sunset: { name: "Sunset Boulevard", freq: "101.3", genre: "Warm retro pop" },
  ambient: { name: "Deep Focus Radio", freq: "88.1", genre: "Ambient for coding" },
};

export default function AudioSettings({ onClose }: { onClose: () => void }) {
  const state = useGame();
  const dialog = useModal();
  const [error, setError] = useState("");
  async function toggleSound(enabled: boolean) {
    setError("");
    if (!enabled) {
      updateGame({ sound: false });
      return;
    }
    if (await audioManager.activate()) updateGame({ sound: true });
    else
      setError(
        "Audio is unavailable in this browser. The portfolio still works normally.",
      );
  }
  const live = state.sound && state.station !== "off";
  const info = stationInfo[state.station];
  return (
    <dialog
      ref={dialog}
      className="settings-dialog"
      aria-labelledby="audio-title"
      data-lenis-prevent
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-head">
        <div>
          <p className="eyebrow">{world.name.toUpperCase()} / PREFERENCES</p>
          <h2 id="audio-title">Radio & settings</h2>
        </div>
        <button
          className="icon-button"
          aria-label="Close settings"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <div className={`radio-display ${live ? "is-live" : ""}`} aria-hidden="true">
        <span className="radio-freq">{info.freq}</span>
        <span className="radio-name">
          {info.name}
          <small>{live ? info.genre : state.sound ? "Pick a station" : "Sound is off"}</small>
        </span>
        <span className="equalizer">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="station-dial" role="group" aria-label="Stations">
        {(Object.keys(stationInfo) as Station[]).map((key) => (
          <button
            key={key}
            aria-pressed={state.station === key}
            onClick={() => {
              updateGame({ station: key });
              audioManager.cue("tick");
            }}
          >
            <b>{stationInfo[key].freq}</b>
            {stationInfo[key].name}
          </button>
        ))}
      </div>
      <label className="setting-row">
        Sound enabled
        <input
          type="checkbox"
          checked={state.sound}
          disabled={state.mode === "recruiter"}
          onChange={(event) => void toggleSound(event.target.checked)}
        />
      </label>
      {state.mode === "recruiter" && (
        <p className="settings-note">Audio is off in Recruiter Mode.</p>
      )}
      <label className="setting-row">
        <span className="radio-label">
          <Radio size={17} />
          Station
        </span>
        <select
          aria-label="Music station"
          value={state.station}
          onChange={(event) =>
            updateGame({ station: event.target.value as Station })
          }
        >
          {(Object.keys(stationInfo) as Station[]).map((key) => (
            <option key={key} value={key}>
              {key === "off" ? "Off" : stationInfo[key].name}
            </option>
          ))}
        </select>
      </label>
      {(
        [
          ["master", "Master volume"],
          ["music", "Music volume"],
          ["sfx", "SFX volume"],
        ] as const
      ).map(([key, label]) => (
        <label className="volume-row" key={key}>
          <span>
            {label}
            <output>{state[key]}%</output>
          </span>
          <input
            aria-label={label}
            type="range"
            min="0"
            max="100"
            value={state[key]}
            onChange={(event) =>
              updateGame({ [key]: Number(event.target.value) })
            }
          />
        </label>
      ))}
      <label className="setting-row">
        Motion effects
        <input
          type="checkbox"
          checked={state.motion}
          onChange={(event) => updateGame({ motion: event.target.checked })}
        />
      </label>
      <p className="settings-note">
        Original synthesized audio. System reduced-motion preferences always
        take priority.
      </p>
      {error && (
        <p role="alert" className="settings-note">
          {error}
        </p>
      )}
    </dialog>
  );
}
