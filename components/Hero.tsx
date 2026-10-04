import { doom, hero, site, stark } from "@/lib/content";
import { DownloadIcon, GithubIcon, LinkedinIcon, MailIcon } from "./Icons";
import RotatingWord from "./RotatingWord";
import AnimatedName from "./AnimatedName";
import Magnetic from "./Magnetic";
import GlowCard from "./GlowCard";
import EmberField from "./doom/EmberField";
import IronMask from "./doom/IronMask";
import ComboMask from "./doom/ComboMask";
import DualMask from "./doom/DualMask";
import HudRings from "./doom/HudRings";
import Sigil from "./doom/Sigil";

const btn =
  "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition";

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="aurora relative isolate overflow-hidden">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-20 opacity-40" />
      <EmberField />

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-5 pb-8 pt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display inline-flex items-center gap-2 rounded-full border border-accent2/40 bg-surface/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent2 backdrop-blur">
              <span className="doom-only">✦ {doom.edition} ✦</span>
              <span className="stark-only">◆ {stark.edition} ◆</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1 text-xs text-muted backdrop-blur">
              <span className="pulse-dot relative h-2 w-2 rounded-full bg-accent" />
              {hero.status}
            </span>
          </div>

          <h1 id="hero-title" className="mt-7">
            <span className="font-display block text-xl font-semibold uppercase tracking-[0.5em] text-muted sm:text-2xl">
              I am
            </span>
            <span className="font-display mt-1 block text-[3.6rem] font-black leading-[0.95] tracking-tight sm:text-8xl lg:text-[7.2rem]">
              <AnimatedName name={site.name} />
            </span>
          </h1>

          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-muted md:text-lg">
            <span>Software Developer</span>
            <span aria-hidden="true" className="text-accent2">✦</span>
            <span>GenAI &amp; Automation Engineering</span>
          </p>

          <p className="mt-5 max-w-xl text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
            <span className="doom-only">{doom.verb}</span>
            <span className="stark-only">{stark.verb}</span> <RotatingWord words={doom.rotating} />
            <br />
            <span className="doom-only">{doom.taglineEnd}</span>
            <span className="stark-only">{stark.taglineEnd}</span>
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <a href={site.resume} download className={`${btn} btn-forged`}>
                <DownloadIcon /> Download Resume
              </a>
            </Magnetic>
            <Magnetic>
              <a href={site.github} target="_blank" rel="noopener noreferrer" className={`${btn} btn-iron`}>
                <GithubIcon /> GitHub
              </a>
            </Magnetic>
            <Magnetic>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={`${btn} btn-iron`}>
                <LinkedinIcon /> LinkedIn
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className={`${btn} btn-iron`}>
                <MailIcon /> Contact
              </a>
            </Magnetic>
          </div>

          <p className="mt-8 hidden text-xs text-muted sm:block">
            <span className="doom-only">Click the mask. Click the darkness. Or press</span>
            <span className="stark-only">{stark.hint}</span>{" "}
            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono">Ctrl</kbd>{" "}
            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono">K</kbd>
          </p>
        </div>

        <div className="relative flex min-h-[360px] min-w-0 items-center justify-center sm:min-h-[460px]">
          <Sigil className="doom-only pointer-events-none absolute left-1/2 top-1/2 w-[min(135%,600px)] max-w-none -translate-x-1/2 -translate-y-1/2" />
          <HudRings className="stark-only pointer-events-none absolute left-1/2 top-1/2 w-[min(135%,600px)] max-w-none -translate-x-1/2 -translate-y-1/2" />
          <div
            aria-hidden="true"
            className="hover-breathe pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, var(--glow), transparent 70%)" }}
          />
          {doom.mask === "dual" ? <DualMask /> : doom.mask === "combo" ? <ComboMask /> : <IronMask />}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-14">
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {hero.stats.map((s) => (
            <GlowCard key={s.label} tilt className="p-5">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-gilt text-3xl font-bold tracking-tight">{s.value}</dd>
              <p aria-hidden="true" className="mt-1 text-sm text-muted">
                {s.label}
              </p>
            </GlowCard>
          ))}
        </dl>
        <a
          href="#console"
          aria-label="Scroll down"
          className="mx-auto mt-12 flex h-10 w-6 justify-center rounded-full border-2 border-line pt-2"
        >
          <span className="scroll-dot block h-2 w-1 rounded-full bg-accent" />
        </a>
      </div>
    </section>
  );
}
