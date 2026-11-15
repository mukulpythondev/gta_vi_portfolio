/**
 * Original code-drawn beachfront: sunset, art-deco hotels, palms, sand, surf and
 * cars cruising the coast road. Mood-inspired by neon coastal cities; no
 * third-party art, frames or logos.
 */

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

type Hotel = { x: number; w: number; h: number; neon: string; sign: boolean; tiers: number };
const neons = ["#ff2e88", "#18f0ff", "#ffb238", "#0fd99b", "#9d4dff"];
const hotelRandom = rng(31);
const HOTELS: Hotel[] = [];
for (let x = -10; x < 1640; ) {
  const w = 70 + hotelRandom() * 90;
  HOTELS.push({
    x,
    w,
    h: 90 + hotelRandom() * 150,
    neon: neons[Math.floor(hotelRandom() * neons.length)],
    sign: hotelRandom() > 0.55,
    tiers: 1 + Math.floor(hotelRandom() * 3),
  });
  x += w + 8 + hotelRandom() * 30;
}
const towerRandom = rng(77);
const TOWERS = Array.from({ length: 34 }, (_, i) => ({
  x: i * 48 + towerRandom() * 20,
  w: 30 + towerRandom() * 26,
  h: 120 + towerRandom() * 220,
}));
const winRandom = rng(5);
const WINDOWS = HOTELS.flatMap((hotel) => {
  const cells: { x: number; y: number; on: boolean }[] = [];
  for (let y = 520 - hotel.h + 22; y < 506; y += 14)
    for (let x = hotel.x + 8; x < hotel.x + hotel.w - 10; x += 12)
      if (winRandom() > 0.45) cells.push({ x, y, on: winRandom() > 0.3 });
  return cells;
});

const BASE = 520;
const cell = (w: { x: number; y: number }) => `M${w.x.toFixed(1)} ${w.y}h6v6h-6z`;
const WIN_ON = WINDOWS.filter((w) => w.on).map(cell).join("");
const WIN_OFF = WINDOWS.filter((w) => !w.on).map(cell).join("");

function Palm({ x, y, s, flip = false }: { x: number; y: number; s: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill="#0b0418">
      <path d="M0 0 C 6 -70 22 -140 54 -200" stroke="#0b0418" strokeWidth="11" fill="none" strokeLinecap="round" />
      <g transform="translate(54 -200)">
        <path d="M0 0 C -50 -16 -92 8 -124 50 C -84 16 -42 8 0 6 Z" />
        <path d="M0 0 C -34 -50 -84 -66 -124 -50 C -74 -40 -34 -24 0 3 Z" />
        <path d="M0 0 C 8 -58 42 -92 84 -100 C 50 -74 24 -40 3 3 Z" />
        <path d="M0 0 C 50 -24 100 -16 140 24 C 92 0 50 -2 2 6 Z" />
        <path d="M0 0 C 42 8 84 42 100 92 C 66 50 34 24 0 8 Z" />
      </g>
    </g>
  );
}

function Car({ body, trim }: { body: string; trim: string }) {
  return (
    <g>
      <ellipse cx="80" cy="44" rx="78" ry="5" fill="#000" opacity=".45" />
      <path d="M4 34 L18 29 L46 25 L64 13 L104 11 L126 23 L150 27 L157 35 L153 40 H6 Z" fill={body} />
      <path d="M68 16 L102 14 L117 24 H58 Z" fill="#0a0418" opacity=".85" />
      <path d="M8 33 H152" stroke={trim} strokeWidth="1.6" opacity=".9" />
      <circle cx="36" cy="40" r="9" fill="#07030f" stroke={trim} strokeWidth="1.4" />
      <circle cx="126" cy="40" r="9" fill="#07030f" stroke={trim} strokeWidth="1.4" />
      <rect x="150" y="29" width="6" height="3" fill="#fff6c8" />
      <rect x="3" y="31" width="5" height="3" fill="#ff2e5a" />
    </g>
  );
}

