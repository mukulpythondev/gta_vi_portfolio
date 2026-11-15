/**
 * One original, code-drawn scene per district, so every page has its own place
 * in the world. Each scene is light: a few dozen shapes and at most two
 * transform/opacity animations, so it costs almost nothing to paint.
 */
import type { ReactNode } from "react";

export type SceneKey =
  | "map"
  | "about"
  | "missions"
  | "experience"
  | "hackathons"
  | "skills"
  | "achievements"
  | "gallery"
  | "timeline"
  | "contact"
  | "resume"
  | "coast";

const W = 1600;
const H = 480;
const INK = "#0b0418";

function Sky({ id, top, mid, low }: { id: string; top: string; mid: string; low: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset=".6" stopColor={mid} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
    </>
  );
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* ---------- Safehouse: a desk by a big window over the city at night ---------- */
function About() {
  return (
    <>
      <Sky id="ab" top="#0c0622" mid="#2a0f4f" low="#5a1d63" />
      <g fill="#1d0b3a">
        {range(22).map((i) => (
          <rect key={i} x={i * 74} y={180 + ((i * 53) % 120)} width="60" height="300" />
        ))}
      </g>
      <g fill="#ffd38a" opacity=".5">
        {range(60).map((i) => (
          <rect key={i} x={(i * 97) % 1600} y={210 + ((i * 41) % 200)} width="5" height="7" />
        ))}
      </g>
      {/* window frame */}
      <g fill={INK}>
        <rect x="0" y="0" width={W} height="26" />
        <rect x="0" y="0" width="26" height={H} />
        <rect x="540" y="0" width="16" height={H} />
        <rect x="1060" y="0" width="16" height={H} />
        <rect x="0" y="230" width={W} height="10" />
        <rect x="0" y="372" width={W} height={H - 372} />
      </g>
      {/* desk, monitor, lamp, plant, mug */}
      <rect x="760" y="362" width="760" height="14" fill="#2a1446" />
      <g transform="translate(1040 214)">
        <rect width="250" height="148" rx="6" fill="#140828" stroke="#18f0ff" strokeOpacity=".7" strokeWidth="2" />
        {range(7).map((i) => (
          <rect key={i} x={18 + (i % 3) * 14} y={20 + i * 16} width={60 + ((i * 37) % 120)} height="5" rx="2" fill={i % 3 ? "#18f0ff" : "#ff2e88"} opacity=".7" />
        ))}
        <rect className="sc-blink" x="150" y="132" width="9" height="5" fill="#fff" />
        <rect x="112" y="148" width="26" height="16" fill="#140828" />
      </g>
      <g transform="translate(860 362)" fill="#140828">
        <path d="M0 0 L8 -96 L52 -126" stroke="#140828" strokeWidth="6" fill="none" />
        <path d="M34 -140 L82 -110 L60 -96 Z" />
        <path d="M70 -100 L160 30 L-10 30 Z" fill="#ffd38a" opacity=".08" />
        <rect x="-20" y="-6" width="40" height="6" />
      </g>
      <g transform="translate(1400 362)">
        <rect x="-20" y="-34" width="40" height="34" fill="#3a1c5c" />
        <path d="M0 -34 C -30 -70 -40 -100 -20 -120 M0 -34 C 10 -80 30 -110 50 -118 M0 -34 C -6 -70 4 -110 2 -140" stroke="#0fd99b" strokeWidth="7" fill="none" strokeLinecap="round" opacity=".8" />
      </g>
      <rect x="1330" y="340" width="22" height="22" rx="3" fill="#ff2e88" opacity=".8" />
    </>
  );
}

/* ---------- Dev District: harbor with cranes and containers ---------- */
function Missions() {
  const colors = ["#ff2e88", "#18f0ff", "#ffb238", "#0fd99b", "#9d4dff", "#ff6b4a"];
  return (
    <>
      <Sky id="ms" top="#120a2e" mid="#4b1d6e" low="#ff7a6b" />
      <circle cx="380" cy="310" r="90" fill="#ffb238" opacity=".55" />
      <rect y="330" width={W} height="150" fill="#1b0c3a" />
      <g opacity=".5" fill="#ffb238">
        {range(8).map((i) => (
          <rect key={i} x={330 + i * 4} y={346 + i * 14} width={100 - i * 8} height="3" />
        ))}
      </g>
      {/* cranes */}
      {[700, 1050, 1380].map((x, k) => (
        <g key={x} transform={`translate(${x} 330)`} fill={INK}>
          <path d="M-30 0 L-14 -210 H14 L30 0 H18 L6 -190 H-6 L-18 0 Z" />
          <rect x="-180" y="-230" width="330" height="18" />
          <rect x="120" y="-262" width="16" height="32" />
          <path d="M-14 -230 L60 -262 L136 -230" stroke={INK} strokeWidth="4" fill="none" />
          <g transform="translate(-120 -212)">
            <g className={k === 1 ? "sc-sway" : undefined}>
              <rect x="-1" y="0" width="2" height="110" />
              <rect x="-24" y="110" width="48" height="22" fill={colors[k + 1]} opacity=".85" />
            </g>
          </g>
          <circle cx="136" cy="-264" r="4" fill="#ff2e5a" className="sc-blink" />
        </g>
      ))}
      {/* container stacks on the quay */}
      <g>
        {range(36).map((i) => {
          const col = i % 12;
          const row = Math.floor(i / 12);
          if ((col * 7 + row * 3) % 5 === 0) return null;
          return (
            <rect key={i} x={620 + col * 82} y={302 - row * 26} width="78" height="24" fill={colors[(col + row * 2) % colors.length]} opacity={0.55 + row * 0.12} />
          );
        })}
      </g>
      <rect x="560" y="326" width="1040" height="8" fill={INK} />
      {/* ship */}
      <g transform="translate(120 360)">
        <path d="M0 0 H420 L390 50 H30 Z" fill={INK} />
        <rect x="290" y="-40" width="90" height="40" fill={INK} />
        <rect x="330" y="-70" width="14" height="30" fill={INK} />
        {range(6).map((i) => (
          <rect key={i} x={30 + i * 42} y="-24" width="38" height="24" fill={colors[i]} opacity=".7" />
        ))}
      </g>
    </>
  );
}

/* ---------- Corporate HQ: glass towers and a helipad ---------- */
function Experience() {
  return (
    <>
      <Sky id="ex" top="#0a1640" mid="#264a8a" low="#ff9fb0" />
      <defs>
        <linearGradient id="ex-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7fe8ff" stopOpacity=".55" />
          <stop offset=".5" stopColor="#1b2a5c" />
          <stop offset="1" stopColor="#0d1230" />
        </linearGradient>
      </defs>
      <g className="sc-drift" fill="#fff" opacity=".12">
        <ellipse cx="300" cy="90" rx="160" ry="18" />
        <ellipse cx="900" cy="60" rx="220" ry="14" />
      </g>
      {[
        [620, 160, 120],
        [760, 60, 150],
        [930, 120, 110],
        [1060, 20, 170],
        [1250, 140, 120],
        [1390, 90, 140],
      ].map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={H - y} fill="url(#ex-glass)" />
          {range(Math.floor((H - y) / 22)).map((r) => (
            <rect key={r} x={x} y={y + r * 22} width={w} height="1.5" fill="#bff6ff" opacity=".18" />
          ))}
          <rect x={x + w / 2 - 1} y={y - 30} width="2" height="30" fill="#bff6ff" opacity=".5" />
          <circle cx={x + w / 2} cy={y - 32} r="3.5" fill="#ff2e5a" className={i % 2 ? "sc-blink" : undefined} />
        </g>
      ))}
      {/* helipad on the tallest tower */}
      <g transform="translate(1145 20)">
        <ellipse cx="0" cy="0" rx="70" ry="9" fill="#0d1230" stroke="#ffb238" strokeWidth="2" />
        <text x="0" y="4" textAnchor="middle" fontSize="11" fill="#ffb238" fontFamily="monospace" fontWeight="700">H</text>
      </g>
      <rect y="440" width={W} height="40" fill="#060a1e" />
    </>
  );
}

