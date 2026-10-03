/** Gilded divider: line · dot · diamond · dot · line */
export default function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 20" aria-hidden="true" className={`h-4 w-48 text-accent2 ${className}`}>
      <path d="M0 10 H168" stroke="currentColor" strokeOpacity="0.5" />
      <path d="M232 10 H400" stroke="currentColor" strokeOpacity="0.5" />
      <circle cx="180" cy="10" r="2.5" fill="currentColor" />
      <circle cx="220" cy="10" r="2.5" fill="currentColor" />
      <path d="M200 1 L209 10 L200 19 L191 10 Z" fill="none" stroke="currentColor" />
      <path d="M200 5 L205 10 L200 15 L195 10 Z" fill="currentColor" />
    </svg>
  );
}
