/*  The page's words.
 *
 *  Written in the reference's format and in Julian's voice, which are two different
 *  things and both had to be obeyed.
 *
 *  The format, read off the reference rather than guessed: a short declarative set in
 *  capitals, then one or two sentences of plain present-tense prose saying what the
 *  company is and what it does. No adjective stacking, no slogan, no sentence that
 *  needs a comma to hold two ideas together.
 *
 *  The voice is his house style with one deliberate exception: short declaratives,
 *  concrete nouns, no em dashes, no exclamation marks, no closing flourish, but first
 *  person plural rather than singular. His standing rule for juliangigola.com is "I",
 *  never "we", because that site is one photographer. PLCBO is a collective and he
 *  has said "we" is right for it, so the page speaks as the studio.
 *
 *  That moves one fact. "Twenty years behind the camera" was safe attached to him and
 *  would read as a years-in-business claim attached to "we", so it is pinned to his
 *  name in the same sentence rather than left to float.
 *
 *  The rule the rest of this file follows: nothing here states a year in business, a
 *  project count, a headcount, a response time, an award, a press mention, a
 *  testimonial, a price, or a client outside the seven named below. None of those are
 *  on record, and a studio with seven clients inventing the furniture of a
 *  two-hundred-person one is the fastest way to read as neither.
 */

export const SITE = {
  name: 'PLCBO',
  /* His own description of what PLCBO is, from his own notes. Not a claim about
     scale, reach or history, so it is safe to set as fact. */
  disciplines: 'Photography, film and direction',
  /* v3 ships this address. Unverified: confirm before the site goes public. */
  email: 'hello@plcbo.co',
};

export const HERO = {
  /*  The reference's hero is one short claim and nothing else. This is the same
      shape: two declaratives, no clause joining them, saying the thing that is
      actually unusual about commissioning here rather than a value statement. */
  statement: 'We direct and shoot. Stills and film come off the same set.',
};

export const STUDIO = {
  /*  Two sentences, their About paragraph's length.
   *
   *  "Led by", not "is": the studio speaks as "we" everywhere else on the page, and a
   *  sentence saying PLCBO is one named person would take that back in the one place
   *  a reader is looking for who makes the work.
   *
   *  "Twenty years behind the camera" is the only claim about time on the page. It
   *  sits inside his name's clause on purpose, because the same words after "we"
   *  would be a years-in-business claim about the studio, which is not on record.
   *  Still the first thing to cut if the page should make no claim about time. */
  body:
    'PLCBO is led by Julian Gigola, twenty years behind the camera. We photograph and ' +
    'direct out of the Bay Area, and we bring in the stylists, models and art ' +
    'directors a shoot needs.',
};

export const CONTACT = {
  /*  Their closing CTA is an instruction, not a pitch, so this is one too. The second
      sentence is there because the brief and the dates alone do not tell you what the
      pictures have to do. */
  invitation: 'Send the brief and the dates. Tell us what the frames are for.',
};

/*  The seven confirmed engagements, and what each one actually was.
 *
 *  Four publish a mark worth committing. The other three publish none anywhere
 *  retrievable: Ukiyo's Unknown has no favicon and no logo asset on its store, and
 *  Jojo's Hot Chicken and SAGO set their names as live type. They sit in the same
 *  ruled row either way, named rather than hidden.
 *
 *  Seven marks dropped into a grid built for twelve reads as a studio padding its
 *  wall, which is worse than showing fewer with confidence. So this is a list of
 *  seven, set as a list of seven, saying what the work was. A logo grid cannot say
 *  that, and it is the thing a brand lead is actually reading for.
 */
export type Engagement = {
  name: string;
  discipline: string;
  /** Path under public/. Absent where the brand publishes no retrievable mark. */
  logo?: string;
  w?: number;
  h?: number;
};

export const ENGAGEMENTS: Engagement[] = [
  { name: 'Google', discipline: 'Photography', logo: '/clients/google.svg', w: 272, h: 92 },
  { name: 'WIRED', discipline: 'Editorial', logo: '/clients/wired.svg', w: 125, h: 25 },
  { name: 'Aurora Solar', discipline: 'Identity, digital', logo: '/clients/aurora-solar.svg', w: 79, h: 14 },
  { name: 'JUBO', discipline: 'Campaign, film', logo: '/clients/jubo.png', w: 640, h: 300 },
  { name: "Ukiyo's Unknown", discipline: 'Art direction' },
  { name: 'SAGO', discipline: 'Identity' },
  { name: "Jojo's Hot Chicken", discipline: 'Photography, digital' },
];

/*  Three capabilities, not six.
 *
 *  The labels are what PLCBO is, in his own words, so they are facts. v3 ran six
 *  services with written-in copy in the first person plural, and both the count and
 *  the voice were inventions: six evenly-weighted rows say none of them is the thing
 *  this studio is for.
 */
export type Capability = { no: string; label: string; body: string };

/*  One line each, in their services register: the work named in concrete nouns, then
    what is actually done to it. No sentence here promises an outcome, and none of the
    three carries a pronoun, so the switch to "we" left them alone. */
export const CAPABILITIES: Capability[] = [
  { no: '01', label: 'Photography', body: 'Editorial, campaign and portrait work, shot and graded here.' },
  { no: '02', label: 'Film', body: 'Music videos and commercials, directed and cut.' },
  { no: '03', label: 'Direction', body: 'Treatment, casting and look, decided before the shoot day.' },
];
