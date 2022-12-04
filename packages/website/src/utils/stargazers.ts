import { taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/lib/function";

import { getRepository } from "../services/github";

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
});

export function getStargazersCount(): TE.TaskEither<Error, number> {
  return pipe(
    getRepository({ user: "morellodev", repo: "react-awesome-reveal" }),
    TE.map((a) => a.stargazers_count)
  );
}

export function toCompactNotation(n: number): string {
  return compactNumberFormatter.format(n);
}
