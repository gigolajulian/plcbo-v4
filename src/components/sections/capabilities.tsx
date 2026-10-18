import { Section, SectionHead } from '@/design/layout';
import { Rise } from '@/design/reveal';
import { CAPABILITIES } from '@/lib/copy';

/*  Capabilities.
 *
 *  This section exists because of a gap in the reference rather than a feature of it:
 *  its nav links to /services and its home page never says what the services are. A
 *  brand lead who has just looked at the work wants to know what can be commissioned,
 *  and making them navigate for it loses them.
 *
 *  Three rows, matching what PLCBO actually is. The descriptions are Julian's to
 *  write and render as visible slots until he does. They stay visible at all times
 *  rather than hiding behind the row hover: tidier, and it would leave a keyboard
 *  reader, a touch reader and a printer with three words and no explanation.
 */
export function Capabilities() {
  return (
    <Section id="capabilities">
      <SectionHead eyebrow="What the work is" title="Capabilities" />

        <ul>
          {CAPABILITIES.map((capability, i) => (
            <li key={capability.label} className="rule-row last:border-b">
              <Rise stagger={i}>
                <span className="flex items-baseline gap-4">
                  <span className="font-text text-caption tabular-nums text-ink-3">
                    {capability.no}
                  </span>
                  <span className="font-display text-capability font-semibold uppercase text-ink">
                    {capability.label}
                  </span>
                </span>
              </Rise>

              <p className="max-w-[46ch] font-text text-body text-ink-2">{capability.body}</p>
            </li>
          ))}
        </ul>
    </Section>
  );
}
