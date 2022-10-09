export function isNullable(a: unknown): a is null | undefined {
  return a == undefined;
}

export function isStringLike(
  value: unknown
): value is string | number | boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}
