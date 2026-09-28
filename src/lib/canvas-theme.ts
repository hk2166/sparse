/**
 * Bridges the globals.css theme into <canvas> and WebGL, which can't read it.
 *
 * cobe wants [r,g,b] floats and can't resolve var() or parse oklch, so it reads
 * the --canvas-* hex mirrors in globals.css rather than carrying its own palette.
 */

/** Reads a custom property off <html>. Returns the fallback during SSR. */
export function readToken(name: string, fallback = "#000000"): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

/** "#19398d" -> [0.098, 0.2235, 0.5529], the form cobe expects. */
export function hexToTuple(hex: string): [number, number, number] {
  let value = hex.trim().replace("#", "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const int = Number.parseInt(value, 16);
  if (value.length !== 6 || Number.isNaN(int)) return [0, 0, 0];
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

/** Convenience: read a --canvas-* token straight into a cobe colour tuple. */
export function readTokenTuple(
  name: string,
  fallback = "#000000",
): [number, number, number] {
  return hexToTuple(readToken(name, fallback));
}
