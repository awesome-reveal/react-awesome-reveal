import { option as O, predicate as P, string as S } from "fp-ts";
import { pipe } from "fp-ts/lib/function";

export function formatTitle(
  s?: string,
  fallback = "React Awesome Reveal"
): string {
  return pipe(
    O.fromNullable(s),
    O.map(S.trim),
    O.filter(P.not(S.isEmpty)),
    O.filter((s) => s !== fallback),
    O.map((s) => `${s} | ${fallback}`),
    O.getOrElse(() => fallback)
  );
}
