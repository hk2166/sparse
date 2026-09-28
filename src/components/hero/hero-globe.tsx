"use client";

import { useEffect, useMemo, useState } from "react";
import type { COBEOptions } from "cobe";
import { useTheme } from "next-themes";

import { Globe } from "@/components/ui/globe";
import { readTokenTuple } from "@/lib/canvas-theme";
import { cn } from "@/lib/utils";

/**
 * Bengaluru is the anchor — the lab is built in the open, in India — and the
 * rest are spread wide enough that "ideas from across the globe" is literal
 * rather than decorative.
 */
const MARKERS: COBEOptions["markers"] = [
  { location: [12.9716, 77.5946], size: 0.11 }, // Bengaluru
  { location: [28.6139, 77.209], size: 0.07 }, // Delhi
  { location: [40.7128, -74.006], size: 0.06 }, // New York
  { location: [51.5074, -0.1278], size: 0.06 }, // London
  { location: [-23.5505, -46.6333], size: 0.05 }, // São Paulo
  { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
  { location: [1.3521, 103.8198], size: 0.045 }, // Singapore
  { location: [-33.8688, 151.2093], size: 0.045 }, // Sydney
  { location: [30.0444, 31.2357], size: 0.045 }, // Cairo
  { location: [52.52, 13.405], size: 0.04 }, // Berlin
];

type Palette = {
  dark: boolean;
  globe: [number, number, number];
  accent: [number, number, number];
  glow: [number, number, number];
};

function readPalette(): Palette {
  // Read `dark` off the live class rather than next-themes' resolvedTheme, so
  // the flag can never disagree with the colours read in the same pass.
  const dark = document.documentElement.classList.contains("dark");
  return {
    dark,
    globe: readTokenTuple("--canvas-globe", dark ? "#c9d5f2" : "#ffffff"),
    accent: readTokenTuple("--canvas-accent", dark ? "#ffffff" : "#19398d"),
    glow: readTokenTuple("--canvas-glow", dark ? "#6a8dd8" : "#ffffff"),
  };
}

export function HeroGlobe({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [palette, setPalette] = useState<Palette | null>(null);

  // next-themes swaps the class on <html> in its own effect, so reading the
  // tokens during render returns the *previous* theme's values — that was the
  // dark globe surviving a switch to light. rAF defers the read until the
  // class has landed and styles have been recomputed.
  //
  // Holding the globe until the palette exists also gives its container a
  // resolved width before cobe measures offsetWidth (it only re-measures on
  // window resize, so a zero-width mount would leave it dead).
  useEffect(() => {
    const frame = requestAnimationFrame(() => setPalette(readPalette()));
    return () => cancelAnimationFrame(frame);
  }, [resolvedTheme]);

  const config = useMemo<COBEOptions | null>(() => {
    if (!palette) return null;
    return {
      width: 800,
      height: 800,
      onRender: () => {},
      devicePixelRatio: 2,
      phi: 0,
      theta: 0.28,
      dark: palette.dark ? 1 : 0,
      diffuse: 0.4,
      mapSamples: 16000,
      // baseColor is already a light tone in both themes (see --canvas-globe),
      // so this only trims the dot intensity rather than rescuing it.
      mapBrightness: palette.dark ? 1.6 : 1.2,
      baseColor: palette.globe,
      glowColor: palette.glow,
      markerColor: palette.accent,
      markers: MARKERS,
    };
  }, [palette]);

  return (
    <div
      aria-hidden
      className={cn(
        // Diameter and crown height are separate knobs and they fight. The crown
        // is capped by the room between the buttons and the section bottom; the
        // FRACTION of the sphere that shows is crown/diameter. Shrinking the
        // globe raises that fraction, but once it passes ~50% the crown clears
        // the equator and you get a whole planet behind the copy instead of a
        // horizon. Keep the visible fraction under ~40%.
        "absolute inset-x-0 mx-auto aspect-square w-[min(140%,26rem)] sm:w-[min(115%,48rem)]",
        className,
      )}
    >
      {config ? (
        <Globe
          // Remount so cobe rebuilds with the new palette; its config is only
          // read when the instance is created.
          key={palette?.dark ? "dark" : "light"}
          config={config}
          className="inset-0 max-w-none"
        />
      ) : null}
    </div>
  );
}
