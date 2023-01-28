import { either as E, taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { z } from "zod";

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
    TE.chainTaskK((response) => () => response.json()),
    TE.chain((data) =>
      TE.tryCatch(() => Repository.parseAsync(data), E.toError)
    )
  );
}

const Repository = z.object({
  allow_forking: z.boolean(),
  archive_url: z.string(),
  archived: z.boolean(),
  assignees_url: z.string(),
  blobs_url: z.string(),
  branches_url: z.string(),
  clone_url: z.string(),
  collaborators_url: z.string(),
  comments_url: z.string(),
  commits_url: z.string(),
  compare_url: z.string(),
  contents_url: z.string(),
  contributors_url: z.string(),
  created_at: z.string().transform((s) => new Date(s)),
  default_branch: z.string(),
  deployments_url: z.string(),
  description: z.string(),
  disabled: z.boolean(),
  downloads_url: z.string(),
  events_url: z.string(),
  fork: z.boolean(),
  forks: z.number(),
  forks_count: z.number(),
  forks_url: z.string(),
  full_name: z.string(),
  git_commits_url: z.string(),
  git_refs_url: z.string(),
  git_tags_url: z.string(),
  git_url: z.string(),
  has_downloads: z.boolean(),
  has_issues: z.boolean(),
  has_pages: z.boolean(),
  has_projects: z.boolean(),
  has_wiki: z.boolean(),
  homepage: z.string(),
  hooks_url: z.string(),
  html_url: z.string(),
  id: z.number(),
  is_template: z.boolean(),
  issue_comment_url: z.string(),
  issue_events_url: z.string(),
  issues_url: z.string(),
  keys_url: z.string(),
  labels_url: z.string(),
  language: z.string(),
  languages_url: z.string(),
  merges_url: z.string(),
  milestones_url: z.string(),
  name: z.string(),
  network_count: z.number(),
  node_id: z.string(),
  notifications_url: z.string(),
  open_issues: z.number(),
  open_issues_count: z.number(),
  private: z.boolean(),
  pulls_url: z.string(),
  pushed_at: z.string().transform((s) => new Date(s)),
  releases_url: z.string(),
  size: z.number(),
  ssh_url: z.string(),
  stargazers_count: z.number(),
  stargazers_url: z.string(),
  statuses_url: z.string(),
  subscribers_count: z.number(),
  subscribers_url: z.string(),
  subscription_url: z.string(),
  svn_url: z.string(),
  tags_url: z.string(),
  teams_url: z.string(),
  topics: z.array(z.string()),
  trees_url: z.string(),
  updated_at: z.string().transform((s) => new Date(s)),
  url: z.string(),
  visibility: z.string(),
  watchers: z.number(),
  watchers_count: z.number(),
  web_commit_signoff_required: z.boolean(),
});

type Repository = z.infer<typeof Repository>;
