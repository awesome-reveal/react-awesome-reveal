# Contributing

Thanks for your help with awesome-reveal.

- Report a bug with the issue form. Ask questions and suggest features in [Discussions](https://github.com/awesome-reveal/awesome-reveal/discussions).
- Open pull requests against the `next` branch.
- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for the PR title. release-please writes the changelog from it.

## Set up

1. Use the Node version in `.nvmrc`.
2. Run `pnpm install`.
3. Read [`AGENTS.md`](AGENTS.md) for the map of the workspace and the commands for the build, the tests and the lint.

`pnpm install` also installs a pre-commit hook. The hook fixes the lint and the format of the staged files, and runs the unit and SSR tests that are related to them.
