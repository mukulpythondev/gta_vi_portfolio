/** Original, stylized weapon silhouettes for the Armory. Code-drawn, no third-party art. */
export type WeaponKind = "launcher" | "rifle" | "smg" | "sniper" | "pistol" | "shotgun";

const shapes: Record<WeaponKind, { body: string; detail: string }> = {
  pistol: {
    body: "M24 18 H128 V31 H124 V35 H78 L68 58 H48 L58 35 H24 Z",
    detail: "M64 35 Q64 46 78 44 M30 22 H118 M100 18 V31",
  },
  smg: {
    body: "M14 22 H156 V34 H116 L112 50 H100 V34 H74 L66 56 H52 L60 34 H34 L22 44 H8 L16 30 H14 Z M88 34 H100 L96 60 H84 Z",
    detail: "M156 26 H176 V30 H156 M20 26 H150 M124 22 V34",
  },
  rifle: {
    body: "M6 26 H40 L52 20 H170 V24 H194 V28 H170 V34 H122 L118 54 H104 L108 34 H86 Q84 52 74 58 L64 54 Q72 46 72 34 H40 L20 42 H4 Z",
    detail: "M60 20 V14 H96 V20 M56 26 H164 M138 20 V34",
  },
  sniper: {
    body: "M2 28 H46 L60 24 H198 V28 H60 V34 H104 L96 52 H82 L88 34 H44 L22 46 H2 Z M70 10 H132 V20 H70 Z",
    detail: "M80 20 V24 M122 20 V24 M64 30 H190 M66 15 H136",
  },
  shotgun: {
    body: "M4 30 L30 24 H182 V30 H190 V34 H182 V36 H96 L90 40 H70 L60 52 H44 L54 36 H34 L14 42 H2 Z M104 36 H160 V42 H104 Z",
    detail: "M34 28 H178 M108 36 V42 M124 36 V42 M140 36 V42",
  },
  launcher: {
    body: "M10 18 H178 V40 H10 Z M178 13 H196 V45 H178 Z M68 40 H84 L80 60 H66 Z M110 40 H124 L122 56 H108 Z M88 6 H106 V18 H88 Z",
    detail: "M16 24 H172 M16 34 H172 M40 18 V40 M150 18 V40",
  },
};

export function WeaponArt({
  kind,
  className,
}: {
  kind: WeaponKind;
  className?: string;
}) {
  const shape = shapes[kind];
  const id = `wpn-${kind}`;
  return (
    <svg
      viewBox="0 0 200 64"
      className={`weapon-art ${className ?? ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4b3d78" />
          <stop offset="0.45" stopColor="#1d1536" />
          <stop offset="1" stopColor="#0b0718" />
        </linearGradient>
      </defs>
      <path d={shape.body} fill={`url(#${id}-metal)`} stroke="var(--rarity, #18f0ff)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d={shape.detail} fill="none" stroke="var(--rarity, #18f0ff)" strokeOpacity="0.55" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
