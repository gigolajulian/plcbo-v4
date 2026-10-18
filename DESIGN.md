# PLCBO design system

Extracted from the shipped v4 build, not from intentions. Everything here is in use on
the page right now.

The world: one grotesque in two optical cuts, set uppercase and tracked tight at display
size, on a light ground, against a lot of air, with the photographs doing the talking.
Structure is hairlines and ruled rows, never cards. The reference grammar is
basicagency.com, borrowed as grammar: the type ladder's proportions, the ruled row, the
vertical rhythm and the measured motion curves. Not their identity, their compositions
or their copy.

## Where things live

| File | Owns |
|---|---|
| `src/design/tokens.css` | Colour, motion, rhythm. The single source of values. |
| `tailwind.config.js` | The type ramp, plus the Tailwind-facing mirrors of the tokens. |
| `src/index.css` | The base layer and the five moves' CSS. Writes no values of its own. |
| `src/design/reveal.tsx` | The three scroll moves as components. |
| `src/design/layout.tsx` | Section, SectionHead, Counter, Caption. |
| `src/design/controls.tsx` | Button, PushArrow. |
| `src/design/media.tsx` | Photograph, WipingPhotograph. |

The type ramp is in `tailwind.config.js` rather than in `tokens.css` on purpose.
Tailwind reads it there, and mirroring nine roles into custom properties would hide
the numbers behind a second name for no gain.

## Colour

Seven values. v3's palette verbatim, so the two cuts never read as different sites.

| Token | Value | Use |
|---|---|---|
| `--ground` | `#f4f4f3` | The page. Neutral light, deliberately not cream. |
| `--ink` | `#434343` | Every heading and every line of body. |
| `--ink-2` | `#5e5e5e` | Secondary reading colour: the statement, the studio paragraph. |
| `--ink-3` | `#8a8a8a` | 3.5:1. Labels, counters, credits, eyebrows. Never body. |
| `--hairline` | `#dfdfdc` | Every rule on the page. |
| `--terracotta` | `#d26e52` | The accent. Three uses, listed below. |
| `--terracotta-fill` | `#c25a3c` | The deeper step white needs to clear AA. |

`--ink` is the most important value here and it is not black. A soft charcoal on a light
ground is what separates an expensive editorial page from a default one: pure black on
near-white is a contrast shout nobody asked for, and it makes a photograph look washed
out beside it. Every reading colour is a step down from that charcoal, never up to black.

**Terracotta appears exactly three times:** the rule above Selected work, the focus ring,
and the filled button. Never on the mark, never over a photograph. That is the identity
system's own under-5% rule, and a fourth use breaks it.

Tokens are channel triplets, not hex, so Tailwind can substitute an alpha into
`rgb(var(--ink) / <alpha-value>)`. With a hex string there, `border-ink/25` is not a
class that exists and the build says so.

## Type

Two cuts of Neue Haas Grotesk from the Adobe kit `zit8yjq`: Display for every structural
role, Text for anything read at paragraph size. The kit is domain-locked to localhost,
plcbo.co, www.plcbo.co and gigolajulian.github.io. **Serve over `localhost`, never
`127.0.0.1`**: the numeric host is not on the list and both families fall back to
Helvetica with no error and no console warning.

| Role | Size desk / mob | Weight | Case |
|---|---|---|---|
| `text-hero` | 6.25vw / 40px | 700 | upper |
| `text-head` | 42 / 24 | 700 | upper |
| `text-work-title` | 38 / 22 | 700 | upper |
| `text-engagement` | 28 / 20 | 700 | upper |
| `text-capability` | 22 / 18 | 600 | upper |
| `text-statement` | 22 / 18 | 400 | upper |
| `text-body` | 18 / 14 | 400 | sentence |
| `text-caption` | 14 / 11 | 400 | sentence |
| `text-eyebrow` | 11 | 500 | upper, +0.09em |

Each role carries its own tracking and leading, so a role cannot be half-applied at a
call site. Sizes interpolate rather than switching at a breakpoint, so no size is ever
wrong between the two.

One honest gap: the kit's lightest Display weight is 400 and the reference runs 300 in
its quiet statement role, so that role sits a touch heavier here. Adding Display 25 Thin
to the kit closes it with no rebuild.

## Rhythm and grid

| Token | Value | Use |
|---|---|---|
| `--space-section` | `clamp(4rem, 12vh, 8rem)` | Above and below every section. |
| `--space-head` | `clamp(2rem, 5vh, 3.5rem)` | Section heading to its content. |
| `--space-block` | `clamp(2.5rem, 7vh, 5rem)` | Between blocks inside a section. |
| `--nav-height` | `88px` | Read by both `scroll-padding-top` and section scroll margin. |

Page padding steps 20 / 32 / 48 at 375 / 768 / 1024, content capped at 1440 and centred
past it. The ruled row puts its label column at `14rem` from 768 up and stacks below.

