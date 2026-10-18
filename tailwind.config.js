/** @type {import('tailwindcss').Config} */

/*  v4 runs one grotesque in two optical cuts, which is the whole typographic system.
    Neue Haas Grotesk Display for every structural role, Text for everything read at
    paragraph size. Both come from the PLCBO Adobe Fonts kit zit8yjq, which is
    domain-locked to localhost, plcbo.co, www.plcbo.co and gigolajulian.github.io.

    The kit's lightest Display weight is 400. The reference runs 300 in its one quiet
    statement role, so that role sits a touch heavier here. Adding Display 25 Thin to
    the kit closes it with no rebuild. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /*  The tokens are channel triplets, wrapped here so Tailwind can substitute an
          alpha into them. Written as plain var(--ink) the opacity utilities silently
          do not exist, and the build fails on the first border-ink/25. */
      colors: {
        ground: 'rgb(var(--ground) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          2: 'rgb(var(--ink-2) / <alpha-value>)',
          3: 'rgb(var(--ink-3) / <alpha-value>)',
        },
        hairline: 'rgb(var(--hairline) / <alpha-value>)',
        terracotta: {
          DEFAULT: 'rgb(var(--terracotta) / <alpha-value>)',
          fill: 'rgb(var(--terracotta-fill) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"neue-haas-grotesk-display"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        text: ['"neue-haas-grotesk-text"', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      /*  PLAN section 5, one entry per role. Desktop and mobile sizes from the table,
          interpolated rather than switched at a breakpoint so no size is ever wrong
          between the two. Tracking and leading travel with the size, which is what
          keeps a role from being half-applied at a call site. */
      fontSize: {
        hero: ['clamp(2.5rem, 6.25vw, 7.5rem)', { lineHeight: '0.9', letterSpacing: '-0.05em' }],
        head: ['clamp(1.5rem, 3.2vw, 2.625rem)', { lineHeight: '1', letterSpacing: '-0.05em' }],
        'work-title': ['clamp(1.375rem, 2.9vw, 2.375rem)', { lineHeight: '1.1', letterSpacing: '-0.035em' }],
        engagement: ['clamp(1.25rem, 2.2vw, 1.75rem)', { lineHeight: '1', letterSpacing: '-0.035em' }],
        capability: ['clamp(1.125rem, 1.7vw, 1.375rem)', { lineHeight: '1.15', letterSpacing: '-0.035em' }],
        statement: ['clamp(1.125rem, 1.7vw, 1.375rem)', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        body: ['clamp(0.875rem, 1.1vw, 1.125rem)', { lineHeight: '1.6', letterSpacing: '-0.02em' }],
        caption: ['clamp(0.6875rem, 0.9vw, 0.875rem)', { lineHeight: '1.5', letterSpacing: '-0.02em' }],
        eyebrow: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.09em' }],
      },
      /* PLAN section 8, lifted from the reference's own stylesheet. */
      transitionTimingFunction: {
        'out-soft': 'var(--ease-out-soft)',
        out: 'var(--ease-out)',
        garret: 'var(--ease-garret)',
        'in-out-soft': 'var(--ease-in-out-soft)',
        'in-out-hard': 'var(--ease-in-out-hard)',
      },
      transitionDuration: {
        125: '130ms',
        150: '150ms',
        250: '250ms',
        350: '350ms',
        500: '500ms',
        1000: '1000ms',
      },
      maxWidth: { content: '1440px' },
      /* The ruled row's label column, PLAN section 4. */
      gridTemplateColumns: { row: '14rem 1fr' },
    },
  },
};
