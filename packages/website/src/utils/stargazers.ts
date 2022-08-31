import { either as E, taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/lib/function";

import { getRepository } from "../services/github";

export function getStargazersCount(): TE.TaskEither<Error, number> {
  return pipe(
    TE.tryCatch(
      () => getRepository({ user: "morellodev", repo: "react-awesome-reveal" }),
      E.toError
    ),
    TE.map((a) => a.stargazers_count)
  );
}
