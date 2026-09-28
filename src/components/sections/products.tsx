import { ProductShapes } from "@/components/products/product-shapes";

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
    // alternation that separates the bands, so no top border.
    <section className="relative isolate overflow-hidden bg-background px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
      {/* The belt is inside the grid, not full-bleed: it lines up with the
          headline and the closing line rather than running past them. */}
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="max-w-3xl text-balance font-heading text-[1.75rem] leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Whatever shape the problem is
        </h2>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          The loop doesn’t care what form the answer takes. Some problems need
          an application. Some need one endpoint. Some need a command you type
          once and forget about.
        </p>

        <ProductShapes />

        {/* Outside the belt because it comments on all five, not any one. */}
        <p className="mt-14 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:mt-16 sm:text-lg">
          We pick the shape after we understand the problem, never before.
          Deciding you’re building a mobile app and then going looking for a
          reason is how the year-long roadmaps start.
        </p>
      </div>
    </section>
  );
}
