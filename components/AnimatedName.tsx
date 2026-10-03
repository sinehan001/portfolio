/** Name forged letter by letter in brushed steel (pure CSS). */
export default function AnimatedName({ name }: { name: string }) {
  return (
    <>
      <span className="sr-only">{name}</span>
      <span aria-hidden="true" className="glow-text inline-block">
        {[...name].map((ch, i) => (
          <span
            key={i}
            className="forge-letter text-steel"
            style={{ animationDelay: `${0.15 + i * 0.09}s` }}
          >
            {ch}
          </span>
        ))}
      </span>
    </>
  );
}
