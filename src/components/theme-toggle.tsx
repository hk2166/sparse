"use client";

import { useTheme } from "next-themes";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

const BUTTON_CLASSES =
  "inline-flex size-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:size-[1.15rem]";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  // Left uncontrolled, AnimatedThemeToggler writes its own localStorage entry
  // and would drift from next-themes. Holding the real button until the theme
  // resolves keeps it controlled, and keeps the icon from flipping on hydrate.
  if (!mounted || !resolvedTheme) {
    return (
      <div aria-hidden className={cn(BUTTON_CLASSES, "opacity-0", className)} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <AnimatedThemeToggler
      variant="hexagon"
      duration={400}
      theme={isDark ? "dark" : "light"}
      onThemeChange={(next) => setTheme(next)}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={cn(BUTTON_CLASSES, className)}
    />
  );
}
