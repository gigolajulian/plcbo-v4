import { Caption, Counter, Section, SectionHead } from '@/design/layout';
import { WipingPhotograph } from '@/design/media';
import { WORK_FRAMES } from '@/lib/frames';

/*  Selected work.
 *
 *  Photography first, before any claim about it. The reference puts a case-study
 *  carousel here and its one device worth stealing is the counter: "01 / 10" against
 *  each entry, which tells you how much of the set you are looking at without a
 *  progress bar or a row of dots.
 *
 *  Not a carousel though. A carousel hides most of its contents behind an interaction
 *  nobody performs, and the whole argument of this page is that the photographs are
 *  the proof. They are laid out and scrolled past instead.
 *
 *  Two up from 768, offset vertically so the eye travels down the page diagonally
 *  rather than in level pairs. The library is 79 portrait to 7 landscape, so the cells
 *  are portrait and the grid does not fight the archive.
 */
export function Work() {
  const total = WORK_FRAMES.length;

  return (
    <Section id="work">
      {/* The one terracotta rule on the page. */}
      <SectionHead accent eyebrow="Selected work" title="Work" />

      <ul className="grid grid-cols-1 gap-x-6 gap-y-[var(--space-block)] md:grid-cols-2">
        {WORK_FRAMES.map((frame, i) => (
          <li
            key={frame.slug}
            /* The offset. Every second cell drops by a third of a cell from 768 up, so
               the column breaks the level-pair rhythm without a masonry library and
               without any cell changing size. */
            className={i % 2 === 1 ? 'md:mt-[clamp(2rem,8vh,6rem)]' : undefined}
          >
            <article className="group">
              <WipingPhotograph
                className="aspect-[4/5] w-full"
                frame={frame}
                sizes="(min-width: 768px) 46vw, 90vw"
              />
              <Caption title={frame.name} trailing={<Counter index={i + 1} total={total} />} />
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
