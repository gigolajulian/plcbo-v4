/*  Derive the page's photographs, and write the module that describes them.
 *
 *  Run: npm run frames
 *
 *  The source library is Julian's juliangigola.com checkout, which is read-only from
 *  here. Nothing is copied out of it: the 2500px JPEGs do not ship, they are the
 *  input to a build step that writes webp at three widths into public/work/. So a
 *  frame change is a number change in PICKS below plus one command, not a file hunt.
 *
 *  PICKS is the one place the selection lives. The numbers are contact-sheet numbers,
 *  from .contact-sheet/index.html on localhost:7788, which lists all 86 projects
 *  darkest first and then most saturated.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const V4 = path.resolve(HERE, '..');
const SHEET = path.resolve(V4, '../.contact-sheet/rows.json');
const JG =
  process.env.JG_ROOT || 'C:/Users/Julian/Documents/Claude/Projects/JG WEBSITE NEW';

/*  ---------------------------------------------------------------------------
 *  PLACEHOLDER PICKS. These are not Julian's choices.
 *
 *  The brief says the frames are his call and that nothing gets placed until the
 *  numbers come back. So these are seeded from the top of his own stated cut, which
 *  is the sheet's own sort order: darkest first, then most saturated. They are here
 *  so the page can be built, measured and reviewed with real photographs in it
 *  rather than grey boxes. Swap the numbers, run the command, done.
 *  --------------------------------------------------------------------------- */
const PICKS = {
  /*  53 DIESEL, frame 03. Julian's pick, identified from a screenshot of his own
   *  site: matched against all seven frames, 0.26 SSIM against this one and 0.05 to
   *  0.10 against every other.
   *
   *  It is one of the 59 frames in the library with no alt text, which is why an
   *  earlier sweep for horizontal frames never surfaced it. The alt below is written
   *  here rather than in his library, so his file stays untouched. Worth him reading
   *  once: it is the only description on this page that is not his own.
   *
   *  Horizontal at 1.5:1, with the foreground figure running the full height, so the
   *  2.6:1 band takes a slice off the top and bottom of that figure. */
  hero: {
    num: 53,
    frame: '03',
    alt:
      'Cropped at the waist in a leather jacket and DIESEL belt, baggy jeans and a ' +
      'wallet chain, the crew spread across the warehouse floor behind',
  },
  /*  Ten, picked for the register rather than off the darkest-first sort.
   *
   *  This grid is read by someone deciding whether to commission a studio, so what it
   *  shows has to be commissionable work. The sort cannot know that. It ranked by
   *  luminance and saturation and put three boudoir sets near the top, which shoot
   *  beautifully and say the wrong thing on a page whose next section names Google
   *  and WIRED. Out: 19 ROUGE, 15 LUSTRO, 07 VENDETTA, and then 11 AERA:WRAITH for
   *  the same reason once its seven frames were looked at rather than its cover.
   *
   *  35 WIRED MAGAZINE went in on the strength of the name and came straight back
   *  out. All seventeen of its frames are bright daylight exteriors, median
   *  luminance 87 against 38 for the next brightest frame on this page. The name
   *  still earns its place in the Engagements rows below, which is where a brand a
   *  reader knows does its work. It does not have to carry a frame as well.
   *
   *  What is left is dark, figure-led and lit with one hard colour. 29 OAKLEY X NIKE
   *  and 41 METAMORPHOSIS carry the brand and fashion end. 39 HUA and 12 CYBER1A
   *  are pinned to a frame each, one red and one cyan, so the two accents sit on
   *  opposite sides of the grid instead of stacking.
   *
   *  Ordered strongest first, since the two-up grid is read in pairs. */
  work: [
    2,
    29,
    3,
    /* Red-lit tunnel, the figure silhouetted at the end of it, shot from low. */
    { num: 39, frame: '11' },
    9,
    /* Cyan CRT glow, crouched on the set. The counterweight to HUA's red. */
    { num: 12, frame: '02' },
    13,
    41,
    6,
    17,
  ],
  /* 08 VIGIL. A slot, not an answer: the section wants a portrait of the person who
     makes the work, and the archive has no portrait of Julian in it. */
  studio: 8,
};

