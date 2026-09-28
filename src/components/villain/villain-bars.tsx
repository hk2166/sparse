"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * docs/Idea.md §3 as a scale rather than prose columns.
 *
 * On the bar widths: these are illustrative, not to scale. A true linear axis
 * puts fifteen days at 4% of a year and an afternoon at 0.07% — both bars
 * vanish, and the whole point is that you can see fifteen days sitting between
 * the two failures. So the ordering is truthful and the real durations are in
 * the labels, but the widths are drawn for legibility. There is deliberately no
 * axis, no ticks and no percentage anywhere: this is a diagram making an
 * argument, not a chart claiming a measurement.
 */
const ROWS = [
  {
    label: "a year",
    width: "100%",
    // Hatched rather than solid — a year of roadmap is mostly waiting, and a
    // solid block would read as a year of work.
    fill: "border border-border bg-[repeating-linear-gradient(135deg,color-mix(in_oklab,var(--muted-foreground),transparent_58%)_0_2px,transparent_2px_7px)]",
    body: "A year of roadmap. Two quarters of discovery. A launch that finally answers a question the customer stopped asking in month three. We’ve worked inside that, and the waste isn’t the money — it’s watching a real problem sit there, unfixed, while everyone aligns.",
    kept: false,
  },
  {
    label: "an afternoon",
    width: "5%",
    fill: "bg-muted-foreground/45",
    body: "The opposite failure is just as bad. Something generated in an afternoon, shipped without ever meeting the person it was supposedly for, solving nothing. Fast is only worth anything when it’s pointed at something true.",
    kept: false,
  },
  {
    label: "fifteen days",
    width: "22%",
    // The only bar in --primary. Two greys and a colour is the argument.
    fill: "bg-primary",
    body: "So we kept the speed and added the constraint.",
    kept: true,
  },
] as const;

export function VillainScale() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-12 sm:mt-16">
      {ROWS.map((row, index) => (
        <div
          key={row.label}
          className="grid gap-y-4 border-t border-border py-9 last:border-b sm:py-11 md:grid-cols-[8rem_1fr] md:gap-x-10"
        >
          {/* Mono because it is a measurement. Lowercase — the voice rules rule
              out ALL-CAPS labels, and a measure doesn't need shouting. */}
          <span className="font-mono text-xs text-muted-foreground md:pt-1">
            {row.label}
          </span>

          <div>
            {/* The track is what makes the afternoon bar legible: 5% of a
                visible span reads as tiny, 5% of nothing reads as a dash. */}
            <div className="h-3 w-full rounded-sm bg-border/45">
              <motion.div
                className={`h-full rounded-sm ${row.fill}`}
                // Animating width rather than scaleX: scaling would skew the
                // hatch pattern on the first bar while it grows.
                initial={reduceMotion ? false : { width: 0 }}
                whileInView={{ width: row.width }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.75,
                  delay: index * 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={reduceMotion ? { width: row.width } : undefined}
              />
            </div>

            {row.kept ? (
              /* The turn in the argument, and the hand-off into §4. Heading
                 weight and foreground colour because it is the thing we want
                 kept — it earns more than the two failures above it. */
              <p className="mt-7 max-w-2xl text-balance font-heading text-xl leading-snug text-foreground sm:text-2xl lg:text-3xl">
                {row.body}
              </p>
            ) : (
              <p className="mt-7 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {row.body}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
