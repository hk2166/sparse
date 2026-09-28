import { VillainScale } from "@/components/villain/villain-scale";

/**
 * docs/Idea.md §3. The job of this section is to name both failure modes — the
 * slow one and the slop one — before the page asks the reader to believe
 * anything about us. Copy is verbatim from the script; the only addition is the
 * "fifteen days" row label, which comes from the brand constraint in §2.
 *
 * Deliberately not a timeline: §4 is the genuine sequence and owns that shape.
 * This section is two opposite failures with a position taken between them, so
 * it is drawn as a scale. See VillainScale for how the widths are chosen.
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

        <VillainScale />
      </div>
    </section>
  );
}
