/*  Browser verification. Run: npm run verify (dev server must be up on 4175).
 *
 *  This exists because the two tools nearest to hand both lie about this page. The
 *  app's own Browser pane freezes requestAnimationFrame and IntersectionObserver when
 *  it is not composited, so it reports a canvas still at its default 300x150 and
 *  zero of forty-six reveals fired: both false. And reasoning about whether a font
 *  resolved or a row overflowed is not verification at all.
 *
 *  So: a real Chromium, with the GPU flags, at three widths, scrolled the way a
 *  reader scrolls, asserting the things that have actually broken on this site
 *  before. Fonts silently falling back is the first of them, which is why the host
 *  has to stay localhost: the Adobe kit is domain-locked and 127.0.0.1 is not on the
 *  list, and the failure is invisible without a check like this one.
 *
 *  Playwright is not a dependency of v4. The library ships inside the globally
 *  installed @playwright/cli, and the browser binaries are already on disk, so this
 *  imports it by path rather than adding a second copy to the tree.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const V4 = path.resolve(HERE, '..');
const OUT = path.join(V4, '.qa');

const PLAYWRIGHT =
  process.env.PLAYWRIGHT_PATH ||
  'C:/Users/Julian/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright/index.mjs';

/* Must be localhost. The kit is locked to it and the numeric host fails silently. */
const URL_UNDER_TEST = process.env.V4_URL || 'http://localhost:4175/';

const EXPECTED_FACES = [
  ['neue-haas-grotesk-display', 400],
  ['neue-haas-grotesk-display', 600],
  ['neue-haas-grotesk-display', 700],
  ['neue-haas-grotesk-text', 400],
  ['neue-haas-grotesk-text', 500],
];

const WIDTHS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

const failures = [];
const notes = [];

function check(ok, label, detail = '') {
  const line = `${ok ? 'pass' : 'FAIL'}  ${label}${detail ? `  ${detail}` : ''}`;
  console.log(line);
  if (!ok) failures.push(`${label} ${detail}`.trim());
}

/** Scroll the whole page in viewport steps, the way a reader does, and let the
    reveals fire. Jumping straight to the bottom leaves every observer in between
    unfired, which is how a reveal bug hides from its own test. */
async function scrollThrough(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = await page.evaluate(() => Math.round(window.innerHeight * 0.8));
  for (let y = 0; y < height; y += step) {
    await page.evaluate((to) => window.scrollTo(0, to), y);
    await page.waitForTimeout(140);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
}

/* A Windows path is not a URL: node's ESM loader reads "C:" as a protocol and
   refuses it. pathToFileURL is the conversion. */
const { chromium } = await import(pathToFileURL(PLAYWRIGHT).href);

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  args: [
    /* WebGL2 in headless. Without these the blob mark falls back to the flat SVG and
       the check below would call a working renderer broken. */
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
  ],
});

