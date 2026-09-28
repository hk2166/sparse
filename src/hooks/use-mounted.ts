"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during SSR and the hydrating render, true afterwards.
 *
 * Components that read live DOM state — computed theme tokens, canvas sizes —
 * use this to hold that read until the client owns the tree.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
