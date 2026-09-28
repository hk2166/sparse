import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { TextHighlight } from "@/components/wensity/text-highlight";
import { VillainBars } from "@/components/villain/villain-bars";

/**
 * docs/Idea.md §3. The job of this section is to name both failure modes — the
 * slow one and the slop one — before the page asks the reader to believe
 * anything about us. Copy is verbatim from the script.
 *
 * Deliberately not a timeline: §4 is the genuine sequence and owns that shape.
 * This is two opposite failures with a position taken between them, so the two
 * failures get identically sized cells — the script says the second is "just
 * as bad", and an asymmetric pair would contradict the sentence — and the
 * resolution spans both.
 *
 * The card headings are the three durations rather than invented titles. They
 * are the only addition to the script, they read in order as a year → an
 * afternoon → fifteen days, and they let the bars behind the last card go
 * unlabelled instead of repeating the same three words twice.
 */
export function Villain() {
  return (
    // Hero is bg-card; dropping to bg-background is what makes this read as a
    // separate band. No top border — the surface change already does that work.
    // The cards then come back up to bg-card, so they read as raised panels
    // without needing a shadow.
    <section className="relative isolate bg-background px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="max-w-3xl text-balance font-heading text-[1.75rem] leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Most software arrives{" "}
          {/* The phrase kept short on purpose: the host is inline-block, so a
              long one shrink-wraps to the remaining line width and wraps
              inside itself mid-sentence. Two words also hit harder. */}
          <TextHighlight color="var(--primary)">too late</TextHighlight> to
          matter.
        </h2>

        {/* md:grid-cols-2 overrides the primitive's md:grid-cols-3 through
            tailwind-merge. Two columns is what makes two equal cells possible. */}
        <BentoGrid className="mt-12 sm:mt-16 md:grid-cols-2">
          <BentoCard
            name="a year"
            className="md:col-span-1"
            description="A year of roadmap. Two quarters of discovery. A launch that finally answers a question the customer stopped asking in month three. We’ve worked inside that, and the waste isn’t the money — it’s watching a real problem sit there, unfixed, while everyone aligns."
          />

          <BentoCard
            name="an afternoon"
            className="md:col-span-1"
            description="The opposite failure is just as bad. Something generated in an afternoon, shipped without ever meeting the person it was supposedly for, solving nothing. Fast is only worth anything when it’s pointed at something true."
          />

          {/* The turn in the argument, and the hand-off into §4. The bars are
              the evidence for it, which is why they sit in this cell and not
              in either of the two above. */}
          <BentoCard
            name="fifteen days"
            className="md:col-span-2"
            background={<VillainBars />}
            description="So we kept the speed and added the constraint."
          />
        </BentoGrid>
      </div>
    </section>
  );
}
