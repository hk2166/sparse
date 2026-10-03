"use client";

import {
  EyeIcon,
  FileTextIcon,
  GhostIcon,
  MegaphoneIcon,
  RocketIcon,
  ScissorsIcon,
  SendIcon,
  SparklesIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import { AnimatedList } from "@/components/ui/animated-list";
import { cn } from "@/lib/utils";

/**
 * docs/Idea.md §3, told rather than described.
 *
 * One queue, running forever. The three durations the section used to spell
 * out in three cards are now three runs of rows inside a single stream, and
 * the timestamp column is what carries the argument: read it as it goes past
 * and it runs months, then minutes, then days. Nothing here is labelled "slow"
 * or "wasteful" — the reader does that arithmetic themselves, which is the
 * only way they'll believe it.
 *
 * The order is deliberate and the loop is the point. Ceremony piles up and
 * launches into an empty room; slop ships in an afternoon to nobody; then the
 * same problem goes through the loop and something real lands on day fifteen.
 * Then it starts again, because it does.
 */

type FeedItem = {
  readonly icon: LucideIcon;
  /** Tile classes. Chart tokens only — see the note on TONE. */
  readonly tone: string;
  readonly title: string;
  readonly when: string;
  readonly detail: string;
};

/**
 * On colour: these are the theme's own --chart-1..5 scales, which have a full
 * .dark override in globals.css. Hue deliberately carries no meaning — the
 * light and dark scales do not map onto each other (chart-3 is magenta in
 * light and green in dark), so anything load-bearing would invert on a theme
 * switch. The icon and the timestamp carry the meaning; colour is only here to
 * keep nine rows from reading as one grey wall.
 *
 * Tinted tiles rather than the solid fills of the reference: chart-2 and
 * chart-5 sit around 0.67-0.75 lightness, and a white glyph on those fails
 * contrast in light mode. A 15% wash with the full-strength icon on top reads
 * as colourful at a glance and stays legible in both themes.
 */
const TONE = {
  blue: "bg-chart-1/15 text-chart-1 ring-chart-1/25",
  teal: "bg-chart-2/15 text-chart-2 ring-chart-2/25",
  magenta: "bg-chart-3/15 text-chart-3 ring-chart-3/25",
  amber: "bg-chart-4/15 text-chart-4 ring-chart-4/25",
  sea: "bg-chart-5/15 text-chart-5 ring-chart-5/25",
  primary: "bg-primary/15 text-primary ring-primary/30",
} as const;

const ITEMS: readonly FeedItem[] = [
  // A year. Ceremony arriving on schedule, launching into a room that emptied
  // in month three.
  {
    icon: UsersIcon,
    tone: TONE.blue,
    title: "Discovery kickoff",
    when: "month 1",
    detail: "Twelve people, one hour",
  },
  {
    icon: FileTextIcon,
    tone: TONE.amber,
    title: "Requirements, revised",
    when: "month 4",
    detail: "Third version this quarter",
  },
  {
    icon: MegaphoneIcon,
    tone: TONE.teal,
    title: "Launch",
    when: "month 11",
    detail: "The question changed in month three",
  },

  // An afternoon. The opposite failure: everything ships, none of it was
  // wanted.
  {
    icon: SparklesIcon,
    tone: TONE.magenta,
    title: "Prompt, then a product",
    when: "2m ago",
    detail: "Nobody ran it past a user",
  },
  {
    icon: RocketIcon,
    tone: TONE.amber,
    title: "Deployed to production",
    when: "31m ago",
    detail: "Forty-one files, none of them read",
  },
  {
    icon: GhostIcon,
    tone: TONE.sea,
    title: "Still nobody has opened it",
    when: "40m ago",
    detail: "It solved nothing",
  },

  // Fifteen days. The turn, and the hand-off into §4 — these three are Notice,
  // Cut and Ship under different names.
  {
    icon: EyeIcon,
    tone: TONE.sea,
    title: "Noticed the friction",
    when: "day 1",
    detail: "Someone's fourth workaround",
  },
  {
    icon: ScissorsIcon,
    tone: TONE.teal,
    title: "Cut to one thing",
    when: "day 4",
    detail: "Everything else waits",
  },
  {
    // The only --primary tile in the stream. One colour among the chart scales
    // marks the row the whole page is arguing for.
    icon: SendIcon,
    tone: TONE.primary,
    title: "Shipped",
    when: "day 15",
    detail: "A thing you can open",
  },
];

export function VillainFeed() {
  return (
    <div
      className={cn(
        // No frame: the rows are already cards, and a border around a column of
        // bordered cards reads as a box someone forgot to remove.
        "relative w-full max-w-md overflow-hidden",
        // Centred while it is the only column; hugs the left once the grid
        // splits and something sits beside it.
        "mx-auto md:mx-0",
        // Fixed height so the section never reflows: rows are added forever,
        // and without a ceiling the page would grow by a row every tick.
        // Roughly five rows and their gaps — see maxVisible below.
        "h-[26rem]",
      )}
    >
      <AnimatedList
        loop
        startOnView
        // One more than the box can show, so the oldest row leaves from behind
        // the fade rather than popping out in view.
        maxVisible={6}
        // Slow enough to read a row before the next one lands on top of it.
        delay={1600}
        // items-stretch: upstream centres its children, which would leave the
        // rows floating in a column narrower than the frame.
        className="items-stretch gap-3"
      >
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className={cn(
              "relative flex items-center gap-3 overflow-hidden rounded-2xl p-4",
              // The glass: a translucent card over the section background with
              // a hairline edge, blurred behind. bg-card/70 rather than a flat
              // fill so the frame's own surface shows through.
              "border border-border bg-card/70 backdrop-blur-md",
              // Lift in light mode, inner top-glow in dark — the reference does
              // both. color-mix keeps them on --foreground instead of a
              // hardcoded rgba, so they re-theme with everything else.
              "shadow-[0_2px_4px_color-mix(in_oklab,var(--foreground),transparent_94%),0_12px_24px_color-mix(in_oklab,var(--foreground),transparent_94%)]",
              "dark:shadow-[inset_0_-20px_80px_-20px_color-mix(in_oklab,var(--foreground),transparent_88%)]",
            )}
          >
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-lg ring-1 ring-inset",
                item.tone,
              )}
            >
              <item.icon className="size-5" strokeWidth={1.75} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm font-medium text-foreground">
                  {item.title}
                </span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {item.when}
                </span>
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {item.detail}
              </span>
            </span>
          </div>
        ))}
      </AnimatedList>

      {/* Fades the oldest rows out at the floor of the frame instead of
          letting them clip on a hard edge. from-background ties it to the
          section's surface — change one and change the other. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  );
}
