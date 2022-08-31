import type { RepoDetails } from "../types/ghRepo";

export async function getRepoDetails(args: {
  user: string;
  repo: string;
}): Promise<RepoDetails> {
  const response = await fetch(
    `https://api.github.com/repos/${args.user}/${args.repo}`
  );

  if (!response.ok)
    throw new Error(
      `Could not fetch details for repository "${args.user}/${args.repo}"`
    );

  return response.json();
}
