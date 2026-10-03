/** Name split into letters that rise in on load and bounce on hover (pure CSS). */
export default function AnimatedName({ name }: { name: string }) {
  const letters = [...name];
  const last = Math.max(letters.length - 1, 1);
  return (
    <>
      <span className="sr-only">{name}</span>
      <span aria-hidden="true" className="inline-block">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="hero-letter"
            style={{
              animationDelay: `${0.1 + i * 0.07}s`,
              color: `color-mix(in oklab, var(--accent) ${Math.round(100 - (i / last) * 100)}%, var(--accent2))`,
            }}
          >
            {ch}
          </span>
        ))}
      </span>
    </>
  );
}
