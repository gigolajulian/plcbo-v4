import { Capabilities } from '@/components/sections/capabilities';
import { Contact } from '@/components/sections/contact';
import { Engagements } from '@/components/sections/engagements';
import { Footer } from '@/components/sections/footer';
import { Hero } from '@/components/sections/hero';
import { Motion } from '@/components/sections/motion';
import { Nav } from '@/components/sections/nav';
import { Studio } from '@/components/sections/studio';
import { Work } from '@/components/sections/work';

/*  PLAN section 2, in order.
 *
 *  Read as one argument: say what this is, show the stills and then the films before
 *  making any claim about either, name who already commissioned them, say what can be
 *  commissioned, show who makes it, then ask.
 *
 *  What is not here is as deliberate as what is. No internal-works cards, no awards
 *  row, no Featured News, no Offices, no Initiatives. Every one of those exists on the
 *  reference because that studio has the thing, and filling the slot without the thing
 *  is the fastest way to make a seven-client studio look like it is pretending to be a
 *  two-hundred-person one. The reel is the exception that proves it: it is in, because
 *  it exists.
 */
export default function App() {
  return (
    <>
      <a
        /* First in the DOM, visible only on focus. The nav is four links, but the
           photographs between the sections make for a long tab trip without it. */
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-eyebrow focus:uppercase focus:text-ground"
        href="#work"
      >
        Skip to the work
      </a>

      <Nav />

      <main id="top">
        <Hero />
        <Work />
        <Motion />
        <Engagements />
        <Capabilities />
        <Studio />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
