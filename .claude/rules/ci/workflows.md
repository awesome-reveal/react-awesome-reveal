---
paths:
  - ".github/workflows/**"
---

# GitHub workflows

- Pin each action to a full commit SHA, with the version in a comment.
- Set `permissions: {}` for the workflow, and give each job only the permissions that it uses.
- Check out with `persist-credentials: false`.
- Run `actionlint` after each change.
- Run the browser tests in the `mcr.microsoft.com/playwright` container, with `--user 1001` as the Playwright CI guide shows. The image has the browsers and their system packages. A `playwright install --with-deps` step takes about 70 s on `ubuntu-latest`, and the image pull takes about 30 s.
- Keep the image tag equal to the `playwright` version in `pnpm-lock.yaml`. If the versions differ, the tests fail with "Executable doesn't exist". Update the tag in the PR that upgrades Playwright.
- In the container, `run` steps use `sh`, not `bash`, and `jq` is not available.
- Do not cache the Playwright browsers. The Playwright docs say that a cache restore takes about as long as the download.
- `actions/upload-artifact` skips hidden files by default. An upload of `.vitest/` needs `include-hidden-files: true`.
- A release PR that release-please opens with `GITHUB_TOKEN` runs CI only after a user with write access approves the runs in the merge box of the PR.