/* ---------- The Arena: stadium under floodlights ---------- */
function Hackathons() {
  return (
    <>
      <Sky id="hk" top="#08041a" mid="#1d0d40" low="#3d1360" />
      {[260, 640, 1000, 1380].map((x, i) => (
        <g key={x} transform={`translate(${x} 70)`}>
          <g className={i % 2 ? "sc-beam sc-beam-b" : "sc-beam"}>
            <path d="M-18 0 L-180 420 H180 L18 0 Z" fill="#fff6c8" opacity=".07" />
          </g>
          <rect x="-4" y="0" width="8" height="300" fill={INK} />
          <rect x="-34" y="-16" width="68" height="24" fill="#2a1446" />
          {range(4).map((k) => (
            <circle key={k} cx={-24 + k * 16} cy="-4" r="5" fill="#fff6c8" />
          ))}
        </g>
      ))}
      <path d={`M0 300 Q 800 190 ${W} 300 V${H} H0 Z`} fill="#170a30" />
      <g fill="#ff2e88" opacity=".35">
        {range(120).map((i) => (
          <circle key={i} cx={(i * 131) % 1600} cy={300 - Math.sin(((i * 131) % 1600) / 1600 * Math.PI) * 90 + ((i * 17) % 60)} r="2.4" />
        ))}
      </g>
      <path d={`M0 380 Q 800 330 ${W} 380 V${H} H0 Z`} fill="#0fd99b" opacity=".25" />
      <g transform="translate(800 180)">
        <rect x="-110" y="-46" width="220" height="70" rx="4" fill={INK} stroke="#18f0ff" strokeWidth="2" />
        <text x="0" y="-12" textAnchor="middle" fontSize="13" fill="#18f0ff" fontFamily="monospace" letterSpacing="3">HACK CLOCK</text>
        <text x="0" y="14" textAnchor="middle" fontSize="22" fill="#ffb238" fontFamily="monospace" fontWeight="700" className="sc-blink-slow">36:00:00</text>
      </g>
    </>
  );
}

