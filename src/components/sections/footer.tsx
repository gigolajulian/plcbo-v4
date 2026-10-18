import { PushArrow } from '@/design/controls';
import { Rise } from '@/design/reveal';
import { SITE } from '@/lib/copy';

/*  The footer.
 *
 *  The wordmark set enormous and allowed to run off both edges. This is the
 *  reference's closing move and the reason it works is restraint everywhere above it:
 *  on a page of hairlines and air, one word at 26vw is the only loud thing, so it
 *  reads as a signature rather than as decoration.
 *
 *  It overflows the viewport by design and is clipped by the Rise box it sits in,
 *  which is already an overflow-hidden clip because that is how the masked rise
 *  works. body carries overflow-x: hidden as the backstop.
 *
 *  aria-hidden because the name is already the page's h1: a screen reader does not
 *  need to be told the studio is called PLCBO a second time, in capitals, at the end.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline pt-[clamp(3rem,8vh,5rem)]">
      <div className="shell flex flex-wrap items-baseline justify-between gap-6">
        <span className="font-text text-caption text-ink-3">
          &copy; {year} {SITE.name}
        </span>
        <a
          className="group font-text text-caption text-ink-2"
          href={`mailto:${SITE.email}`}
        >
          {SITE.email}
          <PushArrow className="ml-2" />
        </a>
      </div>

      <Rise className="mt-[clamp(2rem,6vh,4rem)]">
        <span
          aria-hidden="true"
          className="block whitespace-nowrap text-center font-display text-[26vw] font-bold uppercase leading-[0.78] tracking-[-0.055em] text-ink"
        >
          {SITE.name}
        </span>
      </Rise>
    </footer>
  );
}
