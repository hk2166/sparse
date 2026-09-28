"use client";

import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

/**
 * Four separate links, sentence case (docs/Idea.md §1). They are laid out with
 * spacing — never joined with middle dots.
 */
const LINKS = [
  { label: "Products", href: "#products" },
  { label: "Method", href: "#method" },
  { label: "Open source", href: "#open-source" },
  { label: "Contact", href: "#contact" },
];

const CTA = { label: "Tell us what hurts", href: "#contact" };

export function SiteHeader() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        // Transparent over the hero; earns a surface only once you leave it.
        scrolled || open
          ? "border-b border-border bg-card/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:h-18 sm:px-8">
        <a
          href="#top"
          className="font-heading text-xl tracking-tight text-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-2xl"
        >
          TheSparseLabs
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <a
            href={CTA.href}
            className="hidden min-h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:inline-flex"
          >
            {CTA.label}
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          >
            {open ? (
              <XIcon className="size-[1.15rem]" />
            ) : (
              <MenuIcon className="size-[1.15rem]" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="site-menu"
          className="border-t border-border bg-card/95 backdrop-blur-md md:hidden"
        >
          <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            ))}

            <a
              href={CTA.href}
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {CTA.label}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
