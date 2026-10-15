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

/**
 * Collects the errors of the window error event, where jsdom reports an error of a custom element
 * callback, and returns a function that stops the collection and gives the errors.
 */
export function collectWindowErrors(): () => unknown[] {
  const errors: unknown[] = [];
  const onError = (event: ErrorEvent) => {
    event.preventDefault();
    errors.push(event.error);
  };
  window.addEventListener("error", onError);
  return () => {
    window.removeEventListener("error", onError);
    return errors;
  };
}
