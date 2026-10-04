/**
 * First-load screen, rendered on the server so it shows before any JavaScript.
 * Hidden via the `is-loading` class on <html> (set before paint, removed by the
 * inline script in layout.tsx once fonts and assets are ready). The element itself
 * is never removed, so React hydration is unaffected.
 */
export default function Preloader() {
  return (
    <div id="preloader" role="status" aria-live="polite">
      <span className="sr-only">Loading portfolio</span>

      {/* Iron: arc reactor */}
      <div className="stark-only flex flex-col items-center gap-5" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="h-28 w-28" style={{ filter: "drop-shadow(0 0 18px rgba(56,189,248,0.55))" }}>
          <circle cx="60" cy="60" r="56" fill="#12171c" stroke="#b3121d" strokeWidth="4" />
          <circle cx="60" cy="60" r="49" fill="none" stroke="#e3ad2f" strokeWidth="1.5" strokeOpacity="0.8" />
          <g className="pl-spin">
            <circle cx="60" cy="60" r="40" fill="none" stroke="#7dd3fc" strokeWidth="4" strokeDasharray="10 6" strokeLinecap="round" />
          </g>
          <circle cx="60" cy="60" r="31" fill="none" stroke="#38bdf8" strokeWidth="2" />
          <polygon points="60,82 41,49 79,49" fill="#bdefff" fillOpacity="0.35" stroke="#e0f7ff" strokeWidth="4" strokeLinejoin="round" className="core-breathe" />
          <circle cx="60" cy="60" r="5" fill="#ffffff" />
        </svg>
        <p className="pl-label">Initializing suit</p>
        <div className="pl-bar" />
      </div>

      {/* Doom: emerald */}
      <div className="doom-only flex flex-col items-center gap-5" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="h-28 w-28" style={{ filter: "drop-shadow(0 0 18px rgba(61,220,132,0.55))" }}>
          <g className="pl-spin" style={{ animationDuration: "6s" }}>
            <polygon points="60,4 108.5,32 108.5,88 60,116 11.5,88 11.5,32" fill="none" stroke="#c9971c" strokeWidth="3" strokeLinejoin="round" />
          </g>
          <polygon points="60,18 96,39 96,81 60,102 24,81 24,39" fill="#0a3d21" stroke="#d4af37" strokeWidth="1.5" strokeLinejoin="round" />
          <g className="core-breathe">
            <polygon points="60,26 89,43 89,77 60,94 31,77 31,43" fill="#1d9e5a" />
            <polygon points="60,26 89,43 60,60" fill="#3ddc84" />
            <polygon points="31,43 60,26 60,60" fill="#2fbf6c" />
            <polygon points="60,94 31,77 60,60" fill="#0f6e3a" />
            <polygon points="60,42 75.5,51 75.5,69 60,78 44.5,69 44.5,51" fill="#b8ffd6" fillOpacity="0.85" />
          </g>
        </svg>
        <p className="pl-label">Summoning</p>
        <div className="pl-bar" />
      </div>
    </div>
  );
}
