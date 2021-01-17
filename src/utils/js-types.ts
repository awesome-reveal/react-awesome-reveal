export function isEmpty(object: any): object is null | undefined {
  return object === null || object === undefined;
}

export function isStringLike(object: any): object is string | number | boolean {
  return (
    typeof object === "string" ||
    typeof object === "number" ||
    typeof object === "boolean"
  );
}
