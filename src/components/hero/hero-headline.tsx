"use client";

import { useEffect, useState } from "react";

import { TextShimmer } from "@/components/wensity/text-shimmer";
import { TextWordFlip } from "@/components/wensity/text-word-flip";

const FLIP_WORDS = ["products", "software", "businesses", "companies"];

const STATIC_LINE = "We take ideas from across the globe and turn them into real";

/**
 * TextShimmer loops forever by default. One sweep is the entry, so the timer
 * lands exactly on the end of the first cycle — background-position is fully
 * off the text there, which means pausing leaves a clean base fill rather than
 * freezing the band mid-word.
 */
const SHIMMER_SECONDS = 2.6;

export function HeroHeadline() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setIntroDone(true),
      SHIMMER_SECONDS * 1000,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <h1 className="pointer-events-auto max-w-4xl text-balance font-heading text-[2rem] leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-7xl">
      <TextShimmer
        as="span"
        text={STATIC_LINE}
        duration={SHIMMER_SECONDS}
        // Resting fill is the normal headline colour, so when the sweep stops
        // the type just looks like type. The band itself carries the accent.
        baseColor="var(--foreground)"
        shimmerColor="var(--primary)"
        spread={30}
        paused={introDone}
        // The component defaults to inline-block, which makes this an atomic
        // box: it takes the full width, wraps inside itself, and forces the
        // flip word onto a line of its own. Inline lets them share a line and
        // lets the h1's own text-balance do the wrapping. The component
        // already sets box-decoration-break: clone for exactly this case.
        className="inline"
      />{" "}
      {/* Holds on the first word until the sweep finishes, then starts cycling. */}
      <TextWordFlip
        words={FLIP_WORDS}
        duration={3000}
        paused={!introDone}
        className="text-primary"
      />
    </h1>
  );
}
