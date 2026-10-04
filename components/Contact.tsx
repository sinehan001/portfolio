import { contact, site } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";
import CopyEmail from "./CopyEmail";
import { MailIcon } from "./Icons";
import Magnetic from "./Magnetic";
import SummonButton from "./doom/SummonButton";
import Sigil from "./doom/Sigil";

export default function Contact() {
  return (
    <Section num="06" id="contact" eyebrow="Contact" title={contact.heading}>
      <Reveal>
        <div className="iron relative overflow-hidden rounded-3xl border border-line p-8 md:p-12">
          <Sigil className="doom-only pointer-events-none absolute -right-40 -top-40 w-[520px] opacity-40" />
          <div className="relative grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <p className="max-w-xl text-lg text-muted">{contact.text}</p>
              <p className="font-display text-gilt mt-5 break-all text-2xl font-bold tracking-tight md:text-4xl">
                {site.email}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <a
                    href={`mailto:${site.email}`}
                    className="btn-forged inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition"
                  >
                    <MailIcon /> Send an email
                  </a>
                </Magnetic>
                <CopyEmail email={site.email} />
              </div>
              <p className="mt-8 text-sm text-muted">
                {site.location} ·{" "}
                <a className="underline" href={`tel:${site.phone.replace(/\s/g, "")}`}>
                  {site.phone}
                </a>
              </p>
            </div>
            <SummonButton />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
