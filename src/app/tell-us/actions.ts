"use server";

import { revalidatePath } from "next/cache";

import { createIdea, parseIdea, type IdeaFormState } from "@/lib/ideas";

export async function submitIdea(
  _previous: IdeaFormState,
  formData: FormData,
): Promise<IdeaFormState> {
  // Honeypot: real people never see this field, bots fill everything. Say
  // "success" so they don't learn they were filtered.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const parsed = parseIdea(formData);

  if (!parsed.ok) {
    return {
      status: "error",
      message: "A couple of things need another look.",
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  const values = {
    title: parsed.value.title,
    details: parsed.value.details,
    name: parsed.value.name ?? "",
    email: parsed.value.email ?? "",
  };

  try {
    await createIdea(parsed.value);
  } catch (error) {
    console.error("Could not save idea", error);
    return {
      status: "error",
      message: "That didn't save. Give it another go in a moment.",
      values,
    };
  }

  // Re-renders the list in the same response, so the new idea shows up at once.
  revalidatePath("/ideas");

  return { status: "success" };
}
