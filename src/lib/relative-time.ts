// UTC is pinned so the server and every reader see the same calendar day.
const dateFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});

const fullFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "UTC",
});

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "just now", "3 hours ago", "yesterday", then a plain date after a week. */
export function describeAge(date: Date, now: Date = new Date()) {
  // Clamped so a database clock a little ahead of ours never reads "in 2 minutes".
  const seconds = Math.min(0, Math.round((date.getTime() - now.getTime()) / 1000));
  const age = Math.abs(seconds);

  if (age < MINUTE) return "just now";
  if (age < HOUR) return relative.format(Math.round(seconds / MINUTE), "minute");
  if (age < DAY) return relative.format(Math.round(seconds / HOUR), "hour");
  if (age < 7 * DAY) return relative.format(Math.round(seconds / DAY), "day");

  return dateFormat.format(date);
}

/** The exact moment, for a tooltip behind the friendly version. */
export function describeMoment(date: Date) {
  return `${fullFormat.format(date)} UTC`;
}
