/**
 * Holds the microtasks that report errors, and returns a function that runs them and gives the thrown errors.
 * Core reports each message only one time per module, so each test needs its own message.
 */
export function collectReports(): () => unknown[] {
  const callbacks: VoidFunction[] = [];
  vi.stubGlobal("queueMicrotask", (callback: VoidFunction) => callbacks.push(callback));
  return () => {
    const errors: unknown[] = [];
    for (const callback of callbacks) {
      try {
        callback();
      } catch (error) {
        errors.push(error);
      }
    }
    return errors;
  };
}
