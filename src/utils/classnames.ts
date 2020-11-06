export function classnames(...classes: Array<string | undefined>) {
  const nonEmptyClasses = classes.filter(Boolean);

  return nonEmptyClasses.length ? nonEmptyClasses.join(" ") : undefined;
}
