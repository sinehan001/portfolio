/** Tiny iron-mask emblem used in the navbar and the summon button. */
export default function MaskGlyph({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="glyph-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef2f4" />
          <stop offset="0.55" stopColor="#8a959c" />
          <stop offset="1" stopColor="#3a4146" />
        </linearGradient>
      </defs>
      <path d="M16 1.5c7 0 13 5 14 13 .6 6.5-1.6 12.5-4 16H6c-2.4-3.5-4.6-9.5-4-16 1-8 7-13 14-13z" fill="var(--hood-a)" />
      <path
        d="M16 5c5.3 0 8.4 3.3 8.6 8.5l-.4 6.9c-.4 4.6-3.4 7.9-8.2 8.8-4.8-.9-7.8-4.2-8.2-8.8l-.4-6.9C7.6 8.3 10.7 5 16 5z"
        fill="url(#glyph-metal)"
      />
      <path d="M9.6 14.6l5 .5-.4 1.9-4.3-.5z" fill="var(--eye)" />
      <path d="M22.4 14.6l-5 .5.4 1.9 4.3-.5z" fill="var(--eye)" />
      <path d="M16 15v6" stroke="#30373c" strokeWidth="0.8" />
      <rect x="13" y="23" width="6" height="1.6" rx="0.8" fill="#030504" />
    </svg>
  );
}
