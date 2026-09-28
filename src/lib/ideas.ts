import { getSql, isDbConfigured } from "@/lib/db";
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

// Code points, not UTF-16 units, so the count matches Postgres char_length().
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

export async function createIdea(idea: NewIdea) {
  const sql = getSql();

  await sql`
    insert into ideas (title, details, author_name, author_email)
    values (${idea.title}, ${idea.details}, ${idea.name}, ${idea.email})
  `;
}

/** Public columns only; author_email never leaves the database. */
export async function getIdeas(limit = 50): Promise<IdeasResult> {
  if (!isDbConfigured()) return { status: "not-configured" };

  try {
    const rows = await getSql()<
      {
        id: string;
        title: string;
        details: string;
        name: string | null;
        createdAt: Date;
      }[]
    >`
      select
        id::text,
        title,
        details,
        author_name as name,
        created_at as "createdAt"
      from ideas
      where not hidden
      order by created_at desc
      limit ${limit}
    `;

    return { status: "ok", ideas: [...rows] };
  } catch (error) {
    console.error("Could not load ideas", error);
    return { status: "error" };
  }
}
