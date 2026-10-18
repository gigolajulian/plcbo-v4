import * as React from 'react';

/**
 * Scroll reveal, on one observer for the whole page.
 *
 * PLAN section 8: one shared IntersectionObserver, not one per element. A page with a
 * hero, six work frames, seven engagement rows, three capabilities and every heading
 * above them runs to roughly forty reveals, and forty observers is forty separate
 * callbacks the browser has to schedule against the same scroll.
 *
 * It sets `data-shown` on the element and forgets it. The animation itself lives in
 * the stylesheet, which is what lets prefers-reduced-motion replace all of it with a
 * fade without this file knowing that happened.
 *
 * The background-tab escape hatch is carried over from v3, where the bug it fixes
 * shipped twice. A background tab is delivered neither IntersectionObserver callbacks
 * nor animation frames, so anything waiting for one shows nothing at all to a reader
 * who opens the site in a new tab and switches to it later. Timers do fire there.
 *
 * But the hatch has to know when it is needed. An unconditional timer reveals the
 * whole page a few seconds after load whether anyone has scrolled to it or not, so on
 * a normal visible tab nothing below the fold ever animates in: by the time you reach
 * it, it revealed itself minutes ago. So the observer governs while the document is
 * visible, and the timer only steps in when it cannot.
 */
const FORCE_REVEAL_MS = 3000;

let observer: IntersectionObserver | null = null;
const pending = new Set<Element>();

function reveal(el: Element) {
  if (!pending.has(el)) return;
  pending.delete(el);
  el.setAttribute('data-shown', '');
  observer?.unobserve(el);
}

function ensureObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target);
      }
    },
    /*  A threshold, and deliberately no negative bottom margin.
     *
     *  The margin was -10% of the viewport, to hold a reveal back until it was
     *  properly in view rather than letting it finish below the fold. But a negative
     *  bottom margin shrinks the root permanently, so anything that lives entirely
     *  inside the bottom 10% of the document can never enter it, however far the
     *  reader scrolls. The footer wordmark at 375 is exactly that: 76px tall, ending
     *  on the last pixel of the page. It never revealed, and nothing reported an
     *  error, because not firing is what an observer does most of the time.
     *
     *  A threshold does the same job and cannot have that failure: it asks for a
     *  fraction of the element rather than a fixed inset from the root, so it scales
     *  with whatever it is watching and an element scrolled fully into view always
     *  satisfies it. */
    { threshold: 0.1 },
  );

  /* Backgrounded before it was ever read: give up on the observer and show
     everything still waiting. */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) for (const el of [...pending]) reveal(el);
  });

  return observer;
}

/** Observes the element once and reveals it when it first comes into view. */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = ensureObserver();
    pending.add(el);

    /* Registered before any early return, so no code path can skip it. Fires in a
       background tab, where the observer does not. */
    const timer = window.setTimeout(() => {
      if (document.hidden || !io) reveal(el);
    }, FORCE_REVEAL_MS);

    if (io) io.observe(el);

    return () => {
      window.clearTimeout(timer);
      pending.delete(el);
      io?.unobserve(el);
    };
  }, []);

  return ref;
}
