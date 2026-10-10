---
paths:
  - "packages/*/skills/**"
---

# Consumer skills

- These skills are for the users of the package, not for contributors. pnpm 12.11 and later links each `skills/<name>/SKILL.md` into the agent folders of a consumer project after `pnpm approve`.
- pnpm looks only one level deep, so each skill needs its own folder directly in `skills/`.
- The frontmatter `name` must match the folder name, as the Agent Skills spec requires.
- The `<package>:package` tests check the frontmatter, and check that each `import { … }` line names a real export.
- Update the skills and the README together when an option, a default or an export changes.
