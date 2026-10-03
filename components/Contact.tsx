import { contact, site } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";
import CopyEmail from "./CopyEmail";
import { MailIcon } from "./Icons";

export default function Contact() {
  return (
    <Section num="06" id="contact" eyebrow="Contact" title={contact.heading}>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(circle, var(--aurora-b), transparent 65%)" }}
          />
          <p className="relative max-w-xl text-lg text-muted">{contact.text}</p>
          <p className="text-gradient relative mt-5 break-all text-2xl font-bold tracking-tight md:text-4xl">
            {site.email}
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${site.email}`}
              className="bg-gradient-accent inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-on-accent shadow-lg shadow-accent/20 transition hover:-translate-y-0.5"
            >
              <MailIcon /> Send an email
            </a>
            <CopyEmail email={site.email} />
          </div>
          <p className="relative mt-8 text-sm text-muted">
            {site.location} ·{" "}
            <a className="underline" href={`tel:${site.phone.replace(/\s/g, "")}`}>
              {site.phone}
            </a>
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