/* ---------- The Warehouse: racks, crates and hanging lamps ---------- */
function Skills() {
  return (
    <>
      <rect width={W} height={H} fill="#120822" />
      {/* roller door open to the sunset */}
      <g transform="translate(1180 120)">
        <rect width="360" height="300" fill="#ff7a6b" />
        <rect width="360" height="160" fill="#ffb238" opacity=".6" />
        <circle cx="180" cy="210" r="70" fill="#fff2a8" opacity=".7" />
        <rect y="250" width="360" height="50" fill="#2a0c4a" />
        <g fill="#2a1446">
          {range(6).map((i) => (
            <rect key={i} y={i * 14} width="360" height="11" />
          ))}
        </g>
      </g>
      {/* racks */}
      {[80, 480, 820].map((x) => (
        <g key={x} transform={`translate(${x} 110)`}>
          <rect width="300" height="310" fill="none" stroke="#3a1c5c" strokeWidth="8" />
          {[100, 200].map((y) => (
            <rect key={y} y={y} width="300" height="8" fill="#3a1c5c" />
          ))}
          {range(9).map((i) => {
            const shelf = Math.floor(i / 3);
            const w = 70 + ((i * 29) % 30);
            return (
              <g key={i} transform={`translate(${14 + (i % 3) * 96} ${shelf * 100 + 100 - 52})`}>
                <rect width={w} height="52" fill={i % 4 === 0 ? "#2a3a2a" : "#3a2414"} stroke="#ffb238" strokeOpacity=".35" />
                <path d={`M0 0 L${w} 52 M${w} 0 L0 52`} stroke="#ffb238" strokeOpacity=".15" />
                {i % 4 === 0 && <rect x="8" y="20" width={w - 16} height="8" fill="#0fd99b" opacity=".5" />}
              </g>
            );
          })}
        </g>
      ))}
      {/* hanging lamps */}
      {[230, 630, 970].map((x, i) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <g className={i === 1 ? "sc-swing" : undefined}>
            <rect x="-1" y="0" width="2" height="60" fill="#3a1c5c" />
            <path d="M-26 74 L-10 58 H10 L26 74 Z" fill="#3a1c5c" />
            <path d="M-26 74 L-150 420 H150 L26 74 Z" fill="#ffd38a" opacity=".06" />
          </g>
        </g>
      ))}
      <rect y="420" width={W} height="60" fill="#0a0414" />
      <path d={`M0 420 H${W}`} stroke="#ffb238" strokeWidth="3" strokeDasharray="40 30" opacity=".5" />
    </>
  );
}

