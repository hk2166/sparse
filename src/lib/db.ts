import postgres from "postgres";

/**
 * One Postgres connection string for both Neon and Supabase:
 *
 *   Neon      the pooled connection string (host contains "-pooler").
 *   Supabase  the "Transaction pooler" string from Project Settings > Database.
 *
 * Both sit behind PgBouncer in transaction mode, which is why prepared
 * statements are off.
 */

// Read on every call, not once at import: a dev server that was started before
// .env.local existed picks the value up without a restart.
export const isDbConfigured = () => Boolean(process.env.DATABASE_URL);

// Dev reloads this module on every edit; keep one client so they don't pile up
// connections against the pooler.
const globalForDb = globalThis as unknown as {
  sparseSql?: ReturnType<typeof postgres>;
};

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  globalForDb.sparseSql ??= postgres(url, {
    prepare: false,
    // Each serverless instance handles a trickle of traffic; the pooler does
    // the real fan-in.
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    // Neon and Supabase both require TLS. A local Postgres usually doesn't
    // speak it, so leave it off there.
    ssl: /@(localhost|127\.0\.0\.1)[:/]/.test(url) ? false : "require",
  });

  return globalForDb.sparseSql;
}
