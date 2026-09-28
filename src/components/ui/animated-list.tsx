"use client"

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react"
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type MotionProps,
} from "motion/react"

import { cn } from "@/lib/utils"

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  // Upstream springs every item in from scale: 0 unconditionally. loop-steps.tsx
  // honours prefers-reduced-motion and so does villain-feed.tsx, and a component
  // that ignored it would be the only one on the page that does. The reduced
  // branch also drops `layout`, or the rows still slide as the stack grows —
  // which is the motion the setting is asking us not to make.
  const animations: MotionProps = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1, originY: 0 },
        exit: { scale: 0, opacity: 0 },
        transition: { type: "spring", stiffness: 350, damping: 40 },
      }

  return (
    <motion.div
      {...animations}
      layout={!reduceMotion}
      className="mx-auto w-full"
    >
      {children}
    </motion.div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  delay?: number
  /**
   * Hold the list empty until it scrolls into view, then fill.
   *
   * Upstream starts its timer on mount, so a list below the fold has finished
   * filling before the reader ever reaches it and lands as a static stack.
   * Defaults to false so any other call site keeps the upstream behaviour.
   *
   * A list using this needs a reserved height on the container: while it is
   * held empty it has no content, and useInView cannot resolve an amount
   * threshold against a zero-height box.
   */
  startOnView?: boolean
  /**
   * Keep emitting forever, wrapping back to the first child.
   *
   * Upstream stops on the last child. Its own docs demo fakes a loop by
   * repeating the array three times, which still runs out — it just runs out
   * off screen. Rows here are keyed by their position in the infinite
   * sequence rather than by the child's own key, so the same child can be on
   * screen twice during a wrap without React collapsing the two.
   */
  loop?: boolean
  /**
   * How many rows stay mounted while looping. Anything past this exits at the
   * bottom, so it wants to be one or two more than the container can show —
   * the surplus leaves out of sight rather than popping in the reader's face.
   */
  maxVisible?: number
}

export const AnimatedList = React.memo(
  ({
    children,
    className,
    delay = 1000,
    startOnView = false,
    loop = false,
    maxVisible = 6,
    ...props
  }: AnimatedListProps) => {
    // Counts items emitted, not the index of a child: with `loop` it climbs
    // past the end of the array and the child is looked up modulo its length.
    const [cursor, setCursor] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const reduceMotion = useReducedMotion()
    // once: true matches viewport={{ once: true }} in loop-steps.tsx. The fill
    // is a one-time reveal, not something that replays every time the section
    // scrolls back past.
    const inView = useInView(ref, { once: true, amount: 0.3 })
    // Reduced motion skips the gate as well as the springs. The rows carry
    // content, not decoration, so withholding them behind a scroll trigger and
    // a timer would hide real text from anyone who asked for less movement.
    const running = reduceMotion || !startOnView || inView

    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    )

    useEffect(() => {
      // An endless animation is the exact thing prefers-reduced-motion is
      // asking us to stop, so under it the timer never starts at all.
      if (!running || reduceMotion || childrenArray.length === 0) return
      if (!loop && cursor >= childrenArray.length - 1) return

      const timeout = setTimeout(() => setCursor((prev) => prev + 1), delay)
      return () => clearTimeout(timeout)
    }, [cursor, delay, childrenArray.length, running, reduceMotion, loop])

    const itemsToShow = useMemo(() => {
      // Empty rather than "first item already showing": the stack arriving from
      // nothing is the whole effect, and upstream renders index 0 on mount.
      if (!running) return []
      // No timer under reduced motion, so show the finished list rather than
      // stalling on the first row forever.
      if (reduceMotion) {
        return childrenArray
          .map((node, position) => ({ position, node }))
          .reverse()
      }

      const window = loop ? maxVisible : cursor + 1
      const rows: { position: number; node: React.ReactNode }[] = []
      // Walks backwards from the newest, so index 0 is the row at the top.
      for (let offset = 0; offset < Math.min(window, cursor + 1); offset++) {
        const position = cursor - offset
        rows.push({
          position,
          node: childrenArray[position % childrenArray.length],
        })
      }
      return rows
    }, [cursor, childrenArray, running, reduceMotion, loop, maxVisible])

    return (
      <div
        ref={ref}
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence initial={false}>
          {itemsToShow.map(({ position, node }) => (
            <AnimatedListItem key={position}>{node}</AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"