/* ---------- Hall of Fame: trophies on lit pedestals ---------- */
function Achievements() {
  const trophy = "M-22 -70 H22 V-58 C22 -36 12 -28 4 -26 V-12 H14 V0 H-14 V-12 H-4 V-26 C-12 -28 -22 -36 -22 -58 Z M22 -66 C36 -66 36 -46 20 -44 M-22 -66 C-36 -66 -36 -46 -20 -44";
  return (
    <>
      <Sky id="ac" top="#0d0520" mid="#2a0d3d" low="#4a1650" />
      <g fill="#fff2a8">
        {range(40).map((i) => (
          <circle key={i} className={i % 3 ? undefined : "sc-twinkle"} cx={(i * 211) % 1600} cy={(i * 67) % 220} r={i % 5 ? 1.5 : 2.6} opacity=".7" />
        ))}
      </g>
      {[620, 860, 1100, 1340].map((x, i) => {
        const h = [110, 160, 130, 90][i];
        return (
          <g key={x} transform={`translate(${x} ${420 - h})`}>
            <path d={`M-30 -260 L-110 ${h} H110 L30 -260 Z`} fill="#fff6c8" opacity=".05" />
            <rect x="-60" y="0" width="120" height={h} fill="#1d0b3a" stroke="#ffb238" strokeOpacity=".4" />
            <rect x="-60" y="0" width="120" height="6" fill="#ffb238" opacity=".7" />
            <g transform="translate(0 0)" fill="#ffb238" stroke="#ffb238" strokeWidth="3">
              <path d={trophy} fillOpacity=".85" strokeOpacity=".9" />
            </g>
          </g>
        );
      })}
      <rect y="420" width={W} height="60" fill="#09030f" />
      <path d="M560 480 L760 420 H1460 L1600 480 Z" fill="#8a1a3a" opacity=".5" />
    </>
  );
}

/* ---------- Arts Quarter: pier, ferris wheel and string lights ---------- */
function Gallery() {
  const spokes = range(12);
  return (
    <>
      <Sky id="ga" top="#1a0838" mid="#8a2a7a" low="#ffae5c" />
      <rect y="330" width={W} height="150" fill="#2a0f4f" />
      <g fill="none" stroke="#ffe1f0" opacity=".25">
        {range(6).map((i) => (
          <path key={i} d={`M0 ${350 + i * 20} H${W}`} strokeDasharray={`${30 + i * 10} ${50 + i * 6}`} />
        ))}
      </g>
      {/* pier */}
      <rect x="560" y="320" width="1040" height="14" fill={INK} />
      {range(14).map((i) => (
        <rect key={i} x={580 + i * 74} y="334" width="8" height="90" fill={INK} />
      ))}
      {/* ferris wheel */}
      <g transform="translate(1180 170)">
        <path d="M-90 150 L0 0 L90 150" stroke={INK} strokeWidth="10" fill="none" />
        <g className="sc-spin">
          <circle r="140" fill="none" stroke={INK} strokeWidth="6" />
          <circle r="140" fill="none" stroke="#ff2e88" strokeWidth="2" strokeDasharray="4 14" />
          {spokes.map((i) => {
            const a = (i / spokes.length) * Math.PI * 2;
            return (
              <g key={i}>
                <line x1="0" y1="0" x2={Math.cos(a) * 140} y2={Math.sin(a) * 140} stroke={INK} strokeWidth="3" />
                <rect x={Math.cos(a) * 140 - 11} y={Math.sin(a) * 140 - 8} width="22" height="16" rx="4" fill={["#18f0ff", "#ffb238", "#0fd99b"][i % 3]} />
              </g>
            );
          })}
        </g>
        <circle r="12" fill={INK} />
      </g>
      {/* string lights */}
      <path d="M560 250 Q 760 300 960 250" stroke={INK} strokeWidth="2" fill="none" />
      {range(9).map((i) => {
        const t = i / 8;
        return <circle key={i} cx={560 + t * 400} cy={250 + Math.sin(t * Math.PI) * 25} r="5" fill={i % 2 ? "#ffd38a" : "#ff2e88"} />;
      })}
      {/* photo booth */}
      <g transform="translate(700 236)">
        <rect width="80" height="84" fill="#ff2e88" />
        <rect x="10" y="14" width="60" height="40" fill={INK} />
        <circle cx="40" cy="34" r="12" fill="none" stroke="#fff" strokeWidth="3" />
        <text x="40" y="74" textAnchor="middle" fontSize="11" fill="#fff" fontFamily="monospace" fontWeight="700">PHOTO</text>
      </g>
    </>
  );
}

