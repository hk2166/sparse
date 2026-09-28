const DURATION_MS = 500;
const COLORS = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

let endsAt = 0;

/**
 * Confetti from both screen edges for 1.5s. Clicking again mid-burst extends
 * the current one instead of stacking a second animation loop.
 */
export async function fireSideCannons() {
  const running = Date.now() < endsAt;
  endsAt = Date.now() + DURATION_MS;
  if (running) return;

  // Loaded on first click so it stays out of the initial bundle.
  const { default: confetti } = await import("canvas-confetti");

  const shared = {
    particleCount: 2,
    spread: 55,
    startVelocity: 60,
    colors: COLORS,
    disableForReducedMotion: true,
  };

  const frame = () => {
    if (Date.now() > endsAt) return;

    confetti({ ...shared, angle: 60, origin: { x: 0, y: 0.5 } });
    confetti({ ...shared, angle: 120, origin: { x: 1, y: 0.5 } });

    requestAnimationFrame(frame);
  };

  frame();
}
