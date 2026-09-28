import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  description: string
  className?: string
  /** Rendered above the text, in flow. Carries its own inset. */
  background?: ReactNode
  Icon?: React.ElementType
  /** Supply href and cta together, or neither — a card with one is a dead end. */
  href?: string
  cta?: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        // minmax rather than a fixed row height: a long paragraph should grow
        // its cell instead of overflowing it. One column until md — the
        // upstream default was bare grid-cols-3 at every width.
        "grid w-full auto-rows-[minmax(16rem,auto)] grid-cols-1 gap-4 md:grid-cols-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => {
  // Both CTA blocks and the hover affordances only exist to reveal a link.
  // Without one, a card that lifts and tints on hover is a broken promise.
  const isLinked = Boolean(href && cta)

  return (
    <div
      key={name}
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
        // Hairline border on --card, matching every other surface on the page.
        // The upstream version stacked two arbitrary box-shadows and a
        // hardcoded rgba border here; a drop shadow would be the only one on
        // the page, and docs/Idea.md forbids the parallel colour system.
        "border border-border bg-card transform-gpu",
        className
      )}
      {...props}
    >
      {background ? <div>{background}</div> : null}

      <div className="p-4">
        <div
          className={cn(
            "pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300",
            isLinked && "lg:group-hover:-translate-y-10"
          )}
        >
          {Icon ? (
            <Icon className="h-12 w-12 origin-left transform-gpu text-muted-foreground transition-all duration-300 ease-in-out group-hover:scale-75" />
          ) : null}
          <h3 className="font-heading text-2xl leading-tight text-foreground">
            {name}
          </h3>
          <p className="max-w-lg text-pretty leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {isLinked ? (
          <div className="pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden">
            <Button variant="link" size="sm" className="pointer-events-auto p-0" render={<a href={href} />} nativeButton={false}>{cta}<ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" /></Button>
          </div>
        ) : null}
      </div>

      {isLinked ? (
        <div className="pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
          <Button variant="link" size="sm" className="pointer-events-auto p-0" render={<a href={href} />} nativeButton={false}>{cta}<ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" /></Button>
        </div>
      ) : null}

      {isLinked ? (
        <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-muted/30" />
      ) : null}
    </div>
  )
}

export { BentoCard, BentoGrid }