for (const size of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      consoleErrors.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));

  const failedRequests = [];
  page.on('requestfailed', (request) =>
    failedRequests.push(`${request.url()} ${request.failure()?.errorText ?? ''}`),
  );

  console.log(`\n--- ${size.name} ${size.width}x${size.height} ---`);

  await page.goto(URL_UNDER_TEST, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  /* Fonts. The whole typographic system is two families; if either falls back the
     page is still legible, which is exactly why this has to be asserted. */
  const fonts = await page.evaluate(
    (faces) => ({
      resolved: faces.map(([family, weight]) => [
        `${family} ${weight}`,
        document.fonts.check(`${weight} 16px "${family}"`),
      ]),
      loaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`),
    }),
    EXPECTED_FACES,
  );
  for (const [face, ok] of fonts.resolved) check(ok, `font resolves: ${face}`);
  check(
    fonts.loaded.length >= EXPECTED_FACES.length,
    'font files downloaded',
    `${fonts.loaded.length} of ${EXPECTED_FACES.length}`,
  );

  await scrollThrough(page);

  /* Reveals. All of them, or the ones that did not fire are invisible content. */
  const reveals = await page.evaluate(() => ({
    shown: document.querySelectorAll('[data-shown]').length,
    total: document.querySelectorAll('.rise, .wipe, .rule-draw').length,
  }));
  check(
    reveals.total > 0 && reveals.shown === reveals.total,
    'every reveal fired',
    `${reveals.shown} of ${reveals.total}`,
  );

  /* Horizontal overflow. Measured by trying to scroll sideways rather than by
     comparing scrollWidth to innerWidth: with a zero-size viewport that subtraction
     invents an overflow that is not there. */
  const overflow = await page.evaluate(() => {
    window.scrollTo(5000, window.scrollY);
    const x = window.scrollX;
    window.scrollTo(0, window.scrollY);
    const vw = document.documentElement.clientWidth;
    const culprits = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        /* Anything inside a clip is off-stage on purpose, which is what the wipe and
           the rise are. Only unclipped overflow is a defect. */
        return (
          (r.right > vw + 1 || r.left < -1) && !el.closest('.wipe, .rise, .swap, .push-arrow')
        );
      })
      .slice(0, 6)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`);
    return { scrolledX: x, culprits };
  });
  /*  Both halves, because either alone passes a broken page. A document that cannot
      scroll sideways may simply be clipping content away, which is how five nav items
      fitted a 320px phone twice: body hides the overflow, so nothing scrolls and
      nothing complains, and "Contact" is just not on screen. */
  check(overflow.scrolledX === 0, 'no horizontal scroll');
  check(
    overflow.culprits.length === 0,
    'nothing clipped off the right edge',
    overflow.culprits.join(' | '),
  );

  /*  The mark is the flat SVG artwork and nothing renders it, so what is asserted is
      that it is drawn at a real size and that no canvas crept back onto the page. */
  const mark = await page.evaluate(() => {
    const svg = document.querySelector('main svg');
    const box = svg ? svg.getBoundingClientRect() : null;
    return {
      present: Boolean(svg),
      width: box ? Math.round(box.width) : 0,
      height: box ? Math.round(box.height) : 0,
      canvases: document.querySelectorAll('canvas').length,
    };
  });
  check(
    mark.present && mark.width > 30 && mark.height > 30,
    'the mark is drawn',
    `${mark.width}x${mark.height}`,
  );
  check(mark.canvases === 0, 'no renderer on the mark', `${mark.canvases} canvas`);

  check(consoleErrors.length === 0, 'console clean', consoleErrors.slice(0, 4).join(' | '));
  check(failedRequests.length === 0, 'every request loaded', failedRequests.slice(0, 4).join(' | '));

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(OUT, `${size.name}-top.png`) });
  await page.screenshot({ path: path.join(OUT, `${size.name}-full.png`), fullPage: true });

  await context.close();
}

/*  Reduced motion. The one thing the reference gets wrong, so it is the one thing
    worth asserting hardest: everything must be on screen and nothing may be parked
    off it. */
console.log('\n--- reduced motion, 1440x900 ---');
const reducedContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
const reducedPage = await reducedContext.newPage();
await reducedPage.goto(URL_UNDER_TEST, { waitUntil: 'networkidle' });
await reducedPage.evaluate(() => document.fonts.ready);
await scrollThrough(reducedPage);

const stillHidden = await reducedPage.evaluate(() => {
  const movers = [...document.querySelectorAll('.rise-i, .wipe-outer, .wipe-inner, .rule-draw')];
  return movers
    .filter((el) => {
      const t = getComputedStyle(el).transform;
      const opacity = Number(getComputedStyle(el).opacity);
      /* "none" or the identity matrix both mean it was put back where it belongs. */
      const moved = t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)';
      return moved || opacity < 0.99;
    })
    .slice(0, 6)
    .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)} ${getComputedStyle(el).transform}`);
});
check(stillHidden.length === 0, 'reduced motion leaves nothing off-stage', stillHidden.join(' | '));
await reducedPage.screenshot({ path: path.join(OUT, 'reduced-motion-full.png'), fullPage: true });
await reducedContext.close();

await browser.close();

console.log(`\nscreenshots in ${OUT}`);
for (const note of notes) console.log(`note: ${note}`);

if (failures.length) {
  console.log(`\n${failures.length} failure(s):`);
  for (const failure of failures) console.log(`  ${failure}`);
  process.exit(1);
}
console.log('\nall checks passed');
