import * as React from 'react';

import { cn } from '@/lib/utils';

/*  The things a reader can press.
 *
 *  Two button shapes and one arrow, which were being retyped as five lines of markup
 *  at every call site. The arrow in particular: every copy of it is three nested
 *  elements that have to stay in exactly that shape or the clip stops clipping, and
 *  there were five copies.
 */

/**
 * The arrow that pushes out of its own slot and comes back from the other side.
 *
 * One arrow, not two: it leaves to the right, jumps the gap while outside the clip,
 * and arrives back from the left. Two copies would have to stay in step forever, and
 * they drift.
 *
 * Known gap, recorded rather than hidden: this is a unicode glyph, not a drawn icon.
 * It is the only mark of its kind on the page, so a whole icon system to hold one
 * arrow is not worth it yet. The moment a second icon appears, both come from one
 * drawn set, and this is the single file that has to change.
 */
export function PushArrow({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('push-arrow', className)}>
      <span>&rarr;</span>
    </span>
  );
}

type ButtonProps = {
  children: React.ReactNode;
  href: string;
  /** `solid` is the page's one filled control. There is exactly one per screen. */
  variant?: 'solid' | 'ghost';
  className?: string;
};

/**
 * An action.
 *
 * Square, not a pill: pills are for the buttons that asked to be pills, and none here
 * did. The solid variant is the third and last of the page's three terracotta uses,
 * so two of them side by side would break the identity system's own under-5% rule.
 */
export function Button({ children, href, variant = 'solid', className }: ButtonProps) {
  return (
    <a className={cn(variant === 'solid' ? 'btn-solid' : 'btn-ghost', 'group', className)} href={href}>
      {children}
      <PushArrow />
    </a>
  );
}
