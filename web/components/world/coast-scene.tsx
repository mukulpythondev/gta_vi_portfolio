/**
 * The hero's key art: a golden-hour postcard of Solara Coast. Original, code-drawn
 * art in the spirit of a game's cover wallpaper: a low striped sun over the bay,
 * a hazy skyline and causeway, the sun's road on the water, palms framing the
 * shot, and the player leaning on a convertible at the seawall, back to us.
 * The left third stays darker and calm so the headline reads over it.
 * Each layer is one SVG so the parallax can move it; repeated shapes are merged
 * into single paths (perf rule: no per-element animation).
 */

const r1 = (n: number) => n.toFixed(1);

function rng(seed: number) {
  seed = (seed * 9301 + 49297) % 233280 + 1;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const HORIZON = 600;
const SUN = { x: 820, y: 505, r: 165 };

/* Stars in the upper sky, one path. */
const starRandom = rng(3);
const STARS = Array.from({ length: 70 }, () => {
  const x = starRandom() * 1600;
  const y = starRandom() * 230;
  const s = starRandom() > 0.85 ? 2.4 : 1.4;
  return `M${r1(x)} ${r1(y)}h${s}v${s}h-${s}z`;
}).join("");

/* Far skyline: a long hazy band of towers behind the sun. */
const farRandom = rng(11);
const FAR = (() => {
  let d = "";
  for (let x = 520; x < 1660; ) {
    const w = 16 + farRandom() * 34;
    const tall = Math.abs(x - SUN.x) < 260 ? 1.3 : 1;
    const h = (20 + farRandom() * 80) * tall;
    d += `M${r1(x)} ${HORIZON + 2}V${r1(HORIZON - h)}h${r1(w)}V${HORIZON + 2}z`;
    x += w + 3 + farRandom() * 6;
  }
  return d;
})();

/* Near downtown on the right: taller towers with lit windows. */
const nearRandom = rng(27);
const TOWERS: { x: number; w: number; h: number }[] = [];
for (let x = 1270; x < 1640; ) {
  const w = 34 + nearRandom() * 46;
  const h = 110 + nearRandom() * 200;
  TOWERS.push({ x, w, h });
  x += w + 6 + nearRandom() * 10;
}
const NEAR = TOWERS.map(({ x, w, h }) => `M${r1(x)} ${HORIZON + 4}V${r1(HORIZON - h)}h${r1(w)}V${HORIZON + 4}z`).join("");
const WINDOWS = TOWERS.flatMap(({ x, w, h }) => {
  const out: string[] = [];
  for (let y = HORIZON - h + 14; y < HORIZON - 10; y += 13) {
    for (let wx = x + 6; wx < x + w - 8; wx += 10) {
      if (nearRandom() > 0.72) out.push(`M${r1(wx)} ${r1(y)}h5v6h-5z`);
    }
  }
  return out;
}).join("");

/* Causeway bridge on the left: deck plus evenly spaced piers. */
const BRIDGE_PIERS = Array.from({ length: 18 }, (_, i) => `M${20 + i * 42} ${HORIZON - 16}h5v20h-5z`).join("");

/* The sun's road on the water: horizontal dashes that widen towards us. */
const roadRandom = rng(5);
const SUN_ROAD = Array.from({ length: 28 }, (_, i) => {
  const t = i / 27;
  const y = HORIZON + 6 + t * t * 200;
  const w = 40 + t * 280 + roadRandom() * 50;
  const h = 1.5 + t * 4;
  const x = SUN.x - w / 2 + (roadRandom() - 0.5) * 30 * t;
  return `M${r1(x)} ${r1(y)}h${r1(w)}v${r1(h)}h-${r1(w)}z`;
}).join("");

/* Sun stripes: gaps cut across the lower half of the disc. */
const SUN_CUTS = Array.from({ length: 6 }, (_, i) => {
  const y = SUN.y - 30 + i * 22;
  const h = 2.5 + i * 2;
  return `M${SUN.x - SUN.r} ${y}h${SUN.r * 2}v${r1(h)}h-${SUN.r * 2}z`;
}).join("");

/** A palm: a curved trunk plus a crown of leaves, as two path strings. */
function palm(baseX: number, baseY: number, height: number, lean: number, seed: number) {
  const random = rng(seed);
  const topX = baseX + lean;
  const topY = baseY - height;
  const midX = baseX + lean * 0.15;
  const midY = baseY - height * 0.55;
  const trunk = `M${baseX - 10} ${baseY}Q${r1(midX - 6)} ${r1(midY)} ${r1(topX - 4)} ${r1(topY)}h8Q${r1(midX + 8)} ${r1(midY)} ${baseX + 10} ${baseY}z`;
  let leaves = "";
  const count = 11;
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI - 0.15 + (i / (count - 1)) * (Math.PI + 0.3) + (random() - 0.5) * 0.2;
    const len = height * (0.34 + random() * 0.12);
    const droop = len * (0.3 + random() * 0.3) * Math.abs(Math.cos(angle));
    const ex = topX + Math.cos(angle) * len;
    const ey = topY + Math.sin(angle) * len * 0.5 + droop;
    const cx = topX + Math.cos(angle) * len * 0.55;
    const cy = topY + Math.sin(angle) * len * 0.62 - 6;
    const spread = 7 + random() * 5;
    leaves += `M${r1(topX)} ${r1(topY)}Q${r1(cx)} ${r1(cy - spread)} ${r1(ex)} ${r1(ey)}Q${r1(cx)} ${r1(cy + spread)} ${r1(topX)} ${r1(topY + 5)}z`;
  }
  return { trunk, leaves };
}

