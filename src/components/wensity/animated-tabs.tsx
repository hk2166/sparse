"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** How many cards peek behind the front card. */
const MAX_VISIBLE_DEPTH = 3;

/**
 * Aceternity-style upward stack at rest; hover fans side cards left/right.
 */
const STACK = {
  scaleStep: 0.03,
  yStep: -11,
  opacityStep: 0.08,
} as const;

const FAN = {
  x: 84,
  y: 8,
  rotate: 5.5,
  scale: 0.92,
} as const;

/** Smooth deck motion — low bounce, interruptible spring. */
const DECK_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
  mass: 0.85,
};

/** Opacity settles a touch faster than position so crossfades stay clean. */
const OPACITY_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 34,
  mass: 0.7,
};

function canFineHover() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function stackPose(depth: number, selected: boolean, visible: boolean) {
  const scale = selected ? 1 : 1 - depth * STACK.scaleStep;
  const y = selected ? 0 : depth * STACK.yStep;
  const opacity = !visible
    ? 0
    : selected
      ? 1
      : Math.max(0.82, 1 - depth * STACK.opacityStep);

  return {
    x: 0,
    y,
    scale,
    rotate: 0,
    opacity,
  };
}

/** depth 1 → left, depth 2 → right (inspired by fan-out stacks). */
function fanPose(depth: number, selected: boolean, visible: boolean) {
  if (!visible) {
    return { x: 0, y: 0, scale: 0.92, rotate: 0, opacity: 0 };
  }
  if (selected) {
    return { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
  }

  const side = depth % 2 === 1 ? -1 : 1;
  const rank = Math.ceil(depth / 2);

  return {
    x: side * (FAN.x + (rank - 1) * 36),
    y: FAN.y + (rank - 1) * 6,
    scale: FAN.scale - (rank - 1) * 0.03,
    rotate: side * (FAN.rotate + (rank - 1) * 2),
    opacity: Math.max(0.88, 1 - (rank - 1) * 0.06),
  };
}

export interface AnimatedTabItem {
  readonly id: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  /**
   * Live content for the card's media area. Takes precedence over `image`.
   * Upstream only supported a photo URL; this is what lets the panel host a
   * device mockup instead of a screenshot we would have had to invent.
   */
  readonly content?: React.ReactNode;
  readonly image?: string;
  readonly imageAlt?: string;
}

export interface AnimatedTabsProps {
  /** Tab definitions. Each item drives both the trigger and its panel. */
  readonly tabs: readonly AnimatedTabItem[];
  /** Controlled active tab id. */
  readonly value?: string;
  /** Uncontrolled initial tab id. Defaults to the first tab. */
  readonly defaultValue?: string;
  /** Fires whenever the active tab changes. */
  readonly onValueChange?: (value: string) => void;
  /** Accessible name for the tablist. Upstream hardcoded "Destinations". */
  readonly label?: string;
  readonly className?: string;
}

type ClipRect = {
  left: number;
  width: number;
  listWidth: number;
};

function stackDepth(index: number, activeIndex: number, total: number) {
  return (index - activeIndex + total) % total;
}

function TabCard({
  tab,
  depth,
  selected,
}: {
  tab: AnimatedTabItem;
  depth: number;
  selected: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.35rem]",
        // Hairline border, no drop shadow: nothing else on this page carries
        // one, and the upstream rgba stack is a parallel colour system.
        "border border-border bg-card",
      )}
    >
      {/* Photo — tiny inset from the top/sides of the card */}
      <div className="px-1.5 pt-1.5">
        <div
          className={cn(
            "relative overflow-hidden rounded-[1.05rem] bg-muted/40",
            // Only the photo path gets a forced ratio. Live content sizes
            // itself: a 16/10 box at full deck width is ~640px tall, which
            // left every mockup floating in a void.
            tab.content
              ? "flex items-center justify-center p-5 sm:p-8"
              : "aspect-[16/10]",
          )}
        >
          {tab.content ? (
            tab.content
          ) : tab.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tab.image}
              alt={tab.imageAlt ?? tab.title}
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          {!selected ? (
            <div
              aria-hidden
              className="absolute inset-0 bg-[var(--foreground)]"
              style={{ opacity: Math.min(0.35, 0.08 + depth * 0.1) }}
            />
          ) : null}
        </div>
      </div>

      {/* Copy sits in the card footer, not over the photo */}
      <div className="flex flex-col gap-1.5 px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-3.5">
        <h3 className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-xl">
          <span>{tab.label}</span>
          <span className="mx-1.5 font-normal text-[var(--muted-foreground)]">
            ·
          </span>
          <span className="font-medium text-[var(--muted-foreground)]">
            {tab.title}
          </span>
        </h3>
        {tab.description ? (
          <p className="max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-[15px]">
            {tab.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * AnimatedTabs
 *
 * Clip-path tab chrome (Emil) + upward card stack. Hovering the deck (fine
 * pointers only) fans side cards left/right. Photo stays tight under the top
 * edge; copy is `Label · Title` in the footer.
 */
export function AnimatedTabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  label = "Tabs",
  className,
}: AnimatedTabsProps) {
  const reduceMotion = useReducedMotion();
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(
    () => defaultValue ?? tabs[0]?.id ?? "",
  );
  const activeId = isControlled ? value : uncontrolled;

  const listRef = React.useRef<HTMLDivElement>(null);
  const triggerRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const [clip, setClip] = React.useState<ClipRect>({
    left: 0,
    width: 0,
    listWidth: 0,
  });
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeId),
  );
  const activeTab = tabs[activeIndex] ?? tabs[0];
  const [fanned, setFanned] = React.useState(false);

  const setActive = React.useCallback(
    (nextId: string) => {
      if (nextId === activeId) return;
      if (!tabs.some((tab) => tab.id === nextId)) return;
      if (!isControlled) setUncontrolled(nextId);
      onValueChange?.(nextId);
    },
    [activeId, isControlled, onValueChange, tabs],
  );

  const measureClip = React.useCallback(() => {
    const list = listRef.current;
    const trigger = triggerRefs.current.get(activeId);
    if (!list || !trigger) return;

    const listRect = list.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    setClip({
      left: triggerRect.left - listRect.left,
      width: triggerRect.width,
      listWidth: listRect.width,
    });
  }, [activeId]);

  React.useLayoutEffect(() => {
    measureClip();
  }, [measureClip, tabs]);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => measureClip());
    observer.observe(list);
    for (const node of triggerRefs.current.values()) {
      observer.observe(node);
    }
    return () => observer.disconnect();
  }, [measureClip, tabs]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (tabs.length === 0) return;

    let nextIndex = activeIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      nextIndex = (activeIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    const next = tabs[nextIndex];
    if (!next) return;
    setActive(next.id);
    triggerRefs.current.get(next.id)?.focus();
  };

  if (!activeTab) return null;

  const clipPath =
    clip.width > 0 && clip.listWidth > 0
      ? `inset(0 ${Math.max(0, clip.listWidth - clip.left - clip.width)}px 0 ${clip.left}px round 999px)`
      : "inset(0 100% 0 0 round 999px)";

  const deckTransition = reduceMotion
    ? { duration: 0.01 }
    : DECK_SPRING;

  const opacityTransition = reduceMotion
    ? { duration: 0.01 }
    : OPACITY_SPRING;

  const fanActive = fanned && !reduceMotion;

  const triggerClass = cn(
    "relative shrink-0 rounded-full px-3.5 py-1.5",
    "text-[13px] font-medium tracking-[-0.01em] outline-none select-none",
  );

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cn(
          "relative z-20 mx-auto max-w-full self-center",
          // --primitive-surface-hover is not defined in this project's theme,
          // so upstream's pill resolved to transparent. --muted is.
          "rounded-full border border-border bg-muted p-1",
        )}
      >
        <div ref={listRef} className="relative grid">
          <div className="col-start-1 row-start-1 z-[1] flex min-w-0 gap-0.5">
            {tabs.map((tab) => {
              const selected = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  ref={(node) => {
                    if (node) triggerRefs.current.set(tab.id, node);
                    else triggerRefs.current.delete(tab.id);
                  }}
                  type="button"
                  role="tab"
                  id={`animated-tab-${tab.id}`}
                  aria-selected={selected}
                  aria-controls={`animated-tab-panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    triggerClass,
                    "text-[var(--muted-foreground)]",
                    "transition-[transform,color] duration-100",
                    "ease-[cubic-bezier(0.23,1,0.32,1)]",
                    "active:scale-[0.97]",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                    "motion-reduce:transition-none motion-reduce:active:scale-100",
                    "[@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--foreground)]",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            aria-hidden
            className="pointer-events-none col-start-1 row-start-1 z-[2] overflow-hidden rounded-full"
          >
            <div
              className="will-change-[clip-path]"
              style={{
                clipPath,
                transition: reduceMotion
                  ? undefined
                  : "clip-path 200ms cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              <div className="flex gap-0.5">
                {tabs.map((tab) => (
                  <div
                    key={`active-${tab.id}`}
                    className={cn(
                      triggerClass,
                      "bg-[var(--foreground)] text-[var(--background)]",
                    )}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deck — original upward stack at rest; hover fans left/right */}
      <div
        className="relative w-full pt-9"
        onMouseEnter={() => {
          if (canFineHover()) setFanned(true);
        }}
        onMouseLeave={() => setFanned(false)}
      >
        <div className="relative">
          {/*
            Upstream reserved the deck's height with a second, invisible copy of
            the active card. That rendered its content twice — duplicate SVG ids
            in the DOM, and any animation inside it running twice offscreen.
            Instead the selected card sits in normal flow and sets the height;
            only the cards behind it are absolutely positioned.
          */}
          {tabs.map((tab, index) => {
            const depth = stackDepth(index, activeIndex, tabs.length);
            const selected = depth === 0;
            const visible = depth < MAX_VISIBLE_DEPTH;
            const pose = fanActive
              ? fanPose(depth, selected, visible)
              : stackPose(depth, selected, visible);
            const interactive = selected || (fanActive && visible);
            // Tiny stagger on side cards when fanning out / collapsing.
            const fanDelay =
              fanActive && !selected && visible ? depth * 0.035 : 0;

            return (
              <motion.div
                key={tab.id}
                role="tabpanel"
                id={`animated-tab-panel-${tab.id}`}
                aria-labelledby={`animated-tab-${tab.id}`}
                aria-hidden={!selected}
                inert={!interactive ? true : undefined}
                initial={false}
                animate={{
                  opacity: reduceMotion ? (selected ? 1 : 0) : pose.opacity,
                  // Always the same transform channels so stack ↔ fan
                  // retargets smoothly instead of swapping property sets.
                  transform: reduceMotion
                    ? "translate(0px, 0px) rotate(0deg) scale(1)"
                    : `translate(${pose.x}px, ${pose.y}px) rotate(${pose.rotate}deg) scale(${pose.scale})`,
                }}
                transition={{
                  transform: {
                    ...deckTransition,
                    delay: reduceMotion ? 0 : fanDelay,
                  },
                  opacity: {
                    ...opacityTransition,
                    delay: reduceMotion ? 0 : fanDelay,
                  },
                }}
                className={cn(
                  "origin-top will-change-transform",
                  selected
                    ? "relative"
                    : "absolute inset-x-0 top-0",
                  interactive && !selected && "cursor-pointer",
                )}
                style={{
                  zIndex: tabs.length - depth,
                  pointerEvents: interactive ? "auto" : "none",
                }}
                onClick={() => {
                  if (!selected && fanActive) setActive(tab.id);
                }}
              >
                <TabCard tab={tab} depth={depth} selected={selected} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
