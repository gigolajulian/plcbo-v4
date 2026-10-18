import * as React from 'react';

/**
 * Reports which section id is currently occupying the viewport, or "" above all of
 * them.
 *
 * Empty rather than the first id, which is what this returned. The hero is not the
 * Work section, so defaulting to the first one drew the nav's accent rule under Work
 * before the reader had scrolled a pixel, and the one thing the rule is there to say
 * is where you are.
 */
export function useScrollSpy(ids: string[], offset = 120) {
  const [active, setActive] = React.useState('');

  React.useEffect(() => {
    const onScroll = () => {
      const line = window.scrollY + offset;
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        /* Measured against the document, not offsetTop. offsetTop is relative to the
           nearest positioned ancestor, so a section inside any positioned wrapper
           reports its offset within that wrapper rather than down the page. */
        if (el && el.getBoundingClientRect().top + window.scrollY <= line) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids, offset]);

  return active;
}
