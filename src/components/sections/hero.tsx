import { Mark } from '@/components/mark';
import { Button } from '@/design/controls';
import { Photograph } from '@/design/media';
import { Rise, RuleDraw } from '@/design/reveal';
import { HERO, SITE } from '@/lib/copy';
import { HERO_FRAME } from '@/lib/frames';

/*  The hero.
 *
 *  It does not move. The reference's does not either: the mark sits, the type rises
 *  once, and the page is scrolled rather than scrubbed. v3's P-to-wordmark morph is
 *  the best trick the current site has, but it costs a pinned section, and PLAN
 *  section 8 rules out pinning on the grounds that moving the photographs while
 *  someone is trying to look at them is how a studio site becomes annoying on the
 *  second visit. If the morph comes back it comes back behind ?morph=1, seen and
 *  approved first.
 *
 *  The mark is the plain SVG, flat, in one ink. Nothing renders it and nothing moves
 *  it: it rises once with the rest of the type and then it is artwork on a page.
 *
 *  Theirs leads with a reel and three awards. There is no reel and there are no
 *  awards, so the mark and the name carry it, and the first photograph lands
 *  immediately under them where the reel would have been.
 */
export function Hero() {
  return (
    <section aria-label="Introduction" className="pb-[clamp(3rem,8vh,5rem)] pt-[clamp(2rem,6vh,4rem)]">
      <div className="shell">
        <RuleDraw />

        <Rise className="mt-5" stagger={0}>
          <span className="eyebrow">({SITE.disciplines})</span>
        </Rise>

        {/*  The mark. The artwork, flat, in one colour.
         *
         *  No renderer on it: the identity system says the mark is fixed artwork and
         *  is never redrawn, recoloured into a gradient, outlined or given a shadow,
         *  and a metaball field approximating it with 128 blobs is a redraw. The
         *  WebGL version is still in components/blob-mark.tsx, unused.
         *
         *  Decorative. The page is already titled by the h1 under it. */}
        <Rise className="mt-[clamp(1.5rem,4vh,2.5rem)]" stagger={1}>
          <Mark className="h-[clamp(3.25rem,9vh,6rem)] w-auto text-ink" />
        </Rise>

        <Rise as="h1" className="mt-[clamp(1rem,3vh,2rem)]" stagger={2}>
          <span className="block font-display text-hero font-bold uppercase text-ink">
            {SITE.name}
          </span>
        </Rise>

        <div className="mt-[clamp(1.5rem,4vh,2.5rem)] grid gap-x-12 gap-y-8 md:grid-cols-[minmax(0,34rem)_auto] md:items-end md:justify-between">
          <Rise as="p" stagger={3}>
            <span className="block font-display text-statement font-normal uppercase text-ink-2">
              {HERO.statement}
            </span>
          </Rise>

          <Rise stagger={4}>
            <span className="flex flex-wrap items-center gap-3">
              <Button href="#contact">Start a project</Button>
              <Button href="#work" variant="ghost">
                See the work
              </Button>
            </span>
          </Rise>
        </div>
      </div>

      {/*  The first photograph, full bleed.
       *
       *  Outside the shell on purpose: it is the one element on the page allowed to
       *  touch both edges, which is what makes the ruled, padded sections under it
       *  read as deliberate rather than narrow. Height is capped in viewport units
       *  rather than set by the frame's own ratio, because the library is portrait
       *  and a 4:5 frame at full width is three screens tall on a phone. */}
      <div className="mt-[clamp(2.5rem,7vh,4.5rem)] h-[clamp(20rem,62vh,40rem)] w-full overflow-hidden">
        <Photograph frame={HERO_FRAME} priority sizes="100vw" />
      </div>
    </section>
  );
}
