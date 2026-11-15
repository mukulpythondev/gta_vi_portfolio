/**
 * Draws a project's request flow from `architecture.nodes`, so every project
 * has its own picture until a real diagram or screenshot is added. Pure SVG,
 * server-rendered, no animation.
 */
type Props = {
  nodes: string[];
  /** Boxes per row. Rows snake left-right-left so arrows stay short. */
  columns?: number;
  variant?: "card" | "full";
  className?: string;
  label?: string;
};

function wrap(text: string, max: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

export function ArchitectureDiagram({ nodes, columns = 3, variant = "full", className, label }: Props) {
  const card = variant === "card";
  const w = card ? 168 : 250;
  const h = card ? 62 : 84;
  const gapX = card ? 44 : 64;
  const gapY = card ? 46 : 58;
  const pad = card ? 22 : 18;
  const font = card ? 17 : 19;
  const chars = card ? 15 : 22;
  const cols = Math.min(columns, nodes.length);
  const rows = Math.ceil(nodes.length / cols);
  const width = pad * 2 + cols * w + (cols - 1) * gapX;
  const height = pad * 2 + rows * h + (rows - 1) * gapY;
  const place = (index: number) => {
    const row = Math.floor(index / cols);
    const inRow = index % cols;
    const col = row % 2 === 0 ? inRow : cols - 1 - inRow;
    return { x: pad + col * (w + gapX), y: pad + row * (h + gapY), row };
  };
  const boxes = nodes.map((node, index) => ({ node, ...place(index) }));
  const arrows = boxes.slice(1).map((to, index) => {
    const from = boxes[index];
    if (from.row === to.row) {
      const forward = to.x > from.x;
      const x1 = forward ? from.x + w : from.x;
      const x2 = forward ? to.x - 6 : to.x + w + 6;
      const y = from.y + h / 2;
      return { d: `M${x1} ${y} H${x2}`, key: index };
    }
    const x = from.x + w / 2;
    return { d: `M${x} ${from.y + h} V${to.y - 6}`, key: index };
  });
  const id = `arrow-${variant}-${nodes.length}-${cols}`;
  return (
    <svg
      className={`arch-diagram arch-${variant}${className ? ` ${className}` : ""}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label ?? `Request flow: ${nodes.join(", then ")}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="arch-head" />
        </marker>
      </defs>
      {arrows.map((arrow) => (
        <path key={arrow.key} d={arrow.d} className="arch-edge" markerEnd={`url(#${id})`} />
      ))}
      {boxes.map((box, index) => {
        const lines = wrap(box.node, chars);
        return (
          <g key={box.node} transform={`translate(${box.x} ${box.y})`}>
            <rect width={w} height={h} rx={card ? 12 : 14} className={index === 0 ? "arch-box arch-entry" : "arch-box"} />
            {!card && (
              <text x={14} y={20} className="arch-step">
                {String(index + 1).padStart(2, "0")}
              </text>
            )}
            <text
              x={w / 2}
              y={h / 2 + (card ? 0 : 6) - ((lines.length - 1) * font * 0.6) + font * 0.35}
              textAnchor="middle"
              className="arch-label"
              fontSize={font}
            >
              {lines.map((line, i) => (
                <tspan key={line} x={w / 2} dy={i === 0 ? 0 : font * 1.2}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
