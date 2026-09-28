import type { ReactNode } from "react";

import { Marquee } from "@/components/ui/marquee";
import {
  ApiEndpointScreen,
  CommandLineScreen,
  MicroBrowserScreen,
  MobileAppScreen,
  WebApplicationScreen,
} from "@/components/products/shape-screens";

type Shape = {
  readonly title: string;
  readonly description: string;
  readonly content: ReactNode;
};

/**
 * docs/Idea.md §5, the five shapes, moving past horizontally.
 *
 * A marquee is a better answer to the build note at docs/Idea.md:145 than the
 * tabs this replaced: "five short blocks, equal weight ... alternatives, not a
 * hierarchy". Tabs made one shape selected and hid four behind a click. Here
 * all five are on screen, the same size, in the script's order, and none is
 * the default. pauseOnHover exists so the terminal panes can actually be read.
 *
 * Copy is verbatim.
 */
const SHAPES: readonly Shape[] = [
  {
    title: "Web applications",
    description:
      "Full products that live in a browser. Real software, not a landing page with a form behind it.",
    content: <WebApplicationScreen />,
  },
  {
    title: "Mobile apps",
    description:
      "For the problems that only happen away from a desk. Shops, sites, vans, waiting rooms.",
    content: <MobileAppScreen />,
  },
  {
    title: "Command-line tools",
    description:
      "Sometimes the honest answer to a problem is forty lines you run in a terminal. No dashboard, no account, no onboarding — it just does the thing and exits.",
    content: <CommandLineScreen />,
  },
  {
    title: "API endpoints",
    description:
      "Infrastructure for other people’s software. If the thing that hurts is something your own product needs and can’t get, we’ll build the service rather than the interface.",
    content: <ApiEndpointScreen />,
  },
  {
    title: "Micro-browser products",
    description:
      "Small, single-purpose tools that open in a tab and solve exactly one thing. No signup, no install. You use it, it works, you close it.",
    content: <MicroBrowserScreen />,
  },
];

function ShapeCard({ shape }: { shape: Shape }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col rounded-xl border border-border bg-card p-5 sm:w-[23rem]">
      {/* Fixed band so five frames of different proportions line up. */}
      <div className="flex h-[14rem] items-center justify-center overflow-hidden">
        {shape.content}
      </div>
      <figcaption className="mt-5">
        <h3 className="font-heading text-xl leading-tight text-foreground">
          {shape.title}
        </h3>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
          {shape.description}
        </p>
      </figcaption>
    </figure>
  );
}

export function ProductShapes() {
  return (
    <div className="relative mt-12 sm:mt-16">
      {/* repeat={2} is the minimum for a seamless loop. Upstream defaults to 4,
          which would put four copies of every frame in the DOM for nothing. */}
      <Marquee pauseOnHover repeat={2} className="[--duration:34s] [--gap:1rem]">
        {SHAPES.map((shape) => (
          <ShapeCard key={shape.title} shape={shape} />
        ))}
      </Marquee>

      {/* Edges dissolve into the section surface instead of cutting off. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-background to-transparent sm:w-20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-background to-transparent sm:w-20"
      />
    </div>
  );
}
