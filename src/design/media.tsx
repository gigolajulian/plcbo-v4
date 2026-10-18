import { Wipe } from '@/design/reveal';
import { asset } from '@/lib/asset';
import type { Frame } from '@/lib/frames';
import { cn } from '@/lib/utils';

/**
 * One photograph, in its window.
 *
 * Three things matter here and none of them are visible when they work:
 *
 * The aspect ratio comes off the file, so the box is the right shape before the bytes
 * arrive and nothing on the page moves when they do. The library is 79 portrait to 7
 * landscape, so a fixed ratio would crop most of it.
 *
 * The dominant colour sits behind the image as the placeholder. Every record in the
 * library carries one, so a frame loads out of its own darkness rather than out of a
 * grey rectangle.
 *
 * `sizes` is the honest one. Without it the browser assumes the image fills the
 * viewport and reaches for the 1600 everywhere, which makes a three-up grid download
 * three full-width frames on a phone.
 */
export function Photograph({
  frame,
  sizes,
  priority = false,
  className,
}: {
  frame: Frame;
  sizes: string;
  /** The hero. Loads eagerly rather than waiting to be scrolled toward. */
  priority?: boolean;
  className?: string;
}) {
  return (
    <img
      alt={frame.alt}
      className={cn('block h-full w-full object-cover', className)}
      decoding={priority ? 'sync' : 'async'}
      height={frame.height}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sizes}
      src={asset(frame.src)}
      srcSet={frame.srcSet
        .split(', ')
        .map((entry) => {
          const [path, width] = entry.split(' ');
          return `${asset(path)} ${width}`;
        })
        .join(', ')}
      style={{ backgroundColor: frame.color }}
      width={frame.width}
    />
  );
}

/** A photograph that wipes in behind its own window on scroll. */
export function WipingPhotograph({
  frame,
  sizes,
  className,
}: {
  frame: Frame;
  sizes: string;
  className?: string;
}) {
  return (
    <Wipe className={className} >
      <div className="wipe-inner" style={{ backgroundColor: frame.color }}>
        <Photograph frame={frame} sizes={sizes} />
      </div>
    </Wipe>
  );
}
