const reported = new Set<string>();

// Throws from a microtask, so a failure reaches window.error and error trackers, but not a render or an effect.
export function report(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (reported.has(message)) return;
  reported.add(message);
  queueMicrotask(() => {
    throw error;
  });
}
