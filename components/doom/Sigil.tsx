import { doom } from "@/lib/content";

const R_TEXT = 262;

/** Rotating arcane sigil (original geometry) with an inscription ring. */
export default function Sigil({ className = "" }: { className?: string }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  const star = (rot: number) =>
    Array.from({ length: 4 }, (_, i) => {
      const a = ((i * 90 + rot) * Math.PI) / 180;
      return `${300 + Math.cos(a) * 196},${300 + Math.sin(a) * 196}`;
    }).join(" ");
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180;
    return [300 + Math.cos(a) * 196, 300 + Math.sin(a) * 196];
  });

  return (
    <svg viewBox="0 0 600 600" aria-hidden="true" className={className}>
      <defs>
        <path
          id="sigil-ring"
          d={`M300,300 m-${R_TEXT},0 a${R_TEXT},${R_TEXT} 0 1,1 ${R_TEXT * 2},0 a${R_TEXT},${R_TEXT} 0 1,1 -${R_TEXT * 2},0`}
        />
      </defs>

      <circle cx="300" cy="300" r="292" fill="none" stroke="var(--accent)" strokeOpacity="0.22" />
      <circle cx="300" cy="300" r="284" fill="none" stroke="var(--accent2)" strokeOpacity="0.25" strokeDasharray="2 6" />

      <g className="spin-slow">
        <text
          fill="var(--accent2)"
          fillOpacity="0.75"
          fontSize="17"
          letterSpacing="5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <textPath href="#sigil-ring" textLength={Math.round(2 * Math.PI * R_TEXT) - 6} lengthAdjust="spacing">
            {doom.sigil.repeat(2)}
          </textPath>
        </text>
      </g>

      <g className="spin-rev">
        <circle cx="300" cy="300" r="240" fill="none" stroke="var(--accent)" strokeOpacity="0.3" />
        {ticks.map((deg) => {
          const a = (deg * Math.PI) / 180;
          const long = deg % 45 === 0;
          const r1 = long ? 222 : 232;
          return (
            <line
              key={deg}
              x1={300 + Math.cos(a) * r1}
              y1={300 + Math.sin(a) * r1}
              x2={300 + Math.cos(a) * 240}
              y2={300 + Math.sin(a) * 240}
              stroke={long ? "var(--accent2)" : "var(--accent)"}
              strokeOpacity={long ? 0.7 : 0.35}
              strokeWidth={long ? 2 : 1}
            />
          );
        })}
      </g>

      <g className="spin-slow">
        <polygon points={star(0)} fill="none" stroke="var(--accent)" strokeOpacity="0.28" />
        <polygon points={star(45)} fill="none" stroke="var(--accent)" strokeOpacity="0.28" />
        <circle cx="300" cy="300" r="140" fill="none" stroke="var(--accent)" strokeOpacity="0.2" strokeDasharray="4 8" />
        {nodes.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="var(--bg)" stroke="var(--accent2)" strokeOpacity="0.8" />
        ))}
      </g>
    </svg>
  );
}
