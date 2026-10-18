import { Mark } from '@/components/mark';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { SITE } from '@/lib/copy';

/*  Four items, because the site has four sections' worth of content.
 *
 *  The reference runs six plus a dropdown, and it can: it has offices, initiatives
 *  and a news desk behind them. Reproducing the count here would mean four items
 *  pointing at nothing.
 *
 *  The terracotta rule under the current item is move 4 from PLAN section 8. It
 *  traces in from the left on hover and sits under whichever section the page is
 *  actually in, so the nav answers "where am I" without a second colour or a weight
 *  change. */
/*  Five at desktop, three on a phone.
 *
 *  Five items measured 397px against a 320px viewport, and body clips the overflow,
 *  so "Contact" simply was not there and the page did not even scroll sideways to say
 *  so. Five sets of 11px tracked capitals is not a phone nav, it is a ribbon.
 *
 *  Which two go is not arbitrary: Work and Motion are what the studio sells and
 *  Contact is the ask, while Capabilities and Studio are both a short scroll under
 *  Motion and are the two a visitor is least likely to be navigating to directly. */
const ITEMS = [
  { id: 'work', label: 'Work', onPhone: true },
  { id: 'motion', label: 'Motion', onPhone: true },
  { id: 'capabilities', label: 'Capabilities', onPhone: false },
  { id: 'studio', label: 'Studio', onPhone: false },
  { id: 'contact', label: 'Contact', onPhone: true },
];

const IDS = ITEMS.map((item) => item.id);

export function Nav() {
  const active = useScrollSpy(IDS);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-ground/90 backdrop-blur-sm">
      <nav aria-label="Main" className="shell flex items-center justify-between py-4">
        <a
          className="group flex items-center gap-3"
          href="#top"
          /* The mark is the home link, so it needs a name. The SVG itself is
             aria-hidden and the name lives on the link, which is also what keeps the
             link named when the wordmark beside it is dropped at phone width. */
          aria-label={`${SITE.name}, back to top`}
        >
          <Mark className="h-5 w-auto text-ink" />
          {/*  Dropped below 640.
           *
           *  Four items plus the mark plus the wordmark measured 407px against a
           *  375px viewport, so "Contact" was cut off 32px into itself and nothing
           *  reported it: body clips the overflow, so the page did not even scroll
           *  sideways to give it away. The glyph is still the home link. */}
          <span className="hidden font-display text-eyebrow font-bold uppercase tracking-[0.09em] text-ink sm:block">
            {SITE.name}
          </span>
        </a>

        <ul className="flex items-center gap-4 sm:gap-6 md:gap-9">
          {ITEMS.map((item) => (
            <li key={item.id} className={item.onPhone ? undefined : 'hidden sm:block'}>
              <a
                aria-current={active === item.id ? 'true' : undefined}
                className="nav-item relative block font-text text-eyebrow font-medium uppercase text-ink"
                href={`#${item.id}`}
              >
                {item.label}
                <span className="trace" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
