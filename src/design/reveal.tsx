import * as React from 'react';

import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';

/*  The three scroll moves from PLAN section 8, as components.
 *
 *  Each is a clip box plus one child that travels, and each only ever adds
 *  `data-shown` to itself. The animation is in the stylesheet, which is why reduced
 *  motion can replace every one of them with a fade in one place.
 *
 *  `stagger` is an index, not a delay: the CSS multiplies it by 40ms, so a row of six
 *  frames reads as one gesture and the number at the call site stays a position
 *  rather than a hand-tuned millisecond count. */

type RiseProps = {
  children: React.ReactNode;
  /** Position in a staggered group. Multiplied by 40ms in the stylesheet. */
  stagger?: number;
  className?: string;
  as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'li';
};

/** Masked rise. Every heading and eyebrow on the page arrives this way. */
export function Rise({ children, stagger = 0, className, as: Tag = 'div' }: RiseProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn('rise', className)}
      style={{ '--stagger': stagger } as React.CSSProperties}
    >
      <span className="rise-i">{children}</span>
    </Tag>
  );
}

/** The hairline that draws itself in from the left. */
export function RuleDraw({ accent = false, className }: { accent?: boolean; className?: string }) {
  const ref = useReveal<HTMLDivElement>();

  return <div ref={ref} className={cn('rule-draw', accent && 'is-accent', className)} />;
}

/** The work frame's window opening over a photograph that appears to hold still. */
export function Wipe({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={cn('wipe', className)}>
      <div className="wipe-outer">{children}</div>
    </div>
  );
}
