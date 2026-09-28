// Creates the tables in db/schema.sql on whatever DATABASE_URL points at.
// Run with `npm run db:setup`. Safe to run again.
import { readFileSync } from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;

if (!url) {
  console.error(
    "DATABASE_URL is not set. Add it to .env.local (see .env.example) and try again.",
  );
  process.exit(1);
}

const sql = postgres(url, {
  prepare: false,
  max: 1,
  connect_timeout: 10,
  // "already exists, skipping" is expected on a re-run; don't print it.
  onnotice: () => {},
  ssl: /@(localhost|127\.0\.0\.1)[:/]/.test(url) ? false : "require",
});

try {
  // unsafe() with no parameters uses the simple query protocol, which allows
  // the several statements in schema.sql to go in one round trip.
  await sql.unsafe(
    readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"),
  );
  console.log("Database is ready.");
} catch (error) {
  console.error("Could not set up the database:", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
