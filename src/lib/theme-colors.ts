/**
 * canvas-confetti only understands hex: its parser strips every character that
 * isn't a hex digit, so handing it `var(--chart-1)` or an `oklch(...)` string
 * doesn't fail loudly — it scrapes stray digits out and paints nonsense. The
 * theme tokens in globals.css are all oklch, so they have to be converted.
 */

const FALLBACK = ["#0159b7", "#13c9aa", "#cf3fd9", "#8f3c1e", "#17ab92"];

/** The designed five-colour spread already in globals.css. */
const CONFETTI_TOKENS = [
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
];

const OKLCH = /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(?:deg)?/i;

const channel = (value: number) => {
  const encoded =
    value <= 0.0031308
      ? 12.92 * value
      : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
  const byte = Math.round(Math.min(1, Math.max(0, encoded)) * 255);
  return byte.toString(16).padStart(2, "0");
};

/** OKLCH -> OKLab -> linear sRGB -> gamma-encoded hex, clamped into gamut. */
function oklchToHex(l: number, c: number, hue: number): string {
  const h = (hue * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  const lCube = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mCube = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sCube = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return (
    "#" +
    channel(4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube) +
    channel(-1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube) +
    channel(-0.0041960863 * lCube - 0.7034186147 * mCube + 1.707614701 * sCube)
  );
}

const number = (raw: string, percentBase: number) =>
  raw.endsWith("%") ? parseFloat(raw) / 100 * percentBase : parseFloat(raw);

function tokenToHex(token: string, styles: CSSStyleDeclaration): string | null {
  const value = styles.getPropertyValue(token).trim();
  if (!value) return null;
  // A theme that already stores hex needs no conversion.
  if (/^#[0-9a-f]{3,8}$/i.test(value)) return value;

  const match = OKLCH.exec(value);
  if (!match) return null;

  const l = number(match[1], 1);
  const c = number(match[2], 0.4);
  const h = parseFloat(match[3]);
  if (![l, c, h].every(Number.isFinite)) return null;

  return oklchToHex(l, c, h);
}

/**
 * Read at call time, not at import: the tokens differ between light and dark,
 * and the user can flip themes without a reload.
 */
export function themeConfettiColors(): string[] {
  if (typeof window === "undefined") return FALLBACK;

  try {
    const styles = getComputedStyle(document.documentElement);
    const colors = CONFETTI_TOKENS.map((token) => tokenToHex(token, styles))
      .filter((hex): hex is string => hex !== null);

    return colors.length > 0 ? colors : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
