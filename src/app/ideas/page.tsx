import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { IdeaWall, IdeaWallSkeleton } from "@/components/ideas/idea-wall";
import { Heading, Lead } from "@/components/wensity/typography";

export const metadata: Metadata = {
  title: "Ideas — TheSparseLabs",
  description:
    "The problems and small tools people have told us about. Ideas that fit in fifteen days are the ones we build.",
};

export default function IdeasPage() {
  return (
    // Top padding clears the fixed header, which is h-16 sm:h-18.
    <main className="flex-1 bg-background px-5 pb-24 pt-28 sm:px-8 sm:pb-32 sm:pt-36">
      <div className="mx-auto w-full max-w-4xl">
        <Heading level={1} className="max-w-3xl">
          What people want built
        </Heading>

        <Lead className="mt-6 max-w-2xl">
          The problems and small tools people have told us about. Ideas that
          fit in fifteen days are the ones we build.
        </Lead>

        {/* From lg up the header carries this button; below that it lives in
            the menu, so the page offers it directly. */}
        <Link
          href="/tell-us"
          className="mt-8 inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl bg-primary px-5 py-2.5 text-base font-medium text-primary-foreground transition-[scale,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
        >
          Tell us what hurts
        </Link>

        <div className="mt-10 sm:mt-12">
          <Suspense fallback={<IdeaWallSkeleton />}>
            <IdeaWall />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
