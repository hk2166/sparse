import { ProductShapes } from "@/components/products/product-shapes";
import { TextHighlight } from "@/components/wensity/text-highlight";
import { Heading, Lead } from "@/components/wensity/typography";

/**
 * docs/Idea.md §5. This is the section that licenses everything else — it is
 * why a whiteboard, a shop till and a search API can sit on one page without
 * the reader wondering what kind of company this is. Copy is verbatim.
 *
 * No id here. The header's Products link belongs to §6, the ledger of things
 * actually shipped; §5 is shapes, and pointing the nav at it would send
 * someone looking for products to a page of categories.
 */
export function Products() {
  return (
    // Loop is bg-card; dropping back to bg-background continues the
    // alternation that separates the bands. The seam is ramped, not hard.
    <section className="relative isolate overflow-hidden bg-background px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
      {/* Loop above is --card and this is --background; without this ramp the
          two surfaces meet on a hard horizontal line. Same dissolve as Villain
          uses under the hero. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[linear-gradient(to_bottom,var(--card)_0%,color-mix(in_oklab,var(--card),transparent_45%)_38%,color-mix(in_oklab,var(--card),transparent_80%)_68%,transparent_100%)]" />

      {/* The belt is inside the grid, not full-bleed: it lines up with the
          headline and the closing line rather than running past them. */}
      <div className="mx-auto w-full max-w-4xl">
        <Heading level={2} className="max-w-3xl">
          Whatever{" "}
          <TextHighlight color="var(--primary)">shape</TextHighlight> the
          problem is
        </Heading>

        <Lead className="mt-6 max-w-2xl">
          The loop doesn’t care what form the answer takes. Some problems need
          an application. Some need one endpoint. Some need a command you type
          once and forget about.
        </Lead>

        <ProductShapes />

        {/* Outside the belt because it comments on all five, not any one. */}
        <Lead className="mt-14 max-w-2xl sm:mt-16">
          We pick the shape after we understand the problem, never before.
          Deciding you’re building a mobile app and then going looking for a
          reason is how the year-long roadmaps start.
        </Lead>
      </div>
    </section>
  );
}