export function OceanDrive({ className = "" }: { className?: string }) {
  return (
    <div className={`ocean-drive ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1600 640" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="od-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a0838" />
            <stop offset=".45" stopColor="#6b1a6e" />
            <stop offset=".72" stopColor="#ff4f7b" />
            <stop offset=".85" stopColor="#ffae5c" />
          </linearGradient>
          <linearGradient id="od-sun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff2a8" />
            <stop offset=".5" stopColor="#ffb238" />
            <stop offset="1" stopColor="#ff2e88" />
          </linearGradient>
          <linearGradient id="od-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff7a8a" />
            <stop offset=".25" stopColor="#7a2a8c" />
            <stop offset="1" stopColor="#1b0c3a" />
          </linearGradient>
          <linearGradient id="od-sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f7a774" />
            <stop offset="1" stopColor="#8a3a5c" />
          </linearGradient>
          <linearGradient id="od-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c1030" />
            <stop offset="1" stopColor="#07030f" />
          </linearGradient>
          <mask id="od-sun-cuts">
            <rect width="1600" height="640" fill="#fff" />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x="0" y={300 + i * 22} width="1600" height={3 + i * 2.2} fill="#000" />
            ))}
          </mask>
        </defs>

        <rect width="1600" height="640" fill="url(#od-sky)" />
        <circle cx="1180" cy="330" r="150" fill="url(#od-sun)" mask="url(#od-sun-cuts)" />
        <g fill="#2a0c4a" opacity=".9">
          {TOWERS.map((t, i) => (
            <rect key={i} x={t.x} y={BASE - 40 - t.h} width={t.w} height={t.h + 40} />
          ))}
        </g>

        <g>
          {HOTELS.map((hotel, i) => {
            const top = BASE - hotel.h;
            return (
              <g key={i}>
                <rect x={hotel.x} y={top} width={hotel.w} height={hotel.h} fill="#f3d6e6" opacity=".16" />
                <rect x={hotel.x} y={top} width={hotel.w} height={hotel.h} fill="#1a0a30" opacity=".82" />
                {Array.from({ length: hotel.tiers }, (_, t) => (
                  <rect
                    key={t}
                    x={hotel.x + 6 + t * 8}
                    y={top - 10 - t * 10}
                    width={hotel.w - 12 - t * 16}
                    height="10"
                    fill="#1a0a30"
                  />
                ))}
                <rect x={hotel.x} y={top} width={hotel.w} height="2.5" fill={hotel.neon} />
                <rect x={hotel.x + hotel.w / 2 - 1.5} y={top + 10} width="3" height={hotel.h - 30} fill={hotel.neon} opacity=".7" />
                {hotel.sign && (
                  <rect x={hotel.x + 10} y={top + 14} width={Math.min(54, hotel.w - 20)} height="12" rx="6" fill="none" stroke={hotel.neon} strokeWidth="2" />
                )}
              </g>
            );
          })}
          <path d={WIN_ON} fill="#ffd38a" opacity=".7" />
          <path d={WIN_OFF} fill="#18f0ff" opacity=".18" />
        </g>

        {/* coast road */}
        <rect x="0" y={BASE} width="1600" height="54" fill="url(#od-road)" />
        <rect x="0" y={BASE} width="1600" height="2" fill="#ff2e88" opacity=".8" />
        <g className="od-lane">
          {Array.from({ length: 40 }, (_, i) => (
            <rect key={i} x={i * 44} y={BASE + 26} width="22" height="2.5" fill="#ffd38a" opacity=".55" />
          ))}
        </g>
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} transform={`translate(${60 + i * 190} ${BASE})`}>
            <rect x="-1.5" y="-70" width="3" height="70" fill="#0b0418" />
            <path d="M0 -70 Q 10 -76 22 -72" stroke="#0b0418" strokeWidth="3" fill="none" />
            <circle cx="22" cy="-70" r="3" fill="#fff2c4" />
            <circle cx="22" cy="-70" r="16" fill="#ffd38a" opacity=".14" />
          </g>
        ))}
        {/* Two lanes that never overlap: the far lane drives right, the near lane left. */}
        <g className="od-car od-car-a">
          <g transform={`translate(0 ${BASE - 12}) scale(0.56)`}>
            <Car body="#ff2e88" trim="#ffe1f0" />
          </g>
        </g>
        <g className="od-car od-car-c">
          <g transform={`translate(0 ${BASE - 12}) scale(0.56)`}>
            <Car body="#ffb238" trim="#fff2c4" />
          </g>
        </g>
        <g className="od-car od-car-b">
          <g transform={`translate(104 ${BASE + 14}) scale(-0.66 0.66)`}>
            <Car body="#18c8ff" trim="#e9feff" />
          </g>
        </g>

        {/* beach and surf */}
        <path d={`M0 ${BASE + 54} H1600 V${BASE + 82} Q 1200 ${BASE + 92} 800 ${BASE + 84} T 0 ${BASE + 86} Z`} fill="url(#od-sand)" />
        <rect x="0" y={BASE + 84} width="1600" height="60" fill="url(#od-sea)" />
        <g className="od-surf" fill="none" stroke="#ffe1f0" strokeWidth="2" opacity=".6">
          <path d={`M0 ${BASE + 88} q 40 -6 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`} />
        </g>

        <Palm x={40} y={BASE + 70} s={1.15} />
        <Palm x={250} y={BASE + 76} s={0.8} flip />
        <Palm x={760} y={BASE + 74} s={0.7} />
        <Palm x={1330} y={BASE + 78} s={0.9} flip />
        <Palm x={1560} y={BASE + 70} s={1.2} flip />
      </svg>
    </div>
  );
}
