import { HeroGlobe } from "@/components/hero/hero-globe";
import { HeroHeadline } from "@/components/hero/hero-headline";
import { HexagonPattern } from "@/components/ui/hexagon-pattern";
import { CoolButton } from "@/components/wensity/cool-button";

export function Hero() {
  return (
    // One surface. The globe is cropped by the section's own bottom edge.
    <section className="relative isolate flex min-h-[min(92svh,60rem)] flex-1 flex-col items-center overflow-hidden bg-card px-5 pt-24 sm:px-8 sm:pt-32 lg:pt-36">
      {/* Honeycomb backdrop. Masked so it only reads at the edges and never
          competes with the headline or the globe. */}
      <HexagonPattern
        radius={26}
        gap={2}
        className="-z-10 stroke-foreground/[0.07] fill-none [mask-image:radial-gradient(ellipse_78%_62%_at_50%_38%,transparent_18%,black_78%)]"
      />

      {/* Bottom-anchored and mostly below the fold, so it reads as a horizon
          rather than a ball sitting behind the copy. Draggable. */}
      <HeroGlobe className="-bottom-[52%] z-0 sm:-bottom-[58%]" />

      {/* Keeps the copy legible where it crosses the globe. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[78%] bg-[radial-gradient(ellipse_78%_62%_at_50%_30%,var(--card)_0%,color-mix(in_oklab,var(--card),transparent_22%)_52%,transparent_82%)]"
      />

      {/* pointer-events-none on the wrapper lets clicks in the gaps reach the
          globe; each real element opts back in. */}
      <div className="pointer-events-none relative z-20 flex w-full flex-col items-center text-center">
        {/*
          docs/Idea.md §2 headline is "We ship simple software for painful
          problems." Superseded here by the globe-led line, deliberately.
        */}
        <HeroHeadline />

        <p className="pointer-events-auto mt-7 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:mt-9 sm:text-lg">
          TheSparseLabs is a small product lab. We find what quietly ruins a
          workday and build the smallest thing that stops it.
        </p>

        <div className="pointer-events-auto mt-9 flex w-full flex-col items-center gap-3 sm:mt-11 sm:w-auto sm:flex-row sm:gap-4">
          {/* CoolButton renders an <a> that defaults to target="_blank". */}
          <CoolButton href="#contact" target="_self" className="w-full sm:w-auto">
            Bring us an idea
          </CoolButton>

          <a
            href="#products"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
          >
            See our work
          </a>
        </div>
      </div>
    </section>
  );
}
