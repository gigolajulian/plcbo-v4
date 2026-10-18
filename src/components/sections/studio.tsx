import { Section, SectionHead } from '@/design/layout';
import { WipingPhotograph } from '@/design/media';
import { STUDIO } from '@/lib/copy';
import { STUDIO_FRAME } from '@/lib/frames';

/*  Studio.
 *
 *  One frame, one paragraph, and nothing else. The reference's About block carries
 *  offices, headcount and a founding year; none of the three is on record here and
 *  all three are the kind of thing a reader checks.
 *
 *  The frame is a placeholder in the honest sense: the section wants a portrait of
 *  the person who makes the work, and there is no portrait of Julian anywhere in the
 *  archive. What is in this slot now is a frame from the library standing in for one.
 */
export function Studio() {
  return (
    <Section id="studio">
      <SectionHead eyebrow="Studio" title="Who makes it" />

        <div className="grid gap-x-12 gap-y-10 md:grid-cols-[minmax(0,22rem)_1fr] md:items-start">
          <WipingPhotograph
            className="aspect-[4/5] w-full"
            frame={STUDIO_FRAME}
            sizes="(min-width: 768px) 22rem, 90vw"
          />

          <p className="max-w-[52ch] font-display text-statement font-normal text-ink-2">
            {STUDIO.body}
          </p>
        </div>
    </Section>
  );
}
