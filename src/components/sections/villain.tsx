import { TextHighlight } from "@/components/wensity/text-highlight";
import { VillainFeed } from "@/components/villain/villain-feed";
import { Heading } from "@/components/wensity/typography";

/**
 * docs/Idea.md §3. The job of this section is to name both failure modes — the
 * slow one and the slop one — before the page asks the reader to believe
 * anything about us.
 *
 * Deliberately not a timeline: §4 is the genuine sequence and owns that shape.
 * This is a queue, running on a loop, and it makes its case by what goes past
 * rather than by explaining itself. The timestamp column is the whole
 * argument: months, then minutes, then days.
 *
 * Two earlier versions are worth not going back to. The first drew three bars
 * comparing the durations, which could only say one is longer than another —
 * something a caption already says in words. The second put three feeds in
 * three bento cards with the script's paragraphs underneath; the cards fought
 * each other for the same point and the paragraphs said out loud what the rows
 * were already showing.
 */
export function Villain() {
  return (
    <section className="relative isolate bg-background px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
      {/*
        Dissolves the seam with the hero.

        The hero's surface is --card and this one is --background — two
        different values in both themes (dark: 0.1448 against 0.1149) — so they
        used to meet on a hard line just under the globe. The hero's own
        dissolve resolves to --card on purpose, so that it stays independent of
        whatever section follows it; that makes closing the remaining gap this
        section's job, not the hero's.

        Tall enough that the ramp is never visible as a band in its own right.
        Behind the content, above the section's own background.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[linear-gradient(to_bottom,var(--card)_0%,color-mix(in_oklab,var(--card),transparent_45%)_38%,color-mix(in_oklab,var(--card),transparent_80%)_68%,transparent_100%)]"
      />

      <div className="mx-auto w-full max-w-4xl">
        <Heading level={2} className="max-w-3xl">
          Most software arrives{" "}
          {/* The phrase kept short on purpose: the host is inline-block, so a
              long one shrink-wraps to the remaining line width and wraps
              inside itself mid-sentence. Two words also hit harder. */}
          <TextHighlight color="var(--primary)">too late</TextHighlight> to
          matter.
        </Heading>

        {/*
          Feed left, and the right column is deliberately empty for now — it is
          where the counterpart visual lands. Until something is actually in it
          this is one column of content with air beside it, which is the honest
          state; a placeholder box would only look unfinished.
        */}
        <div className="mt-12 grid gap-10 sm:mt-16 md:grid-cols-2 md:items-start md:gap-12">
          <VillainFeed />
        </div>
      </div>
    </section>
  );
}
