function symbolFor(key: string, fallback: number): symbol | number {
  if (typeof Symbol === "function" && Symbol.for) {
    return Symbol.for(key);
  }

  return fallback;
}

export function isEmpty(object: any): object is null | undefined {
  return object === null || object === undefined;
}

export function isFragment(object: any) {
  if (typeof object === "object" && object !== null) {
    const REACT_ELEMENT_TYPE = symbolFor("react.element", 0xeac7);
    const REACT_FRAGMENT_TYPE = symbolFor("react.fragment", 0xeacb);

    return (
      object.$$typeof === REACT_ELEMENT_TYPE &&
      object.type === REACT_FRAGMENT_TYPE
    );
  }

  return false;
}

export function isStringLike(object: any): object is string | number | boolean {
  return (
    typeof object === "string" ||
    typeof object === "number" ||
    typeof object === "boolean"
  );
}
