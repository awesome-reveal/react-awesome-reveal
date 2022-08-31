import type { Repository } from "../types/github";

export async function getRepository(args: {
  user: string;
  repo: string;
}): Promise<Repository> {
  const response = await fetch(
    `https://api.github.com/repos/${args.user}/${args.repo}`
  );

  if (!response.ok)
    throw new Error(`Could not fetch repository "${args.user}/${args.repo}"`);

  return response.json();
}
