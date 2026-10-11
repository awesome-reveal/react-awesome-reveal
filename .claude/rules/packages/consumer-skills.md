---
paths:
  - "packages/*/skills/**"
---

# Consumer skills

- These skills are for the users of the package, not for contributors. pnpm 12.11 and later links each `skills/<name>/SKILL.md` into the agent folders of a consumer project after `pnpm approve`.
- pnpm looks only one level deep, so each skill needs its own folder directly in `skills/`.
- pnpm links only the skills of the direct dependencies of a project. A React app gets `@awesome-reveal/core` as a transitive dependency, so a skill for adapter users goes in the adapter package, not in core.
- The frontmatter `name` must match the folder name, as the Agent Skills spec requires.
- The `<package>:package` tests check the frontmatter. They also type-check each `ts` and `tsx` fence and each inline factory call, such as `` `slide({ distance: 16 })` ``, against the built types. Fences that import `react-awesome-reveal` (v4) are not checked.
- Update the skills, the README and the playgrounds together when an option, a default or an export changes.
