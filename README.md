# PLCBO v4

The collective's site. Vite, React, TypeScript, Tailwind.

```bash
npm install
npm run dev      # serve on localhost, never 127.0.0.1
npm run frames   # re-derive the photographs from PICKS
npm run verify   # real-browser checks at 1440 / 768 / 375 plus reduced motion
npm run build
```

`DESIGN.md` is the design system, extracted from this build rather than from
intentions. Read it before changing a value.

Two things that bite:

- **Serve over `localhost`.** The Adobe Fonts kit is domain-locked, and on
  `127.0.0.1` both families fall back to Helvetica with no error and no console
  warning.
- **`scripts/frames.mjs` reads a library this repo does not contain**, Julian's
  juliangigola.com checkout. It derives webp into `public/work/` and writes
  `src/lib/frames.ts`. Both are committed, so the site builds without it. Point
  `JG_ROOT` at the checkout if you need to change which frames ship.
