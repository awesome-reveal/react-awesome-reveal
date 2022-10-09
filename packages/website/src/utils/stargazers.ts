import { taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/lib/function";

import { getRepository } from "../services/github";

export function getStargazersCount(): TE.TaskEither<Error, number> {
  return pipe(
    getRepository({ user: "morellodev", repo: "react-awesome-reveal" }),
    TE.map((a) => a.stargazers_count)
  );
}

export function formatThousands(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}
