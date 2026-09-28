"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/**
 * True once the page has scrolled past `threshold`.
 *
 * useSyncExternalStore rather than useState + useEffect: it renders false on
 * the server and reads the real value on the client without a setState in an
 * effect body, which this repo's eslint config rejects.
 */
export function useScrolled(threshold = 8): boolean {
  const getSnapshot = useCallback(
    () => window.scrollY > threshold,
    [threshold],
  );
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
