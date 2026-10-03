import { hero, site } from "@/lib/content";
import { DownloadIcon, GithubIcon, LinkedinIcon, MailIcon } from "./Icons";
import RotatingWord from "./RotatingWord";
import Terminal from "./Terminal";
import NeuralCanvas from "./NeuralCanvas";
import AnimatedName from "./AnimatedName";
import Magnetic from "./Magnetic";
import GlowCard from "./GlowCard";

const btn =
  "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition";
const ghost = `${btn} border border-line bg-surface/60 backdrop-blur hover:border-accent`;

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="aurora relative isolate overflow-hidden">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-20" />
      <NeuralCanvas />

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 pb-10 pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs font-medium text-muted backdrop-blur">
            <span className="pulse-dot relative h-2 w-2 rounded-full bg-emerald-400" />
            {hero.status}
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl lg:text-[7.5rem] lg:leading-[0.95]"
          >
            <span className="block text-3xl font-medium tracking-tight text-muted sm:text-4xl">
              Hi, I&apos;m
            </span>
            <AnimatedName name={site.name} />
          </h1>

          <p className="mt-6 text-lg text-muted md:text-xl">{site.title}</p>

          <p className="mt-5 max-w-xl text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
            I build <RotatingWord words={hero.rotating} />
            <br />
            that work on real data.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a
                href={site.resume}
                download
                className={`${btn} bg-gradient-accent text-on-accent shadow-lg shadow-accent/25`}
              >
                <DownloadIcon /> Download Resume
              </a>
            </Magnetic>
            <Magnetic>
              <a href={site.github} target="_blank" rel="noopener noreferrer" className={ghost}>
                <GithubIcon /> GitHub
              </a>
            </Magnetic>
            <Magnetic>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={ghost}>
                <LinkedinIcon /> LinkedIn
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className={ghost}>
                <MailIcon /> Contact
              </a>
            </Magnetic>
          </div>

          <p className="mt-8 hidden text-xs text-muted sm:block">
            Psst: click anywhere on the background, type in the terminal, or press{" "}
            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono">Ctrl</kbd>{" "}
            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono">K</kbd>
          </p>
        </div>

        <div className="flex min-w-0 justify-center lg:justify-end">
          <Terminal />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-16">
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {hero.stats.map((s) => (
            <GlowCard key={s.label} tilt className="bg-surface/70 p-5 backdrop-blur">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-gradient text-3xl font-bold tracking-tight">{s.value}</dd>
              <p aria-hidden="true" className="mt-1 text-sm text-muted">
                {s.label}
              </p>
            </GlowCard>
          ))}
        </dl>
        <a
          href="#about"
          aria-label="Scroll to About"
          className="mx-auto mt-12 flex h-10 w-6 justify-center rounded-full border-2 border-line pt-2"
        >
          <span className="scroll-dot block h-2 w-1 rounded-full bg-accent" />
        </a>
      </div>
    </section>
  );
}
