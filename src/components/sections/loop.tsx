import { LoopSteps } from "@/components/loop/loop-steps";

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
      <div className="mx-auto w-full max-w-6xl">
        <h2
          id="loop-heading"
          className="max-w-3xl text-balance font-heading text-[1.75rem] leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          How fifteen days works
        </h2>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Four steps. We run them again the moment we’re done.
        </p>

        <LoopSteps />
      </div>
    </section>
  );
}
