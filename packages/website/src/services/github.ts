import { either as E, taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/function";

import type { Repository } from "../types/github";

export function getRepository(args: {
  user: string;
  repo: string;
}): TE.TaskEither<Error, Repository> {
  return pipe(
    TE.tryCatch(
      () => fetch(`https://api.github.com/repos/${args.user}/${args.repo}`),
      E.toError
    ),
    TE.filterOrElse(
      (response) => response.ok,
      () => new Error(`Could not fetch repository "${args.user}/${args.repo}"`)
    ),
    TE.chainTaskK<Response, Repository>((response) => () => response.json())
  );
}
