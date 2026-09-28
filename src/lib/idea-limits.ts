/**
 * Shared by the form (maxLength attributes) and the server (validation), and
 * mirrored by the check constraints in db/schema.sql. Change all three
 * together.
 */
export const IDEA_LIMITS = {
  title: { min: 3, max: 120 },
  details: { min: 10, max: 1000 },
  name: { max: 60 },
  email: { max: 254 },
} as const;
