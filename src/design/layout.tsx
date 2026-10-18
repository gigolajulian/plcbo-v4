import * as React from 'react';

import { Rise, RuleDraw } from '@/design/reveal';
import { cn } from '@/lib/utils';

/*  The page's structural pieces.
 *
 *  Each one is here because it was being retyped. Six sections carried the same
 *  scroll offset and the same vertical rhythm as bracket clamps, three blocks carried
 *  the same caption bar, and the heading group was three elements that only read as
 *  one gesture when their gaps matched. Built per section they drift: three different
 *  gaps, two different eyebrow colours, and the rule above one of them forgetting to
 *  animate at all.
 */

/**
 * A section of the page.
 *
 * Owns the vertical rhythm and the scroll offset, so a section file says what is in
 * it rather than how far it sits from the one above. The offset has to clear the
 * sticky nav or an anchor lands with its heading underneath it, which is why both
 * read the same token.
 */
export function Section({
  id,
  label,
  children,
  className,
}: {
  id?: string;
  /** For a section whose heading is not its accessible name. */
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={label}
      className={cn('py-[var(--space-section)]', className)}
      id={id}
      style={id ? { scrollMarginTop: 'var(--nav-height)' } : undefined}
    >
      <div className="shell">{children}</div>
    </section>
  );
}

/**
 * The thing that starts every section: a hairline that draws itself, a parenthesised
 * eyebrow, and the heading rising under it.
 *
 * One component because the three are one gesture, staggered 40ms apart.
 */
export function SectionHead({
  eyebrow,
  title,
  accent = false,
  className,
}: {
  eyebrow: string;
  title: string;
  /** The one terracotta rule on the page. Selected work only. */
  accent?: boolean;
  className?: string;
}) {
  return (
    <header className={cn('mb-[var(--space-head)]', className)}>
      <RuleDraw accent={accent} />
      <Rise className="mt-5" stagger={0}>
        <span className="eyebrow">({eyebrow})</span>
      </Rise>
      <Rise as="h2" className="mt-3" stagger={1}>
        <span className="block font-display text-head font-bold uppercase text-ink">{title}</span>
      </Rise>
    </header>
  );
}

/**
 * Position over total, the reference's counter.
 *
 * Tabular numerals on purpose: proportional digits make a column of counters shuffle
 * sideways by a pixel or two per row, which is the kind of thing nobody can name and
 * everybody can see.
 */
export function Counter({ index, total }: { index: number; total: number }) {
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <span className="font-text text-caption tabular-nums text-ink-3">
      {pad(index)} <span aria-hidden="true">/</span> {pad(total)}
    </span>
  );
}

/**
 * The bar under a photograph or a film: a ruled line, the title rising from it, and
 * whatever sits at the right end.
 *
 * `titleClass` rather than a variant prop, because the only thing that actually
 * differs between a work frame and a film is which step of the type ramp the title
 * takes, and inventing two names for that would hide it.
 */
export function Caption({
  title,
  titleClass = 'text-work-title',
  trailing,
  children,
}: {
  title: string;
  titleClass?: string;
  /** The counter, or a credit, set hard right on the title's baseline. */
  trailing?: React.ReactNode;
  /** A second line under the bar, for a credit that needs its own row. */
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="mt-5 flex items-baseline justify-between gap-6 border-t border-hairline pt-4">
        <Rise as="h3" stagger={0}>
          <span className={cn('block font-display font-bold uppercase text-ink', titleClass)}>
            {title}
          </span>
        </Rise>
        {trailing}
      </div>
      {children ? <div className="mt-2">{children}</div> : null}
    </>
  );
}
