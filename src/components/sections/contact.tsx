import { PushArrow } from '@/design/controls';
import { Section, SectionHead } from '@/design/layout';
import { Rise } from '@/design/reveal';
import { CONTACT, SITE } from '@/lib/copy';

/*  Contact.
 *
 *  The address is set as type at display size and linked, rather than hidden behind a
 *  button labelled "get in touch". Someone deciding whether to commission a studio
 *  often wants to forward the address to somebody else, and a mailto button gives
 *  them nothing to copy.
 *
 *  No form. A form here would need a backend, a spam defence and a promise about when
 *  a reply arrives, and the response time is exactly the kind of thing this page does
 *  not have on record.
 */
export function Contact() {
  return (
    <Section id="contact">
      <SectionHead eyebrow="Contact" title="Start a project" />

        <Rise as="p" className="max-w-[40ch]" stagger={0}>
          <span className="block font-display text-statement font-normal uppercase text-ink-2">
            {CONTACT.invitation}
          </span>
        </Rise>

        <Rise className="mt-[clamp(2rem,5vh,3rem)]" stagger={1}>
          <a
            className="group inline-block font-display text-work-title font-bold uppercase text-ink"
            href={`mailto:${SITE.email}`}
          >
            {SITE.email}
            <PushArrow className="ml-3" />
          </a>
        </Rise>
    </Section>
  );
}
