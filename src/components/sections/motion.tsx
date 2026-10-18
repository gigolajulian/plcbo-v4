import * as React from 'react';

import { Caption, Counter, Section, SectionHead } from '@/design/layout';
import { Wipe } from '@/design/reveal';
import { asset } from '@/lib/asset';
import type { Film } from '@/lib/films';
import { FILMS, REEL } from '@/lib/films';
import { cn } from '@/lib/utils';

/*  Motion.
 *
 *  PLCBO is photography, film and direction, and the page showed one of the three.
 *  These are the films off juliangigola.com's Motion page: four music videos, four
 *  commercials, and the reel that opens it.
 *
 *  The masters stay on YouTube and Vimeo. They are not hosted here for the obvious
 *  reason, a few hundred megabytes on a static host is a bandwidth bill and a
 *  buffering visitor, and for a better one: the clients already have these on their
 *  own channels, and an embed plays the copy with the client's view count on it.
 *
 *  Nothing from either provider loads until somebody presses play. A section that
 *  mounts nine iframes has fetched a megabyte of somebody else's JavaScript, asked
 *  for their cookies and lost its LCP before a visitor has decided to watch anything.
 *  So each tile is a still with a play control, and the frame replaces it on the
 *  click that asked for it. The embed URLs are built at derive time and use
 *  youtube-nocookie and Vimeo's dnt, because this site has no cookie banner to
 *  justify an advertising cookie.
 */

/** The one piece of state a film has: whether the reader asked for it. */
function Player({ film }: { film: Film }) {
  const [playing, setPlaying] = React.useState(false);

  if (playing) {
    return (
      <iframe
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        className="block h-full w-full border-0 bg-ink"
        src={film.embedUrl}
        title={film.title}
      />
    );
  }

  return (
    <button
      className="group/play relative block h-full w-full overflow-hidden bg-ink"
      onClick={() => setPlaying(true)}
      type="button"
    >
      <img
        /* The button names the film, so the still would only repeat it. */
        alt=""
        aria-hidden="true"
        className="block h-full w-full object-cover transition-transform duration-500 ease-out-soft group-hover/play:scale-[1.03]"
        height={film.poster.height}
        loading="lazy"
        sizes="(min-width: 768px) 46vw, 90vw"
        src={asset(film.poster.src)}
        srcSet={film.poster.srcSet
          .split(', ')
          .map((entry) => {
            const [path, width] = entry.split(' ');
            return `${asset(path)} ${width}`;
          })
          .join(', ')}
        width={film.poster.width}
      />

      {/*  The play control. A triangle drawn in CSS rather than an icon file, and a
       *  square rather than a circle, because the only round things on this page are
       *  the ones that asked to be round. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center bg-ink/20 transition-colors duration-250 ease-out-soft group-hover/play:bg-ink/10"
      >
        <span className="grid h-14 w-14 place-items-center bg-ground/95 transition-transform duration-250 ease-out-soft group-hover/play:scale-105">
          <span className="ml-1 block h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-ink" />
        </span>
      </span>

      <span className="sr-only">Play {film.title}</span>
    </button>
  );
}

const SECTION_LABEL: Record<Film['section'], string> = {
  reel: 'Reel',
  music: 'Music video',
  commercial: 'Commercial',
};

function Credit({ film, className }: { film: Film; className?: string }) {
  return (
    <span className={cn('font-text text-caption text-ink-3', className)}>
      {[SECTION_LABEL[film.section], film.credit, film.year].filter(Boolean).join(', ')}
    </span>
  );
}

/** A film in its window, wiping in on scroll like the photographs do. */
function FilmFrame({ film }: { film: Film }) {
  return (
    <Wipe className="aspect-video w-full">
      <div className="wipe-inner">
        <Player film={film} />
      </div>
    </Wipe>
  );
}

export function Motion() {
  return (
    <Section id="motion">
      <SectionHead eyebrow="Moving work" title="Motion" />

      {/*  The reel, wide and first. It is the argument for the section, so it gets the
       *  width rather than a cell in the grid with the films it summarises. */}
      <article className="group">
        <FilmFrame film={REEL} />
        <Caption title={REEL.title} trailing={<Credit film={REEL} />} />
      </article>

      <ul className="mt-[var(--space-block)] grid grid-cols-1 gap-x-6 gap-y-[var(--space-block)] md:grid-cols-2">
        {FILMS.map((film, i) => (
          <li key={film.id}>
            <article className="group">
              <FilmFrame film={film} />
              <Caption
                title={film.title}
                titleClass="text-engagement"
                trailing={<Counter index={i + 1} total={FILMS.length} />}
              >
                <Credit film={film} />
              </Caption>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
