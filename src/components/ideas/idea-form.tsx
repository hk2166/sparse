"use client";

import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, type ReactNode } from "react";

import { submitIdea } from "@/app/tell-us/actions";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { LiquidMultimodalInput } from "@/components/wensity/liquid-multimodal-input";
import { IDEA_LIMITS } from "@/lib/idea-limits";
import type { IdeaFormState } from "@/lib/ideas";
import { themeConfettiColors } from "@/lib/theme-colors";
import { cn } from "@/lib/utils";

const initialState: IdeaFormState = { status: "idle" };

// Top to bottom, so the first error is the one nearest the top.
const FIELD_ORDER = ["title", "details", "name", "email"] as const;

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

function Field({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {hint ? (
          <span className="font-normal text-muted-foreground"> {hint}</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function IdeaForm() {
  const [state, formAction, pending] = useActionState(
    submitIdea,
    initialState,
  );
  const confettiRef = useRef<ConfettiRef>(null);

  const errors = state.status === "error" ? (state.errors ?? {}) : {};
  // React clears uncontrolled fields after every action, so on a failed post
  // the server sends back what was typed and we put it in again.
  const values = state.status === "error" ? state.values : undefined;

  const describe = (id: string, hasError: boolean) =>
    hasError ? `${id}-error` : undefined;

  // A failed post puts the cursor on the first thing to fix, rather than
  // leaving it on the button with the problem somewhere off-screen.
  useEffect(() => {
    if (state.status !== "error" || !state.errors) return;
    const first = FIELD_ORDER.find((field) => state.errors?.[field]);
    if (first) document.getElementById(`idea-${first}`)?.focus();
  }, [state]);

  // A saved idea is the one moment on this page worth a flourish.
  useEffect(() => {
    // Resolved per fire, so the burst follows the active light/dark theme.
    if (state.status === "success") {
      void confettiRef.current?.fire({ colors: themeConfettiColors() });
    }
  }, [state]);

  return (
    <form
      action={formAction}
      aria-busy={pending}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8 dark:shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--foreground),transparent_92%)]"
    >
      <Confetti
        ref={confettiRef}
        manualstart
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 size-full"
      />

      <Field
        id="idea-title"
        label="Your idea"
        error={errors.title}
      >
        <input
          id="idea-title"
          name="title"
          type="text"
          required
          minLength={IDEA_LIMITS.title.min}
          maxLength={IDEA_LIMITS.title.max}
          defaultValue={values?.title}
          placeholder="Invoices that chase themselves"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={describe("idea-title", Boolean(errors.title))}
          className={inputClass}
        />
      </Field>

      <Field
        id="idea-details"
        label="What's the problem?"
        hint="Who has it, and what would make it go away?"
        error={errors.details}
      >
        {/*
          The box keeps its own text, so a rejected post comes back with what
          was typed still in it. Attachments are decorative for now: they live
          in component state only and are not submitted or stored anywhere.
        */}
        <LiquidMultimodalInput
          hideModel
          hideSubmit
          // The component caps itself at max-w-3xl; the form is the one that
          // decides how wide its fields are.
          className="max-w-none"
          placeholder="Tell us what hurts…"
          textareaProps={{
            id: "idea-details",
            name: "details",
            required: true,
            minLength: IDEA_LIMITS.details.min,
            maxLength: IDEA_LIMITS.details.max,
            "aria-label": undefined,
            "aria-invalid": Boolean(errors.details),
            "aria-describedby": describe("idea-details", Boolean(errors.details)),
          }}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="idea-name"
          label="Name"
          hint="(optional)"
          error={errors.name}
        >
          <input
            id="idea-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={IDEA_LIMITS.name.max}
            defaultValue={values?.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describe("idea-name", Boolean(errors.name))}
            className={inputClass}
          />
        </Field>

        <Field
          id="idea-email"
          label="Email"
          hint="(optional, never shown)"
          error={errors.email}
        >
          <input
            id="idea-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={IDEA_LIMITS.email.max}
            defaultValue={values?.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describe("idea-email", Boolean(errors.email))}
            className={inputClass}
          />
        </Field>
      </div>

      {/* Honeypot. Off-screen and out of the tab order, so only bots fill it. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="idea-website">Website</label>
        <input
          id="idea-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="text-sm">
          {state.status === "success" ? (
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-foreground duration-300 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2">
              <span
                aria-hidden
                className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
              >
                <CheckIcon className="size-3" strokeWidth={3} />
              </span>
              <span>Thanks. Your idea is on the wall.</span>
              <Link
                href="/ideas"
                className="underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                See the wall
              </Link>
            </p>
          ) : null}
          {state.status === "error" ? (
            <p role="alert" className="text-destructive">
              {state.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-primary px-5 py-2.5 text-base font-medium text-primary-foreground transition-[scale,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Posting…" : "Post your idea"}
        </button>
      </div>
    </form>
  );
}
