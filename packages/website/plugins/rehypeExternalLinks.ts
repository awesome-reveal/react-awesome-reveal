import { array as A, option as O, record as R, string as S } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { Predicate } from "fp-ts/lib/Predicate";
import * as t from "io-ts";
import type { Options, Target } from "rehype-external-links";

const KnownProtocols = t.keyof({
  ftp: null,
  http: null,
  https: null,
});

const isExternalLink: Predicate<string> = (s) =>
  pipe(
    KnownProtocols.keys,
    R.keys,
    A.some((p) => pipe(s, S.startsWith(p)))
  );

const options: Options = {
  rel: (element) =>
    pipe(
      element.properties?.href,
      O.fromPredicate(S.isString),
      O.filter(isExternalLink),
      O.map(() => ["noopener"]),
      O.getOrElse(() => A.zero())
    ),
  target: (element) =>
    pipe(
      element.properties?.href,
      O.fromPredicate(S.isString),
      O.filter(isExternalLink),
      O.map<string, Target>(() => "_blank"),
      O.toUndefined
    ),
};

export default ["rehype-external-links", options];
