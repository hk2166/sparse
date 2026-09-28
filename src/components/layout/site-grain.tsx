import { NoiseTexture } from "@/components/ui/noise-texture";

/**
 * One grain layer for the entire site, mounted once in the root layout.
 *
 * It has to sit *above* the page rather than behind it: every section paints an
 * opaque --card or --background of its own and most carry `isolate`, so a layer
 * underneath them would be covered by the first section it met. Painting over
 * the top is also the truer effect — film grain belongs to the image, not to
 * one band of it.
 *
 * `fixed` rather than `absolute` so it spans the viewport without needing to
 * know the document height, and so it costs one rasterisation instead of one
 * per scroll position. z-[60] clears the header's z-50; the grain carries on
 * across it, which is the point. pointer-events-none is what keeps the
 * draggable hero globe and every link underneath reachable.
 *
 * Opacity is well below the primitive's default: the component's own 50/75 is
 * tuned for a decorative panel, and at that strength over body copy it reads
 * as a dirty screen. These values are visible on large flat areas and
 * effectively invisible on text.
 */
export function SiteGrain() {
  return (
    <NoiseTexture
      aria-hidden
      className="fixed inset-0 z-[60] h-screen opacity-[0.15] dark:opacity-[0.22]"
    />
  );
}
