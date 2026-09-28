"use client";

import * as React from "react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Heading — hierarchy across titles and sections                    */
/*  Note: visual `level` may differ from semantic heading tag when    */
/*  using asChild; document that buyers own h1–h6 semantics.          */
/* ------------------------------------------------------------------ */

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level and visual scale (defaults to matching h-tag size). */
  level?: HeadingLevel;
  /** Render as a different element while keeping the level's visual scale. */
  asChild?: boolean;
}

const headingScale: Record<HeadingLevel, string> = {
  1: "text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[40px]",
  2: "text-[26px] font-semibold leading-[1.2] tracking-[-0.018em] sm:text-[32px]",
  3: "text-[21px] font-semibold leading-[1.3] tracking-[-0.012em] sm:text-[24px]",
  4: "text-[17px] font-semibold leading-[1.4] tracking-[-0.006em]",
  5: "text-[15px] font-semibold leading-[1.4] tracking-[-0.003em]",
  6: "text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.02em]",
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, asChild, className, children, ...props }, ref) => {
    const composedClassName = cn(
      "text-balance font-[family-name:var(--primitive-font-display)] text-[var(--foreground)]",
      headingScale[level],
      className,
    );

    const asChildElement =
      asChild && React.isValidElement(children) ? children : null;

    const asChildRendered = useRender({
      enabled: Boolean(asChildElement),
      ref: ref as React.Ref<HTMLElement>,
      render: asChildElement ?? undefined,
      props: {
        "data-wensity-primitive": "",
        className: composedClassName,
        children,
        ...props,
      },
    });

    if (asChildRendered) return asChildRendered;

    const Tag = `h${level}` as const;
    return (
      <Tag
        ref={ref}
        data-wensity-primitive=""
        className={composedClassName}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);
Heading.displayName = "Heading";

/* ------------------------------------------------------------------ */
/*  Lead — emphasized introductory and supporting text                */
/* ------------------------------------------------------------------ */

export interface LeadProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

export const Lead = React.forwardRef<HTMLParagraphElement, LeadProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const composedClassName = cn(
      "text-pretty text-[19px] font-normal leading-[1.6] tracking-[-0.006em]",
      "text-[var(--primitive-text-secondary)]",
      className,
    );

    const asChildElement =
      asChild && React.isValidElement(children) ? children : null;

    const asChildRendered = useRender({
      enabled: Boolean(asChildElement),
      ref: ref as React.Ref<HTMLElement>,
      render: asChildElement ?? undefined,
      props: {
        "data-wensity-primitive": "",
        className: composedClassName,
        children,
        ...props,
      },
    });

    if (asChildRendered) return asChildRendered;

    return (
      <p
        ref={ref}
        data-wensity-primitive=""
        className={composedClassName}
        {...props}
      >
        {children}
      </p>
    );
  },
);
Lead.displayName = "Lead";

/* ------------------------------------------------------------------ */
/*  Muted — secondary text for descriptions and metadata              */
/* ------------------------------------------------------------------ */

export interface MutedProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render (defaults to `p`). */
  as?: "p" | "span" | "div";
  asChild?: boolean;
}

