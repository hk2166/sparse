import { IDEA_LIMITS } from "@/lib/idea-limits";

export type Idea = {
  id: string;
  title: string;
  details: string;
  /** Null when the author left it blank; the page shows "Anonymous". */
  name: string | null;
  createdAt: Date;
};

export type IdeasResult =
  | { status: "ok"; ideas: Idea[] }
  | { status: "not-configured" }
  | { status: "error" };

type FieldName = "title" | "details" | "name" | "email";

export type IdeaFormValues = Record<FieldName, string>;

/** What the form gets back from the server action. */
export type IdeaFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message: string;
      errors?: Partial<Record<FieldName, string>>;
      /** Echoed back because React clears the form after every action. */
      values?: IdeaFormValues;
    };

export type NewIdea = {
  title: string;
  details: string;
  name: string | null;
  email: string | null;
};

// Code points, not UTF-16 units, so the count matches what the author typed.
const length = (value: string) => [...value].length;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Server-side validation. The form's HTML attributes are a convenience; this
 * is the check that counts, because anyone can POST to the action directly.
 */
export function parseIdea(
  formData: FormData,
):
  | { ok: true; value: NewIdea }
  | {
      ok: false;
      errors: Partial<Record<FieldName, string>>;
      values: IdeaFormValues;
    } {
  const values: IdeaFormValues = {
    title: text(formData, "title").replace(/\s+/g, " ").trim(),
    details: text(formData, "details").trim(),
    name: text(formData, "name").replace(/\s+/g, " ").trim(),
    email: text(formData, "email").trim(),
  };

  const errors: Partial<Record<FieldName, string>> = {};
  const { title, details, name, email } = IDEA_LIMITS;

  if (length(values.title) < title.min) {
    errors.title = `Give it a title of at least ${title.min} characters.`;
  } else if (length(values.title) > title.max) {
    errors.title = `Keep the title under ${title.max} characters.`;
  }

  if (length(values.details) < details.min) {
    errors.details = `Tell us a little more, at least ${details.min} characters.`;
  } else if (length(values.details) > details.max) {
    errors.details = `Keep this under ${details.max} characters.`;
  }

  if (length(values.name) > name.max) {
    errors.name = `Keep your name under ${name.max} characters.`;
  }

  if (values.email && !EMAIL.test(values.email)) {
    errors.email = "That doesn't look like an email address.";
  } else if (length(values.email) > email.max) {
    errors.email = "That email address is too long.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors, values };

  return {
    ok: true,
    value: {
      title: values.title,
      details: values.details,
      name: values.name || null,
      email: values.email || null,
    },
  };
}

/**
 * Placeholder store while the front end is being built. Everything lives in
 * module memory: it resets on restart and is not shared between server
 * instances, which is fine for clicking through the UI and nothing else.
 *
 * Swapping in the real backend means reimplementing just `createIdea` and
 * `getIdeas` — the types, validation and both call sites stay as they are.
 * The intended table is in db/schema.sql.
 */
const store: Idea[] = [
  {
    id: "seed-3",
    title: "Invoices that chase themselves",
    details:
      "Every month I export a spreadsheet, cross-check who has paid, and send the same three emails. It is an hour of work that knows exactly what it wants to do.",
    name: "Priya",
    createdAt: new Date("2026-09-24T09:20:00Z"),
  },
  {
    id: "seed-2",
    title: "One place for handover notes",
    details:
      "Context for a shift lives in someone's head, a WhatsApp thread, and a notebook. The next person starts by reconstructing it.",
    name: null,
    createdAt: new Date("2026-09-21T16:05:00Z"),
  },
  {
    id: "seed-1",
    title: "Stop re-keying delivery challans",
    details:
      "The same numbers get typed into the portal, the ledger, and then a PDF for the client. Three chances to get a digit wrong.",
    name: "Arun",
    createdAt: new Date("2026-09-18T11:40:00Z"),
  },
];

export async function createIdea(idea: NewIdea) {
  // The real one will persist author_email; here it is deliberately dropped,
  // so a placeholder never holds a contact detail it has no use for.
  store.unshift({
    id: `local-${Date.now()}`,
    title: idea.title,
    details: idea.details,
    name: idea.name,
    createdAt: new Date(),
  });
}

/** Public fields only; an author's email never reaches this list. */
export async function getIdeas(limit = 50): Promise<IdeasResult> {
  return { status: "ok", ideas: store.slice(0, limit) };
}
