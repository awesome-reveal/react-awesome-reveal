---
paths:
  - ".github/workflows/**"
---

# GitHub workflows

- Pin each action to a full commit SHA, with the version in a comment.
- Set `permissions: {}` for the workflow, and give each job only the permissions that it uses.
- Check out with `persist-credentials: false`.
- Run `actionlint` after each change.
- The `lint` job runs `astro check` in the Astro example, because `tsc` cannot read `.astro` files.
- The `test` job uses the catalog version of each framework. The `framework` job tests the older majors in the peer ranges, with only the unit and SSR projects. The core browser tests do not use a framework, and the Astro example needs the current Astro major.
- Run the browser tests in the `mcr.microsoft.com/playwright` container, with `--user 1001` as the Playwright CI guide shows. The image has the browsers and their system packages. A `playwright install --with-deps` step takes about 70 s on `ubuntu-latest`, and the image pull takes about 30 s.
- Keep the image tag equal to the `playwright` version in `pnpm-lock.yaml`. If the versions differ, the tests fail with "Executable doesn't exist". Update the tag in the PR that upgrades Playwright.
- In the container, `run` steps use `sh`, not `bash`, and `jq` is not available.
- Do not cache the Playwright browsers. The Playwright docs say that a cache restore takes about as long as the download.
- `actions/upload-artifact` skips hidden files by default. An upload of `.vitest/` needs `include-hidden-files: true`.
- The `smoke` job runs `scripts/smoke.mjs`. It packs the packages, installs the tarballs into a clean project outside the workspace, and builds, type-checks and server-renders it. A pnpm override makes the adapters use the core tarball and not the registry. Its matrix covers the exact minimum and the newest framework version of each peer range. The `next` case builds a Next.js App Router app, starts it, and checks hydration, scrolling and client navigation in Chromium with Playwright (the job installs Chromium). Change a peer range and this matrix together.
- A PR that `GITHUB_TOKEN` opens starts no workflows. The `release-please` job uses the secret `RELEASE_PLEASE_TOKEN` (a token of a user, with `contents` and `pull requests` write access) so that CI runs on the release PR. Without the secret it falls back to `GITHUB_TOKEN`.
- The `publish` job runs `pnpm test:package` and nothing else from CI, so the checks of the release PR are the gate for the rest.
- The repository ruleset "Require CI" (on `next` and `main`) lists each CI job by its name, including each `smoke` matrix name. Rename a job or a matrix entry, and update the ruleset in the same change. Repository admins can bypass it.
