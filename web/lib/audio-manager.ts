import type { Preferences } from "./game-store";

type Cue = "confirm" | "secret" | "toast" | "achievement" | "open" | "tick" | "complete" | "start";

const progressions: Record<string, { chords: number[][]; step: number; glide: number; wave: OscillatorType }> = {
  "night-drive": {
    chords: [
      [110, 164.81, 220],
      [130.81, 196, 261.63],
      [98, 146.83, 196],
      [87.31, 130.81, 174.61],
    ],
    step: 3000,
    glide: 0.3,
    wave: "sawtooth",
  },
  sunset: {
    chords: [
      [146.83, 220, 293.66],
      [123.47, 185, 246.94],
      [130.81, 196, 261.63],
      [110, 164.81, 220],
    ],
    step: 2400,
    glide: 0.2,
    wave: "triangle",
  },
  ambient: {
    chords: [
      [130.81, 196, 293.66],
      [146.83, 220, 329.63],
      [110, 164.81, 246.94],
      [130.81, 196, 261.63],
    ],
    step: 6000,
    glide: 1.5,
    wave: "sine",
  },
};

class AudioManager {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private sfx: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private voices: OscillatorNode[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private station = "off";
  private enabled = false;
  private lastCue = 0;

  async activate() {
    try {
      if (!this.context) {
        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.music = this.context.createGain();
        this.sfx = this.context.createGain();
        this.filter = this.context.createBiquadFilter();
        this.filter.type = "lowpass";
        this.filter.frequency.value = 900;
        this.master.gain.value = 0;
        this.music.connect(this.filter);
        this.filter.connect(this.master);
        this.sfx.connect(this.master);
        this.master.connect(this.context.destination);
      }
      await this.context.resume();
      return this.context.state === "running";
    } catch {
      return false;
    }
  }

  sync(preferences: Preferences) {
    if (!this.context || !this.master || !this.music || !this.sfx) return;
    this.enabled =
      preferences.sound && preferences.mode === "game" && !document.hidden;
    const time = this.context.currentTime;
    this.master.gain.setTargetAtTime(
      this.enabled ? preferences.master / 100 : 0,
      time,
      0.08,
    );
    this.music.gain.setTargetAtTime((preferences.music / 100) * 0.1, time, 0.1);
    this.sfx.gain.setTargetAtTime((preferences.sfx / 100) * 0.15, time, 0.05);
    const nextStation = this.enabled ? preferences.station : "off";
    if (this.station !== nextStation) {
      this.stopMusic();
      this.station = nextStation;
      if (nextStation !== "off") this.startMusic(nextStation);
    }
  }

  private stopMusic() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.voices.forEach((voice) => {
      try {
        voice.stop();
        voice.disconnect();
      } catch {}
    });
    this.voices = [];
  }

  private startMusic(station: string) {
    const program = progressions[station];
    if (!this.context || !this.music || !program) return;
    let chord = 0;
    this.voices = program.chords[0].map((frequency, index) => {
      const voice = this.context!.createOscillator();
      voice.type = index === 0 ? "sine" : program.wave;
      voice.frequency.value = frequency;
      voice.detune.value = index * 4 - 4;
      voice.connect(this.music!);
      voice.start();
      return voice;
    });
    this.timer = setInterval(() => {
      chord = (chord + 1) % program.chords.length;
      this.voices.forEach((voice, index) =>
        voice.frequency.setTargetAtTime(
          program.chords[chord][index],
          this.context!.currentTime,
          program.glide,
        ),
      );
    }, program.step);
  }

  private tone(from: number, to: number, start: number, length: number, type: OscillatorType = "sine", peak = 0.5) {
    const context = this.context!;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, start);
    oscillator.frequency.exponentialRampToValueAtTime(to, start + length * 0.6);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(peak, start + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.001, start + length);
    oscillator.connect(envelope);
    envelope.connect(this.sfx!);
    oscillator.start(start);
    oscillator.stop(start + length + 0.02);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  }

  /** Short original synthesized cues. Rate-limited so they never pile up. */
  cue(kind: Cue) {
    if (!this.enabled || !this.context || !this.sfx) return;
    const now = performance.now();
    if (kind !== "achievement" && kind !== "complete" && now - this.lastCue < 60) return;
    this.lastCue = now;
    const t = this.context.currentTime;
    const jitter = 1 + (Math.random() - 0.5) * 0.04;
    switch (kind) {
      case "tick":
        this.tone(1200 * jitter, 900, t, 0.05, "square", 0.12);
        break;
      case "open":
        this.tone(300 * jitter, 600, t, 0.16, "triangle", 0.35);
        break;
      case "toast":
        this.tone(880 * jitter, 990, t, 0.12, "sine", 0.3);
        break;
      case "secret":
        this.tone(660, 990, t, 0.2);
        this.tone(990, 1320, t + 0.12, 0.25);
        break;
      case "start":
        this.tone(220, 440, t, 0.3, "sawtooth", 0.25);
        this.tone(330, 660, t + 0.08, 0.35, "triangle", 0.3);
        break;
      case "achievement":
        [523.25, 659.25, 783.99].forEach((f, i) => this.tone(f, f * 1.01, t + i * 0.09, 0.3, "triangle", 0.35));
        break;
      case "complete":
        [392, 523.25, 659.25, 1046.5].forEach((f, i) => this.tone(f, f, t + i * 0.11, 0.45, "triangle", 0.35));
        break;
      default:
        this.tone(420 * jitter, 640, t, 0.18);
    }
  }

  confirm(secret = false) {
    this.cue(secret ? "secret" : "confirm");
  }
}
export const audioManager = new AudioManager();
