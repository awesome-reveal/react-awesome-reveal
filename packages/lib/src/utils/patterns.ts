export function matchIf<T, F>(onTrue: () => T, onFalse: () => F) {
  return (condition: boolean) => (condition ? onTrue() : onFalse());
}

export function matchIfOrNull<T>(onTrue: () => T) {
  return matchIf(onTrue, () => null);
}
