/**
 * docs/Idea.md §3. The job of this section is to name both failure modes — the
 * slow one and the slop one — before the page asks the reader to believe
 * anything about us. Copy is verbatim from the script.
 */
export function Villain() {
  return (
    // Hero is bg-card; dropping to bg-background is what makes this read as a
    // separate band. No top border — the surface change already does that work.
    <section className="relative isolate bg-background px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="max-w-3xl text-balance font-heading text-[1.75rem] leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Most software arrives too late to matter.
        </h2>

        {/*
          The two failures sit as equals, divided by a hairline. No "Too slow" /
          "Too fast" labels above them — the second paragraph opens by saying it
          outright, and a label would only restate the sentence.
        */}
        <div className="mt-12 grid border-y border-border py-10 sm:mt-16 sm:py-12 md:grid-cols-2">
          <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:pr-12">
            A year of roadmap. Two quarters of discovery. A launch that finally
            answers a question the customer stopped asking in month three. We’ve
            worked inside that, and the waste isn’t the money — it’s watching a
            real problem sit there, unfixed, while everyone aligns.
          </p>

          {/* Stacked on mobile, so the divider turns horizontal and sits on top. */}
          <p className="mt-8 border-t border-border pt-8 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:mt-0 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            The opposite failure is just as bad. Something generated in an
            afternoon, shipped without ever meeting the person it was supposedly
            for, solving nothing. Fast is only worth anything when it’s pointed
            at something true.
          </p>
        </div>

        {/* The turn in the argument, and the hand-off into §4. Foreground
            weight, not muted, because it is the thing we want kept. */}
        <p className="mt-12 max-w-2xl text-balance font-heading text-xl leading-snug text-foreground sm:mt-16 sm:text-2xl lg:text-3xl">
          So we kept the speed and added the constraint.
        </p>
      </div>
    </section>
  );
}
