import { Iphone } from "@/components/ui/iphone";
import { Safari } from "@/components/ui/safari";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";

/**
 * The five screens behind docs/Idea.md §5, all on the Magic UI device mocks.
 *
 * Magic UI ships Safari, iPhone and Android — there is no MacBook — so the
 * desktop shapes use Safari. Both it and Iphone were patched to take children,
 * because upstream they only accept an image URL and no real screenshots exist
 * yet (§7 still carries a [[TODO]] for the one that will).
 *
 * Every screen is built from theme tokens and carries no figures: docs/Idea.md:5
 * forbids a number that isn't sourced, which rules out the row counts and
 * timings terminal mockups reflexively print. The one concrete detail is the
 * API response's `coverage` field, sourced at docs/Idea.md:186.
 *
 * Each frame is capped at its own natural width. Nothing here should stretch —
 * the deck card sizes to its content, not the other way round.
 */

/** Abstract UI furniture. Rules and blocks, never fake product copy. */
function Bar({ className }: { className?: string }) {
  return <div className={`rounded-full bg-muted-foreground/20 ${className}`} />;
}

export function WebApplicationScreen() {
  return (
    <Safari
      url="a product that lives in a browser"
      idSuffix="web"
      className="w-[20rem]"
    >
      <div className="flex h-full w-full bg-background">
        <div className="flex w-1/4 flex-col gap-2.5 border-r border-border p-3">
          <Bar className="h-2 w-2/3" />
          <Bar className="h-2 w-full" />
          <Bar className="h-2 w-5/6" />
          <Bar className="h-2 w-3/4" />
          <Bar className="h-2 w-1/2" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-border p-3">
            <Bar className="h-2 w-12" />
            <Bar className="h-2 w-8" />
            <div className="ml-auto h-4 w-14 rounded-sm bg-primary/70" />
          </div>
          <div className="grid flex-1 grid-cols-2 gap-2.5 p-3">
            <div className="rounded-sm border border-border" />
            <div className="rounded-sm border border-border" />
            <div className="col-span-2 rounded-sm border border-border" />
          </div>
        </div>
      </div>
    </Safari>
  );
}

export function MobileAppScreen() {
  return (
    // Narrow on purpose: the frame is 433/882, so every extra rem of width
    // costs two of height and the card grows faster than it reads.
    <Iphone idSuffix="mobile" className="w-[6.8rem]">
      <div className="flex h-full w-full flex-col gap-2 bg-background p-2.5 pt-6">
        <Bar className="h-1.5 w-1/2" />
        <div className="h-4 rounded border border-border" />
        {/* Four rows: the screen is ~214px tall at this frame size and five
            would overflow it, which is what cropped the UI before. */}
        {[0, 1, 2, 3].map((row) => (
          <div
            key={row}
            className="flex items-center gap-1.5 rounded border border-border p-1.5"
          >
            <div className="size-3 shrink-0 rounded-full bg-muted" />
            <div className="flex flex-1 flex-col gap-1">
              <Bar className="h-1 w-2/3" />
              <Bar className="h-1 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </Iphone>
  );
}

export function CommandLineScreen() {
  return (
    // h-auto max-h-none override upstream's h-full max-h-100, which made the
    // terminal stretch to whatever box it was dropped in instead of sizing to
    // its four lines. tailwind-merge resolves these over the base classes.
    <Terminal className="h-auto max-h-none w-[20rem] max-w-none">
      <TypingAnimation>$ sparse export --format csv</TypingAnimation>
      <AnimatedSpan className="text-muted-foreground">
        reading invoices
      </AnimatedSpan>
      <AnimatedSpan className="text-muted-foreground">
        wrote invoices.csv
      </AnimatedSpan>
      <AnimatedSpan className="text-foreground">done</AnimatedSpan>
    </Terminal>
  );
}

export function ApiEndpointScreen() {
  return (
    // Same frame as the CLI tab, told apart by what it shows rather than by
    // chrome: a request and a response, not a command that finishes and exits.
    <Terminal className="h-auto max-h-none w-[20rem] max-w-none">
      <TypingAnimation>{'$ curl -s "$API/search?q=..."'}</TypingAnimation>
      <AnimatedSpan className="text-muted-foreground">{"{"}</AnimatedSpan>
      <AnimatedSpan className="text-muted-foreground">
        {'  "results": [...],'}
      </AnimatedSpan>
      {/* The one sourced detail in the section — docs/Idea.md:186. */}
      <AnimatedSpan className="text-foreground">
        {'  "coverage": "partial"'}
      </AnimatedSpan>
      <AnimatedSpan className="text-muted-foreground">{"}"}</AnimatedSpan>
    </Terminal>
  );
}

export function MicroBrowserScreen() {
  return (
    // mode="simple" strips the toolbar down to the address pill — the whole
    // claim is that it opens in a tab and does one thing.
    <Safari
      url="one thing, one tab"
      idSuffix="micro"
      mode="simple"
      className="w-[20rem]"
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-background p-6">
        <div className="h-8 w-2/3 rounded-md border border-border" />
        <div className="h-8 w-24 rounded-md bg-primary/70" />
        <div className="mt-2 w-2/3 border-t border-border pt-3">
          <Bar className="mx-auto h-1.5 w-1/2" />
        </div>
      </div>
    </Safari>
  );
}
