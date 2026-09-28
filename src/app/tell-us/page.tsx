import type { Metadata } from "next";
import Link from "next/link";

import { IdeaForm } from "@/components/ideas/idea-form";

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
        <h1 className="max-w-3xl text-balance font-heading text-[2.25rem] leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Tell us what hurts
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Describe the thing that keeps getting in your way, or the small tool
          you wish existed. Ideas that fit in fifteen days are the ones we
          build.
        </p>

        <div className="mt-10 sm:mt-12">
          <IdeaForm />
        </div>

        <p className="mt-8 text-base text-muted-foreground">
          Curious what others have posted?{" "}
          <Link
            href="/ideas"
            className="text-foreground underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            See the ideas wall
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