const PALMS = [
  palm(80, 905, 540, 80, 2),
  palm(270, 905, 400, -45, 8),
  palm(1530, 905, 590, -95, 14),
  palm(1395, 905, 360, 45, 19),
];

const layer = "scene-layer";
const svg = { viewBox: "0 0 1600 900", preserveAspectRatio: "xMidYMax slice" } as const;

export function CoastScene() {
  return (
    <div className="sunset-scene coast-scene" aria-hidden="true">
      <div className="cs-drift">
        {/* Sky. */}
        <svg className={`${layer} layer-sky`} {...svg}>
          <defs>
            <linearGradient id="cs-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#12062b" />
              <stop offset=".28" stopColor="#3d1068" />
              <stop offset=".5" stopColor="#a3207a" />
              <stop offset=".6" stopColor="#ef4a6a" />
              <stop offset=".67" stopColor="#ff8a4a" />
              <stop offset="1" stopColor="#ffc36e" />
            </linearGradient>
            <radialGradient id="cs-glow" cx={SUN.x} cy={SUN.y + 40} r="640" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffd67a" stopOpacity=".75" />
              <stop offset=".35" stopColor="#ff6a6a" stopOpacity=".3" />
              <stop offset="1" stopColor="#ff6a6a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1600" height="900" fill="url(#cs-sky)" />
          <rect width="1600" height="900" fill="url(#cs-glow)" />
          <path d={STARS} fill="#fff" opacity=".55" />
          {/* Long painted cloud streaks catching the light. */}
          <path
            d="M480 300c120-14 300-18 470-8 90 5 70 18-20 20-180 4-330 6-450 2-60-2-60-11 0-14zM1180 250c90-10 230-12 360-4 60 4 50 14-14 16-130 3-250 3-330 0-50-2-56-9-16-12zM620 395c160-10 380-12 560-2 80 4 60 15-30 17-200 3-370 3-520 0-70-2-70-12-10-15z"
            fill="#ffb37a"
            opacity=".35"
          />
          <path d="M600 440c140-7 330-8 470 0 50 3 40 11-20 12-160 2-310 2-440 0-50-1-50-9-10-12z" fill="#ffd9a0" opacity=".45" />
        </svg>

        {/* Sun with stripes cut out of its lower half. */}
        <svg className={`${layer} layer-sun`} {...svg}>
          <defs>
            <linearGradient id="cs-sun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff6c4" />
              <stop offset=".55" stopColor="#ffb85a" />
              <stop offset="1" stopColor="#ff4f7a" />
            </linearGradient>
            <mask id="cs-sun-cuts">
              <rect width="1600" height="900" fill="#fff" />
              <path d={SUN_CUTS} fill="#000" />
            </mask>
          </defs>
          <circle cx={SUN.x} cy={SUN.y} r={SUN.r} fill="url(#cs-sun)" mask="url(#cs-sun-cuts)" />
        </svg>

        {/* Hazy far skyline and the causeway. */}
        <svg className={`${layer} layer-far`} {...svg}>
          <path d={FAR} fill="#7a2368" opacity=".85" />
          <path
            d={`M0 ${HORIZON - 20}C300 ${HORIZON - 32} 520 ${HORIZON - 32} 780 ${HORIZON - 22}v7C520 ${HORIZON - 25} 300 ${HORIZON - 25} 0 ${HORIZON - 13}z`}
            fill="#4a1450"
          />
          <path d={BRIDGE_PIERS} fill="#4a1450" />
        </svg>

        {/* Near downtown with lit windows and a landmark hotel. */}
        <svg className={`${layer} layer-near`} {...svg}>
          <path d={NEAR} fill="#2b0c3f" />
          <path d={WINDOWS} fill="#ffc46b" opacity=".85" />
          <path d={`M1090 ${HORIZON + 4}V${HORIZON - 290}q38-46 76 0V${HORIZON + 4}z`} fill="#24093a" />
          <path d={`M1102 ${HORIZON - 278}h52`} stroke="#ff2e88" strokeWidth="2.5" fill="none" />
        </svg>

        {/* Water. */}
        <svg className={`${layer} layer-water`} {...svg}>
          <defs>
            <linearGradient id="cs-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d9466e" />
              <stop offset=".3" stopColor="#7a1f6a" />
              <stop offset="1" stopColor="#140621" />
            </linearGradient>
          </defs>
          <rect y={HORIZON} width="1600" height={900 - HORIZON} fill="url(#cs-water)" />
          <path d={SUN_ROAD} fill="#ffd27a" opacity=".7" />
        </svg>

        {/* Foreground: seawall, palms, convertible and the player. */}
        <svg className={`${layer} layer-palms`} {...svg}>
          <defs>
            <linearGradient id="cs-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1a0828" />
              <stop offset="1" stopColor="#07030d" />
            </linearGradient>
          </defs>
          <path d="M0 820C400 810 1200 810 1600 820V900H0z" fill="url(#cs-wall)" />
          <path d="M0 820C400 810 1200 810 1600 820" stroke="#ff7a5a" strokeOpacity=".55" strokeWidth="2" fill="none" />
          <g fill="#0a0414">
            {PALMS.map(({ trunk, leaves }, i) => (
              <path key={i} d={trunk + leaves} />
            ))}
          </g>
          {/* Convertible, side on, rim-lit by the sunset. */}
          <g transform="translate(770 760) scale(.85)">
            <path
              d="M0 58c0-16 8-26 26-30l64-10c18-14 40-24 62-24h40c14 0 26 8 36 18l58 4c26 2 44 14 50 36v8c0 6-4 10-10 10H10C4 70 0 66 0 58z"
              fill="#0c0517"
            />
            <path
              d="M26 28l64-10c18-14 40-24 62-24h40c14 0 26 8 36 18l58 4c26 2 44 14 50 36"
              stroke="#ff8a5a"
              strokeOpacity=".85"
              strokeWidth="2"
              fill="none"
            />
            <path d="M150 -6l22-26h6l-14 26z" fill="#0c0517" />
            <path d="M48 68a22 22 0 1 0 44 0a22 22 0 1 0-44 0zM240 68a22 22 0 1 0 44 0a22 22 0 1 0-44 0z" fill="#05020a" />
            <path d="M61 68a9 9 0 1 0 18 0a9 9 0 1 0-18 0zM253 68a9 9 0 1 0 18 0a9 9 0 1 0-18 0z" fill="#2a1438" />
            <path d="M330 44h8v8h-8z" fill="#ff3b5c" />
          </g>
          {/* The player, by the car, back to us, looking out at the city. */}
          <g transform="translate(700 822) scale(1.1)">
            <circle cx="0" cy="-140" r="12" fill="#0a0414" />
            <path
              d="M-24-120Q0-128 24-120L30-70L24-66L20-96L18-60L16 0H4L1-52H-1L-4 0H-16L-18-60L-20-96L-24-66L-30-70Z"
              fill="#0a0414"
            />
            <path d="M-24-120Q0-128 24-120M-11-149a12 12 0 0 1 22 0" stroke="#ff9a6a" strokeOpacity=".8" strokeWidth="1.6" fill="none" />
          </g>
        </svg>
      </div>
    </div>
  );
}
