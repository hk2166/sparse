"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TextHighlightTrigger = "view" | "hover" | "mount";

export interface TextHighlightProps {
  /** The inline content to highlight. */
  children: React.ReactNode;
  /** Marker color. Defaults to the Wensity brand (chili). */
  color?: string;
  /** Opacity of the marker band. Default: 0.4. */
  opacity?: number;
  /** Seconds for the sweep. Default: 0.9. */
  duration?: number;
  /** Seconds to wait before sweeping. Default: 0. */
  delay?: number;
  /** When to draw. Default: `"view"`. */
  trigger?: TextHighlightTrigger;
  /** Extra px around the text before the band is drawn. Default: 2. */
  padding?: number;
  /**
   * Force the draw state. `true` keeps it drawn, `false` retracted; when
   * omitted the `trigger` drives it. Reduced-motion always draws instantly.
   */
  drawn?: boolean;
  /** Outer element tag. Default: `"span"`. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Tailwind class for the host (size / weight / color of the text). */
  className?: string;
  /** Optional accessible name override for the host. */
  "aria-label"?: string;
}

type Band = { x: number; y: number; w: number; h: number; delay: number };

/** Wensity brand (chili). Falls back to the literal for copied-out source. */
const DEFAULT_COLOR = "var(--color-chili-500, #cd1c18)";

function bandsEqual(a: Band[], b: Band[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const left = a[i];
    const right = b[i];
    if (
      left.x !== right.x ||
      left.y !== right.y ||
      left.w !== right.w ||
      left.h !== right.h ||
      left.delay !== right.delay
    ) {
      return false;
    }
  }
  return true;
}

/**
 * TextHighlight
 *
 * A hand-placed highlighter band that sweeps in behind React text. Tracks
 * wrapping lines and re-fits on resize / font load.
 *
 * Motion contract:
 * - Measures the live text via Range client rects (ResizeObserver, no polling).
 * - Bands paint client-side only (no SSR path → no hydration diff).
 * - Sweep is a compositor `scaleX` from the left — one cheap transition.
 * - `trigger="view"` draws once on-screen; `"hover"` draws and retracts.
 * - Honours `prefers-reduced-motion` by drawing instantly, no transition.
 */
export function TextHighlight({
  children,
  color,
  opacity = 0.4,
  duration = 0.9,
  delay = 0,
  trigger = "view",
  padding = 2,
  drawn,
  as = "span",
  className,
  "aria-label": ariaLabel,
}: TextHighlightProps) {
  const hostRef = React.useRef<HTMLElement | null>(null);
  const textRef = React.useRef<HTMLSpanElement | null>(null);

  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const [bands, setBands] = React.useState<Band[]>([]);
  // `active` tracks only what this component discovers itself (in view, or
  // hovered). The `drawn` prop and trigger="mount" are resolved at render time
  // instead of being mirrored into state by an effect — mirroring them tripped
  // react-hooks/set-state-in-effect and cost an extra render for no gain.
  const [active, setActive] = React.useState(false);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  const fill = color ?? DEFAULT_COLOR;

  // --- Measure text geometry into marker bands -----------------------------
  const measure = React.useCallback(() => {
    const host = hostRef.current;
    const text = textRef.current;
    if (!host || !text || !text.firstChild) return;

    const hostBox = host.getBoundingClientRect();
    if (hostBox.width < 1) return;

    const range = document.createRange();
    range.selectNodeContents(text);
    const lineRects = Array.from(range.getClientRects()).filter((r) => r.width > 1);
    if (lineRects.length === 0) return;

    const stagger = lineRects.length > 1 ? duration * 0.3 : duration * 0.12;
    const next: Band[] = lineRects.map((r, i) => {
      const x = r.left - hostBox.left;
      const y = r.top - hostBox.top;
      // Cover most of the line box and bias the band downward so glyph
      // descenders (p, g, y) sit inside it — a centered band clips them.
      const bandH = r.height * 0.94;
      const topGap = (r.height - bandH) * 0.72;
      return {
        x: x - padding,
        y: y + topGap,
        w: r.width + padding * 2,
        h: bandH,
        delay: delay + i * stagger,
      };
    });

    setSize((prev) =>
      prev.w === hostBox.width && prev.h === hostBox.height
        ? prev
        : { w: hostBox.width, h: hostBox.height },
    );
    setBands((prev) => (bandsEqual(prev, next) ? prev : next));
  }, [padding, delay, duration]);

  React.useLayoutEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) measure();
    };

    run();
    const host = hostRef.current;
    if (!host) return;

    const ro = new ResizeObserver(run);
    ro.observe(host);

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready?.then(run).catch(() => {});

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [measure, children]);

  // --- Reduced motion ------------------------------------------------------
  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // --- Trigger -------------------------------------------------------------
  React.useEffect(() => {
    // Controlled, or drawn from the first frame — nothing to observe.
    if (drawn !== undefined || trigger !== "view") return;
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [trigger, drawn]);

  const isHover = trigger === "hover" && drawn === undefined;
  const hoverProps = isHover
    ? {
        tabIndex: 0 as const,
        onPointerEnter: () => setActive(true),
        onPointerLeave: () => setActive(false),
        onFocus: () => setActive(true),
        onBlur: () => setActive(false),
      }
    : {};

  const Tag = as as unknown as React.ComponentType<
    React.HTMLAttributes<HTMLElement> & { ref?: React.RefCallback<HTMLElement | null> }
  >;

  const show = (drawn ?? (trigger === "mount" || active)) || reduceMotion;
  const ease = "cubic-bezier(.65,0,.35,1)";

  // On dark the band `screen`-blends over near-black, so a flat 0.4 lands dim.
  // Drive it harder there so the ink stays vivid; light keeps the soft marker.
  const darkOpacity = Math.min(0.92, opacity * 1.9);

  return (
    <Tag
      ref={(node) => {
        hostRef.current = node;
      }}
      aria-label={ariaLabel}
      className={cn("relative inline-block", className)}
      style={
        {
          "--wensity-hl-op": opacity,
          "--wensity-hl-op-dark": darkOpacity,
        } as React.CSSProperties
      }
      {...hoverProps}
    >
      {size.w > 0 && bands.length > 0 ? (
        <svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible"
        >
          {bands.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={Math.min(4, b.h / 3)}
              fill={fill}
              // Marker blend: darkens the paper on light, lifts the ink out of
              // the near-black surface on dark (a flat tint would go muddy).
              // Opacity is themed — dark runs hotter so the band stays vivid.
              className="mix-blend-multiply dark:mix-blend-screen [opacity:var(--wensity-hl-op)] dark:[opacity:var(--wensity-hl-op-dark)]"
              style={{
                // fill-box keeps origin relative to the rect across browsers.
                transformBox: "fill-box",
                transformOrigin: "left center",
                transform: show ? "scaleX(1)" : "scaleX(0)",
                transition: reduceMotion
                  ? "none"
                  : `transform ${duration}s ${ease} ${b.delay}s`,
              }}
            />
          ))}
        </svg>
      ) : null}
      <span ref={textRef} className="relative z-[1]">
        {children}
      </span>
    </Tag>
  );
}
