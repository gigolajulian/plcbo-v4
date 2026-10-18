# PLCBO v4 — plan

Status: Phase 0. Nothing built yet. This document is the thing to approve or redline.

## 1. What changes, and why

v3 is a light atelier page with a Bodoni didone, Archivo and Space Mono, title-case
headings and a centred shell. The reference is a different animal: one grotesque,
uppercase, bold at display, tracked tight, set on ruled rows against a lot of air.

So v4 is not a reskin of v3. It keeps three things and replaces the rest:

| Kept | Replaced |
|---|---|
| The light palette and terracotta accent | The typeface system, entirely |
| The P mark and its blob-field renderer | The section order and the copy |
| The Vite / React / Tailwind setup | The grid, the case, the vertical rhythm |

## 2. Section order

The reference's order, with every slot PLCBO cannot truthfully fill removed rather
than filled with invention.

| # | Section | Why it sits here | Reference equivalent |
|---|---|---|---|
| 1 | Nav | Work, Studio, Services, Contact. Four items, mark left, sticky. | Nav (theirs has 6 plus a dropdown; we have four pages' worth of content) |
| 2 | Hero | The mark, the name at full display weight, one grounded sentence, two actions. | Hero. Theirs leads with a reel and three awards. We have neither, so the mark and the name carry it. |
| 3 | Selected work | Photography first, before any claim about it. Large frames, counted. | Case-study carousel (their "00 /05" counter is the device worth stealing) |
| 4 | Featured engagements | Who already trusted it. Seven ruled rows, name left, discipline right. | Featured Engagements |
| 5 | Capabilities | What the work actually is. Three ruled rows. | The gap in their site: Work links to /services but no services are shown |
| 6 | Studio | Who makes it, one portrait, one grounded paragraph. | About Us |
| 7 | Contact | The ask, with the address visible. | Closing CTA + biz@ |
| 8 | Footer | Wordmark set enormous and allowed to run off both edges. | Footer |

**Cut, and why:** internal-works cards, the awards row, Featured News, Offices,
Initiatives, the reel. Each exists on the reference because that studio has the
thing. Reproducing the slot with filler is the single fastest way to make a
seven-client studio look like it is pretending to be a two-hundred-person one.

**Held for your call:** the marquee ticker (section 6.5). It is one of the
reference's signature moves and it costs nothing, but it needs a line of copy that
is true and worth repeating forever. I have not found one. Say the word and it goes
in with a line you write.

## 3. The social-proof problem, stated plainly

The pattern library's answer for this page type is "social proof before CTA," and
its standard instrument is a testimonial carousel. You have no testimonials on
record, so there is none. The seven client names are the entire proof this page
has, which is why they get their own section at full display weight rather than a
muted logo strip. Four of them publish a usable mark; three do not and are set as
type in the same rows. A seven-cell logo grid built for twelve reads as padding.

## 4. Grid

Twelve columns, matching the reference's variable-driven grid.

| Breakpoint | Columns | Gutter | Page padding | Max content |
|---|---|---|---|---|
| 375 | 4 | 16px | 20px | fluid |
| 768 | 8 | 20px | 32px | fluid |
| 1024 | 12 | 24px | 48px | fluid |
| 1440+ | 12 | 24px | 48px | 1440px |

Vertical rhythm on a 4/8 scale. Section spacing `clamp(4rem, 12vh, 8rem)`, matching
v3's existing rule so the two never look like different sites side by side.

Ruled rows are the repeating unit: a full-width hairline `#dfdfdc`, content on a
`[14rem 1fr]` grid at 768 and up, stacked below.

## 5. Type, as applied

The ladder from the brief, mapped to where it is actually used:

| Element | Family | Size (desk / mob) | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Hero PLCBO | Display | 6.25vw / 40px | 700 | -0.05em | 0.9 |
| Section head | Display | 42 / 24 | 700 | -0.05em | 1.0 |
| Work title | Display | 38 / 22 | 700 | -0.035em | 1.1 |
| Engagement name | Display | 28 / 20 | 700 | -0.035em | 1.0 |
| Capability label | Display | 22 / 18 | 600 | -0.035em | 1.15 |
| Large statement | Display | 22 / 18 | 400 | -0.02em | 1.25 |
| Body | Text | 18 / 14 | 400 | -0.02em | 1.6 |
| Emphasis in body | Text | 18 / 14 | 500 | -0.02em | 1.6 |
| Caption, meta | Text | 14 / 11 | 400 | -0.02em | 1.5 |
| Eyebrow | Text | 11 | 500 | +0.09em | 1.4 |

Uppercase on every Display role and every eyebrow. Sentence case on body. Eyebrows
in parentheses, `(Selected work)`.

One honest gap: the reference's lightest weight is 300 and this kit's lightest is
400. The "large quiet statement" role is therefore a touch heavier here than there.
Adding Display 25 Thin to the kit closes it, one call, no rebuild.

## 6. Colour

v3's tokens, copied verbatim. Ground `#f4f4f3`, ink `#434343`, ink-2 `#5e5e5e`,
ink-3 `#8a8a8a` for labels only, hairline `#dfdfdc`, terracotta `#d26e52`.

Terracotta appears exactly three times on the page: the eyebrow rule above Selected
work, the focus ring, and the contact button fill. Never on the mark, never over a
photograph. That is under 5% and it is the identity system's own rule.

## 7. Images

Inventoried: **87 projects, 1,191 catalogued frames, 1,638 files on disk.**
Sections: WORK 50, MUSIC 9, SESSIONS 8, uncategorised 20.

Three findings that change the build:

**1. The `cover` in work-data is a 600px thumbnail, not a usable frame.** Covers run
600x750. `public/covers/` tops out at 780px. The real frames live at
`/work/<slug>/NN.jpg` and measure **~2500px on the long edge**. Anything full-bleed
pulls from those, never from the cover. The covers are good for one thing, which is
the contact sheet, and that is what they are doing.

**2. Alt text is nearly free.** 1,132 of 1,191 frames, **95%**, already carry written
alt, and it is good: "Side profile in bunny ears and a fur-trimmed coat, edged by red
flare light". Only the 87 cover records are blank, and those are thumbnails we are not
shipping. So the alt obligation is close to zero, not 87 strings.

**3. The library is portrait.** 79 of 86 usable covers are portrait, 7 landscape
(hua, novocaine, diesel, headshots, places, realestate, weddings), 1 square. The work
grid is therefore portrait-first by default, and the few landscape frames are the ones
that can run full-bleed. Designing a landscape-led grid would mean fighting the
archive.

Two smaller ones: `coverart`'s cover points at a directory that does not exist, so it
is excluded, and every record carries a dominant-colour hex, which becomes the
image placeholder background so nothing shifts while loading.

### Pipeline
2500px JPEGs do not ship. Each chosen frame gets derived with ffmpeg, already on PATH,
into webp at 1600 / 1000 / 640 wide, served through `srcset`. Originals are never
copied into v4. This is a build step, not a dependency.

### The sheet
`.contact-sheet/index.html` on localhost, 86 projects, filterable by section, numbered.
Sorted **darkest first, then most saturated**, which is your stated cut: dark frames
with one hard light. The first screen is doing that correctly.

Send numbers. I need:
- **1 hero frame** (landscape reads best full-bleed, but a portrait crop works)
- **5 or 6 for Selected work**
- **1 for Studio**

Nothing gets placed until those numbers come back.

## 8. Motion

The reference's motion system is measurable, so this is copied rather than guessed.
Its CSS defines five named easings and eleven duration steps, and every transition in
it animates **transform or opacity only**. Not one `transition: all`.

### Tokens, lifted verbatim

```css
--ease-out-soft:    cubic-bezier(0.28, 0,     0.49,  1);  /* the workhorse */
--ease-out:         cubic-bezier(0.28, 0.44,  0.49,  1);
--ease-garret:      cubic-bezier(0.5,  0,     0,     1);  /* long, decisive */
--ease-in-out-soft: cubic-bezier(0.72, 0,     0.28,  1);
--ease-in-out-hard: cubic-bezier(0.77, 0,     0.175, 1);

--t-125: 0.13s;  --t-150: 0.15s;  --t-250: 0.25s;  /* 250 is the default */
--t-350: 0.35s;  --t-500: 0.5s;   --t-1000: 1s;
```

### The five moves, and where each one goes

| Move | What it does | Where |
|---|---|---|
| **Masked rise** | `translateY(103%) -> 0` inside an `overflow:hidden` clip. The 103 is theirs: 3% of overshoot so no descender peeks under the mask edge. | Every heading and eyebrow on scroll-in, staggered 40ms |
| **Rule draw** | `scaleX(0) -> 1`, `transform-origin: left` | Every hairline above a section, 500ms, ease-garret |
| **Wipe** | Outer `translateX(-100%) -> 0` while the inner image runs `scale(1.75) translateX(100%) -> scale(1) translateX(0)` | Work frames entering view |
| **Trace** | `translate3d(-101%,0,0) -> 0` | The terracotta rule under the active nav item |
| **Push arrow** | `translateX(0) -> 100%`, jump to `-100%`, back to `0`, inside a clip | The arrow in every CTA, on hover |

Hover link swap is already built: v3's `.swap` component is exactly the masked rise
run on hover instead of on scroll. It carries over unchanged.

### What I will not do

**No scroll-jacking, no pinned sections, no parallax on the photographs.** The frames
are the content. Moving them while the user is trying to look at them is the single
most common way a studio site becomes annoying on the second visit.

**No glow, no neon, no blur reveals.** Per the identity system.

**Springs only where a finger is involved.** Apple's fluid-interface work is emphatic
that animation must be grabbable and reversible mid-flight, and CSS keyframes cannot
be. But that applies to *gesture-driven* motion. A scroll reveal is not gesture-driven:
it fires once, it is not something you grab. Using a spring library for all of it would
buy nothing and cost bundle. So: CSS keyframes for reveals, framer-motion springs only
if we add a draggable surface later.

### Reduced motion

The reference ships **zero** `prefers-reduced-motion` rules. I checked the whole
stylesheet. That is a defect, not a style choice, and I am not copying it.

```css
@media (prefers-reduced-motion: reduce) {
  /* content still arrives, it just arrives by fading */
  [data-reveal] { animation: fade-in var(--t-250) var(--ease-out-soft) both; }
  .wipe, .rule-draw, .push-arrow { animation: none; transform: none; }
}
```

Everything stays legible and everything still appears. Nothing translates, scales or
wipes. The hero morph, if it survives, is off entirely in this mode.

### Performance

Transform and opacity only, so every animation runs on the compositor. `will-change`
goes on only what is about to move and comes off after. Reveals use one shared
IntersectionObserver, not one per element. Target is 60fps with the WebGL mark running,
and I will measure that in your Chrome rather than this pane, since the hidden pane
freezes rAF and reports zeros.

### The hero, still your call

Two options, and this is open question 1:

- **Still.** The reference hero does not move. The mark sits, the type rises once, done.
- **Scroll-morph.** v3's P-to-wordmark blob morph, which is the best thing the current
  site does. It costs a pinned section, which contradicts the no-pinning rule above.

If you want the morph, it ships behind `?morph=1` until you have seen it in place and
said yes, per the standing rule about big motion changes.

## 9. Who builds what

| Agent | Owns | Runs |
|---|---|---|
| Explore | Read-only inventory of the JG library | first, already running |
| Track A (general-purpose) | Shell, nav, type layer, tokens, footer | after approval |
| Track B (general-purpose) | Work, engagements, capabilities, studio, contact | parallel with A |
| impeccable-finish-reviewer | Ordered fix list against the reference | after A and B land |
| impeccable-documenter | v4/DESIGN.md from the shipped result | last |

I am not spawning a separate Plan agent. It would start cold and re-derive the
reference measurements that are already in hand, which costs a full pass to arrive
back here. The IA above came from the ui-ux-pro-max pass plus the measured CSS.

## 10. Copy still owed by you

Every line below is a slot I will not invent. They ship as `[JG TO WRITE]` until
you fill them.

- Hero sentence, one line, what PLCBO is.
- Studio paragraph, two or three sentences.
- Capability descriptions, three, one line each.
- Contact invitation, one line.
- Marquee line, only if the marquee goes in.

## 11. Open questions

1. Does the hero keep the scroll-morph (P into wordmark) or does the mark sit still?
   The reference hero does not move. The morph is v3's best trick.
2. Marquee in or out.
3. Is `hello@plcbo.co` the right address? v3 uses it. Confirm before it ships.
