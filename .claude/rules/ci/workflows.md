---
paths:
  - ".github/workflows/**"
---

# GitHub workflows

- Pin each action to a full commit SHA, with the version in a comment.
- Set `permissions: {}` for the workflow, and give each job only the permissions that it uses.
- Check out with `persist-credentials: false`.
- Run `actionlint` after each change.
- Install only the Playwright browsers that the tests use, with `--with-deps --only-shell`. Do not cache the browsers: the Playwright docs say that a cache restore takes about as long as the download.
- `actions/upload-artifact` skips hidden files by default. An upload of `.vitest/` needs `include-hidden-files: true`.
- A release PR that release-please opens with `GITHUB_TOKEN` runs CI only after a user with write access approves the runs in the merge box of the PR.
- `anthropics/claude-code-action` runs only when the workflow file is identical to the copy on `main`, the default branch. Otherwise it skips the run, and the check still passes. Land each change to `claude.yml` and `claude-code-review.yml` on `main` and `next` with the same content.
- The `claude-code-plugins` marketplace name is reserved for its GitHub URL, and `plugin_marketplaces` takes no git ref. That marketplace cannot be pinned to a SHA.