const WIDTHS = [1600, 1000, 640];
const FALLBACK_WIDTH = 1000;

/** Perceived luminance, the same weighting the contact sheet sorted on. */
function luminance(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** The PROJECTS array out of a TypeScript file, without compiling TypeScript. */
function readProjects() {
  const file = fs.readFileSync(path.join(JG, 'lib/work-data.ts'), 'utf8');
  const start = file.indexOf('export const PROJECTS');
  /* "= [", not the first "[": the declaration is `PROJECTS: Project[] = [`, and the
     type annotation's own brackets come first. */
  const open = file.indexOf('= [', start) + 2;
  /* The array is the last thing in the file and its body is plain JSON, which is
     what makes this honest rather than a regex that half-parses a language. */
  const close = file.lastIndexOf('];');
  return JSON.parse(file.slice(open, close + 1));
}

/**
 * The frame to use from a project.
 *
 * Darkest first, and it must already carry alt text. 95% of the library does, the
 * strings are good, and writing a new one when a written one exists is how a
 * description drifts away from the photograph it describes.
 */
function chooseFrame(project, pinned) {
  /*  A pinned frame is looked up among all of them, because 59 frames in the library
      carry no alt text and one of them can still be the right picture. The automatic
      rule stays restricted to frames that already have alt: picking blind and then
      owing a description is fine once, deliberately, and wrong as a default. */
  const pool = pinned ? project.images.filter((img) => img.src.includes('/work/')) : null;
  const candidates = project.images.filter((img) => img.alt && img.src.includes('/work/'));
  if (!pinned && !candidates.length) return null;

  /*  A pick can name its frame when the automatic rule gets it wrong, which is what
      the hero needs: darkest is right for a portrait cell in the grid and wrong for a
      2.6:1 band, where it just reads as a black mass. */
  if (pinned) {
    const match = pool.find((img) => path.basename(img.src, path.extname(img.src)) === pinned);
    if (!match) throw new Error(`${project.slug} has no frame ${pinned}`);
    return match;
  }

  return candidates.slice().sort((a, b) => luminance(a.color) - luminance(b.color))[0];
}

function derive(srcAbs, outDir, stem, sourceWidth) {
  fs.mkdirSync(outDir, { recursive: true });
  const made = [];

  for (const w of WIDTHS) {
    /* Never upscale. A 640-wide source asked for at 1600 would ship a soft frame and
       a srcset that lies about it. */
    if (w > sourceWidth) continue;
    const out = path.join(outDir, `${stem}-w${w}.webp`);
    if (!fs.existsSync(out)) {
      execFileSync(
        'ffmpeg',
        ['-y', '-loglevel', 'error', '-i', srcAbs, '-vf', `scale=${w}:-1`,
         '-c:v', 'libwebp', '-quality', '82', '-compression_level', '6', out],
        { stdio: 'inherit' },
      );
    }
    made.push(w);
  }

  if (!made.length) throw new Error(`no width small enough for ${srcAbs} (${sourceWidth}px)`);
  return made;
}

const rows = JSON.parse(fs.readFileSync(SHEET, 'utf8'));
const projects = readProjects();
const byNum = new Map(rows.map((r) => [r.num, r]));

/** A pick is a contact-sheet number, or that number with a frame pinned. */
function build(pick) {
  const { num, frame: pinned, alt: writtenAlt } = typeof pick === 'number' ? { num: pick } : pick;
  const row = byNum.get(num);
  if (!row) throw new Error(`no contact-sheet row numbered ${num}`);

  const project = projects.find((p) => p.slug === row.slug);
  if (!project) throw new Error(`no project ${row.slug} in work-data`);

  const frame = chooseFrame(project, pinned);
  if (!frame) throw new Error(`no frame with alt text in ${row.slug}`);

  const stem = path.basename(frame.src, path.extname(frame.src));
  const srcAbs = path.join(JG, 'public', frame.src.replace(/^\//, ''));
  const outDir = path.join(V4, 'public/work', row.slug);
  const widths = derive(srcAbs, outDir, stem, frame.width);

  /* The scale the chosen widths were actually written at, so width and height on the
     img element describe the file the browser gets rather than the 2500px original. */
  const fallback = widths.includes(FALLBACK_WIDTH) ? FALLBACK_WIDTH : widths[0];
  const ratio = frame.height / frame.width;

  return {
    slug: row.slug,
    name: row.name,
    num: row.num,
    src: `/work/${row.slug}/${stem}-w${fallback}.webp`,
    srcSet: widths.map((w) => `/work/${row.slug}/${stem}-w${w}.webp ${w}w`).join(', '),
    width: fallback,
    height: Math.round(fallback * ratio),
    color: frame.color,
    alt: frame.alt || writtenAlt || '',
  };
}

const hero = build(PICKS.hero);
const work = PICKS.work.map(build);
const studio = build(PICKS.studio);

/*  ---------------------------------------------------------------------------
 *  The films.
 *
 *  The Motion page on juliangigola.com embeds from YouTube and Vimeo rather than
 *  hosting masters, and PLCBO does the same: the clients already have these on their
 *  own channels, and an embed plays the copy with the client's view count on it.
 *
 *  What is derived here is the poster. Six of the eight carry a still Julian kept
 *  with the app; three point at YouTube's own thumbnail, which is a third-party URL
 *  and does not belong in the markup of this site, so those are fetched once here and
 *  served from public/films/ like everything else.
 *  --------------------------------------------------------------------------- */
const SITE_JSON = path.join(JG, 'content/site.json');
const CACHE = path.join(V4, '.cache/films');

/* The reel, which is not one of the films in a section: it is the argument for the
   page and there is exactly one of it. Same values as the JG site's own REEL. */
const REEL_SOURCE = {
  id: 'vimeo-895502238',
  title: "Director's Reel",
  provider: 'vimeo',
  videoId: '895502238',
  section: 'reel',
  poster: '/films/directors-reel.jpg',
};

/*  youtube-nocookie because the ordinary domain sets an advertising cookie on load
    and this site has no banner to justify one, dnt=1 on Vimeo for the same reason.
    Autoplay is on because the click was the press of play: a second one would be the
    site not listening. Built here so the component carries no URL logic. */
function embedUrl(film) {
  return film.provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${film.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : `https://player.vimeo.com/video/${film.videoId}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`;
}

function watchUrl(film) {
  return film.provider === 'youtube'
    ? `https://www.youtube.com/watch?v=${film.videoId}`
    : `https://vimeo.com/${film.videoId}`;
}

/** The client as a credit, unless the title already names them. */
function creditOf(film) {
  return film.client && !film.title.toLowerCase().startsWith(film.client.toLowerCase())
    ? film.client
    : undefined;
}

async function posterSource(film) {
  if (film.poster && film.poster.startsWith('/')) {
    return path.join(JG, 'public', film.poster.replace(/^\//, ''));
  }

  /* No still kept with the app, so the poster is YouTube's. Fetched once, into its
     own directory, and handed to ffmpeg as a path argument. */
  fs.mkdirSync(CACHE, { recursive: true });
  const cached = path.join(CACHE, `${film.videoId}.jpg`);
  if (fs.existsSync(cached)) return cached;

  const url = film.poster || `https://i.ytimg.com/vi/${film.videoId}/maxresdefault.jpg`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`poster for ${film.title}: ${url} returned ${response.status}`);
  fs.writeFileSync(cached, Buffer.from(await response.arrayBuffer()));
  return cached;
}

async function buildFilm(film) {
  const source = await posterSource(film);
  const probe = execFileSync(
    'ffprobe',
    ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
     '-of', 'csv=p=0', source],
    { encoding: 'utf8' },
  ).trim();
  const [sourceWidth, sourceHeight] = probe.split(',').map(Number);

  const stem = film.id;
  const outDir = path.join(V4, 'public/films');
  const widths = derive(source, outDir, stem, sourceWidth);
  const fallback = widths.includes(FALLBACK_WIDTH) ? FALLBACK_WIDTH : widths[0];
  const ratio = sourceHeight / sourceWidth;

  return {
    id: film.id,
    title: film.title,
    credit: creditOf(film) ?? null,
    year: film.year ?? null,
    section: film.section,
    provider: film.provider,
    embedUrl: embedUrl(film),
    watchUrl: watchUrl(film),
    poster: {
      src: `/films/${stem}-w${fallback}.webp`,
      srcSet: widths.map((w) => `/films/${stem}-w${w}.webp ${w}w`).join(', '),
      width: fallback,
      height: Math.round(fallback * ratio),
    },
  };
}

const site = JSON.parse(fs.readFileSync(SITE_JSON, 'utf8'));
const reel = await buildFilm(REEL_SOURCE);
const films = [];
for (const film of site.videos) films.push(await buildFilm(film));

const filmsTs = `/*  GENERATED by scripts/frames.mjs. Do not edit by hand.
 *
 *  The films are the Motion page's, read from the juliangigola.com content file. The
 *  masters stay on YouTube and Vimeo; what is served from here is the poster and the
 *  arrangement, and no third-party frame loads until somebody presses play.
 */

export type Film = {
  id: string;
  title: string;
  /** The artist or the brand, unless the title already names them. */
  credit: string | null;
  year: number | null;
  section: 'reel' | 'music' | 'commercial';
  provider: 'youtube' | 'vimeo';
  /** Built at derive time, so nothing on the page assembles a provider URL. */
  embedUrl: string;
  watchUrl: string;
  poster: { src: string; srcSet: string; width: number; height: number };
};

export const REEL: Film = ${JSON.stringify(reel, null, 2)};

export const FILMS: Film[] = ${JSON.stringify(films, null, 2)};
`;

fs.writeFileSync(path.join(V4, 'src/lib/films.ts'), filmsTs, 'utf8');

const ts = `/*  GENERATED by scripts/frames.mjs. Do not edit by hand.
 *
 *  Change which photographs the page uses by editing PICKS in that script and
 *  running "npm run frames". The alt text is Julian's own, carried over from the
 *  juliangigola.com library unchanged.
 */

export type Frame = {
  slug: string;
  name: string;
  /** Its number on the contact sheet, so a frame on screen can be named in one word. */
  num: number;
  src: string;
  srcSet: string;
  width: number;
  height: number;
  /** The frame's dominant colour, used as the placeholder so nothing shifts on load. */
  color: string;
  alt: string;
};

export const HERO_FRAME: Frame = ${JSON.stringify(hero, null, 2)};

export const WORK_FRAMES: Frame[] = ${JSON.stringify(work, null, 2)};

export const STUDIO_FRAME: Frame = ${JSON.stringify(studio, null, 2)};
`;

fs.writeFileSync(path.join(V4, 'src/lib/frames.ts'), ts, 'utf8');

console.log(`hero   ${hero.num} ${hero.name} ${hero.src}`);
for (const f of work) console.log(`work   ${f.num} ${f.name} ${f.src}`);
console.log(`studio ${studio.num} ${studio.name} ${studio.src}`);
console.log(`reel   ${reel.title} ${reel.poster.src}`);
for (const film of films) console.log(`film   ${film.section.padEnd(10)} ${film.title}`);
