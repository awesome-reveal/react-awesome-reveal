import { array as A, option as O, string as S } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { Predicate } from "fp-ts/lib/Predicate";
import rehypeExternalLinks_, {
  type Options,
  type Target,
} from "rehype-external-links";
import { z } from "zod";

const KnownProtocols = z.enum(["ftp", "http", "https"]);

const isExternalLink: Predicate<string> = (s) =>
  pipe(
    KnownProtocols.options,
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

const rehypeExternalLinks = () => rehypeExternalLinks_(options);

export default rehypeExternalLinks;
