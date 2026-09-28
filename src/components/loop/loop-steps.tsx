"use client";

import { motion, useReducedMotion } from "motion/react";

type LoopStep = {
  /**
   * Rendered literally rather than derived from the index, so the numeral is
   * greppable against docs/Idea.md when the script changes.
   */
  readonly marker: string;
  readonly title: string;
  readonly body: string;
};

/** docs/Idea.md §4, steps 1–4, transcribed verbatim. */
const STEPS: readonly LoopStep[] = [
  {
    marker: "01",
    title: "Notice",
    body: "We start from friction, not from ideas. Someone doing real work hits the same wall for the fourth time and works around it instead of complaining. That workaround is the brief.",
  },
  {
    marker: "02",
    title: "Cut",
    body: "Then we take things away. What is the smallest version that actually ends the problem? If the answer needs a roadmap, it’s the wrong problem or we haven’t understood it yet.",
  },
  {
    marker: "03",
    title: "Ship",
    body: "Fifteen days, and it goes out. Small enough to finish, real enough to use. Not a beta list, not a waitlist — a thing you can open.",
  },
  {
    marker: "04",
    title: "Listen",
    body: "Then we find out whether we were right. People use it or they don’t, and both answers are useful. Some products get a second fifteen days. Some get put down.",
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DURATION = 0.75;

/**
 * The rail and markers sit in this fixed-width column, and the column's
 * left offset has to agree with each row's left padding or the numerals
 * collide with the titles. Both live here so they move together.
 */
const GUTTER = "absolute inset-y-0 left-6 w-8 sm:left-10";
const ROW_PADDING = "px-6 py-10 pl-20 sm:px-10 sm:py-12 sm:pl-24";
/** Vertical offset of a marker inside its row — matches the row's top padding. */
const MARKER_TOP = "top-10 sm:top-12";

export function LoopSteps() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-12 border border-border sm:mt-16">
      {/*
        role="list" is not redundant: Safari strips list semantics from any list
        with list-style: none, which the Tailwind reset applies here. Without it
        the four steps announce as loose paragraphs and the ordering — the whole
        reason this section is a sequence — is lost.
      */}
      <ol role="list" className="list-none">
        {STEPS.map((step, index) => (
          <li key={step.marker} className={`relative ${ROW_PADDING}`}>
            <div aria-hidden className={GUTTER}>
              {/*
                One rail segment per row rather than a single full-height rail.
                A rail spanning all four rows is ~1400px tall, so no sensible
                viewport threshold is ever satisfied and it would never animate.
                The first row's segment starts at its marker — a stub above 01
                would read as a cut line, not as a loop arriving.
              */}
              <motion.div
                className={`absolute bottom-0 left-1/2 w-px origin-top -translate-x-1/2 bg-border ${
                  index === 0 ? MARKER_TOP : "top-0"
                }`}
                initial={reduceMotion ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                // 0.35, not the 0.6 used in §3: these rows carry full
                // paragraphs and one row can exceed a phone viewport, where a
                // 0.6 threshold never resolves and the row stays invisible.
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: DURATION, ease: EASE }}
                style={reduceMotion ? { scaleY: 1 } : undefined}
              />

              {/* bg-card punches the hole the rail passes behind. It is tied to
                  the section's surface — change one and change the other. */}
              <motion.span
                className={`absolute inset-x-0 flex size-8 items-center justify-center rounded-full border border-border bg-card font-mono text-xs text-muted-foreground ${MARKER_TOP}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: DURATION, delay: 0.08, ease: EASE }}
                style={reduceMotion ? { opacity: 1 } : undefined}
              >
                {step.marker}
              </motion.span>
            </div>

            {/*
              Three columns on desktop — numeral, title, paragraph. §3 is a
              two-column grid with a word in the gutter; keeping the rhythms
              different is what stops the two sections rhyming.
            */}
            <div className="md:grid md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-x-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
              <motion.h3
                className="font-heading text-2xl leading-tight text-foreground sm:text-3xl"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: DURATION, delay: 0.14, ease: EASE }}
                style={reduceMotion ? { opacity: 1 } : undefined}
              >
                {step.title}
              </motion.h3>

              <motion.p
                className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:mt-0"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: DURATION, delay: 0.2, ease: EASE }}
                style={reduceMotion ? { opacity: 1 } : undefined}
              >
                {step.body}
              </motion.p>
            </div>
          </li>
        ))}
      </ol>

      {/*
        Outside the <ol> on purpose: this is not a fifth step, it is step one
        coming back round. The rail goes dashed, bends off its axis and returns
        to it, and the marker is the same 01 as the top of the list but hollow —
        the loop closing rather than the sequence continuing.
      */}
      <div className={`relative ${ROW_PADDING}`}>
        <div aria-hidden className={GUTTER}>
          {/* h-10/sm:h-12 matches MARKER_TOP, so the tail lands exactly on the
              ring rather than floating above it or overshooting. */}
          <svg
            className="absolute left-0 top-0 h-10 w-8 text-border sm:h-12"
            viewBox="0 0 32 48"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M16 0 V12 C16 20 26 18 26 26 C26 34 16 32 16 40 V48"
              stroke="currentColor"
              strokeWidth={1}
              strokeDasharray="3 4"
              // Keeps the hairline a hairline despite the squashed viewBox.
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Hollow where the four above are filled with a numeral. */}
          <span
            className={`absolute inset-x-0 size-8 rounded-full border border-border bg-card ${MARKER_TOP}`}
          />
        </div>

        {/* Heading weight, foreground colour: §3 gives its turn line the same
            treatment, and this is the line the section is actually for. */}
        <motion.p
          className="max-w-2xl text-balance font-heading text-xl leading-snug text-foreground sm:text-2xl"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: DURATION, delay: 0.2, ease: EASE }}
          style={reduceMotion ? { opacity: 1 } : undefined}
        >
          We run them again the moment we’re done.
        </motion.p>
      </div>
    </div>
  );
}