export const Muted = React.forwardRef<HTMLElement, MutedProps>(
  ({ as = "p", asChild, className, children, ...props }, ref) => {
    const composedClassName = cn(
      "text-[13px] font-normal leading-[1.5] tracking-[-0.002em] text-[var(--muted-foreground)]",
      className,
    );

    const asChildElement =
      asChild && React.isValidElement(children) ? children : null;

    const asChildRendered = useRender({
      enabled: Boolean(asChildElement),
      ref: ref as React.Ref<HTMLElement>,
      render: asChildElement ?? undefined,
      props: {
        "data-wensity-primitive": "",
        className: composedClassName,
        children,
        ...props,
      },
    });

    if (asChildRendered) return asChildRendered;

    const Comp = as;
    return (
      <Comp
        ref={ref as React.Ref<HTMLParagraphElement & HTMLSpanElement & HTMLDivElement>}
        data-wensity-primitive=""
        className={composedClassName}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Muted.displayName = "Muted";

/* ------------------------------------------------------------------ */
/*  InlineCode — technical values and code references                 */
/* ------------------------------------------------------------------ */

export interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const InlineCode = React.forwardRef<HTMLElement, InlineCodeProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const composedClassName = cn(
      "rounded-[var(--primitive-radius-control-sm)] border px-[0.4em] py-[0.15em] text-[0.875em] font-medium",
      "font-[family-name:var(--primitive-font-mono)]",
      "border-[var(--primitive-border-subtle)]",
      "bg-[color-mix(in_srgb,var(--foreground)_6%,var(--background))]",
      "text-[var(--foreground)]",
      className,
    );

    const asChildElement =
      asChild && React.isValidElement(children) ? children : null;

    const asChildRendered = useRender({
      enabled: Boolean(asChildElement),
      ref: ref as React.Ref<HTMLElement>,
      render: asChildElement ?? undefined,
      props: {
        "data-wensity-primitive": "",
        className: composedClassName,
        children,
        ...props,
      },
    });

    if (asChildRendered) return asChildRendered;

    return (
      <code
        ref={ref}
        data-wensity-primitive=""
        className={composedClassName}
        {...props}
      >
        {children}
      </code>
    );
  },
);
InlineCode.displayName = "InlineCode";

/* ------------------------------------------------------------------ */
/*  Prose — optimized long-form content and documentation             */
/* ------------------------------------------------------------------ */

export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const proseChildStyles = cn(
  "text-[15px] leading-[1.7] tracking-[-0.003em] text-[var(--foreground)]",
  "[&>*+*]:mt-4",
  "[&_h1]:mt-10 [&_h1]:font-[family-name:var(--primitive-font-display)] [&_h1]:text-[28px] [&_h1]:font-semibold [&_h1]:leading-[1.2] [&_h1]:tracking-[-0.018em]",
  "[&_h2]:mt-9 [&_h2]:font-[family-name:var(--primitive-font-display)] [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:leading-[1.25] [&_h2]:tracking-[-0.014em]",
  "[&_h3]:mt-7 [&_h3]:font-[family-name:var(--primitive-font-display)] [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:leading-[1.35] [&_h3]:tracking-[-0.008em]",
  "[&_p]:text-[15px] [&_p]:leading-[1.7]",
  "[&_strong]:font-semibold [&_strong]:text-[var(--foreground)]",
  "[&_a]:font-medium [&_a]:text-[var(--foreground)] [&_a]:underline [&_a]:decoration-[color-mix(in_srgb,var(--foreground)_30%,transparent)] [&_a]:underline-offset-[3px] [&_a]:transition-colors [&_a]:duration-150 hover:[&_a]:decoration-[var(--foreground)]",
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:mt-1.5 [&_li]:pl-1",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-[var(--primitive-border-subtle)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--muted-foreground)]",
  "[&_hr]:my-8 [&_hr]:border-[var(--primitive-border-subtle)]",
  "[&_code]:rounded-[var(--primitive-radius-control-sm)] [&_code]:border [&_code]:border-[var(--primitive-border-subtle)] [&_code]:bg-[color-mix(in_srgb,var(--foreground)_6%,var(--background))] [&_code]:px-[0.4em] [&_code]:py-[0.15em] [&_code]:font-[family-name:var(--primitive-font-mono)] [&_code]:text-[0.875em] [&_code]:font-medium",
  "[&_pre]:overflow-x-auto [&_pre]:rounded-[var(--primitive-radius-surface)] [&_pre]:border [&_pre]:border-[var(--primitive-border-subtle)] [&_pre]:bg-[color-mix(in_srgb,var(--foreground)_4%,var(--background))] [&_pre]:p-4 [&_pre]:font-[family-name:var(--primitive-font-mono)] [&_pre]:text-[13px] [&_pre]:leading-[1.6]",
  "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_img]:rounded-[var(--primitive-radius-surface)]",
);

export const Prose = React.forwardRef<HTMLDivElement, ProseProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const composedClassName = cn(proseChildStyles, className);

    const asChildElement =
      asChild && React.isValidElement(children) ? children : null;

    const asChildRendered = useRender({
      enabled: Boolean(asChildElement),
      ref: ref as React.Ref<HTMLElement>,
      render: asChildElement ?? undefined,
      props: {
        "data-wensity-primitive": "",
        className: composedClassName,
        children,
        ...props,
      },
    });

    if (asChildRendered) return asChildRendered;

    return (
      <div
        ref={ref}
        data-wensity-primitive=""
        className={composedClassName}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Prose.displayName = "Prose";
