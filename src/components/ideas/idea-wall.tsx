import { LightbulbIcon } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";

import { getIdeas } from "@/lib/ideas";
import { describeAge, describeMoment } from "@/lib/relative-time";
import { Heading, Muted } from "@/components/wensity/typography";

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <Muted className="rounded-2xl border border-dashed border-border px-5 py-10 text-center">
      {children}
    </Muted>
  );
}

export function IdeaWallSkeleton() {
  return (
    <div
      aria-hidden
      className="columns-1 gap-4 sm:columns-2 [&>*]:mb-4 [&>*]:break-inside-avoid"
    >
      {[36, 28, 44, 32].map((height, index) => (
        <div
          key={index}
          style={{ height: `${height * 0.25}rem` }}
          className="rounded-2xl bg-muted motion-safe:animate-pulse"
        />
      ))}
    </div>
  );
}

export async function IdeaWall() {
  // Reads the database, so this must run per request, not at build time.
  await connection();

  const result = await getIdeas();

  if (result.status === "not-configured") {
    return <Notice>Ideas will show up here once the wall is switched on.</Notice>;
  }

  if (result.status === "error") {
    return (
      <Notice>
        We couldn&rsquo;t load the ideas just now. Refresh to try again.
      </Notice>
    );
  }

  if (result.ideas.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-5 py-12 text-center">
        <span
          aria-hidden
          className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground"
        >
          <LightbulbIcon className="size-5" />
        </span>
        <Muted>Nothing on the wall yet.</Muted>
        <Link
          href="/tell-us"
          className="text-base font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Be the first to tell us what hurts
        </Link>
      </div>
    );
  }

  return (
    // Columns rather than a grid: cards are different heights, and a grid
    // leaves ragged holes between rows. Reading order runs down each column.
    <ul className="columns-1 gap-4 sm:columns-2">
      {result.ideas.map((idea) => (
        <li
          key={idea.id}
          className="mb-4 break-inside-avoid rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <Heading level={4} asChild>
            <h2>{idea.title}</h2>
          </Heading>
          <Muted className="mt-2 wrap-break-word whitespace-pre-line">
            {idea.details}
          </Muted>
          <p className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{idea.name ?? "Anonymous"}</span>
            <time
              dateTime={idea.createdAt.toISOString()}
              title={describeMoment(idea.createdAt)}
            >
              {describeAge(idea.createdAt)}
            </time>
          </p>
        </li>
      ))}
    </ul>
  );
}
