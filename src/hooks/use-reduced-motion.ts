import * as React from 'react';

/**
 * Whether the reader has asked for less motion.
 *
 * This is the one thing v4 used framer-motion for, and framer-motion is 100KB or so
 * to answer a media query. Every reveal on this page is a CSS keyframe that the
 * stylesheet already turns off under prefers-reduced-motion, so the only caller left
 * is the WebGL mark, which has to make the decision in JavaScript because there is no
 * stylesheet between it and the GPU.
 *
 * It listens, rather than reading once: the setting can be changed while the page is
 * open, and on macOS it is toggled from a system panel the reader never reloads for.
 */
const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );

  React.useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    /* Re-read on mount: the first render may have been a server render, or the
       setting may have changed between that render and this effect. */
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
