import { either as E, taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/lib/function";

import { getRepoDetails } from "../services/github";

export function getStargazersCount(): TE.TaskEither<Error, number> {
  return pipe(
    TE.tryCatch(
      () =>
        getRepoDetails({ user: "morellodev", repo: "react-awesome-reveal" }),
      E.toError
    ),
    TE.map((a) => a.stargazers_count)
  );
}
