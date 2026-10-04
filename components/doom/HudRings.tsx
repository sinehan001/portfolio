/** Iron theme backdrop: rotating heads-up-display rings with a radar sweep (original geometry). */
export default function HudRings({ className = "" }: { className?: string }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  const arc = (r: number, a0: number, a1: number) => {
    const p = (a: number) => [300 + Math.cos((a * Math.PI) / 180) * r, 300 + Math.sin((a * Math.PI) / 180) * r];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };

  return (
    <svg viewBox="0 0 600 600" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="hud-sweep-fill" cx="0" cy="0.5" r="1">
          <stop offset="0" style={{ stopColor: "var(--bolt)", stopOpacity: 0.35 }} />
          <stop offset="1" style={{ stopColor: "var(--bolt)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      <circle cx="300" cy="300" r="292" fill="none" stroke="var(--bolt)" strokeOpacity="0.3" />
      <circle cx="300" cy="300" r="286" fill="none" stroke="var(--bolt)" strokeOpacity="0.25" strokeDasharray="1 7" />

      {/* Segmented outer band */}
      <g className="spin-slow">
        <circle cx="300" cy="300" r="266" fill="none" stroke="var(--bolt)" strokeOpacity="0.35" strokeWidth="7" strokeDasharray="44 16" />
      </g>

      {/* Tick ring */}
      <g className="spin-rev">
        <circle cx="300" cy="300" r="240" fill="none" stroke="var(--bolt)" strokeOpacity="0.3" />
        {ticks.map((deg) => {
          const a = (deg * Math.PI) / 180;
          const major = deg % 30 === 0;
          const r1 = major ? 222 : 232;
          return (
            <line
              key={deg}
              x1={300 + Math.cos(a) * r1}
              y1={300 + Math.sin(a) * r1}
              x2={300 + Math.cos(a) * 240}
              y2={300 + Math.sin(a) * 240}
              stroke={major ? "var(--accent)" : "var(--bolt)"}
              strokeOpacity={major ? 0.8 : 0.4}
              strokeWidth={major ? 2.5 : 1}
            />
          );
        })}
      </g>

      {/* Red and gold arc brackets */}
      <g className="spin-slow">
        <path d={arc(212, -60, 20)} fill="none" stroke="var(--accent)" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
        <path d={arc(212, 120, 200)} fill="none" stroke="var(--accent)" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
        <path d={arc(198, 40, 100)} fill="none" stroke="var(--accent2)" strokeOpacity="0.7" strokeWidth="2" />
        <path d={arc(198, 220, 280)} fill="none" stroke="var(--accent2)" strokeOpacity="0.7" strokeWidth="2" />
      </g>

      {/* Radar sweep (the transparent circle keeps the rotation centred) */}
      <g className="hud-sweep">
        <circle cx="300" cy="300" r="190" fill="none" />
        <path d="M300 300 L490 300 A190 190 0 0 0 464.5 205 Z" fill="url(#hud-sweep-fill)" />
      </g>
      <circle cx="300" cy="300" r="150" fill="none" stroke="var(--bolt)" strokeOpacity="0.25" strokeDasharray="3 9" />

      {/* Crosshair ticks */}
      {[0, 90, 180, 270].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={300 + Math.cos(a) * 160}
            y1={300 + Math.sin(a) * 160}
            x2={300 + Math.cos(a) * 182}
            y2={300 + Math.sin(a) * 182}
            stroke="var(--bolt)"
            strokeOpacity="0.6"
            strokeWidth="2"
          />
        );
      })}

      {/* Readouts */}
      <g fill="var(--bolt)" fontSize="13" letterSpacing="2" style={{ fontFamily: "var(--display-face)" }}>
        <text x="62" y="70" className="hud-blink">SYS ONLINE</text>
        <text x="440" y="70">PWR 100%</text>
        <text x="455" y="540">LOCK ✓</text>
        <text x="58" y="540" fill="var(--accent2)">MK · V4</text>
      </g>
    </svg>
  );
}
