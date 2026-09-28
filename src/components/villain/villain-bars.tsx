"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The three durations in docs/Idea.md §3, drawn to compare.
 *
 * On the widths: these are illustrative, not to scale. A true linear axis puts
 * fifteen days at 4% of a year and an afternoon at 0.07% — both bars vanish,
 * and the whole point is that you can see fifteen days sitting between the two
 * failures. So the ordering is truthful and the real durations are named by
 * the cards this sits inside, but the widths are drawn for legibility. There
 * is deliberately no axis, no ticks and no percentage: a diagram making an
 * argument, not a chart claiming a measurement.
 *
 * The bars carry no labels of their own — the three BentoCard headings ("a
 * year", "an afternoon", "fifteen days") already name them in the same order,
 * and repeating the words here would say everything twice.
 */
const BARS = [
  {
    id: "a year",
    width: "100%",
    // Hatched rather than solid — a year of roadmap is mostly waiting, and a
    // solid block would read as a year of work.
    fill: "border border-border bg-[repeating-linear-gradient(135deg,color-mix(in_oklab,var(--muted-foreground),transparent_58%)_0_2px,transparent_2px_7px)]",
  },
  {
    id: "an afternoon",
    width: "5%",
    fill: "bg-muted-foreground/45",
  },
  {
    id: "fifteen days",
    width: "22%",
    // The only bar in --primary. Two greys and a colour is the argument.
    fill: "bg-primary",
  },
] as const;

export function VillainBars() {
  const reduceMotion = useReducedMotion();

  return (
    // Carries its own inset: BentoCard renders `background` in flow with no
    // padding of its own, and the text below sits in p-4.
    <div className="flex flex-col gap-3 px-4 pt-6" aria-hidden>
      {BARS.map((bar, index) => (
        // The track is what makes the afternoon bar legible: 5% of a visible
        // span reads as tiny, 5% of nothing reads as a dash.
        <div key={bar.id} className="h-3 w-full rounded-sm bg-border/45">
          <motion.div
            className={`h-full rounded-sm ${bar.fill}`}
            // Animating width rather than scaleX: scaling would skew the hatch
            // pattern on the first bar while it grows.
            initial={reduceMotion ? false : { width: 0 }}
            whileInView={{ width: bar.width }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.75,
              delay: index * 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={reduceMotion ? { width: bar.width } : undefined}
          />
        </div>
      ))}
    </div>
  );
}