/* ---------- The Journey: a road winding into the hills at sunrise ---------- */
function Timeline() {
  const signs = [
    [760, 380, "2023"],
    [1010, 300, "2025"],
    [1240, 248, "2027"],
  ] as const;
  return (
    <>
      <Sky id="tl" top="#140a38" mid="#7a2a7a" low="#ffb27a" />
      <circle cx="1320" cy="230" r="80" fill="#fff2a8" opacity=".75" className="sc-glow" />
      <path d={`M0 300 L200 220 L380 280 L620 180 L860 260 L1100 160 L1340 240 L1600 190 V${H} H0 Z`} fill="#3d1360" />
      <path d={`M0 360 L260 280 L520 340 L780 270 L1040 330 L1300 260 L1600 310 V${H} H0 Z`} fill="#25093f" />
      <path d={`M300 ${H} C 700 420 600 340 1000 320 S 1260 250 1340 240 L1360 244 C 1260 270 1080 330 1050 350 S 860 450 760 ${H} Z`} fill={INK} />
      <path d={`M530 ${H} C 760 420 760 360 1020 336 S 1260 256 1350 242`} stroke="#ffd38a" strokeWidth="3" strokeDasharray="22 18" fill="none" opacity=".75" />
      {signs.map(([x, y, label]) => (
        <g key={label} transform={`translate(${x} ${y})`}>
          <rect x="-2" y="-50" width="4" height="50" fill={INK} />
          <rect x="-34" y="-74" width="68" height="28" rx="3" fill="#0fd99b" />
          <text x="0" y="-54" textAnchor="middle" fontSize="15" fontWeight="700" fill={INK} fontFamily="monospace">
            {label}
          </text>
        </g>
      ))}
    </>
  );
}

/* ---------- Contact: lighthouse on the cliff with a sweeping beam ---------- */
function Contact() {
  return (
    <>
      <Sky id="ct" top="#070a26" mid="#1a2058" low="#4a2a78" />
      <circle cx="420" cy="120" r="46" fill="#f3f0ff" opacity=".85" />
      <circle cx="404" cy="110" r="46" fill="#1a2058" opacity=".35" />
      <rect y="350" width={W} height="130" fill="#101646" />
      <g stroke="#bff6ff" opacity=".25" fill="none">
        {range(5).map((i) => (
          <path key={i} d={`M0 ${370 + i * 22} H${W}`} strokeDasharray={`${20 + i * 12} ${40 + i * 8}`} />
        ))}
      </g>
      <path d={`M960 ${H} L1000 330 L1120 300 L1240 260 L1460 250 L1600 280 V${H} Z`} fill={INK} />
      <g transform="translate(1300 250)">
        <g transform="translate(0 -180)">
          <g className="sc-sweep">
            <path d="M0 0 L-900 -70 L-900 70 Z" fill="#fff6c8" opacity=".12" />
          </g>
        </g>
        <path d="M-30 0 L-20 -160 H20 L30 0 Z" fill="#f3f0ff" />
        <rect x="-26" y="-120" width="52" height="18" fill="#ff2e5a" />
        <rect x="-24" y="-60" width="48" height="18" fill="#ff2e5a" />
        <rect x="-26" y="-196" width="52" height="36" fill={INK} />
        <rect x="-18" y="-190" width="36" height="24" fill="#fff6c8" />
        <path d="M-30 -196 L0 -222 L30 -196 Z" fill="#ff2e5a" />
      </g>
      {/* phone booth by the road */}
      <g transform="translate(1100 300)">
        <rect x="-22" y="-80" width="44" height="80" fill="#ff2e88" />
        <rect x="-16" y="-66" width="32" height="48" fill="#ffd38a" opacity=".55" />
        <rect x="-22" y="-88" width="44" height="10" fill={INK} />
      </g>
    </>
  );
}

/* ---------- Records office: filing cabinets and the case file ---------- */
function Resume() {
  return (
    <>
      <rect width={W} height={H} fill="#130a24" />
      <g transform="translate(1180 60)">
        <g className="sc-spin-slow">
          {range(4).map((i) => (
            <rect key={i} x="-6" y="0" width="12" height="110" rx="6" fill="#2a1446" transform={`rotate(${i * 90})`} />
          ))}
        </g>
        <circle r="14" fill="#3a1c5c" />
      </g>
      {[620, 760, 900].map((x) => (
        <g key={x} transform={`translate(${x} 160)`}>
          <rect width="124" height="260" fill="#241040" stroke="#3a1c5c" strokeWidth="3" />
          {range(4).map((i) => (
            <g key={i}>
              <rect x="10" y={10 + i * 62} width="104" height="54" fill="#2d1450" />
              <rect x="44" y={28 + i * 62} width="36" height="8" rx="3" fill="#ffb238" opacity=".7" />
            </g>
          ))}
        </g>
      ))}
      <rect x="1060" y="330" width="500" height="14" fill="#3a1c5c" />
      <g transform="translate(1180 270) rotate(-6)">
        <rect width="230" height="60" fill="#e6c48a" />
        <rect x="0" y="-12" width="90" height="14" fill="#e6c48a" />
        <rect x="70" y="16" width="110" height="28" fill="none" stroke="#c8102e" strokeWidth="3" />
        <text x="125" y="36" textAnchor="middle" fontSize="15" fill="#c8102e" fontFamily="monospace" fontWeight="700">DOSSIER</text>
      </g>
      <rect y="420" width={W} height="60" fill="#0a0414" />
    </>
  );
}

