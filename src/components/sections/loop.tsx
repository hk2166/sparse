import { LoopSteps } from "@/components/loop/loop-steps";
import { TextHighlight } from "@/components/wensity/text-highlight";
import { Heading, Lead } from "@/components/wensity/typography";

/**
 * docs/Idea.md §4. This is the substrate the rest of the page rests on —
 * without it §6 is a directory of unrelated software. Copy is verbatim from
 * the script.
 *
 * Numbered markers are legitimate here, and only here: docs/Idea.md:111 says
 * it is genuinely a sequence, which is why §3 was built as a scale and left
 * this shape alone.
 *
 * Deliberately no dates and no images. The script supplies neither, and
 * docs/Idea.md:5 forbids any number that isn't sourced — labelling the steps
 * "Day 1 / Day 5 / Day 15" would be publishing a guess. A photograph of
 * "Notice" would be decoration claiming to be evidence, which is the failure
 * §3 just spent a section naming.
 */
export function Loop() {
  return (
    // bg-card, with §5 below on bg-background — the surface change is what
    // separates the bands, so there is no top border. While §3 is parked this
    // section follows the hero, which is also bg-card; the hero's bottom fade
    // resolves to its own surface, so the two meet with nothing to see.
    //
    // id="method" makes the header's Method link live — it had no target.
    // scroll-mt clears the fixed header, which is h-16 sm:h-18.
    <section
      id="method"
      aria-labelledby="loop-heading"
      className="relative isolate scroll-mt-20 overflow-hidden bg-card px-5 py-24 sm:scroll-mt-24 sm:px-8 sm:py-32 lg:py-40"
    >
      {/* Dissolves the seam with the section above, the same way Villain does
          for the hero: that one is --background and this is --card, so they
          otherwise meet on a hard line. Resolves to the incoming colour, tall
          enough that the ramp never reads as a band of its own. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[linear-gradient(to_bottom,var(--background)_0%,color-mix(in_oklab,var(--background),transparent_45%)_38%,color-mix(in_oklab,var(--background),transparent_80%)_68%,transparent_100%)]" />

      <div className="mx-auto w-full max-w-4xl">
        <Heading level={2} id="loop-heading" className="max-w-3xl">
          How <TextHighlight color="var(--primary)">fifteen days</TextHighlight>{" "}
          works
        </Heading>

        <Lead className="mt-6 max-w-2xl">
          Four steps. We run them again the moment we’re done.
        </Lead>

        <LoopSteps />
      </div>
    </section>
  );
}
