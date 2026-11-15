import { districts } from "@/content/navigation";

/** Original, code-drawn coastline. 1000 x 700 canvas, districts placed in %. */
export const MAP_W = 1000;
export const MAP_H = 700;
export const pt = (item: { x: number; y: number }) => ({
  x: (item.x / 100) * MAP_W,
  y: (item.y / 100) * MAP_H,
});
export const SPAWN = { x: 46, y: 44 };

const LAND =
  "M0,0 H870 C850,80 892,140 862,210 C836,272 882,332 852,400 C832,462 872,520 842,590 C822,640 762,662 700,650 C620,638 560,682 480,670 C380,658 300,692 200,672 C120,658 60,690 0,680 Z";
const ISLAND =
  "M905,40 C925,70 918,140 930,210 C942,300 922,380 936,460 C944,520 930,560 914,590 C904,560 912,500 904,440 C894,360 914,290 902,210 C892,140 896,80 905,40 Z";
const RIVER = "M70,330 C190,300 300,320 380,300 C520,268 600,350 700,360 C780,368 820,392 856,400";

const ROADS: [number, number][][] = [
  [[240, 210], [490, 154], [820, 140]],
  [[490, 154], [680, 294], [760, 532]],
  [[240, 210], [360, 378], [550, 462], [760, 532]],
  [[360, 378], [200, 518]],
  [[550, 462], [680, 294]],
  [[820, 140], [918, 150]],
  [[760, 532], [920, 520]],
];
const path = (points: [number, number][]) =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");

// Deterministic palms along the beach.
const PALMS = [
  [880, 90], [872, 180], [866, 260], [874, 340], [862, 430], [858, 505], [918, 300], [924, 420], [916, 120],
];

export function MapArt({
  discovered = [],
  idPrefix = "map",
  detail = true,
  painted = null,
}: {
  discovered?: string[];
  idPrefix?: string;
  detail?: boolean;
  /** Painted map to draw instead of the code-drawn coastline. Same 10:7 canvas. */
  painted?: string | null;
}) {
  const id = (name: string) => `${idPrefix}-${name}`;
  return (
    <svg
      className="map-art"
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id("sea")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b1d4a" />
          <stop offset="1" stopColor="#1a0b3d" />
        </linearGradient>
        <linearGradient id={id("land")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1240" />
          <stop offset="1" stopColor="#140a2e" />
        </linearGradient>
        <pattern id={id("blocks")} width="26" height="26" patternUnits="userSpaceOnUse">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#ffffff" opacity=".05" />
        </pattern>
        <pattern id={id("waves")} width="60" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 11 Q15 4 30 11 T60 11" fill="none" stroke="#18f0ff" strokeWidth="1" opacity=".12" />
        </pattern>
        <radialGradient id={id("fog")}>
          <stop offset="0" stopColor="#07050d" stopOpacity=".92" />
          <stop offset=".7" stopColor="#07050d" stopOpacity=".6" />
          <stop offset="1" stopColor="#07050d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("glow")}>
          <stop offset="0" stopColor="#ff2e88" stopOpacity=".45" />
          <stop offset="1" stopColor="#ff2e88" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id("land-clip")}>
          <path d={LAND} />
        </clipPath>
      </defs>
      {painted ? (
        <image href={painted} width={MAP_W} height={MAP_H} preserveAspectRatio="xMidYMid slice" />
      ) : (
        <>
      <rect width={MAP_W} height={MAP_H} fill={`url(#${id("sea")})`} />
      <rect width={MAP_W} height={MAP_H} fill={`url(#${id("waves")})`} />
      <path d={LAND} fill={`url(#${id("land")})`} stroke="#ffb238" strokeOpacity=".5" strokeWidth="3" />
      <path d={LAND} fill="none" stroke="#ffd59a" strokeOpacity=".18" strokeWidth="14" />
      <path d={ISLAND} fill="#21134a" stroke="#ffb238" strokeOpacity=".5" strokeWidth="2" />
      {[[880, 640, 18], [928, 662, 13], [968, 684, 10]].map(([cx, cy, r]) => (
        <circle key={cx} cx={cx} cy={cy} r={r} fill="#21134a" stroke="#ffb238" strokeOpacity=".5" strokeWidth="2" />
      ))}
      <g clipPath={`url(#${id("land-clip")})`}>
        <rect width={MAP_W} height={MAP_H} fill={`url(#${id("blocks")})`} />
      </g>
      <path d={RIVER} fill="none" stroke="#123a7a" strokeWidth="16" strokeLinecap="round" />
      <ellipse cx="110" cy="330" rx="72" ry="44" fill="#123a7a" />
        </>
      )}
      {districts.map((item) => {
        const p = pt(item);
        return <circle key={item.href} cx={p.x} cy={p.y} r="70" fill={`url(#${id("glow")})`} />;
      })}
      {!painted && (
      <g className="map-roads">
        {ROADS.map((road, index) => (
          <path key={index} d={path(road)} fill="none" stroke="#18f0ff" strokeOpacity=".22" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {ROADS.map((road, index) => (
          <path key={`c${index}`} d={path(road)} fill="none" stroke="#18f0ff" strokeOpacity=".75" strokeWidth="2" strokeDasharray="10 8" strokeLinecap="round" />
        ))}
      </g>
      )}
      {detail && !painted &&
        PALMS.map(([x, y]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`} opacity=".85">
            <path d="M0 0 C1 -6 -1 -10 1 -16" stroke="#0fd99b" strokeWidth="2" fill="none" />
            <path d="M1 -16 l-8 3 M1 -16 l8 3 M1 -16 l-5 -5 M1 -16 l6 -4" stroke="#0fd99b" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
      {detail && !painted && (
        <>
          <text x="960" y="380" className="map-water-label" transform="rotate(90 960 380)">ATLANTIC OCEAN</text>
          <text x="110" y="300" className="map-small-label" textAnchor="middle">LAKE SOL</text>
          <text x="560" y="620" className="map-small-label" textAnchor="middle">SOUTH CANAL</text>
        </>
      )}
      <g className="map-fog">
        {districts.map((item) => {
          const p = pt(item);
          const hidden = !discovered.includes(item.href);
          return (
            <circle
              key={item.href}
              cx={p.x}
              cy={p.y}
              r="95"
              fill={`url(#${id("fog")})`}
              className={hidden ? "fog fog-on" : "fog"}
            />
          );
        })}
      </g>
    </svg>
  );
}