/* ---------- World map: radar sweep over the islands ---------- */
function MapScene() {
  return (
    <>
      <rect width={W} height={H} fill="#06101f" />
      <g stroke="#18f0ff" opacity=".12">
        {range(17).map((i) => (
          <path key={`v${i}`} d={`M${i * 100} 0 V${H}`} />
        ))}
        {range(6).map((i) => (
          <path key={`h${i}`} d={`M0 ${i * 100} H${W}`} />
        ))}
      </g>
      <g fill="#0fd99b" opacity=".35">
        <path d="M900 160 C 980 90 1120 110 1160 180 C 1200 250 1100 300 1010 280 C 930 260 850 220 900 160 Z" />
        <path d="M1260 300 C 1300 260 1380 270 1400 320 C 1410 370 1330 390 1290 370 C 1250 350 1240 330 1260 300 Z" />
        <path d="M700 330 C 740 310 790 320 800 350 C 805 380 760 390 730 380 C 700 370 690 350 700 330 Z" />
      </g>
      <g transform="translate(1100 240)">
        {[80, 160, 240, 320].map((r) => (
          <circle key={r} r={r} fill="none" stroke="#18f0ff" opacity=".25" />
        ))}
        <g className="sc-spin-fast">
          <path d="M0 0 L320 0 A320 320 0 0 0 277 -160 Z" fill="#18f0ff" opacity=".12" />
        </g>
        <circle r="5" fill="#ff2e88" />
      </g>
    </>
  );
}

/* ---------- Footer coast: palms over a calm night sea, no traffic ---------- */
function Coast() {
  const palm = (x: number, s: number, flip = false) => (
    <g transform={`translate(${x} 400) scale(${flip ? -s : s} ${s})`} fill={INK}>
      <path d="M0 0 C 6 -70 22 -140 54 -200" stroke={INK} strokeWidth="11" fill="none" strokeLinecap="round" />
      <g transform="translate(54 -200)">
        <path d="M0 0 C -50 -16 -92 8 -124 50 C -84 16 -42 8 0 6 Z" />
        <path d="M0 0 C -34 -50 -84 -66 -124 -50 C -74 -40 -34 -24 0 3 Z" />
        <path d="M0 0 C 8 -58 42 -92 84 -100 C 50 -74 24 -40 3 3 Z" />
        <path d="M0 0 C 50 -24 100 -16 140 24 C 92 0 50 -2 2 6 Z" />
        <path d="M0 0 C 42 8 84 42 100 92 C 66 50 34 24 0 8 Z" />
      </g>
    </g>
  );
  return (
    <>
      <Sky id="co" top="#07030f" mid="#1b0c3a" low="#3a1458" />
      <circle cx="1200" cy="250" r="70" fill="#ffe1f0" opacity=".2" />
      <rect y="300" width={W} height="180" fill="#120830" />
      <g stroke="#ffe1f0" opacity=".2">
        {range(6).map((i) => (
          <path key={i} d={`M${1060 + i * 8} ${314 + i * 14} H${1340 - i * 8}`} />
        ))}
      </g>
      <path d={`M0 400 Q 400 380 800 396 T ${W} 392 V${H} H0 Z`} fill="#0a0418" />
      {palm(60, 1.1)}
      {palm(330, 0.75, true)}
      {palm(1450, 1, true)}
    </>
  );
}

const scenes: Record<SceneKey, () => ReactNode> = {
  map: MapScene,
  about: About,
  missions: Missions,
  experience: Experience,
  hackathons: Hackathons,
  skills: Skills,
  achievements: Achievements,
  gallery: Gallery,
  timeline: Timeline,
  contact: Contact,
  resume: Resume,
  coast: Coast,
};

export function SectionScene({ scene, className = "" }: { scene: SceneKey; className?: string }) {
  const Draw = scenes[scene] ?? About;
  return (
    <div className={`section-scene scene-${scene} ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice">
        <Draw />
      </svg>
    </div>
  );
}
