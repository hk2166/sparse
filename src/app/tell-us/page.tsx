import type { Metadata } from "next";
import Link from "next/link";

import { IdeaForm } from "@/components/ideas/idea-form";
import { TextHighlight } from "@/components/wensity/text-highlight";
import { Heading, Lead, Muted } from "@/components/wensity/typography";

export const metadata: Metadata = {
  title: "Tell us what hurts — TheSparseLabs",
  description:
    "Describe the thing that keeps getting in your way, or the small tool you wish existed.",
};

export default function TellUsPage() {
  return (
    // Top padding clears the fixed header, which is h-16 sm:h-18.
    <main className="flex-1 bg-background px-5 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-36">
      <div className="mx-auto w-full max-w-4xl">
        <Heading level={1} className="max-w-3xl">
          Tell us{" "}
          {/* Two words on purpose: the host is inline-block, so a longer
              phrase shrink-wraps and wraps inside itself mid-sentence. */}
          <TextHighlight color="var(--primary)">what hurts</TextHighlight>
        </Heading>

        <Lead className="mt-6 max-w-2xl">
          Describe the thing that keeps getting in your way, or the small tool
          you wish existed. Ideas that fit in fifteen days are the ones we
          build.
        </Lead>

        {/* Narrower than the page: form fields read badly at full 4xl width. */}
        <div className="mx-auto mt-10 max-w-2xl sm:mt-12">
          <IdeaForm />
        </div>

        <Muted className="mt-8">
          Curious what others have posted?{" "}
          <Link
            href="/ideas"
            className="text-foreground underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            See the ideas wall
          </Link>
          .
        </Muted>
      </div>
    </main>
  );
}
