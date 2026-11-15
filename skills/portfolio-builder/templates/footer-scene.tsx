/**
 * Example signature scene: a skyline with a road and two lanes of cars.
 * Swap the shapes for the theme's motif (marquee bulbs, lamps on a bridge,
 * a running sprite) and keep the structure: one SVG, an outer group animated
 * by CSS, an inner group placed by an SVG transform. Server-safe (no hooks).
 * Pair with footer-scene.css and load it through lazy-scene.tsx.
 */
const ROAD = 520;

function Car({ body, trim }: { body: string; trim: string }) {
  // Drawn facing right, 160 units long, wheels on y=40.
  return (
    <g>
      <ellipse cx="80" cy="44" rx="78" ry="5" fill="#000" opacity=".45" />
      <path d="M4 34 L18 29 L46 25 L64 13 L104 11 L126 23 L150 27 L157 35 L153 40 H6 Z" fill={body} />
      <path d="M68 16 L102 14 L117 24 H58 Z" fill="#0a0418" opacity=".85" />
      <circle cx="36" cy="40" r="9" fill="#07030f" stroke={trim} strokeWidth="1.4" />
      <circle cx="126" cy="40" r="9" fill="#07030f" stroke={trim} strokeWidth="1.4" />
      <rect x="150" y="29" width="6" height="3" fill="#fff6c8" />
      <rect x="3" y="31" width="5" height="3" fill="#ff2e5a" />
    </g>
  );
}

// Deterministic skyline: same output on server and client (no Math.random()).
const SKYLINE = Array.from({ length: 30 }, (_, i) => {
  const h = 120 + ((i * 73) % 200);
  return `M${i * 54} ${ROAD - h}h44v${h}h-44z`;
}).join("");

export function FooterScene({ className = "" }: { className?: string }) {
  return (
    <div className={`scene ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1600 640" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="fs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--sky-top)" }} />
            <stop offset=".6" style={{ stopColor: "var(--sky-mid)" }} />
            <stop offset="1" style={{ stopColor: "var(--sky-low)" }} />
          </linearGradient>
        </defs>
        <rect width="1600" height="640" fill="url(#fs-sky)" />
        <path d={SKYLINE} fill="#1a0a30" />
        <rect y={ROAD} width="1600" height="54" fill="#0d0718" />
        <rect y={ROAD} width="1600" height="2" style={{ fill: "var(--accent)" }} />
        {/* far lane drives right */}
        <g className="fs-car fs-car-a">
          <g transform={`translate(0 ${ROAD - 12}) scale(0.56)`}><Car body="#ff2e88" trim="#ffe1f0" /></g>
        </g>
        <g className="fs-car fs-car-c">
          <g transform={`translate(0 ${ROAD - 12}) scale(0.56)`}><Car body="#ffb238" trim="#fff2c4" /></g>
        </g>
        {/* near lane drives left: mirrored with a negative x scale */}
        <g className="fs-car fs-car-b">
          <g transform={`translate(104 ${ROAD + 14}) scale(-0.66 0.66)`}><Car body="#18c8ff" trim="#e9feff" /></g>
        </g>
      </svg>
    </div>
  );
}
