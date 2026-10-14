---
paths:
  - "packages/*/skills/**"
---

# Consumer skills

- These skills are for the users of the package, not for contributors. pnpm 12.11 and later links each `skills/<name>/SKILL.md` into the agent folders of a consumer project after `pnpm approve`.
- pnpm looks only one level deep, so each skill needs its own folder directly in `skills/`.
- pnpm links only the skills of the direct dependencies of a project. A React app gets `@awesome-reveal/core` as a transitive dependency, so a skill for adapter users goes in the adapter package. The core skills are for projects that use core directly, with plain DOM code.
- pnpm puts the package name in each link, such as `.claude/skills/pnpm-<package>-<skill>`. So the skills of core and of an adapter can have the same name.
- The frontmatter `name` must match the folder name, as the Agent Skills spec requires.
- The `<package>:package` tests call `describeDocs` from `@awesome-reveal/test-utils/docs`. It checks the frontmatter of the skills. It also type-checks each `ts` and `tsx` fence in the skills and in the `README.md` of the package, against the built types. Write a README example that is a whole module in a `ts` or `tsx` fence, with its imports. Use `js`, `jsx` or `vue` for a fragment, which the check skips. Fences that import `react-awesome-reveal` (v4) are not checked.
- Update the skills, the READMEs and the examples together when an option, a default or an export changes.
