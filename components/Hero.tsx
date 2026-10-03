import { hero, site } from "@/lib/content";
import { DownloadIcon, GithubIcon, LinkedinIcon, MailIcon } from "./Icons";
import RotatingWord from "./RotatingWord";
import HeroCode from "./HeroCode";

const btn =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition";

export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="aurora relative isolate overflow-hidden"
    >
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs font-medium text-muted backdrop-blur">
            <span className="pulse-dot relative h-2 w-2 rounded-full bg-emerald-400" />
            {hero.status}
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl"
          >
            <span className="block text-3xl font-medium tracking-tight text-muted sm:text-4xl">
              Hi, I&apos;m
            </span>
            <span className="text-gradient">{site.name}</span>
          </h1>

          <p className="mt-6 text-lg text-muted md:text-xl">{site.title}</p>

          <p className="mt-6 max-w-xl text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
            I build <RotatingWord words={hero.rotating} />
            <br />
            that work on real data.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={site.resume}
              download
              className={`${btn} bg-gradient-accent text-on-accent shadow-lg shadow-accent/20 hover:-translate-y-0.5`}
            >
              <DownloadIcon /> Download Resume
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} border border-line bg-surface/60 backdrop-blur hover:border-accent`}
            >
              <GithubIcon /> GitHub
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} border border-line bg-surface/60 backdrop-blur hover:border-accent`}
            >
              <LinkedinIcon /> LinkedIn
            </a>
            <a
              href="#contact"
              className={`${btn} border border-line bg-surface/60 backdrop-blur hover:border-accent`}
            >
              <MailIcon /> Contact
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HeroCode />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-14">
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {hero.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-line bg-surface/70 p-5 backdrop-blur"
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-3xl font-bold tracking-tight text-gradient">{s.value}</dd>
              <p aria-hidden="true" className="mt-1 text-sm text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