## Motion

Five easings and six durations, measured off the reference's own stylesheet rather than
guessed. Every transition animates transform or opacity only, so all of it runs on the
compositor. **There is no `transition: all` in this project** and adding one is a
regression.

```
--ease-out-soft    cubic-bezier(0.28, 0,    0.49,  1)   the workhorse
--ease-out         cubic-bezier(0.28, 0.44, 0.49,  1)
--ease-garret      cubic-bezier(0.5,  0,    0,     1)   long, decisive, the reveals
--ease-in-out-soft cubic-bezier(0.72, 0,    0.28,  1)
--ease-in-out-hard cubic-bezier(0.77, 0,    0.175, 1)   the arrow's jump

--t-125 .13s  --t-150 .15s  --t-250 .25s (default)
--t-350 .35s  --t-500 .5s   --t-1000 1s
```

### The five moves

| Move | What | Where |
|---|---|---|
| Masked rise | `translateY(103%)` to 0 inside a clip, staggered 40ms | every heading and eyebrow |
| Rule draw | `scaleX(0)` to 1 from the left, 500ms | the hairline above each section |
| Wipe | the window opens left-to-right while the image runs the other way at 1.75x | work frames and films |
| Trace | `translate3d(-101%)` to 0 | the rule under the current nav item |
| Push arrow | out right, jump the gap outside the clip, back from the left | every action on hover |

The 103% is the reference's own number: 3% of overshoot so no descender peeks under the
mask edge mid-travel.

Each move is a clip box plus one child that travels. **The box never moves and never
fades**, so an IntersectionObserver always has a full-size rect to measure. An earlier
cut hid elements with a zero-area `clip-path`, which made the observer meant to reveal
them report ratio 0 forever, and six cells sat invisible with no error anywhere.

### Reduced motion

The reference ships zero `prefers-reduced-motion` rules. That is a defect, not a style
choice, and it is not copied. Content still arrives, it just arrives by fading: nothing
translates, scales or wipes, and everything parked off-stage is put back where it
belongs rather than left hidden.

## Components

| Component | Props worth knowing | Notes |
|---|---|---|
| `Section` | `id`, `label` | Owns vertical rhythm and the scroll offset that clears the nav. |
| `SectionHead` | `eyebrow`, `title`, `accent` | `accent` is the one terracotta rule. Selected work only. |
| `Counter` | `index`, `total` | Tabular numerals, so a column of them does not shuffle. |
| `Caption` | `title`, `titleClass`, `trailing` | The ruled bar under a frame or a film. |
| `Button` | `href`, `variant` | `solid` is the page's one filled control, one per screen. |
| `PushArrow` | `className` | See the known gap below. |
| `Rise` | `stagger` | An index, not a delay. The CSS multiplies it by 40ms. |
| `Wipe`, `RuleDraw` | `accent` on RuleDraw | The other two scroll moves. |
| `Photograph` | `frame`, `sizes`, `priority` | Ratio and placeholder colour come off the file. |
| `WipingPhotograph` | same | `Photograph` inside a `Wipe`. |

`Rise` takes a stagger index rather than a millisecond count so a row of six frames
reads as one gesture and the number at the call site stays a position.

`sizes` on a photograph is the one that matters. Without it the browser assumes the
image fills the viewport and reaches for the 1600 everywhere, which makes a two-up grid
download two full-width frames on a phone.

## Rules

1. No value outside `tokens.css` or the type ramp. A hex literal or a bare
   `cubic-bezier` in a component is the thing the system was extracted to stop.
2. Terracotta three times, listed above. A fourth breaks the identity system.
3. Transform and opacity only. No `transition: all`.
4. Every clip box keeps its size. Hidden states translate and fade, they never clip
   themselves to zero area.
5. `--ink-3` is 3.5:1. Labels and meta only, never body text.
6. Serve over `localhost`. The font kit is domain-locked.
7. Nothing third-party loads until a reader asks for it. The films mount zero iframes
   until play is pressed.

## Known gaps

- **`PushArrow` is a unicode glyph, not a drawn icon.** It is the only mark of its kind
  on the page, so a whole icon system to hold one arrow is not worth it yet. The moment
  a second icon appears, both come from one drawn set, and `controls.tsx` is the single
  file that changes.
- **Capability numbers `01 / 02 / 03` carry no information.** The work and film counters
  do, because they say how much of a set you are looking at. The capability numbers are
  decoration, and three rows do not need numbering to be read in order.
- **Display 400 is the lightest weight available**, so the quiet statement role is
  heavier than the reference's.
- **`src/components/blob-mark.tsx` and `src/lib/blob-field.ts` are unimported.** The
  WebGL mark was replaced by the flat SVG. Kept on disk, not deleted.
