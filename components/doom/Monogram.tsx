/** Header emblem: gilt "S" inside a hexagon frame, set in the active theme's display face. */
export default function Monogram({
  className = "h-8 w-8",
  gradientId = "mono-gilt",
}: {
  className?: string;
  /** Unique per instance so several emblems on one page do not share an SVG id. */
  gradientId?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6dd8a" />
          <stop offset="0.55" stopColor="#d4a73a" />
          <stop offset="1" stopColor="#8f6410" />
        </linearGradient>
      </defs>
      <g className="origin-center transition-transform duration-700 [transform-box:fill-box] group-hover:rotate-[60deg]">
        <polygon
          points="20,2 35.6,11 35.6,29 20,38 4.4,29 4.4,11"
          fill="var(--surface-2)"
          stroke="var(--accent)"
          strokeWidth="1.6"
        />
        <polygon
          points="20,6.5 31.7,13.25 31.7,26.75 20,33.5 8.3,26.75 8.3,13.25"
          fill="none"
          stroke="var(--accent2)"
          strokeOpacity="0.55"
          strokeWidth="0.8"
        />
      </g>
      <text
        x="20"
        y="27.5"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill={`url(#${gradientId})`}
        style={{ fontFamily: "var(--display-face)" }}
      >
        S
      </text>
    </svg>
  );
}
