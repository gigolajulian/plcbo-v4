import { Section, SectionHead } from '@/design/layout';
import { Rise } from '@/design/reveal';
import { Swap } from '@/components/swap';
import { asset } from '@/lib/asset';
import { ENGAGEMENTS } from '@/lib/copy';

/*  Featured engagements.
 *
 *  Seven ruled rows: the name left at display weight, what the work was in the
 *  middle, the mark right where there is one. See lib/copy.ts for why this is a list
 *  rather than the reference's twelve-cell logo grid.
 *
 *  This is also the page's answer to the social-proof slot the pattern library wants
 *  filled before the closing CTA. Its standard instrument there is a testimonial
 *  carousel, and there are no testimonials on record, so there is none. These seven
 *  names are the entire proof this page has, which is why they get display weight
 *  rather than a muted strip at 40% opacity.
 */
export function Engagements() {
  return (
    <Section label="Featured engagements">
      <SectionHead eyebrow="Trusted by" title="Engagements" />

      <ul>
          {ENGAGEMENTS.map((client, i) => (
            <li
              key={client.name}
              className="rule-row group md:grid-cols-[1fr_11rem_7rem] last:border-b"
            >
              <Rise stagger={Math.min(i, 4)}>
                <span className="block font-display text-engagement font-bold uppercase text-ink">
                  <Swap text={client.name} />
                </span>
              </Rise>

              <span className="font-text text-caption text-ink-3">{client.discipline}</span>

              <span className="hidden h-5 items-center md:flex md:justify-end">
                {client.logo ? (
                  <img
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none max-h-full w-auto max-w-[6.5rem] select-none opacity-70"
                    height={client.h}
                    loading="lazy"
                    src={asset(client.logo)}
                    /* Every mark to one ink. The sources are a four-colour logotype,
                       two black wordmarks and a white PNG; left alone they read as a
                       pile of assets rather than a list of names. On a light ground
                       the white PNG needs inverting first, which brightness(0) does
                       for all four at once by mapping every opaque pixel to black and
                       leaving alpha untouched. */
                    style={{ filter: 'brightness(0)' }}
                    width={client.w}
                  />
                ) : null}
              </span>
            </li>
          ))}
      </ul>
    </Section>
  );
}
